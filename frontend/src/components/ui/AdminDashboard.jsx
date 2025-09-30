import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  TrendingUp, 
  Eye, 
  Phone,
  Mail,
  MapPin,
  Sparkles
} from 'lucide-react';
import { mockData } from '../data/mockData';

export const AdminDashboard = () => {
  const [leads, setLeads] = useState(mockData.leads);
  const [selectedLead, setSelectedLead] = useState(null);
  const { stats } = mockData;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Proposta enviada': return 'bg-blue-100 text-blue-800';
      case 'Em negociação': return 'bg-yellow-100 text-yellow-800';
      case 'Aguardando confirmação': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-amber-300 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-sm text-gray-600">Rosa Eventos</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              Voltar ao Site
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-rose-500 to-rose-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-100 text-sm">Total de Leads</p>
                <p className="text-3xl font-bold">{stats.totalLeads}</p>
              </div>
              <Users className="w-8 h-8 text-rose-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Conversas Ativas</p>
                <p className="text-3xl font-bold">{stats.activeConversations}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-amber-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Eventos este Mês</p>
                <p className="text-3xl font-bold">{stats.eventsThisMonth}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Receita Total</p>
                <p className="text-3xl font-bold">R$ {(stats.totalRevenue / 1000).toFixed(0)}k</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-rose-50">
            <TabsTrigger 
              value="leads"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              Leads Coletados
            </TabsTrigger>
            <TabsTrigger 
              value="conversations"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              Conversas em Andamento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            <div className="grid gap-6">
              {leads.map((lead) => (
                <Card key={lead.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{lead.name}</h3>
                          <div className="flex items-center space-x-4 mt-2 text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{lead.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(lead.date).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(lead.status)} border-0`}>
                          {lead.status}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Tipo de Evento:</span>
                          <p className="text-gray-600">{lead.eventType}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Convidados:</span>
                          <p className="text-gray-600">{lead.guests} pessoas</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Orçamento:</span>
                          <p className="text-gray-600">R$ {lead.budget.toLocaleString('pt-BR')}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Criado em:</span>
                          <p className="text-gray-600">{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>

                      {lead.notes && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="font-medium text-gray-700">Observações:</span>
                          <p className="text-gray-600 mt-1">{lead.notes}</p>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLead(lead)}
                      className="ml-4 border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="conversations" className="space-y-6">
            <Card className="p-8 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Conversas em Tempo Real
              </h3>
              <p className="text-gray-600 mb-4">
                Aqui você verá todas as conversas ativas com os clientes em tempo real.
              </p>
              <div className="bg-rose-50 p-4 rounded-lg">
                <p className="text-rose-700 text-sm">
                  <strong>{stats.activeConversations}</strong> conversas ativas no momento
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detalhes do Lead</h2>
                <Button
                  variant="outline"
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Informações Pessoais</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nome:</strong> {selectedLead.name}</p>
                      <p><strong>Telefone:</strong> {selectedLead.phone}</p>
                      <p><strong>Status:</strong> <Badge className={`${getStatusColor(selectedLead.status)} border-0 text-xs`}>{selectedLead.status}</Badge></p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Detalhes do Evento</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Tipo:</strong> {selectedLead.eventType}</p>
                      <p><strong>Data:</strong> {new Date(selectedLead.date).toLocaleDateString('pt-BR')}</p>
                      <p><strong>Convidados:</strong> {selectedLead.guests} pessoas</p>
                      <p><strong>Orçamento:</strong> R$ {selectedLead.budget.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                </div>
                
                {selectedLead.notes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Observações</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{selectedLead.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};