import React from 'react'

type Props = { onStart?: () => void }

export default function ChatWidget({ onStart }: Props){
  return (
    <div className="chat-widget card">
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:44,height:44,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#ff7aa2,#ffc069)',color:'#fff',fontWeight:700}}>R</div>
        <div>
          <div style={{fontWeight:700}}>Rosa</div>
          <div className="small-muted" style={{fontSize:12}}>Organizadora de Eventos</div>
        </div>
      </div>

      <div style={{marginTop:12,background:'rgba(255,255,255,0.95)',padding:12,borderRadius:8}}>
        <div style={{color:'#6b7280',fontSize:14}}>“Olá! Sou Rosa, sua organizadora de eventos. Como posso lhe ajudar? Tenho quase 20 anos de experiência.”</div>
      </div>

      <div style={{marginTop:12,display:'flex',justifyContent:'center'}}>
        <button className="btn btn-primary" onClick={onStart}>Iniciar Conversa</button>
      </div>
    </div>
  )
}
