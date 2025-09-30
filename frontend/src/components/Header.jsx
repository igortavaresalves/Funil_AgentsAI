import React from 'react';
import { Button } from './ui/button';
import { Sparkles, Calendar, Users } from 'lucide-react';

export const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-rose-100 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-amber-300 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Rosa</h1>
              <p className="text-sm text-rose-600">Eventos Exclusivos</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#sobre" className="text-gray-700 hover:text-rose-600 transition-colors">Sobre</a>
            <a href="#servicos" className="text-gray-700 hover:text-rose-600 transition-colors">Serviços</a>
            <a href="#portfolio" className="text-gray-700 hover:text-rose-600 transition-colors">Portfólio</a>
            <Button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full transition-all transform hover:scale-105">
              <Calendar className="w-4 h-4 mr-2" />
              Agendar Reunião
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};