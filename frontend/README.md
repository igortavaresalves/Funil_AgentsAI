# Frontend do Funil_AgentsAI

React 19 + TypeScript + Vite + Tailwind.

```powershell
npm install
npm run dev      # http://localhost:5173
npm run build    # checa tipos e gera dist/
```

O chat ([`src/components/ChatSection.tsx`](src/components/ChatSection.tsx)) conversa com a API em
`http://localhost:8000` pelo hook [`src/hooks/useChat.ts`](src/hooks/useChat.ts).
A resposta de `POST /chat` traz `reply` (texto da Rosalina) e `debug.decision` (qual agente respondeu).
