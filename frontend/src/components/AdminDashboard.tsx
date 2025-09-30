import React from 'react'
import LeadCard from './LeadCard'
import FunnelStatus from './FunnelStatus'
import ImageGallery from './ImageGallery'

export const AdminDashboard: React.FC = () => {
  return (
    <div style={{padding:24}}>
      <header style={{marginBottom:16}}>
        <h2 className="text-2xl font-bold">Painel Administrativo</h2>
      </header>

      <section style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:20}}>
        <div>
          <LeadCard />
          <div style={{marginTop:12}}>
            <FunnelStatus />
          </div>
        </div>
        <aside>
          <ImageGallery />
        </aside>
      </section>
    </div>
  )
}

export default AdminDashboard
