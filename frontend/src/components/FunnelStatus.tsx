import React from 'react'

type Stage = { id: number; name: string; done: boolean }

const stages: Stage[] = [
  { id: 1, name: 'Novo', done: true },
  { id: 2, name: 'Contato', done: true },
  { id: 3, name: 'Proposta', done: false },
  { id: 4, name: 'Confirmado', done: false },
]

export default function FunnelStatus(){
  return (
    <div className="card">
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {stages.map(s => (
          <div key={s.id} className="funnel-stage">
            <div className="stage-name">{s.name}</div>
            <div className={`stage-pill ${s.done ? 'stage-done' : 'stage-pending'}`}>{s.done ? 'Concluído' : 'Pendente'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
