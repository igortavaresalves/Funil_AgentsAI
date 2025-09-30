import { useState, useCallback } from 'react';

export function useChat(baseUrl: string = 'http://localhost:8000') {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (message: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message }),
      });
      const data = await res.json();
      if (data.session_id) setSessionId(data.session_id);
      return data;
    } finally {
      setLoading(false);
    }
  }, [baseUrl, sessionId]);

  return { sessionId, sendMessage, loading };
}
