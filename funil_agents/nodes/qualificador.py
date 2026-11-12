"""Qualificador: extrai os dados do lead, calcula o score e devolve o lead COMPLETO."""

from datetime import date
from typing import Callable, Optional

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, SystemMessage
from pydantic import BaseModel, Field, field_validator

from funil_agents.nodes.mensagens import conversa_limpa, formatar_lead
from funil_agents.prompts import EXTRACAO_PROMPT, MSG_NAO_QUALIFICADO, MSG_QUALIFICADO, QUALIFICADOR_PROMPT
from funil_agents.score import calcular_score
from funil_agents.state import FunilState, campos_faltando, mesclar_lead


class DadosLead(BaseModel):
    """Dados do evento informados pela cliente. Campos não informados ficam nulos."""

    nome: Optional[str] = Field(None, description="Nome da cliente.")
    tipo_festa: Optional[str] = Field(None, description="Tipo do evento, ex.: casamento, 15 anos, corporativo.")
    convidados: Optional[int] = Field(None, description="Número de convidados.")
    orcamento: Optional[float] = Field(None, description="Orçamento total em reais.")
    data: Optional[str] = Field(None, description="Data do evento no formato AAAA-MM-DD.")

    @field_validator("convidados", "orcamento")
    @classmethod
    def _positivo(cls, v):
        # Valor zero ou negativo é tratado como "não informado" em vez de quebrar a extração.
        return v if v is None or v > 0 else None


def criar_qualificador(
    llm: BaseChatModel,
    score_limite: int,
    hoje: Callable[[], date] = date.today,
):
    extrator = llm.with_structured_output(DadosLead)

    def qualificador(state: FunilState) -> dict:
        conversa = conversa_limpa(state.get("messages", []))
        lead_atual = state.get("lead") or {}
        dia = hoje()

        dados: DadosLead = extrator.invoke(
            [
                SystemMessage(content=EXTRACAO_PROMPT.format(hoje=dia.isoformat(), lead=formatar_lead(lead_atual))),
                *conversa,
            ]
        )

        # Sem reducer em `lead`: devolver só {"score": ...} apagaria o resto.
        lead = mesclar_lead(lead_atual, dados.model_dump())
        lead["score"] = calcular_score(lead, dia)
        faltam = campos_faltando(lead)
        nome = lead.get("nome", "")

        if faltam:
            prompt = QUALIFICADOR_PROMPT.format(lead=formatar_lead(lead), faltam=", ".join(faltam))
            texto = llm.invoke([SystemMessage(content=prompt), *conversa]).text
            etapa = "supervisor"
        elif lead["score"] >= score_limite:
            texto = MSG_QUALIFICADO.format(nome=nome)
            etapa = "qualificado"
        else:
            texto = MSG_NAO_QUALIFICADO.format(nome=nome)
            etapa = "supervisor"

        return {
            "lead": lead,
            "messages": [AIMessage(content=texto, name="qualificador")],
            "proxima_etapa": etapa,
        }

    return qualificador
