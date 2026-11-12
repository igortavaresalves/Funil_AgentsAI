"""API HTTP do funil. Só traduz requisições para chamadas ao grafo.

Rodar:  uvicorn api.main:app --reload
"""

import logging
import os
import uuid
from functools import lru_cache
from typing import Any, Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage
from langgraph.graph.state import CompiledStateGraph
from pydantic import BaseModel

from funil_agents.graph import build_graph, run_config
from funil_agents.leads import salvar_lead
from funil_agents.nodes.mensagens import ultima_resposta
from funil_agents.state import FunilState

logger = logging.getLogger("funil.api")

app = FastAPI(title="Funil_AgentsAI - Rosalina")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("FRONTEND_ORIGINS", "http://localhost:5173").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

# PARTE 1 (sem memória): o estado de cada conversa fica num dicionário em memória
# e é reenviado ao grafo a cada mensagem. Some quando o servidor reinicia.
# A parte 2 troca isto por um checkpointer com um thread_id por lead.
SESSOES: dict[str, FunilState] = {}
LEADS_SALVOS: set[str] = set()


@lru_cache(maxsize=1)
def get_grafo() -> CompiledStateGraph:
    return build_graph()


class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    debug: dict[str, Any] = {}


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest, grafo: CompiledStateGraph = Depends(get_grafo)) -> ChatResponse:
    if not req.message.strip():
        raise HTTPException(status_code=422, detail="Mensagem vazia.")

    session_id = req.session_id or uuid.uuid4().hex
    anterior = SESSOES.get(session_id, {})
    entrada: FunilState = {
        "messages": [*anterior.get("messages", []), HumanMessage(content=req.message)],
        "lead": anterior.get("lead", {}),
    }

    try:
        estado = grafo.invoke(entrada, run_config())
    except Exception as exc:  # erro do provedor de LLM, limite de recursão etc.
        logger.exception("Falha ao executar o grafo (sessão %s)", session_id)
        raise HTTPException(status_code=502, detail="Não consegui responder agora. Tente de novo.") from exc

    SESSOES[session_id] = estado
    resposta = ultima_resposta(estado["messages"])
    lead = estado.get("lead", {})

    if estado.get("proxima_etapa") == "qualificado" and session_id not in LEADS_SALVOS:
        # Parte 3: esta gravação sai daqui e vira a "ação final", depois da aprovação humana.
        salvar_lead(lead, thread_id=session_id)
        LEADS_SALVOS.add(session_id)

    return ChatResponse(
        session_id=session_id,
        reply=resposta.text if resposta else "Desculpe, não consegui responder agora.",
        debug={
            "decision": resposta.name if resposta else None,
            "etapa": estado.get("proxima_etapa"),
            "lead": lead,
        },
    )
