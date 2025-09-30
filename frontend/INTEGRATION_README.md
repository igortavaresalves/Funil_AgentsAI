# Frontend Integration Guide

This short guide explains how to integrate the existing React frontend with the backend API (`api_server.py`).

1. Hook

Use the provided `src/hooks/useChat.ts` hook to send messages to the backend.

Example:

```tsx
import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';

export default function ChatDemo() {
  const { sessionId, sendMessage, loading } = useChat();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);

  const onSend = async () => {
    const result = await sendMessage(text);
    setMessages(prev => [...prev, {role: 'user', content: text}, {role: 'assistant', content: result.reply}]);
    setText('');
  }

  return (
    <div>
      <div>Session: {sessionId}</div>
      <div>{messages.map((m, i) => <div key={i}><strong>{m.role}</strong>: {m.content}</div>)}</div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={onSend} disabled={loading}>Send</button>
    </div>
  )
}
```

2. Backend URL

By default the hook points to `http://localhost:8000`. If your backend runs elsewhere, pass `useChat('https://api.example.com')`.

3. Saving leads

When the backend determines the lead is complete it will save automatically to `leads.xlsx`. You can also call `POST /lead` to save programmatically.

4. CORS

If you run the frontend on a different port (e.g., 3000 or 5173), ensure the backend allows CORS. Add the following to `api_server.py` near app initialization:

```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

5. Debug

Check browser console and the backend logs for the `debug` object returned by `/chat` if you need to inspect prompts and model outputs.

*** End ***
