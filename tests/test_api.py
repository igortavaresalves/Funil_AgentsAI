from datetime import date

import pytest
from fastapi.testclient import TestClient
from langchain_core.messages import AIMessage

import api.main as api
from funil_agents.graph import build_graph
from funil_agents.nodes.qualificador import DadosLead
from funil_agents.nodes.supervisor import Roteamento
from tests.fakes import FakeLLM


@pytest.fixture
def cliente(monkeypatch):
    llm = FakeLLM(
        roteamentos=[Roteamento(proximo="qualificador", motivo="")] * 2,
        extracoes=[
            DadosLead(nome="Ana", tipo_festa="casamento"),
            DadosLead(convidados=100, orcamento=20000, data="2027-05-10"),
        ],
        respostas=[AIMessage(content="Quantos convidados, orçamento e data?")],
    )
    salvos = []
    monkeypatch.setattr(api, "salvar_lead", lambda lead, thread_id: salvos.append((thread_id, lead)))
    api.SESSOES.clear()
    api.LEADS_SALVOS.clear()
    api.app.dependency_overrides[api.get_grafo] = lambda: build_graph(
        llm=llm, score_limite=70, hoje=lambda: date(2026, 11, 12)
    )
    yield TestClient(api.app), salvos
    api.app.dependency_overrides.clear()


def test_conversa_em_dois_turnos_mantem_o_lead_e_salva_uma_vez(cliente):
    client, salvos = cliente

    r1 = client.post("/chat", json={"message": "Sou a Ana, vou casar"}).json()
    assert r1["debug"]["decision"] == "qualificador"
    assert r1["debug"]["lead"]["nome"] == "Ana"

    r2 = client.post("/chat", json={"session_id": r1["session_id"], "message": "100 pessoas, 20 mil, 10/05/2027"}).json()
    assert r2["debug"]["etapa"] == "qualificado"
    assert r2["debug"]["lead"]["nome"] == "Ana"  # não se perdeu no segundo turno
    assert len(salvos) == 1 and salvos[0][0] == r1["session_id"]


def test_mensagem_vazia(cliente):
    client, _ = cliente
    assert client.post("/chat", json={"message": "  "}).status_code == 422
