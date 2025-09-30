import React from 'react';
import { Card } from './ui/card';
import { Heart, Users, Sparkles, Crown, Briefcase, Baby } from 'lucide-react';

const services = [
  {
    icon: Heart,
    title: "Casamentos",
    description: "Do pedido ao 'sim', criamos o dia mais especial da sua vida com elegância e perfeição.",
    color: "from-rose-500 to-pink-500",
    image: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?q=80&w=500&auto=format&fit=crop"
  },
  {
    icon: Crown,
    title: "Festas de 15 Anos",
    description: "A transição para a vida adulta merece uma celebração única e inesquecível.",
    color: "from-amber-500 to-yellow-500",
    image: "https://images.unsplash.com/photo-1755207299166-61c6847f9579?q=80&w=500&auto=format&fit=crop"
  },
  {
    icon: Baby,
    title: "Batizados",
    description: "Momentos sagrados celebrados com delicadeza, amor e atenção aos detalhes.",
    color: "from-rose-400 to-rose-600",
    image: "https://images.unsplash.com/photo-1668120010694-a4909fb0446d?q=80&w=500&auto=format&fit=crop"
  },
  {
    icon: Briefcase,
    title: "Eventos Corporativos",
    description: "Fortalecemos sua marca com eventos profissionais que impressionam e conectam.",
    color: "from-amber-600 to-orange-500",
    image: "https://images.pexels.com/photos/50675/banquet-wedding-society-deco-50675.jpeg?auto=compress&cs=tinysrgb&w=500"
  },
  {
    icon: Users,
    title: "Festas de Meia Idade",
    description: "Celebre conquistas e marcos importantes com estilo e sofisticação.",
    color: "from-rose-500 to-rose-700",
    image: "https://images.unsplash.com/photo-1544155892-b2b6c64204fc?q=80&w=500&auto=format&fit=crop"
  },
  {
    icon: Sparkles,
    title: "Ornamentação de Espaços",
    description: "Transformamos qualquer ambiente em um cenário mágico e acolhedor.",
    color: "from-amber-400 to-amber-600",
    image: "https://images.unsplash.com/photo-1653821355736-0c2598d0a63e?q=80&w=500&auto=format&fit=crop"
  }
];

export const ServicesSection = () => {
  return (
    <section id="servicos" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">Serviços</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Especializados em criar momentos únicos para cada tipo de celebração, 
            com atenção personalizada e cuidado em cada detalhe.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index} 
                className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-rose-100 bg-white"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 group-hover:from-black/70 group-hover:to-black/50 transition-all duration-300"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                  <div className="space-y-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold group-hover:text-rose-300 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-100 leading-relaxed text-sm">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};