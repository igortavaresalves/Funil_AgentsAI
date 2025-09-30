import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, MessageCircle, User } from 'lucide-react';
import { useChat } from '../hooks/useChat';

type Message = {
  id: number | string;
  content: string;
  sender: string;
  timestamp: string;
  agent?: string;
};

const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([] as Message[]);
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

  const { sessionId, sendMessage: sendToBackend, loading } = useChat('http://localhost:8000');

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const res = await sendToBackend(userMessage.content);
      const aiResponse: Message = {
        id: Date.now() + 1,
        content: res.reply || 'Desculpe, sem resposta do servidor.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        agent: res.debug?.decision || undefined
      };
      // Atualizar contexto se o backend retornou algo
      setMessages((prev: Message[]) => [...prev, aiResponse]);
    } catch (err) {
      const aiResponse: Message = {
        id: Date.now() + 1,
        content: 'Erro ao conectar com o servidor.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages((prev: Message[]) => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e as any).key === 'Enter' && !(e as any).shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="py-6">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border border-rose-100 shadow-2xl">
            <div className="p-6">
              <div className="space-y-6">
                <ScrollArea className="h-96 w-full pr-4">
                  <div className="space-y-4">
                    {messages.map((message: any) => (
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress as any}
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

export default ChatSection;
