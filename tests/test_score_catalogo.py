from datetime import date

import pytest

from funil_agents.catalogo import consultar_pacote, resolver_tipo
from funil_agents.score import calcular_score

HOJE = date(2026, 11, 12)


def test_score_lead_completo_e_bom():
    lead = {"nome": "Ana", "tipo_festa": "casamento", "convidados": 100, "orcamento": 20000, "data": "2027-05-10"}
    assert calcular_score(lead, HOJE) == 50 + 30 + 20


def test_score_lead_vazio():
    assert calcular_score({}, HOJE) == 0


@pytest.mark.parametrize(
    ("data", "pontos"),
    [("2026-11-20", 10), ("2027-06-01", 20), ("2028-06-01", 10), ("2026-01-01", 0), ("data invalida", 0)],
)
def test_score_prazo(data, pontos):
    assert calcular_score({"data": data}, HOJE) == 10 + pontos


def test_score_orcamento_baixo_por_convidado():
    lead = {"convidados": 200, "orcamento": 5000}  # R$ 25 por convidado
    assert calcular_score(lead, HOJE) == 20


@pytest.mark.parametrize(
    ("texto", "chave"),
    [("Casamento", "casamento"), ("festa de debutante", "15 anos"), ("evento da empresa", "corporativo"), ("show", None)],
)
def test_resolver_tipo(texto, chave):
    assert resolver_tipo(texto) == chave


def test_salvar_lead_acrescenta_linhas(tmp_path):
    from openpyxl import load_workbook

    from funil_agents.leads import salvar_lead

    caminho = tmp_path / "leads.xlsx"
    salvar_lead({"nome": "Ana", "score": 90}, "t1", str(caminho))
    salvar_lead({"nome": "Bia", "score": 75}, "t2", str(caminho))

    linhas = list(load_workbook(caminho).active.iter_rows(values_only=True))
    assert linhas[0][:3] == ("registrado_em", "thread_id", "nome")
    assert [(l[1], l[2]) for l in linhas[1:]] == [("t1", "Ana"), ("t2", "Bia")]


def test_consultar_pacote_desconhecido():
    assert "Não há pacote" in consultar_pacote.invoke({"tipo_festa": "rodeio"})
