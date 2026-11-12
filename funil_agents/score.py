"""Score do lead (0 a 100), calculado em Python para ser previsível e testável.

- Completude: 10 pontos por campo obrigatório preenchido (até 50).
- Orçamento por convidado: até 30 pontos.
- Prazo até o evento: até 20 pontos (muito em cima ou já passado vale menos).
"""

from datetime import date
from typing import Optional

from funil_agents.state import CAMPOS_OBRIGATORIOS, Lead


def _pontos_orcamento(lead: Lead) -> int:
    convidados, orcamento = lead.get("convidados"), lead.get("orcamento")
    if not convidados or not orcamento or convidados <= 0:
        return 0
    por_convidado = orcamento / convidados
    if por_convidado >= 150:
        return 30
    if por_convidado >= 80:
        return 20
    if por_convidado >= 40:
        return 10
    return 0


def _pontos_prazo(lead: Lead, hoje: date) -> int:
    try:
        evento = date.fromisoformat(str(lead.get("data")))
    except ValueError:
        return 0
    dias = (evento - hoje).days
    if dias < 0:
        return 0
    if dias < 30:
        return 10
    if dias <= 365:
        return 20
    return 10


def calcular_score(lead: Lead, hoje: Optional[date] = None) -> int:
    hoje = hoje or date.today()
    completude = sum(10 for c in CAMPOS_OBRIGATORIOS if lead.get(c) not in (None, ""))
    return completude + _pontos_orcamento(lead) + _pontos_prazo(lead, hoje)
