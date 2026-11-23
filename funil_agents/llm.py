"""Modelo usado pelos agentes, com timeout curto e modelo reserva.

Provedores (LLM_PROVIDER): "gemini" (API do Google) ou "local" (LM Studio na própria máquina).

O Gemini às vezes responde 503 ("alta demanda"). Sem limite, o cliente fica
tentando de novo em silêncio e a conversa parece travada. Aqui cada chamada tem
timeout e poucas tentativas; se o modelo principal falhar, a mesma chamada vai
para o modelo reserva (GEMINI_FALLBACK_MODEL).
"""

from functools import lru_cache

from langchain_core.runnables import Runnable

from funil_agents.config import settings


class ModeloComReserva:
    """Repassa invoke/bind_tools/with_structured_output ao principal, com o reserva como fallback."""

    def __init__(self, principal, reserva=None):
        self.principal = principal
        self.reserva = reserva

    def _com_reserva(self, montar) -> Runnable:
        runnable = montar(self.principal)
        return runnable.with_fallbacks([montar(self.reserva)]) if self.reserva else runnable

    def invoke(self, entrada, *args, **kwargs):
        return self._com_reserva(lambda m: m).invoke(entrada, *args, **kwargs)

    def bind_tools(self, tools, **kwargs) -> Runnable:
        return self._com_reserva(lambda m: m.bind_tools(tools, **kwargs))

    def with_structured_output(self, schema, **kwargs) -> Runnable:
        return self._com_reserva(lambda m: m.with_structured_output(schema, **kwargs))


def _gemini(modelo: str):
    from langchain_google_genai import ChatGoogleGenerativeAI

    return ChatGoogleGenerativeAI(
        model=modelo,
        google_api_key=settings.google_api_key or None,
        temperature=0.3,
        timeout=settings.llm_timeout,
        max_retries=settings.llm_max_retries,
    )


def _local():
    """Modelo rodando na própria máquina (LM Studio), via API compatível com a da OpenAI.

    Não usa conta nem chave da OpenAI: o servidor é o LM Studio em localhost.
    """
    from langchain_openai import ChatOpenAI

    return ChatOpenAI(
        model=settings.local_model,
        base_url=settings.local_base_url,
        api_key="lm-studio",  # o LM Studio ignora, mas o cliente exige um valor
        temperature=0.3,
        timeout=settings.local_timeout,
        max_retries=0,
    )


@lru_cache(maxsize=1)
def get_llm() -> ModeloComReserva:
    """Os imports dos provedores ficam dentro das funções para os testes não dependerem deles."""
    if settings.llm_provider == "local":
        # Gemini como reserva só se houver chave configurada.
        chave = settings.google_api_key
        tem_chave = bool(chave) and not chave.startswith("sua-chave")  # ignora o valor de exemplo
        return ModeloComReserva(_local(), _gemini(settings.gemini_model) if tem_chave else None)

    if settings.llm_provider != "gemini":
        raise ValueError(f"LLM_PROVIDER inválido: {settings.llm_provider!r} (use 'gemini' ou 'local').")

    reserva = settings.gemini_fallback_model
    return ModeloComReserva(
        _gemini(settings.gemini_model),
        _gemini(reserva) if reserva and reserva != settings.gemini_model else None,
    )
