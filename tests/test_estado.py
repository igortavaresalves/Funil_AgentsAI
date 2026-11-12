"""Comportamento do estado: reducer em `messages` e sobrescrita em `lead`."""

from langchain_core.messages import AIMessage, HumanMessage
from langgraph.graph import END, START, StateGraph

from funil_agents.state import FunilState, campos_faltando, mesclar_lead

LEAD = {"nome": "Ana", "tipo_festa": "casamento", "convidados": 120}


def _grafo_com_no(retorno: dict):
    g = StateGraph(FunilState)
    g.add_node("no", lambda _state: retorno)
    g.add_edge(START, "no")
    g.add_edge("no", END)
    return g.compile()


def test_lead_sem_reducer_e_sobrescrito_inteiro():
    """A pergunta de revisão da aula: devolver só o score apaga o resto do lead."""
    grafo = _grafo_com_no({"messages": [AIMessage(content="ok")], "lead": {"score": 80}})
    final = grafo.invoke({"messages": [HumanMessage(content="oi")], "lead": dict(LEAD)})

    assert final["lead"] == {"score": 80}
    assert [m.content for m in final["messages"]] == ["oi", "ok"]  # add_messages acrescenta


def test_devolver_lead_completo_preserva_os_dados():
    grafo = _grafo_com_no({"lead": mesclar_lead(LEAD, {"score": 80})})
    final = grafo.invoke({"messages": [], "lead": dict(LEAD)})

    assert final["lead"] == {**LEAD, "score": 80}


def test_mesclar_lead_ignora_campos_vazios():
    assert mesclar_lead(LEAD, {"nome": None, "orcamento": 20000, "data": ""}) == {**LEAD, "orcamento": 20000}


def test_campos_faltando():
    assert campos_faltando(LEAD) == ["orcamento", "data"]
    assert campos_faltando(None) == ["nome", "tipo_festa", "convidados", "orcamento", "data"]
