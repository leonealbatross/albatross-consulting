import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LogOut, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock,
  BarChart3,
  Target,
  ArrowLeft
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import albatrossLogo from "@/assets/logo-albatross.png";

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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

  // Dados simulados - serão substituídos quando a tabela for criada
  const mockMetrics = {
    totalSessions: 0,
    totalMessages: 0,
    leadsCapturados: 0,
    taxaConversao: 0,
    tempoMedioSessao: "0m",
    servicoMaisInteresse: "N/A",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
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
        {/* Status */}
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            ⚠️ Dashboard em configuração. Aprove a criação da tabela de analytics para começar a coletar métricas.
          </p>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Sessões</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.totalSessions}</div>
              <p className="text-xs text-muted-foreground">Conversas iniciadas com Alba</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mensagens Trocadas</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.totalMessages}</div>
              <p className="text-xs text-muted-foreground">Total de interações</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Leads Capturados</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.leadsCapturados}</div>
              <p className="text-xs text-muted-foreground">Formulários preenchidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.taxaConversao}%</div>
              <p className="text-xs text-muted-foreground">Sessões → Leads</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.tempoMedioSessao}</div>
              <p className="text-xs text-muted-foreground">Duração média por sessão</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Serviço Top</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">{mockMetrics.servicoMaisInteresse}</div>
              <p className="text-xs text-muted-foreground">Maior interesse</p>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder para gráficos futuros */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
              <CardDescription>Jornada do visitante até lead</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Gráfico disponível após ativação do tracking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interesse por Serviço</CardTitle>
              <CardDescription>Distribuição de interesse nos serviços</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Gráfico disponível após ativação do tracking
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
