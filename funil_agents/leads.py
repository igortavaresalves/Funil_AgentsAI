"""Gravação dos leads qualificados numa planilha local (fora do Git)."""

from datetime import datetime
from pathlib import Path
from typing import Optional

from openpyxl import Workbook, load_workbook

from funil_agents.config import settings
from funil_agents.state import CAMPOS_OBRIGATORIOS, Lead

COLUNAS = ["registrado_em", "thread_id", *CAMPOS_OBRIGATORIOS, "score"]


def salvar_lead(lead: Lead, thread_id: str, caminho: Optional[str] = None) -> Path:
    destino = Path(caminho or settings.leads_path)
    destino.parent.mkdir(parents=True, exist_ok=True)

    if destino.exists():
        planilha = load_workbook(destino)
        aba = planilha.active
    else:
        planilha = Workbook()
        aba = planilha.active
        aba.title = "leads"
        aba.append(COLUNAS)

    linha = {"registrado_em": datetime.now().isoformat(timespec="seconds"), "thread_id": thread_id, **lead}
    aba.append([linha.get(c) for c in COLUNAS])
    planilha.save(destino)
    return destino
