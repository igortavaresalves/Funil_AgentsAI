export const mockData = {
  initialMessages: [
    {
      id: 1,
      content: "Olá! Sou Rosa, sua organizadora de eventos! Como posso lhe ajudar? Estou no ramo de eventos há quase 20 anos e tenho a experiência que sua festa precisa.",
      sender: 'ai',
      timestamp: new Date().toISOString(),
      agent: 'supervisor'
    }
  ],

  // Contexto da conversa por sessão (simulando cache)
  conversationContext: {
    leadData: {
      nome: null,
      tipoEvento: null,
      convidados: null,
      orcamento: null,
      data: null,
      local: null
    },
    currentAgent: 'supervisor',
    conversationState: 'inicio' // inicio, coletando_dados, qualificando, finalizado
  },

  // Simulação dos 3 agentes
  agents: {
    supervisor: {
      name: 'Supervisor',
      role: 'Coordena a conversa e decide qual agente acionar',
      
      welcomeMessage: "Olá! Sou Rosa, sua organizadora de eventos! Como posso lhe ajudar? Estou no ramo de eventos há quase 20 anos e tenho a experiência que sua festa precisa.",
      
      decideAgent: (userMessage, context) => {
        const message = userMessage.toLowerCase();
        const { leadData, conversationState } = context;
        
        // Se já tem informações básicas, vai para qualificador
        if (leadData.nome && leadData.tipoEvento && conversationState === 'coletando_dados') {
          return 'qualificador';
        }
        
        // Se menciona interesse direto, vai para especialista
        if (message.includes('quero') || message.includes('gostaria') || message.includes('preciso') || 
            message.includes('casamento') || message.includes('festa') || message.includes('evento')) {
          return 'especialista';
        }
        
        return 'supervisor';
      }
    },

    especialista: {
      name: 'Especialista',
      role: 'Especialista em vendas de eventos com gatilhos mentais',
      
      generateResponse: (userMessage, context) => {
        const message = userMessage.toLowerCase();
        const { leadData } = context;
        
        // Coleta nome se não tiver
        if (!leadData.nome) {
          return "Que maravilha! Adoro quando posso ajudar a realizar sonhos. Para personalizar ainda mais nossa conversa, qual é o seu nome?";
        }
        
        // Coleta tipo de evento
        if (!leadData.tipoEvento) {
          if (message.includes('casamento')) {
            leadData.tipoEvento = 'Casamento';
            return `${leadData.nome || 'Querido(a)'}, casamentos são nossa paixão! 💕 Cada cerimônia que organizamos é única. Você já tem uma data em mente? E quantos convidados estão esperando para este momento mágico?`;
          } else if (message.includes('15') || message.includes('quinze') || message.includes('debutante')) {
            leadData.tipoEvento = 'Festa de 15 anos';
            return `${leadData.nome || 'Querida'}, festa de 15 anos é um marco tão especial! ✨ Trabalhamos com temas incríveis que transformam sonhos em realidade. Você já pensou em algum tema específico? E quantas pessoas vão celebrar com vocês?`;
          } else if (message.includes('corporativo') || message.includes('empresa')) {
            leadData.tipoEvento = 'Evento Corporativo';
            return `${leadData.nome || 'Caro(a)'}, eventos corporativos são nossa especialidade para fortalecer marcas! 🏆 Que tipo de evento corporativo vocês estão planejando? Lançamento, confraternização ou convenção?`;
          } else if (message.includes('batizado') || message.includes('batismo')) {
            leadData.tipoEvento = 'Batizado';
            return `${leadData.nome || 'Querido(a)'}, batizados são momentos sagrados que organizamos com muito carinho! 👶 Vocês preferem algo mais íntimo ou uma celebração maior?`;
          } else {
            return `${leadData.nome || 'Querido(a)'}, temos experiência em diversos tipos de eventos! Casamentos, festas de 15 anos, batizados, eventos corporativos e muito mais. Que tipo de celebração você tem em mente?`;
          }
        }
        
        // Coleta número de convidados
        if (!leadData.convidados) {
          const numbers = message.match(/\d+/g);
          if (numbers) {
            leadData.convidados = numbers[0];
            return `Perfeito! ${leadData.convidados} convidados para ${leadData.tipoEvento}. Nossos pacotes são desenvolvidos especialmente para cada porte de evento. Qual seria a faixa de investimento que vocês estão considerando?`;
          } else {
            return `${leadData.nome}, para dimensionar melhor seu ${leadData.tipoEvento.toLowerCase()}, quantos convidados vocês estão pensando em receber? Isso nos ajuda a criar a proposta ideal.`;
          }
        }
        
        // Transfere para qualificador quando tem informações básicas
        context.conversationState = 'coletando_dados';
        return `${leadData.nome}, tenho informações iniciais sobre seu ${leadData.tipoEvento} para ${leadData.convidados} pessoas. Agora vou conectar você com nossa equipe de qualificação para detalharmos melhor sua proposta!`;
      }
    },

    qualificador: {
      name: 'Qualificador',
      role: 'Qualifica leads e agenda reuniões',
      
      generateResponse: (userMessage, context) => {
        const message = userMessage.toLowerCase();
        const { leadData } = context;
        
        // Coleta orçamento
        if (!leadData.orcamento) {
          const budgetMatch = message.match(/(\d+\.?\d*)\s*(mil|k|reais|r\$)/i);
          if (budgetMatch) {
            leadData.orcamento = budgetMatch[0];
            return `Excelente! Com o orçamento de ${leadData.orcamento}, podemos criar algo verdadeiramente especial. Quando vocês estão pensando em realizar o evento? Já têm uma data em mente?`;
          } else {
            return `${leadData.nome}, para criarmos a proposta mais adequada, qual seria a faixa de investimento que vocês estão considerando para o ${leadData.tipoEvento.toLowerCase()}?`;
          }
        }
        
        // Coleta data
        if (!leadData.data) {
          const dateWords = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
          const hasDate = dateWords.some(month => message.includes(month)) || message.includes('2024') || message.includes('2025');
          
          if (hasDate) {
            leadData.data = message;
            return `Perfeita escolha de data! Vou verificar nossa disponibilidade. Vocês já têm algum local em mente ou gostariam que sugerissemos opções incríveis?`;
          } else {
            return `${leadData.nome}, quando vocês gostariam de realizar o ${leadData.tipoEvento.toLowerCase()}? Uma data específica nos ajuda a garantir os melhores fornecedores.`;
          }
        }
        
        // Finalização e agendamento
        context.conversationState = 'finalizado';
        return `${leadData.nome}, coletei todas as informações sobre seu ${leadData.tipoEvento}:
        
✅ Convidados: ${leadData.convidados} pessoas
✅ Orçamento: ${leadData.orcamento}
✅ Período: ${leadData.data}

Você está qualificado(a) como cliente premium! 🌟 

Nossa equipe entrará em contato nas próximas 2 horas para agendar uma reunião de briefing personalizado. 

Muito obrigada por confiar na Rosa! Vamos criar algo INCRÍVEL juntos! 💕`;
      }
    }
  },

  // Mock responses baseadas no agente atual
  getAIResponse: (userMessage, context = mockData.conversationContext) => {
    const message = userMessage.toLowerCase();
    
    // Atualiza contexto se mencionado nome
    const nameMatch = message.match(/meu nome é (\w+)|sou (\w+)|me chamo (\w+)/i);
    if (nameMatch) {
      context.leadData.nome = nameMatch[1] || nameMatch[2] || nameMatch[3];
    }
    
    // Supervisor decide qual agente acionar
    let currentAgent = mockData.agents.supervisor.decideAgent(userMessage, context);
    context.currentAgent = currentAgent;
    
    let response;
    
    switch (currentAgent) {
      case 'especialista':
        response = mockData.agents.especialista.generateResponse(userMessage, context);
        break;
      case 'qualificador':
        response = mockData.agents.qualificador.generateResponse(userMessage, context);
        break;
      default:
        // Respostas do supervisor
        if (message.includes('olá') || message.includes('oi') || message.includes('bom dia')) {
          response = "Olá! Que alegria falar com você! Como posso tornar seu evento inesquecível hoje?";
        } else if (message.includes('preço') || message.includes('valor') || message.includes('custo')) {
          response = "Nossos pacotes começam em R$ 5.000 e vão até R$ 50.000, dependendo do tipo e porte do evento. Que tipo de celebração você está planejando?";
        } else if (message.includes('obrigad')) {
          response = "Por nada, querido(a)! Estou aqui para realizar sonhos. Conte-me mais sobre seu evento dos sonhos!";
        } else {
          response = "Entendi! Deixe-me conectar você com nossa equipe especializada. Que tipo de evento você gostaria de realizar?";
        }
        currentAgent = 'supervisor';
    }
    
    return {
      content: response,
      agent: currentAgent,
      context: context
    };
  },

  // Mock data para leads coletados (mesmo anterior)
  leads: [
    {
      id: 1,
      name: "Maria Silva",
      phone: "(11) 99999-1234",
      eventType: "Casamento",
      guests: 150,
      budget: 25000,
      date: "2024-06-15",
      notes: "Casamento romântico, cores pastéis, cerimônia religiosa",
      status: "Proposta enviada",
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Ana Santos",
      phone: "(11) 88888-5678",
      eventType: "Festa de 15 anos",
      guests: 80,
      budget: 15000,
      date: "2024-04-20",
      notes: "Tema princesa, cores rosa e dourado",
      status: "Em negociação",
      createdAt: "2024-01-10T14:20:00Z"
    },
    {
      id: 3,
      name: "João Oliveira",
      phone: "(11) 77777-9012",
      eventType: "Evento Corporativo",
      guests: 200,
      budget: 35000,
      date: "2024-05-10",
      notes: "Lançamento de produto, networking, coffee break premium",
      status: "Aguardando confirmação",
      createdAt: "2024-01-08T16:45:00Z"
    }
  ],

  // Estatísticas para dashboard admin
  stats: {
    totalLeads: 127,
    activeConversations: 23,
    eventsThisMonth: 8,
    totalRevenue: 450000
  }
};