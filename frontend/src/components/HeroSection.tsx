import React from 'react'
import { cn } from '../lib/utils'

export const HeroSection: React.FC = () => {
  return (
    <section className={cn('hero bg-gradient-to-br from-pink-50 via-white to-yellow-50 py-20') }>
      <div className="container" style={{maxWidth:1200,margin:'0 auto',padding:'0 16px'}}>
        <div className="flex items-center gap-8 md:gap-12 flex-col-reverse md:flex-row">
          {/* Left: Title and CTAs */}
          <div className="w-full md:w-2/3" style={{flex:1}}>
            <div className="max-w-lg">
              <span className="inline-block mb-3 px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm">⭐ 20 anos de experiência</span>
              <h1 className="mt-4 text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">
                Transformamos <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">sonhos</span>
                <br /> em celebrações
                <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">inesquecíveis</span>
              </h1>
              <p className="mt-6 text-base md:text-lg text-gray-600">Há quase 20 anos criando momentos únicos e especiais. Cada evento é uma história, cada detalhe uma emoção que permanece para sempre.</p>

              <div className="mt-8 flex items-center gap-4">
                <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-pink-500 text-white font-semibold shadow-lg hover:translate-y-[-2px] transform transition">♡ Converse com a Rosa</a>
                <a href="#portfolio" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-pink-200 text-pink-600 font-medium">Ver Portfólio</a>
              </div>
            </div>
            {/* Stats row (simple) */}
            <div className="mt-12 flex items-center gap-12">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-pink-600">500+</div>
                <div className="text-sm text-gray-500">Eventos realizados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-pink-600">20</div>
                <div className="text-sm text-gray-500">Anos de experiência</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-pink-600">100%</div>
                <div className="text-sm text-gray-500">Clientes satisfeitos</div>
              </div>
            </div>
          </div>

          {/* Right: floating card with layered backgrounds */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <div className="relative" style={{width:360, minHeight:220}}>
              {/* layered backgrounds */}
              <div className="absolute -top-6 -right-6 w-72 h-44 rounded-xl bg-gradient-to-r from-pink-50 to-yellow-50 opacity-80 transform rotate-6 shadow-sm"></div>
              <div className="absolute -top-3 -right-3 w-72 h-44 rounded-xl bg-gradient-to-r from-yellow-50 to-white opacity-70 transform -rotate-3 shadow-md"></div>

              {/* card */}
              <div className="relative bg-white rounded-xl shadow-xl p-6" style={{zIndex:10}}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white font-bold">R</div>
                  <div>
                    <div className="font-semibold text-sm">Rosa</div>
                    <div className="text-xs text-pink-500">Organizadora de Eventos</div>
                  </div>
                </div>

                <blockquote className="mt-4 p-4 bg-pink-50 rounded-md text-sm text-gray-700">"Olá! Sou Rosa, sua organizadora de eventos! Como posso lhe ajudar? Estou no ramo de eventos há quase 20 anos e tenho a experiência que sua festa precisa."</blockquote>

                <div className="mt-4">
                  <button className="w-full rounded-full bg-pink-500 text-white py-2 font-semibold">Iniciar Conversa</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
