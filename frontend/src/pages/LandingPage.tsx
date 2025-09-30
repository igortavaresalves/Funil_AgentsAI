import React, { useState } from 'react'
import ChatWidget from '../components/ChatWidget'
import ChatModal from '../components/ChatModal'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ServicesSection from '../components/ServicesSection'

type Props = { onGetStarted?: () => void }

export default function LandingPage({ onGetStarted }: Props){
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="landing-root" style={{paddingTop:72}}>
      <Header />

  <header id="sobre" className="lp-hero hero-peach">
        <div className="lp-hero-inner">
          <span className="badge">20 anos de experiência</span>
          <h1>Transformamos <span className="accent">sonhos</span> em celebrações <span className="accent-strong">inesquecíveis</span></h1>
          <p className="lead">Há quase 20 anos criando momentos únicos e especiais. Cada evento é uma história, cada detalhe uma emoção que permanece para sempre.</p>

          <div style={{marginTop:18}}>
            <button className="btn btn-primary" onClick={onGetStarted}>Converse com a Rosa</button>
            <a href="#portfolio" className="btn btn-outline" style={{marginLeft:10}}>Ver Portfólio</a>
          </div>

          <div className="stats" style={{display:'flex',gap:24,marginTop:36}}>
            <div><div className="stat-value">500+</div><div className="small-muted">Eventos realizados</div></div>
            <div><div className="stat-value">20</div><div className="small-muted">Anos de experiência</div></div>
            <div><div className="stat-value">100%</div><div className="small-muted">Clientes satisfeitos</div></div>
          </div>
        </div>

        <div className="lp-hero-visual">
          <div style={{position:'relative'}}>
            <img src="https://picsum.photos/seed/party/800/520" alt="festa" />
            <div style={{position:'absolute',right:-40,top:40}}>
              <ChatWidget onStart={() => setChatOpen(true)} />
            </div>
          </div>
        </div>
      </header>

      {chatOpen && <ChatModal onClose={() => setChatOpen(false)} />}

      <ServicesSection />

      <section id="portfolio" className="lp-gallery">
        <h3>Inspiração</h3>
        <div className="gallery-grid">
          <img src="https://picsum.photos/seed/g1/400/300" alt="g1" />
          <img src="https://picsum.photos/seed/g2/400/300" alt="g2" />
          <img src="https://picsum.photos/seed/g3/400/300" alt="g3" />
          <img src="https://picsum.photos/seed/g4/400/300" alt="g4" />
        </div>
      </section>

      <Footer />
    </div>
  )
}
