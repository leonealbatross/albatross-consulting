import { useEffect } from "react";
import { ArrowLeft, Cookie, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CookieInfo {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  category: "necessary" | "analytics" | "marketing";
}

const cookies: CookieInfo[] = [
  {
    name: "albatross_cookie_consent",
    provider: "Albatross Consulting",
    purpose: "Armazena se o usuário deu consentimento para cookies",
    duration: "1 ano",
    category: "necessary",
  },
  {
    name: "albatross_cookie_preferences",
    provider: "Albatross Consulting",
    purpose: "Armazena as preferências de cookies do usuário",
    duration: "1 ano",
    category: "necessary",
  },
  {
    name: "alba_chat_messages",
    provider: "Albatross Consulting",
    purpose: "Mantém o histórico do chatbot entre sessões (localStorage)",
    duration: "Sessão",
    category: "necessary",
  },
  {
    name: "sb-*",
    provider: "Supabase",
    purpose: "Autenticação e gerenciamento de sessão",
    duration: "Sessão",
    category: "necessary",
  },
];

const categoryLabels = {
  necessary: { label: "Necessário", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  analytics: { label: "Análise", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  marketing: { label: "Marketing", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
};

const Cookies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openCookieSettings = () => {
    // Clear consent to show banner again
    localStorage.removeItem("albatross_cookie_consent");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 py-4">
        <div className="container-wide px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm font-medium">Voltar ao site</span>
            </Link>
            <div className="flex items-center gap-2">
              <Cookie className="w-5 h-5 text-primary" aria-hidden="true" />
              <span className="font-heading font-semibold text-foreground">Albatross Consulting</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="pt-24 pb-16">
        <article className="container-wide max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-4">
              Política de Cookies
            </h1>
            <p className="text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </header>

          <div className="prose prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <section aria-labelledby="intro">
              <h2 id="intro" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                O que são Cookies?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita nosso site. 
                Eles nos ajudam a proporcionar uma experiência melhor, lembrar suas preferências e entender como 
                você usa nosso site.
              </p>
            </section>

            {/* Cookie Types */}
            <section aria-labelledby="types">
              <h2 id="types" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Tipos de Cookies que Utilizamos
              </h2>
              
              <div className="space-y-4">
                <div className="bg-card p-4 rounded-xl border border-border/50">
                  <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    Cookies Necessários
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Essenciais para o funcionamento básico do site. Sem eles, algumas funcionalidades podem não funcionar corretamente.
                    Estes cookies não podem ser desativados.
                  </p>
                </div>

                <div className="bg-card p-4 rounded-xl border border-border/50">
                  <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    Cookies de Análise
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Nos ajudam a entender como os visitantes interagem com o site, coletando informações anônimas 
                    para melhorar nosso conteúdo e serviços.
                  </p>
                </div>

                <div className="bg-card p-4 rounded-xl border border-border/50">
                  <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    Cookies de Marketing
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Utilizados para exibir anúncios relevantes baseados em seus interesses. Atualmente, não utilizamos 
                    cookies de marketing, mas esta opção está disponível para futuras implementações.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookie Table */}
            <section aria-labelledby="table">
              <h2 id="table" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Lista de Cookies
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm" role="table">
                  <thead>
                    <tr className="border-b border-border">
                      <th scope="col" className="text-left py-3 px-4 font-medium text-foreground">Cookie</th>
                      <th scope="col" className="text-left py-3 px-4 font-medium text-foreground">Provedor</th>
                      <th scope="col" className="text-left py-3 px-4 font-medium text-foreground">Finalidade</th>
                      <th scope="col" className="text-left py-3 px-4 font-medium text-foreground">Duração</th>
                      <th scope="col" className="text-left py-3 px-4 font-medium text-foreground">Categoria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookies.map((cookie, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-3 px-4 text-foreground font-mono text-xs">{cookie.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{cookie.provider}</td>
                        <td className="py-3 px-4 text-muted-foreground">{cookie.purpose}</td>
                        <td className="py-3 px-4 text-muted-foreground">{cookie.duration}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs border ${categoryLabels[cookie.category].color}`}>
                            {categoryLabels[cookie.category].label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Third Party */}
            <section aria-labelledby="third-party">
              <h2 id="third-party" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Serviços de Terceiros
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Utilizamos os seguintes serviços que podem definir seus próprios cookies:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong className="text-foreground">Calendly:</strong> Para agendamento de reuniões (iframe incorporado)</li>
                <li><strong className="text-foreground">Supabase:</strong> Infraestrutura de backend e autenticação</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Cada serviço possui sua própria política de privacidade e cookies.
              </p>
            </section>

            {/* How to Manage */}
            <section aria-labelledby="manage">
              <h2 id="manage" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Como Gerenciar Cookies
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Você pode gerenciar suas preferências de cookies a qualquer momento:
                </p>
                
                <div className="bg-card p-4 rounded-xl border border-border/50">
                  <h3 className="font-medium text-foreground mb-2">No nosso site</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Clique no botão abaixo para abrir as configurações de cookies:
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={openCookieSettings}
                    className="gap-2 min-h-[44px]"
                  >
                    <Cookie className="w-4 h-4" />
                    Preferências de Cookies
                  </Button>
                </div>

                <div className="bg-card p-4 rounded-xl border border-border/50">
                  <h3 className="font-medium text-foreground mb-2">No seu navegador</h3>
                  <p className="text-sm text-muted-foreground">
                    A maioria dos navegadores permite controlar cookies através das configurações. 
                    Consulte a documentação do seu navegador para mais informações.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section aria-labelledby="contact" className="bg-card p-6 rounded-xl border border-border/50">
              <h2 id="contact" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Dúvidas?
              </h2>
              <p className="text-muted-foreground mb-4">
                Se tiver dúvidas sobre nossa política de cookies, entre em contato:
              </p>
              <a href="mailto:privacidade@albatross.consulting">
                <Button variant="outline" className="gap-2 min-h-[44px]">
                  <Mail className="w-4 h-4" />
                  privacidade@albatross.consulting
                </Button>
              </a>
            </section>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container-wide px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Albatross Consulting. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Cookies;
