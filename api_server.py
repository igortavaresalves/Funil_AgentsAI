from fastapi import FastAPI, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import yaml
import os
from langchain_google_genai import ChatGoogleGenerativeAI
import uvicorn
from prompts import SUPERVISOR_DECISION, SUPERVISOR_REFINE, ESPECIALISTA_PROMPT, QUALIFICADOR_PROMPT
import re
import pandas as pd

app = FastAPI(title="Rosalina - API de Chat")

# CORS (development friendly). Replace '*' with explicit origins in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load config and init model (reuse same config as Streamlit app)
with open("config.yaml", "r") as f:
    cfg = yaml.safe_load(f)
os.environ["GOOGLE_API_KEY"] = cfg.get("GOOGLE_API_KEY")

googleai = ChatGoogleGenerativeAI(model="gemini-2.5-pro")

# In-memory sessions (replace with DB or redis for production)
SESSIONS: Dict[str, Dict[str, Any]] = {}


class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    debug: Dict[str, Any] = {}


def extract_lead_data(text: str, lead: Dict[str, Any]):
    t = text.lower()
    if "casamento" in t:
        lead["Tipo de Festa"] = "Casamento"
    if "15" in t and "anos" in t:
        lead["Tipo de Festa"] = "Festa de 15 anos"
    if "30" in t and "anos" in t:
        lead["Tipo de Festa"] = "Aniversário 30 anos"
    if "empresarial" in t or "corporativo" in t:
        lead["Tipo de Festa"] = "Corporativo"

    m = re.search(r"nome[:\-]?\s*([a-zA-ZÀ-ÿ ']+)", text, re.IGNORECASE)
    if m:
        lead["Nome"] = m.group(1).strip()

    m = re.search(r"convidados[:\-]?\s*(\d+)", text, re.IGNORECASE)
    if m:
        try:
            lead["Convidados"] = int(m.group(1))
        except:
            pass

    m = re.search(r"or[cç]amento[:\-]?\s*(r\$)?\s*([\d\.,]+)", text, re.IGNORECASE)
    if m:
        valor = m.group(2).replace(".", "").replace(",", "")
        try:
            lead["Orçamento"] = int(valor)
        except:
            pass


def save_lead_to_xlsx(lead: Dict[str, Any]):
    df_new = pd.DataFrame([lead])
    if os.path.exists("leads.xlsx"):
        df_existing = pd.read_excel("leads.xlsx")
        df_final = pd.concat([df_existing, df_new], ignore_index=True)
    else:
        df_final = df_new
    df_final.to_excel("leads.xlsx", index=False, engine="openpyxl")


@app.options("/chat")
async def chat_options(request: Request):
    # Respond to CORS preflight explicitly to avoid some client issues
    return Response(status_code=200)


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    sess_id = req.session_id or os.urandom(8).hex()
    if sess_id not in SESSIONS:
        SESSIONS[sess_id] = {
            "messages": [],
            "lead_data": {"Nome": None, "Tipo de Festa": None, "Convidados": None, "Orçamento": None},
        }

    session = SESSIONS[sess_id]
    session["messages"].append({"role": "user", "content": req.message})

    # Extrair dados básicos do lead
    extract_lead_data(req.message, session["lead_data"])

    contexto = "\n".join([f"{k}: {v}" for k, v in session["lead_data"].items() if v])
    faltam = [k for k, v in session["lead_data"].items() if v is None]
    faltam_str = ", ".join(faltam)

    if not faltam:
        reply = "Todas as informações foram coletadas. Obrigado!"
        session["messages"].append({"role": "assistant", "content": reply})
        # salvar
        save_lead_to_xlsx(session["lead_data"])
        return ChatResponse(session_id=sess_id, reply=reply, debug={"lead_data": session["lead_data"]})

    # Supervisor decide
    supervisor_prompt = SUPERVISOR_DECISION.format(user_message=req.message + ("\n" + contexto if contexto else ""))
    try:
        decision = googleai.invoke(supervisor_prompt).content.strip().lower()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    agent_role = ESPECIALISTA_PROMPT if decision != "qualificador" else QUALIFICADOR_PROMPT
    agent_input = agent_role + (f"\nContexto já coletado:\n{contexto}" if contexto else "") + (f"\nPergunte APENAS sobre o que falta coletar: {faltam_str}." if faltam_str else "") + f"\nUsuário: {req.message}"

    try:
        agent_response = googleai.invoke(agent_input).content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    supervisor_refine = SUPERVISOR_REFINE.format(agent_response=agent_response)
    try:
        final_response = googleai.invoke(supervisor_refine).content
    except Exception:
        final_response = agent_response or "Desculpe, houve erro ao gerar a resposta."

    session["messages"].append({"role": "assistant", "content": final_response})

    debug = {
        "decision_prompt": supervisor_prompt,
        "decision": decision,
        "agent_input": agent_input,
        "agent_response": agent_response,
        "supervisor_refine": supervisor_refine,
    }

    return ChatResponse(session_id=sess_id, reply=final_response, debug=debug)


@app.post("/lead")
def save_lead_endpoint(lead: Dict[str, Any]):
    save_lead_to_xlsx(lead)
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
