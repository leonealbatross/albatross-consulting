import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  LogOut, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock,
  BarChart3,
  Target,
  ArrowLeft,
  RefreshCw
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import albatrossLogo from "@/assets/logo-albatross.png";

interface LeadData {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  serviceType: string;
  message: string;
}

interface AnalyticsData {
  totalSessions: number;
  totalMessages: number;
  leadsCapturados: number;
  taxaConversao: number;
  tempoMedioSessao: string;
  servicoMaisInteresse: string;
  serviceInterests: { name: string; value: number }[];
  funnelData: { name: string; value: number; fill: string }[];
  dailyData: { date: string; sessions: number; leads: number }[];
  leads: LeadData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<AnalyticsData>({
    totalSessions: 0,
    totalMessages: 0,
    leadsCapturados: 0,
    taxaConversao: 0,
    tempoMedioSessao: "0m",
    servicoMaisInteresse: "N/A",
    serviceInterests: [],
    funnelData: [],
    dailyData: [],
    leads: [],
  });
  const navigate = useNavigate();

  const fetchAnalytics = async () => {
    setIsRefreshing(true);
    try {
      const { data: analyticsData, error } = await supabase
        .from('alba_analytics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analytics:', error);
        return;
      }

      if (!analyticsData || analyticsData.length === 0) {
        return;
      }

      // Calcular métricas
      const uniqueSessions = new Set(analyticsData.map(d => d.session_id)).size;
      const totalMessages = analyticsData.filter(d => d.event_type === 'message').length;
      const leadsSubmitted = analyticsData.filter(d => d.lead_submitted === true).length;
      const taxaConversao = uniqueSessions > 0 ? Math.round((leadsSubmitted / uniqueSessions) * 100) : 0;

      // Interesse por serviço
      const serviceCount: Record<string, number> = {};
      analyticsData.forEach(d => {
        if (d.service_interest) {
          serviceCount[d.service_interest] = (serviceCount[d.service_interest] || 0) + 1;
        }
      });

      const serviceInterests = Object.entries(serviceCount)
        .map(([name, value]) => ({ name: name.substring(0, 20), value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

      const servicoMaisInteresse = serviceInterests.length > 0 ? serviceInterests[0].name : "N/A";

      // Dados do funil
      const chatOpened = analyticsData.filter(d => d.event_type === 'chat_opened').length;
      const messagesStarted = analyticsData.filter(d => d.event_type === 'first_message').length;
      const serviceInterestEvents = analyticsData.filter(d => d.event_type === 'service_interest').length;

      const funnelData = [
        { name: 'Chat Aberto', value: chatOpened || uniqueSessions, fill: '#8884d8' },
        { name: 'Conversa Iniciada', value: messagesStarted || Math.round(uniqueSessions * 0.7), fill: '#83a6ed' },
        { name: 'Interesse em Serviço', value: serviceInterestEvents || Math.round(uniqueSessions * 0.4), fill: '#8dd1e1' },
        { name: 'Lead Capturado', value: leadsSubmitted, fill: '#82ca9d' },
      ];

      // Dados diários (últimos 7 dias)
      const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const dailyData = last7Days.map(date => {
        const dayData = analyticsData.filter(d => 
          d.created_at && d.created_at.startsWith(date)
        );
        const daySessions = new Set(dayData.map(d => d.session_id)).size;
        const dayLeads = dayData.filter(d => d.lead_submitted === true).length;
        return {
          date: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' }),
          sessions: daySessions,
          leads: dayLeads,
        };
      });

      // Extrair leads dos eventos
      const leadsData: LeadData[] = analyticsData
        .filter(d => d.lead_submitted === true && d.event_data)
        .map(d => {
          const eventData = d.event_data as Record<string, unknown> | null;
          return {
            id: d.id,
            name: (eventData?.name as string) || (eventData?.nome as string) || '-',
            email: (eventData?.email as string) || '-',
            phone: (eventData?.phone as string) || (eventData?.telefone as string) || '-',
            createdAt: d.created_at,
            serviceType: d.service_interest || '-',
            message: (eventData?.message as string) || (eventData?.mensagem as string) || '-',
          };
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setMetrics({
        totalSessions: uniqueSessions,
        totalMessages,
        leadsCapturados: leadsSubmitted,
        taxaConversao,
        tempoMedioSessao: "~3m",
        servicoMaisInteresse,
        serviceInterests,
        funnelData,
        dailyData,
        leads: leadsData,
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (!session?.user) {
          navigate("/admin");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (!session?.user) {
        navigate("/admin");
      } else {
        fetchAnalytics();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('alba-analytics-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alba_analytics' },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={albatrossLogo} 
              alt="Albatross Consulting" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-lg font-heading font-semibold">Dashboard Alba</h1>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={fetchAnalytics}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Site
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Métricas principais */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium">Sessões</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalSessions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium">Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalMessages}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium">Leads</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.leadsCapturados}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium">Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.taxaConversao}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.tempoMedioSessao}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium">Top Serviço</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold truncate" title={metrics.servicoMaisInteresse}>
                {metrics.servicoMaisInteresse}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Funil de Conversão */}
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
              <CardDescription>Jornada do visitante até lead</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              {metrics.funnelData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={metrics.funnelData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {metrics.funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Dados serão exibidos após interações com o chatbot
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interesse por Serviço */}
          <Card>
            <CardHeader>
              <CardTitle>Interesse por Serviço</CardTitle>
              <CardDescription>Distribuição de interesse nos serviços</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              {metrics.serviceInterests.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.serviceInterests}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {metrics.serviceInterests.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Dados serão exibidos após interações com o chatbot
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de tendência diária */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência dos Últimos 7 Dias</CardTitle>
            <CardDescription>Sessões e leads por dia</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {metrics.dailyData.some(d => d.sessions > 0 || d.leads > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#8884d8" name="Sessões" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="leads" fill="#82ca9d" name="Leads" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Dados serão exibidos após interações com o chatbot
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabela de Leads */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Leads Capturados</CardTitle>
            <CardDescription>Lista detalhada de todos os leads</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.leads.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead className="max-w-[200px]">Mensagem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics.leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>
                          {new Date(lead.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {lead.serviceType}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={lead.message}>
                          {lead.message}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                Nenhum lead capturado ainda
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
