"""Catálogo de serviços e ferramentas do Especialista.

ATENÇÃO: os valores abaixo são EXEMPLOS. Ajuste com os pacotes reais
(ou troque por uma busca RAG quando houver material do produto).
"""

from typing import Optional

from langchain_core.tools import tool

PACOTES: dict[str, dict] = {
    "casamento": {
        "nome": "Casamentos",
        "inclui": "decoração da cerimônia e da recepção, flores, mesa do bolo e iluminação cênica",
        "a_partir_de": 15000,
    },
    "15 anos": {
        "nome": "Festas de 15 Anos",
        "inclui": "cenografia temática, pista, mesa principal e ambientação de entrada",
        "a_partir_de": 9000,
    },
    "batizado": {
        "nome": "Batizados",
        "inclui": "decoração delicada da igreja e do espaço da recepção",
        "a_partir_de": 3500,
    },
    "corporativo": {
        "nome": "Eventos Corporativos",
        "inclui": "ambientação com a identidade da marca, palco e áreas de convivência",
        "a_partir_de": 12000,
    },
    "aniversario": {
        "nome": "Festas de Meia Idade e Aniversários",
        "inclui": "decoração sofisticada, mesa posta e iluminação",
        "a_partir_de": 6000,
    },
    "ornamentacao": {
        "nome": "Ornamentação de Espaços",
        "inclui": "transformação do ambiente com flores, tecidos e luz",
        "a_partir_de": 2500,
    },
}

SINONIMOS = {
    "casamentos": "casamento",
    "noivado": "casamento",
    "debutante": "15 anos",
    "quinze anos": "15 anos",
    "15": "15 anos",
    "batismo": "batizado",
    "empresa": "corporativo",
    "empresarial": "corporativo",
    "aniversário": "aniversario",
    "meia idade": "aniversario",
    "ornamentação": "ornamentacao",
    "espaço": "ornamentacao",
}


def resolver_tipo(tipo_festa: str) -> Optional[str]:
    t = tipo_festa.lower().strip()
    if t in PACOTES:
        return t
    for termo, chave in SINONIMOS.items():
        if termo in t:
            return chave
    for chave in PACOTES:
        if chave in t:
            return chave
    return None


@tool
def listar_servicos() -> str:
    """Lista todos os tipos de evento atendidos, com o valor inicial de cada pacote."""
    return "\n".join(f"- {p['nome']}: a partir de R$ {p['a_partir_de']:,.0f}" for p in PACOTES.values())


@tool
def consultar_pacote(tipo_festa: str) -> str:
    """Detalha o pacote de um tipo de evento (o que inclui e o valor inicial).

    Args:
        tipo_festa: tipo do evento, por exemplo "casamento", "15 anos" ou "corporativo".
    """
    chave = resolver_tipo(tipo_festa)
    if chave is None:
        return f"Não há pacote cadastrado para '{tipo_festa}'. Use listar_servicos para ver as opções."
    p = PACOTES[chave]
    return f"{p['nome']}: inclui {p['inclui']}. Valor a partir de R$ {p['a_partir_de']:,.0f}."


FERRAMENTAS_ESPECIALISTA = [listar_servicos, consultar_pacote]
