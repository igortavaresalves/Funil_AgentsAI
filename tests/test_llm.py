"""O modelo reserva assume quando o principal falha (ex.: 503 de alta demanda do Gemini)."""

from langchain_core.language_models.fake_chat_models import FakeListChatModel
from langchain_core.messages import AIMessage
from langchain_core.runnables import RunnableLambda

from funil_agents.llm import ModeloComReserva


class _Falha(FakeListChatModel):
    def _call(self, *args, **kwargs):
        raise RuntimeError("503 UNAVAILABLE")


def test_reserva_responde_quando_o_principal_falha():
    llm = ModeloComReserva(_Falha(responses=["x"]), FakeListChatModel(responses=["resposta do reserva"]))
    assert llm.invoke("oi").content == "resposta do reserva"


def test_sem_reserva_usa_so_o_principal():
    llm = ModeloComReserva(FakeListChatModel(responses=["principal"]))
    assert llm.invoke("oi").content == "principal"


def _get_llm_com(monkeypatch, **config):
    import funil_agents.llm as modulo
    from funil_agents.config import Settings

    monkeypatch.setattr(modulo, "settings", Settings(**config))
    modulo.get_llm.cache_clear()
    try:
        return modulo.get_llm()
    finally:
        modulo.get_llm.cache_clear()


def test_provedor_local_aponta_para_o_lm_studio(monkeypatch):
    llm = _get_llm_com(monkeypatch, llm_provider="local", local_model="qwen/qwen3-4b", google_api_key="")
    assert type(llm.principal).__name__ == "ChatOpenAI"
    assert llm.principal.model_name == "qwen/qwen3-4b"
    assert str(llm.principal.openai_api_base).startswith("http://localhost:1234")
    assert llm.reserva is None  # sem chave do Google, sem reserva


def test_provedor_local_usa_gemini_como_reserva_quando_ha_chave(monkeypatch):
    llm = _get_llm_com(monkeypatch, llm_provider="local", google_api_key="chave-de-teste")
    assert type(llm.reserva).__name__ == "ChatGoogleGenerativeAI"


def test_chave_de_exemplo_nao_ativa_reserva(monkeypatch):
    llm = _get_llm_com(monkeypatch, llm_provider="local", google_api_key="sua-chave-do-google-ai-studio")
    assert llm.reserva is None


def test_provedor_invalido(monkeypatch):
    import pytest

    with pytest.raises(ValueError, match="LLM_PROVIDER"):
        _get_llm_com(monkeypatch, llm_provider="outro")


def test_reserva_tambem_vale_para_saida_estruturada():
    class Modelo:
        def __init__(self, resultado):
            self.resultado = resultado

        def with_structured_output(self, schema, **kwargs):
            def responder(_):
                if isinstance(self.resultado, Exception):
                    raise self.resultado
                return self.resultado

            return RunnableLambda(responder)

    llm = ModeloComReserva(Modelo(RuntimeError("503")), Modelo(AIMessage(content="ok")))
    assert llm.with_structured_output(dict).invoke("oi").content == "ok"
