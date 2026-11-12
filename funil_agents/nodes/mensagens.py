"""Utilitários para ler o histórico de mensagens."""

import json

from langchain_core.messages import AIMessage, AnyMessage, HumanMessage


def conversa_limpa(messages: list[AnyMessage]) -> list[AnyMessage]:
    """Só as falas da cliente e as respostas finais dos agentes.

    Remove chamadas de ferramenta e seus resultados, que só interessam ao Especialista.
    Isso reduz o contexto (e o custo) do Supervisor e do Qualificador.
    """
    limpas: list[AnyMessage] = []
    for m in messages:
        if isinstance(m, HumanMessage):
            limpas.append(m)
        elif isinstance(m, AIMessage) and not m.tool_calls and m.text:
            limpas.append(AIMessage(content=m.text, name=m.name, id=m.id))
    return limpas


def turno_respondido(messages: list[AnyMessage]) -> bool:
    """True se algum agente já respondeu à última mensagem da cliente."""
    for m in reversed(messages):
        if isinstance(m, HumanMessage):
            return False
        if isinstance(m, AIMessage) and not m.tool_calls and m.text:
            return True
    return False


def ultima_resposta(messages: list[AnyMessage]) -> AIMessage | None:
    for m in reversed(messages):
        if isinstance(m, HumanMessage):
            return None
        if isinstance(m, AIMessage) and not m.tool_calls and m.text:
            return m
    return None


def formatar_lead(lead: dict | None) -> str:
    return json.dumps(lead or {}, ensure_ascii=False)
