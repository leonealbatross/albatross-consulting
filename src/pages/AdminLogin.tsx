import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import albatrossLogo from "@/assets/logo-albatross.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro no login",
          description: error.message === "Invalid login credentials" 
            ? "Credenciais inválidas. Verifique seu email e senha."
            : error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Login realizado",
          description: "Bem-vindo ao painel administrativo.",
        });
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e senha para criar conta.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/dashboard`,
        },
      });

      if (error) {
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Conta criada",
          description: "Login realizado automaticamente.",
        });
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={albatrossLogo} 
              alt="Albatross Consulting" 
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-xl font-heading">Área Administrativa</CardTitle>
          <CardDescription>
            Acesso restrito ao painel de métricas Alba
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleSignUp}
                disabled={isLoading}
              >
                Criar primeira conta
              </Button>
            </div>
          </form>
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao site
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
