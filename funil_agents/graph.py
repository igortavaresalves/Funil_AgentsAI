"""Montagem do grafo do funil (parte 1: sem memória).

START -> supervisor
supervisor --(condicional)--> especialista | qualificador | END
especialista -> supervisor
qualificador --(condicional)--> END (qualificado) | supervisor
"""

from datetime import date
from typing import Callable, Optional

from langchain_core.language_models import BaseChatModel
from langchain_core.runnables import RunnableConfig
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph

from funil_agents.catalogo import FERRAMENTAS_ESPECIALISTA
from funil_agents.config import settings
from funil_agents.nodes import criar_especialista, criar_qualificador, criar_supervisor
from funil_agents.state import FunilState


def rota_supervisor(state: FunilState) -> str:
    etapa = state.get("proxima_etapa")
    return etapa if etapa in ("especialista", "qualificador") else END


def rota_qualificador(state: FunilState) -> str:
    # Parte 3: "qualificado" vai passar a apontar para o nó de aprovação humana.
    return END if state.get("proxima_etapa") == "qualificado" else "supervisor"


def build_graph(
    llm: Optional[BaseChatModel] = None,
    score_limite: Optional[int] = None,
    hoje: Callable[[], date] = date.today,
) -> CompiledStateGraph:
    if llm is None:
        from funil_agents.llm import get_llm

        llm = get_llm()

    grafo = StateGraph(FunilState)
    grafo.add_node("supervisor", criar_supervisor(llm))
    grafo.add_node("especialista", criar_especialista(llm, FERRAMENTAS_ESPECIALISTA))
    grafo.add_node(
        "qualificador",
        criar_qualificador(llm, score_limite if score_limite is not None else settings.score_limite, hoje),
    )

    grafo.add_edge(START, "supervisor")
    grafo.add_conditional_edges(
        "supervisor",
        rota_supervisor,
        {"especialista": "especialista", "qualificador": "qualificador", END: END},
    )
    grafo.add_edge("especialista", "supervisor")
    grafo.add_conditional_edges("qualificador", rota_qualificador, {"supervisor": "supervisor", END: END})
    return grafo.compile(name="funil")


def run_config(**extra) -> RunnableConfig:
    """Config padrão de execução, com recursion_limit para evitar loop infinito."""
    return RunnableConfig(recursion_limit=settings.recursion_limit, **extra)
