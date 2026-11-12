from functools import lru_cache

from langchain_core.language_models import BaseChatModel

from funil_agents.config import settings


@lru_cache(maxsize=1)
def get_llm() -> BaseChatModel:
    """Modelo padrão dos agentes. O import fica aqui para os testes não dependerem do Gemini."""
    from langchain_google_genai import ChatGoogleGenerativeAI

    return ChatGoogleGenerativeAI(model=settings.gemini_model, temperature=0.3)
