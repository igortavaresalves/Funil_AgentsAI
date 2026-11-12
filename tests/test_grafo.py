"""Caminhos do grafo com um LLM falso."""

from datetime import date

from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

from funil_agents.graph import build_graph, run_config
from funil_agents.nodes.qualificador import DadosLead
from funil_agents.nodes.supervisor import Roteamento
from tests.fakes import FakeLLM

HOJE = date(2026, 11, 12)


def _rodar(llm, mensagem, lead=None, historico=None):
    grafo = build_graph(llm=llm, score_limite=70, hoje=lambda: HOJE)
    entrada = {"messages": [*(historico or []), HumanMessage(content=mensagem)], "lead": lead or {}}
    return grafo.invoke(entrada, run_config())


def test_duvida_vai_para_especialista_com_ferramenta():
    llm = FakeLLM(
        roteamentos=[Roteamento(proximo="especialista", motivo="dúvida de preço")],
        respostas=[
            AIMessage(content="", tool_calls=[{"name": "consultar_pacote", "args": {"tipo_festa": "casamento"}, "id": "t1"}]),
            AIMessage(content="O pacote de casamento começa em R$ 15.000."),
        ],
    )
    final = _rodar(llm, "Quanto custa decorar um casamento?")

    tool_msgs = [m for m in final["messages"] if isinstance(m, ToolMessage)]
    assert len(tool_msgs) == 1 and "Casamentos" in tool_msgs[0].content
    assert final["messages"][-1].name == "especialista"
    assert final["proxima_etapa"] == "finalizar"
    # Supervisor chamou o LLM uma vez; a segunda passagem encerrou sem LLM.
    assert llm.chamadas == ["Roteamento", "texto", "texto"]


def test_dados_parciais_qualificador_pede_o_que_falta():
    llm = FakeLLM(
        roteamentos=[Roteamento(proximo="qualificador", motivo="passou dados")],
        extracoes=[DadosLead(nome="Ana", tipo_festa="casamento")],
        respostas=[AIMessage(content="Que lindo, Ana! Quantos convidados e qual a data?")],
    )
    final = _rodar(llm, "Sou a Ana e vou casar")

    assert final["lead"] == {"nome": "Ana", "tipo_festa": "casamento", "score": 20}
    assert final["messages"][-1].name == "qualificador"
    assert final["proxima_etapa"] == "finalizar"  # voltou ao supervisor, que devolveu a vez


def test_lead_completo_e_bom_fica_qualificado_sem_perder_dados():
    lead_anterior = {"nome": "Ana", "tipo_festa": "casamento"}
    llm = FakeLLM(
        roteamentos=[Roteamento(proximo="qualificador", motivo="completou dados")],
        extracoes=[DadosLead(convidados=100, orcamento=20000, data="2027-05-10")],
    )
    final = _rodar(llm, "100 convidados, 20 mil, 10/05/2027", lead=lead_anterior)

    assert final["lead"] == {
        "nome": "Ana",
        "tipo_festa": "casamento",
        "convidados": 100,
        "orcamento": 20000,
        "data": "2027-05-10",
        "score": 100,
    }
    assert final["proxima_etapa"] == "qualificado"
    assert "proposta personalizada" in final["messages"][-1].content


def test_lead_completo_com_score_baixo_volta_ao_supervisor():
    llm = FakeLLM(
        roteamentos=[Roteamento(proximo="qualificador", motivo="dados")],
        extracoes=[DadosLead(nome="Bia", tipo_festa="15 anos", convidados=200, orcamento=3000, data="2026-11-20")],
    )
    final = _rodar(llm, "...")

    assert final["lead"]["score"] == 60  # 50 completude + 0 orçamento + 10 prazo
    assert final["proxima_etapa"] == "finalizar"
