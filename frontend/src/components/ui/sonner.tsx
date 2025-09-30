import React from 'react'
import { useToast } from '../../hooks/useToasts'

export const Toaster: React.FC = () => {
  const { toasts, dismiss } = useToast() as any

  return (
    <div style={{position:'fixed',right:20,top:20,zIndex:60,display:'flex',flexDirection:'column',gap:8}}>
      {toasts.map((t: any) => (
        <div key={t.id} className="glass-effect" style={{padding:12,minWidth:260,borderRadius:10,boxShadow:'0 6px 18px rgba(0,0,0,0.08)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{fontWeight:600}}>{t.title || 'Notificação'}</div>
              {t.message && <div style={{fontSize:13,marginTop:6,color:'#374151'}}>{t.message}</div>}
            </div>
            <div>
              <button onClick={() => dismiss(t.id)} style={{background:'transparent',border:'none',cursor:'pointer'}}>✕</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Toaster
