# Funil_AgentsAI

Funil de vendas multiagente para uma decoradora de festas (persona: Rosalina Montenegro),
construído com **LangGraph**. A cliente conversa num chat; um supervisor decide se quem
responde é a especialista do produto ou a qualificadora, que coleta os dados do evento,
calcula um score e marca o lead como qualificado.

## Arquitetura

```mermaid
graph TD
    START([START]) --> supervisor
    supervisor -.dúvida.-> especialista
    supervisor -.dados do evento.-> qualificador
    supervisor -.turno respondido.-> END([END])
    especialista --> supervisor
    qualificador -.score >= limite.-> END
    qualificador -.faltam dados / score baixo.-> supervisor

    subgraph especialista
        agente --> tools
        tools --> agente
    end
```

| Peça | Arquivo | O que faz |
| --- | --- | --- |
| Estado | [`funil_agents/state.py`](funil_agents/state.py) | `messages` (reducer `add_messages`), `lead` (sem reducer: sempre devolver o lead completo), `proxima_etapa`, `aprovado` |
| Supervisor | [`funil_agents/nodes/supervisor.py`](funil_agents/nodes/supervisor.py) | Decide o próximo nó com saída estruturada (`Roteamento`). Se um agente já respondeu ao turno, encerra sem chamar o LLM |
| Especialista | [`funil_agents/nodes/especialista.py`](funil_agents/nodes/especialista.py) | Subgrafo com loop de ferramentas próprio (`ToolNode` + `tools_condition`) sobre o [catálogo](funil_agents/catalogo.py) |
| Qualificador | [`funil_agents/nodes/qualificador.py`](funil_agents/nodes/qualificador.py) | Extrai os dados (`DadosLead`), mescla com o lead existente, calcula o [score](funil_agents/score.py) e pede o que falta |
| Grafo | [`funil_agents/graph.py`](funil_agents/graph.py) | `StateGraph` + arestas; `run_config()` aplica o `recursion_limit` |
| API | [`api/main.py`](api/main.py) | FastAPI fino: `POST /chat` invoca o grafo |
| Frontend | [`frontend/`](frontend) | React + Vite + Tailwind, chat em `ChatSection.tsx` |

### Score do lead (0 a 100)

- 10 pontos por campo preenchido: nome, tipo de festa, convidados, orçamento e data (até 50).
- Orçamento por convidado: R$ 150 ou mais = 30, R$ 80 ou mais = 20, R$ 40 ou mais = 10.
- Prazo: de 30 dias a 1 ano = 20; menos de 30 dias ou mais de 1 ano = 10; data passada = 0.

Qualificado quando os 5 campos estão preenchidos e o score é maior ou igual a `SCORE_LIMITE` (padrão 70).

## Como rodar

Pré-requisitos: Python 3.11+ e Node 20+.

**Backend** (Windows PowerShell):

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env   # escolha o modelo (abaixo)
uvicorn api.main:app --reload
```

### Escolhendo o modelo

| `LLM_PROVIDER` | Onde roda | Custo | Precisa de |
| --- | --- | --- | --- |
| `local` | No seu PC, pelo [LM Studio](https://lmstudio.ai) | Grátis, nada sai da máquina | LM Studio com um modelo carregado |
| `gemini` | API do Google | Cota grátis, depois pago | `GOOGLE_API_KEY` do [AI Studio](https://aistudio.google.com/apikey) |

Com `local`, se a `GOOGLE_API_KEY` estiver preenchida, o Gemini entra como reserva quando o modelo local falhar.
Com `gemini`, o reserva é o `GEMINI_FALLBACK_MODEL` (útil quando a API devolve 503 por alta demanda).

**Modelo local com o LM Studio:**

1. Instale o LM Studio e, na aba de busca, baixe o **Qwen3 4B Instruct 2507**. Ele cabe numa placa de 4 GB
   e usa ferramentas e saída estruturada, que o funil precisa. Com mais memória de vídeo, um 8B responde melhor.
2. Na aba **Developer**, carregue o modelo e clique em **Start Server** (porta 1234).
3. No `.env`: `LLM_PROVIDER=local` e `LOCAL_MODEL` com o nome exato do modelo
   (`curl http://localhost:1234/v1/models` mostra; o padrão é `qwen3-4b-instruct-2507`).

O LM Studio expõe uma API no mesmo formato da OpenAI, por isso o projeto usa a biblioteca `langchain-openai`.
Não há conta, chave nem cobrança da OpenAI: o servidor é o seu próprio PC.

Detalhes, resultados dos testes com o modelo local e solução de problemas: [docs/modelo-llm.md](docs/modelo-llm.md).

**Frontend:**

```powershell
cd frontend
npm install
npm run dev   # http://localhost:5173
```

**Testes** (usam um LLM falso, não gastam chamadas ao Gemini):

```powershell
pytest
```

Os leads qualificados são gravados em `data/leads.xlsx` (fora do Git, pois contém dados de clientes).

## Roadmap

Ordem definida na aula de LangGraph (12/11/2026), um commit por parte:

- [x] **Parte 1**: Supervisor, Especialista e Qualificador em LangGraph, sem memória.
  Por enquanto a API guarda o estado de cada sessão num dicionário em memória.
- [ ] **Parte 2**: checkpointer e memória. `PostgresSaver` em produção (`SqliteSaver` no
  desenvolvimento), um `thread_id` por lead, corte ou resumo do histórico antigo.
- [ ] **Parte 3**: aprovação humana com `interrupt` antes de enviar a proposta ou passar o lead ao
  comercial, e um nó de **ação final** isolado (que só roda depois da aprovação, e uma única vez).
  Observabilidade com Arize Phoenix.
