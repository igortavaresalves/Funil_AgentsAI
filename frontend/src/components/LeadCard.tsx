import React from 'react'

type Props = { collapsed?: boolean }

export default function LeadCard({ collapsed = false }: Props){
  const lead = { name: 'Ana Silva', phone: '+55 11 9 9999-9999', email: 'ana@exemplo.com', budget: 'R$ 5.000' }
  return (
    <div className="card" style={{display:'flex',gap:12,alignItems:'center'}}>
      <div className="avatar">{lead.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
      <div style={{flex:1}}>
        <div className="lead-name">{lead.name}</div>
        {!collapsed && <div className="lead-meta">{lead.phone} · {lead.email}</div>}
        {!collapsed && <div style={{marginTop:8}}>Orçamento estimado: <strong>{lead.budget}</strong></div>}
      </div>
    </div>
  )
}
