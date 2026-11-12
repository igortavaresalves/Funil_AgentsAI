"""Configuração lida do ambiente (arquivo .env na raiz do projeto).

Variáveis:
- GOOGLE_API_KEY: chave do Google AI Studio (obrigatória para rodar com o Gemini).
- GEMINI_MODEL: modelo usado pelos agentes (padrão: gemini-2.5-flash).
- SCORE_LIMITE: score mínimo (0 a 100) para o lead ser considerado qualificado.
- RECURSION_LIMIT: teto de passos por execução do grafo (evita loop infinito).
- LEADS_PATH: planilha onde os leads qualificados são gravados.
"""

import os
from dataclasses import dataclass, field

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    gemini_model: str = field(default_factory=lambda: os.getenv("GEMINI_MODEL", "gemini-2.5-flash"))
    score_limite: int = field(default_factory=lambda: int(os.getenv("SCORE_LIMITE", "70")))
    recursion_limit: int = field(default_factory=lambda: int(os.getenv("RECURSION_LIMIT", "15")))
    leads_path: str = field(default_factory=lambda: os.getenv("LEADS_PATH", "data/leads.xlsx"))


settings = Settings()
