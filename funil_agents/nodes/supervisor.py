"""Supervisor: decide quem responde, com saída estruturada (schema Pydantic)."""

from typing import Literal

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import SystemMessage
from pydantic import BaseModel, Field

from funil_agents.nodes.mensagens import conversa_limpa, formatar_lead, turno_respondido
from funil_agents.prompts import SUPERVISOR_PROMPT
from funil_agents.state import FunilState, campos_faltando


class Roteamento(BaseModel):
    """Decisão do supervisor sobre o próximo nó."""

    proximo: Literal["especialista", "qualificador"] = Field(
        description="Agente que deve responder à última mensagem da cliente."
    )
    motivo: str = Field(description="Justificativa curta da escolha (vai para os logs).")


def criar_supervisor(llm: BaseChatModel):
    roteador = llm.with_structured_output(Roteamento)

    def supervisor(state: FunilState) -> dict:
        messages = state.get("messages", [])

        # Um agente já respondeu neste turno: devolve a vez para a cliente.
        # A regra é determinística para não gastar uma chamada ao LLM só para encerrar.
        if turno_respondido(messages):
            return {"proxima_etapa": "finalizar"}

        lead = state.get("lead") or {}
        prompt = SUPERVISOR_PROMPT.format(
            lead=formatar_lead(lead),
            faltam=", ".join(campos_faltando(lead)) or "nenhum",
        )
        decisao: Roteamento = roteador.invoke([SystemMessage(content=prompt), *conversa_limpa(messages)])
        return {"proxima_etapa": decisao.proximo}

    return supervisor
