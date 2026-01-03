import { useEffect } from "react";
import { ArrowLeft, Accessibility as AccessibilityIcon, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Accessibility = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none"
      >
        Pular para o conteúdo principal
      </a>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 py-4">
        <div className="container-wide px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between" aria-label="Navegação da página">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg px-2 py-1"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm font-medium">Voltar ao site</span>
            </Link>
            <div className="flex items-center gap-2">
              <AccessibilityIcon className="w-5 h-5 text-primary" aria-hidden="true" />
              <span className="font-heading font-semibold text-foreground">Albatross Consulting</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="pt-24 pb-16" role="main">
        <article className="container-wide max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-4">
              Declaração de Acessibilidade
            </h1>
            <p className="text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </header>

          <div className="prose prose-invert max-w-none space-y-8">
            {/* Commitment */}
            <section aria-labelledby="commitment">
              <h2 id="commitment" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Nosso Compromisso
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A Albatross Consulting está comprometida em garantir a acessibilidade digital para pessoas com deficiência. 
                Estamos continuamente melhorando a experiência do usuário para todos e aplicando os padrões de acessibilidade relevantes.
              </p>
            </section>

            {/* Standard */}
            <section aria-labelledby="standard">
              <h2 id="standard" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Padrão de Conformidade
              </h2>
              <div className="bg-card p-6 rounded-xl border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">WCAG 2.2 Nível AA</h3>
                    <p className="text-sm text-muted-foreground">
                      Este site foi desenvolvido seguindo as diretrizes WCAG (Web Content Accessibility Guidelines) 2.2 nível AA, 
                      o padrão internacionalmente reconhecido para acessibilidade web.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Scope */}
            <section aria-labelledby="scope">
              <h2 id="scope" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Escopo
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Esta declaração se aplica a todo o conteúdo disponível em www.albatross.consulting, incluindo:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Página inicial e todas as seções</li>
                <li>Formulários de contato e candidatura</li>
                <li>Chatbot Alba</li>
                <li>Páginas de políticas</li>
              </ul>
            </section>

            {/* Measures */}
            <section aria-labelledby="measures">
              <h2 id="measures" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Medidas Implementadas
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-xl border border-border/50">
                  <h3 className="font-medium text-foreground mb-2">Navegação por Teclado</h3>
                  <p className="text-sm text-muted-foreground">
                    Todo o site pode ser navegado usando apenas o teclado, com ordem de tabulação lógica e foco visível.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border/50">
                  <h3 className="font-medium text-foreground mb-2">Contraste de Cores</h3>
                  <p className="text-sm text-muted-foreground">
                    Texto e elementos interativos possuem contraste adequado conforme WCAG AA.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border/50">
                  <h3 className="font-medium text-foreground mb-2">Textos Alternativos</h3>
                  <p className="text-sm text-muted-foreground">
                    Todas as imagens informativas possuem descrições alternativas.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border/50">
                  <h3 className="font-medium text-foreground mb-2">Estrutura Semântica</h3>
                  <p className="text-sm text-muted-foreground">
                    HTML semântico com hierarquia de cabeçalhos correta e landmarks ARIA.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border/50">
                  <h3 className="font-medium text-foreground mb-2">Formulários Acessíveis</h3>
                  <p className="text-sm text-muted-foreground">
                    Labels associados, mensagens de erro claras e validação acessível.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border/50">
                  <h3 className="font-medium text-foreground mb-2">Movimento Reduzido</h3>
                  <p className="text-sm text-muted-foreground">
                    Animações respeitam a preferência do sistema (prefers-reduced-motion).
                  </p>
                </div>
              </div>
            </section>

            {/* Limitations */}
            <section aria-labelledby="limitations">
              <h2 id="limitations" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Limitações Conhecidas
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Apesar de nossos esforços, algumas áreas podem ter limitações:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong className="text-foreground">Calendly (iframe):</strong> O widget de agendamento é um serviço de terceiros 
                  e pode ter suas próprias limitações de acessibilidade.
                </li>
                <li>
                  <strong className="text-foreground">Conteúdo de terceiros:</strong> Links externos podem direcionar para sites 
                  que não seguem os mesmos padrões de acessibilidade.
                </li>
              </ul>
            </section>

            {/* Technical */}
            <section aria-labelledby="technical">
              <h2 id="technical" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Especificações Técnicas
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A acessibilidade deste site depende das seguintes tecnologias:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>HTML5</li>
                <li>WAI-ARIA</li>
                <li>CSS</li>
                <li>JavaScript</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Estas tecnologias são utilizadas em conformidade com WCAG 2.2.
              </p>
            </section>

            {/* Assessment */}
            <section aria-labelledby="assessment">
              <h2 id="assessment" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Metodologia de Avaliação
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A acessibilidade deste site foi avaliada através de:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>Ferramentas automatizadas (Lighthouse, axe DevTools)</li>
                <li>Testes manuais de navegação por teclado</li>
                <li>Verificação de contraste de cores</li>
                <li>Testes com leitores de tela</li>
              </ul>
            </section>

            {/* Feedback */}
            <section aria-labelledby="feedback" className="bg-card p-6 rounded-xl border border-border/50">
              <h2 id="feedback" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Feedback e Contato
              </h2>
              <p className="text-muted-foreground mb-4">
                Valorizamos seu feedback! Se você encontrar barreiras de acessibilidade ou tiver sugestões de melhoria, 
                entre em contato conosco:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:acessibilidade@albatross.consulting">
                  <Button variant="outline" className="gap-2 min-h-[44px]">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    acessibilidade@albatross.consulting
                  </Button>
                </a>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Procuraremos responder em até 5 dias úteis e trabalhar em uma solução adequada.
              </p>
            </section>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8" role="contentinfo">
        <div className="container-wide px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Albatross Consulting. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Accessibility;
