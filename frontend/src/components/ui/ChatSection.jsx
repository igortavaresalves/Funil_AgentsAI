import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, MessageCircle, User } from 'lucide-react';
import { mockData } from '../data/mockData';

export const ChatSection = () => {
  const [messages, setMessages] = useState(mockData.initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [conversationContext, setConversationContext] = useState({
    leadData: {
      nome: null,
      tipoEvento: null,
      convidados: null,
      orcamento: null,
      data: null,
      local: null
    },
    currentAgent: 'supervisor',
    conversationState: 'inicio'
  });

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // Simular resposta da IA usando o sistema de agentes
    setTimeout(() => {
      const aiResponseData = mockData.getAIResponse(newMessage, conversationContext);
      
      const aiResponse = {
        id: Date.now() + 1,
        content: aiResponseData.content,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        agent: aiResponseData.agent
      };
      
      // Atualizar contexto da conversa
      setConversationContext(aiResponseData.context);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 to-amber-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Converse com a <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">Rosa</span>
            </h2>
            <p className="text-xl text-gray-600">
              Nossa assistente inteligente está pronta para ajudar você a planejar o evento perfeito
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border border-rose-100 shadow-2xl">
            <div className="p-6">
              <div className="space-y-6">
                <ScrollArea className="h-96 w-full pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-3 max-w-[80%] ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.sender === 'user' 
                              ? 'bg-rose-500' 
                              : 'bg-gradient-to-br from-rose-400 to-amber-300'
                          }`}>
                            {message.sender === 'user' ? (
                              <User className="w-4 h-4 text-white" />
                            ) : (
                              <MessageCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          
                          <div className={`p-4 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-rose-500 text-white'
                              : 'bg-rose-50 text-gray-800 border border-rose-100'
                          }`}>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            {message.agent && (
                              <div className="mt-2 text-xs opacity-70">
                                Agente: {message.agent}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-amber-300 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="flex space-x-4">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={isLoading || !newMessage.trim()}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full transition-all transform hover:scale-105"
                    type="button"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};