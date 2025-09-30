import React from 'react';
import { Sparkles, MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-12">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-amber-300 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Rosa</h3>
                <p className="text-gray-300 text-sm">Eventos Exclusivos</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Há quase 20 anos transformando sonhos em realidade. Cada evento é único, 
              cada detalhe importa, cada memória é eterna.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold text-rose-400">Serviços</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors">Casamentos</a></li>
              <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors">Festas de 15 Anos</a></li>
              <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors">Batizados</a></li>
              <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors">Eventos Corporativos</a></li>
              <li><a href="#" className="text-gray-300 hover:text-rose-400 transition-colors">Ornamentação</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold text-rose-400">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-rose-400" />
                <span className="text-gray-300">(11) 99999-0000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-rose-400" />
                <span className="text-gray-300">contato@rosa.com.br</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-rose-400" />
                <span className="text-gray-300">São Paulo, SP</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold text-rose-400">Siga-nos</h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
            </div>
            <p className="text-gray-300 text-sm">
              Siga nossas redes sociais para ver nossos trabalhos e inspirações diárias!
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Rosa Eventos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
