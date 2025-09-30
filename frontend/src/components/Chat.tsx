import React, { useState, useRef, useEffect } from 'react'

type Msg = { id: string; author: 'me' | 'other'; text: string; time?: string }

function id() { return Math.random().toString(36).slice(2,9) }

export default function Chat(){
  const [messages, setMessages] = useState<Msg[]>([
    { id: id(), author:'other', text:'Olá! Tenho interesse em fazer uma festa.' },
    { id: id(), author:'me', text:'Ótimo — qual é a data prevista?' }
  ])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) }, [messages])

  function send(){
    const trimmed = text.trim()
    if(!trimmed || sending) return

    const myMsg: Msg = { id: id(), author: 'me', text: trimmed, time: new Date().toISOString() }
    setMessages(prev => [...prev, myMsg])
    setText('')
    setSending(true)

    // simulate a typed reply (placeholder)
    setTimeout(()=>{
      const reply: Msg = { id: id(), author: 'other', text: 'Recebido! Vou checar a disponibilidade.' }
      setMessages(prev => [...prev, reply])
      setSending(false)
    }, 700)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>){
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault(); send()
    }
  }

  return (
    <div className="chat" style={{width:'100%',maxWidth:960}}>
      <div className="messages card">
        {messages.map(m=> (
          <div key={m.id} className={`message ${m.author==='me' ? 'me' : 'other'}`}>
            <div>{m.text}</div>
            <div className="meta">{m.time ? new Date(m.time).toLocaleTimeString() : ''}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="input-row">
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={onKeyDown} placeholder="Escreva uma mensagem..." />
        <button onClick={send} disabled={sending}>{sending ? 'Enviando...' : 'Enviar'}</button>
      </div>
    </div>
  )
}
