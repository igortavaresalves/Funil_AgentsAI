import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Sparkles, Heart, Star, Calendar } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 pt-20">
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                <span>20 anos de experiência</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transformamos
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500"> sonhos </span>
                em celebrações
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500"> inesquecíveis</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Há quase 20 anos criando momentos únicos e especiais. Cada evento é uma história, cada detalhe uma emoção que permanece para sempre.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Heart className="w-5 h-5 mr-2" />
                Converse com a Rosa
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-rose-200 text-rose-600 hover:bg-rose-50 px-8 py-4 rounded-full text-lg font-medium transition-all"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Ver Portfólio
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-600">500+</div>
                <div className="text-sm text-gray-600">Eventos realizados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-600">20</div>
                <div className="text-sm text-gray-600">Anos de experiência</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-600">100%</div>
                <div className="text-sm text-gray-600">Clientes satisfeitos</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <Card className="p-8 bg-white/80 backdrop-blur-sm border border-rose-100 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-amber-300 rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Rosa</h3>
                      <p className="text-sm text-rose-600">Organizadora de Eventos</p>
                    </div>
                  </div>
                  
                  <div className="bg-rose-50 p-4 rounded-lg">
                    <p className="text-gray-700 italic">
                      "Olá! Sou Rosa, sua organizadora de eventos! Como posso lhe ajudar? 
                      Estou no ramo de eventos há quase 20 anos e tenho a experiência que sua festa precisa."
                    </p>
                  </div>
                  
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-full font-medium transition-all transform hover:scale-105">
                    Iniciar Conversa
                  </Button>
                </div>
              </Card>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-rose-200/20 to-amber-200/20 rounded-3xl transform rotate-6 scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 to-rose-200/20 rounded-3xl transform -rotate-3 scale-110"></div>
          </div>
        </div>
      </div>
    </section>
  );
};