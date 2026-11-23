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
