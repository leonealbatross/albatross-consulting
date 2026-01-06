import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  LogOut, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock,
  BarChart3,
  Target,
  ArrowLeft,
  RefreshCw,
  CalendarIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import albatrossLogo from "@/assets/logo-albatross.png";

interface DueDiligenceData {
  country?: string;
  taxId?: string;
  transactionType?: string;
  dealStatus?: string;
  requesterProfile?: string;
  jobTitle?: string;
  targetCompany?: string;
  marketSegment?: string;
  revenueModel?: string;
  targetRevenue?: string;
  objectives?: string[];
  availableData?: string[];
  concerns?: string;
}

interface LeadData {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  serviceType: string;
  message: string;
  dueDiligence?: DueDiligenceData;
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

const SERVICES = [
  'Growth Strategy & Go-to-Market',
  'Governança Corporativa & Advisory Board',
  'Mentoria Executiva',
  'M&A para Empresas de Tecnologia',
  'Due Diligence Comercial',
  'GenAI & Inovação'
];

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
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  // Filtrar leads com base nos filtros
  const filteredLeads = useMemo(() => {
    return metrics.leads.filter(lead => {
      // Filtro por serviço
      if (serviceFilter !== "all" && lead.serviceType !== serviceFilter) {
        return false;
      }
      
      // Filtro por data inicial
      if (dateFrom) {
        const leadDate = new Date(lead.createdAt);
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (leadDate < fromDate) {
          return false;
        }
      }
      
      // Filtro por data final
      if (dateTo) {
        const leadDate = new Date(lead.createdAt);
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (leadDate > toDate) {
          return false;
        }
      }
      
      return true;
    });
  }, [metrics.leads, serviceFilter, dateFrom, dateTo]);

  // Paginação
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLeads, currentPage, itemsPerPage]);

  // Reset page quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [serviceFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setServiceFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setCurrentPage(1);
  };

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
          
          // Extrair dados de Due Diligence se existirem
          const dueDiligence: DueDiligenceData | undefined = 
            d.service_interest === 'Due Diligence Comercial' && eventData
              ? {
                  country: eventData.country as string | undefined,
                  taxId: eventData.taxId as string | undefined,
                  transactionType: eventData.transactionType as string | undefined,
                  dealStatus: eventData.dealStatus as string | undefined,
                  requesterProfile: eventData.requesterProfile as string | undefined,
                  jobTitle: eventData.jobTitle as string | undefined,
                  targetCompany: eventData.targetCompany as string | undefined,
                  marketSegment: eventData.marketSegment as string | undefined,
                  revenueModel: eventData.revenueModel as string | undefined,
                  targetRevenue: eventData.targetRevenue as string | undefined,
                  objectives: eventData.objectives as string[] | undefined,
                  availableData: eventData.availableData as string[] | undefined,
                  concerns: eventData.concerns as string | undefined,
                }
              : undefined;
          
          return {
            id: d.id,
            name: (eventData?.lead_name as string) || (eventData?.name as string) || (eventData?.nome as string) || '-',
            email: (eventData?.lead_email as string) || (eventData?.email as string) || '-',
            phone: (eventData?.lead_phone as string) || (eventData?.phone as string) || (eventData?.telefone as string) || '-',
            createdAt: d.created_at,
            serviceType: d.service_interest || '-',
            message: (eventData?.message as string) || (eventData?.mensagem as string) || '-',
            dueDiligence,
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

        <Card className="mt-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Leads Capturados</CardTitle>
                <CardDescription>
                  {filteredLeads.length} de {metrics.leads.length} leads
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Filtro por serviço */}
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os serviços</SelectItem>
                    {SERVICES.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service.length > 25 ? service.substring(0, 25) + '...' : service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Filtro por data inicial */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "De"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      locale={ptBR}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                {/* Filtro por data final */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "dd/MM/yyyy") : "Até"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      locale={ptBR}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                {/* Limpar filtros */}
                {(serviceFilter !== "all" || dateFrom || dateTo) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredLeads.length > 0 ? (
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
                    {paginatedLeads.map((lead) => (
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
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 gap-1 text-left">
                                <Eye className="h-3.5 w-3.5" />
                                <span className="max-w-[150px] truncate">
                                  {lead.dueDiligence ? 'Ver detalhes DD' : lead.message.substring(0, 30) + '...'}
                                </span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className={lead.dueDiligence ? "max-w-2xl max-h-[80vh] overflow-y-auto" : "max-w-lg"}>
                              <DialogHeader>
                                <DialogTitle>
                                  {lead.dueDiligence ? 'Detalhes Due Diligence' : 'Mensagem do Lead'}
                                </DialogTitle>
                                <DialogDescription>
                                  {lead.name} - {lead.serviceType}
                                </DialogDescription>
                              </DialogHeader>
                              
                              {lead.dueDiligence ? (
                                <div className="mt-4 space-y-4">
                                  {/* Informações de Contato */}
                                  <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="font-semibold text-sm mb-3 text-primary">Informações de Contato</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <span className="text-muted-foreground">Nome:</span>
                                        <p className="font-medium">{lead.name}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Email:</span>
                                        <p className="font-medium">{lead.email}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Telefone:</span>
                                        <p className="font-medium">{lead.phone}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">País:</span>
                                        <p className="font-medium">{lead.dueDiligence.country || '-'}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">CNPJ/Tax ID:</span>
                                        <p className="font-medium">{lead.dueDiligence.taxId || '-'}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Cargo:</span>
                                        <p className="font-medium">{lead.dueDiligence.jobTitle || '-'}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Dados da Transação */}
                                  <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="font-semibold text-sm mb-3 text-primary">Dados da Transação</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <span className="text-muted-foreground">Tipo de Transação:</span>
                                        <p className="font-medium">{lead.dueDiligence.transactionType || '-'}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Status do Deal:</span>
                                        <p className="font-medium">{lead.dueDiligence.dealStatus || '-'}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Perfil do Solicitante:</span>
                                        <p className="font-medium">{lead.dueDiligence.requesterProfile || '-'}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Empresa Alvo:</span>
                                        <p className="font-medium">{lead.dueDiligence.targetCompany || '-'}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Dados do Mercado */}
                                  <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="font-semibold text-sm mb-3 text-primary">Dados do Mercado</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <span className="text-muted-foreground">Segmento de Mercado:</span>
                                        <p className="font-medium">{lead.dueDiligence.marketSegment || '-'}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Modelo de Receita:</span>
                                        <p className="font-medium">{lead.dueDiligence.revenueModel || '-'}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <span className="text-muted-foreground">Faturamento Alvo:</span>
                                        <p className="font-medium">{lead.dueDiligence.targetRevenue || '-'}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Objetivos e Dados */}
                                  <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="font-semibold text-sm mb-3 text-primary">Objetivos & Dados Disponíveis</h4>
                                    <div className="space-y-3 text-sm">
                                      <div>
                                        <span className="text-muted-foreground">Objetivos:</span>
                                        {lead.dueDiligence.objectives && lead.dueDiligence.objectives.length > 0 ? (
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {lead.dueDiligence.objectives.map((obj, idx) => (
                                              <span key={idx} className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                {obj}
                                              </span>
                                            ))}
                                          </div>
                                        ) : (
                                          <p className="font-medium">-</p>
                                        )}
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Dados Disponíveis:</span>
                                        {lead.dueDiligence.availableData && lead.dueDiligence.availableData.length > 0 ? (
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {lead.dueDiligence.availableData.map((data, idx) => (
                                              <span key={idx} className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                                {data}
                                              </span>
                                            ))}
                                          </div>
                                        ) : (
                                          <p className="font-medium">-</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Preocupações */}
                                  {lead.dueDiligence.concerns && (
                                    <div className="p-4 bg-muted rounded-lg">
                                      <h4 className="font-semibold text-sm mb-2 text-primary">Preocupações / Observações</h4>
                                      <p className="text-sm whitespace-pre-wrap">{lead.dueDiligence.concerns}</p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="mt-4 p-4 bg-muted rounded-lg">
                                  <p className="text-sm whitespace-pre-wrap">{lead.message}</p>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Exibindo</span>
                      <Select 
                        value={itemsPerPage.toString()} 
                        onValueChange={(value) => {
                          setItemsPerPage(Number(value));
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-[70px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                      <span>de {filteredLeads.length} leads</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        Primeira
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="px-3 text-sm">
                        {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        Última
                      </Button>
                    </div>
                  </div>
                )}
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
