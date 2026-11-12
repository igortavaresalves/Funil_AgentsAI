"""LLM falso para testar o grafo sem chamar o Gemini.

Cada fila guarda as respostas que o modelo vai dar, na ordem:
- roteamentos: saídas estruturadas do Supervisor (Roteamento)
- extracoes: saídas estruturadas do Qualificador (DadosLead)
- respostas: AIMessages de texto ou com tool_calls
"""

from langchain_core.messages import AIMessage
from langchain_core.runnables import RunnableLambda


class FakeLLM:
    def __init__(self, roteamentos=None, extracoes=None, respostas=None):
        self.roteamentos = list(roteamentos or [])
        self.extracoes = list(extracoes or [])
        self.respostas = list(respostas or [])
        self.chamadas: list[str] = []

    def with_structured_output(self, schema):
        nome = schema.__name__
        fila = self.roteamentos if nome == "Roteamento" else self.extracoes

        def _invoke(_messages):
            self.chamadas.append(nome)
            return fila.pop(0)

        return RunnableLambda(_invoke)

    def bind_tools(self, _tools):
        return self

    def invoke(self, _messages, *args, **kwargs) -> AIMessage:
        self.chamadas.append("texto")
        return self.respostas.pop(0)
