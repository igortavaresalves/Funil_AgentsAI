"""Especialista: tira dúvidas do produto num loop de ferramentas próprio (subgrafo)."""

from typing import Sequence

from langchain_core.language_models import BaseChatModel
from langchain_core.messages import SystemMessage
from langchain_core.tools import BaseTool
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode, tools_condition

from funil_agents.prompts import ESPECIALISTA_PROMPT


def criar_especialista(llm: BaseChatModel, ferramentas: Sequence[BaseTool]):
    """Devolve um subgrafo compilado: agente -> (tools -> agente)* -> END.

    Montado na mão (e não com um agente pronto) para controlar o prompt e o nome
    da mensagem. O subgrafo compartilha a chave `messages` com o grafo principal.
    """
    modelo = llm.bind_tools(list(ferramentas))

    def agente(state: MessagesState) -> dict:
        resposta = modelo.invoke([SystemMessage(content=ESPECIALISTA_PROMPT), *state["messages"]])
        resposta.name = "especialista"
        return {"messages": [resposta]}

    grafo = StateGraph(MessagesState)
    grafo.add_node("agente", agente)
    grafo.add_node("tools", ToolNode(list(ferramentas)))
    grafo.add_edge(START, "agente")
    grafo.add_conditional_edges("agente", tools_condition, {"tools": "tools", END: END})
    grafo.add_edge("tools", "agente")
    return grafo.compile(name="especialista")
