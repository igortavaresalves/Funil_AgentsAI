"""Estado compartilhado do grafo.

Regra importante (pergunta de revisão da aula): `lead` NÃO tem reducer, então o
valor devolvido por um nó SUBSTITUI o lead inteiro. Todo nó que mexe no lead
precisa devolver o lead completo (use `mesclar_lead`).
"""

from typing import Annotated, Literal, Optional, TypedDict

from langchain_core.messages import AnyMessage
from langgraph.graph.message import add_messages


class Lead(TypedDict, total=False):
    nome: str
    tipo_festa: str
    convidados: int
    orcamento: float
    data: str  # ISO: AAAA-MM-DD
    score: int


Etapa = Literal["especialista", "qualificador", "finalizar", "qualificado", "supervisor"]


class FunilState(TypedDict, total=False):
    messages: Annotated[list[AnyMessage], add_messages]
    lead: Lead
    proxima_etapa: Etapa
    aprovado: Optional[bool]  # preenchido pela aprovação humana (parte 3)


CAMPOS_OBRIGATORIOS: tuple[str, ...] = ("nome", "tipo_festa", "convidados", "orcamento", "data")


def mesclar_lead(atual: Optional[Lead], novos: dict) -> Lead:
    """Devolve o lead completo: mantém o que já existia e sobrescreve só o que veio preenchido."""
    resultado: dict = dict(atual or {})
    resultado.update({k: v for k, v in novos.items() if v not in (None, "")})
    return Lead(**resultado)


def campos_faltando(lead: Optional[Lead]) -> list[str]:
    lead = lead or {}
    return [c for c in CAMPOS_OBRIGATORIOS if lead.get(c) in (None, "")]
