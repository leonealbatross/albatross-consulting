import { useEffect } from "react";
import { 
  ArrowLeft, 
  Accessibility as AccessibilityIcon, 
  Mail, 
  CheckCircle2, 
  Keyboard,
  Eye,
  MousePointer,
  Smartphone,
  Monitor,
  Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Accessibility = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const keyboardShortcuts = [
    { keys: "Tab", description: "Navegar entre elementos interativos" },
    { keys: "Shift + Tab", description: "Navegar para o elemento anterior" },
    { keys: "Enter / Espaço", description: "Ativar botões e links" },
    { keys: "Escape", description: "Fechar modais e menus" },
    { keys: "Setas ↑↓", description: "Navegar em menus e listas" },
  ];

  const accessibilityFeatures = [
    {
      icon: Keyboard,
      title: "Navegação por Teclado",
      description: "Todo o site pode ser navegado usando apenas o teclado. Use Tab para navegar e Enter/Espaço para ativar."
    },
    {
      icon: Eye,
      title: "Alto Contraste",
      description: "Opções de alto contraste disponíveis no painel de acessibilidade para melhor legibilidade."
    },
    {
      icon: MousePointer,
      title: "Foco Visível",
      description: "Indicadores de foco claros e consistentes em todos os elementos interativos."
    },
    {
      icon: Headphones,
      title: "Leitores de Tela",
      description: "Estrutura semântica e ARIA labels para compatibilidade com tecnologias assistivas."
    },
    {
      icon: Smartphone,
      title: "Responsivo",
      description: "Funciona em todos os dispositivos com suporte a zoom de até 400% sem perda de funcionalidade."
    },
    {
      icon: Monitor,
      title: "Movimento Reduzido",
      description: "Respeita a preferência do sistema para redução de movimento e permite desativar animações."
    },
  ];

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 py-4" role="banner">
        <div className="container-wide px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between" aria-label="Navegação da página">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg px-2 py-1 min-h-[44px]"
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
              Última auditoria: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </header>

          <div className="prose prose-invert max-w-none space-y-10">
            {/* Commitment */}
            <section aria-labelledby="commitment">
              <h2 id="commitment" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Nosso Compromisso
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A Albatross Consulting está comprometida em garantir a acessibilidade digital para todas as pessoas, 
                incluindo pessoas com deficiência. Seguimos os princípios da <strong className="text-foreground">Lei Brasileira de Inclusão (LBI 13.146/2015)</strong>, 
                as diretrizes do <strong className="text-foreground">eMAG 3.1</strong> e a norma <strong className="text-foreground">ABNT NBR 17225:2025</strong>.
              </p>
            </section>

            {/* Standard */}
            <section aria-labelledby="standard">
              <h2 id="standard" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Padrões de Conformidade
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-card p-5 rounded-xl border border-border/50">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">WCAG 2.2 Nível AA</h3>
                      <p className="text-sm text-muted-foreground">
                        Padrão internacional de acessibilidade web
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-card p-5 rounded-xl border border-border/50">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">eMAG 3.1</h3>
                      <p className="text-sm text-muted-foreground">
                        Modelo brasileiro de acessibilidade digital
                      </p>
                    </div>
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
                Esta declaração se aplica a todo o conteúdo disponível em <strong className="text-foreground">www.albatross.consulting</strong>, incluindo:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Página inicial e todas as seções (Sobre, Serviços, Metodologia, Liderança, Carreiras, Contato)</li>
                <li>Formulários de contato, candidatura e Due Diligence</li>
                <li>Chatbot Alba (assistente virtual)</li>
                <li>Modais e componentes interativos</li>
                <li>Páginas de políticas (Privacidade, Cookies, Acessibilidade)</li>
              </ul>
            </section>

            {/* Features */}
            <section aria-labelledby="features">
              <h2 id="features" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Recursos de Acessibilidade
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {accessibilityFeatures.map((feature, index) => (
                  <div key={index} className="bg-card p-4 rounded-xl border border-border/50">
                    <feature.icon className="w-5 h-5 text-primary mb-3" aria-hidden="true" />
                    <h3 className="font-medium text-foreground mb-2">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Accessibility Panel */}
            <section aria-labelledby="panel" className="bg-primary/5 p-6 rounded-xl border border-primary/20">
              <h2 id="panel" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Painel de Acessibilidade
              </h2>
              <p className="text-muted-foreground mb-4">
                Disponibilizamos um <strong className="text-foreground">painel de configurações avançadas</strong> acessível 
                pelo botão flutuante com o ícone de acessibilidade no canto inferior direito da tela. Nele você pode:
              </p>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  Aumentar/diminuir tamanho da fonte
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  Ajustar espaçamento entre letras
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  Modificar altura da linha
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  Ativar alto contraste
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  Sublinhar todos os links
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  Reforçar indicador de foco
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  Reduzir/pausar animações
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  Ativar guia de leitura
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  Aumentar cursor
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                  Modo para dislexia
                </li>
              </ul>
            </section>

            {/* Keyboard Navigation */}
            <section aria-labelledby="keyboard">
              <h2 id="keyboard" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Navegação por Teclado
              </h2>
              <p className="text-muted-foreground mb-4">
                Todas as funcionalidades do site podem ser acessadas usando apenas o teclado. Principais atalhos:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-foreground">Tecla(s)</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keyboardShortcuts.map((shortcut, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-3 px-4">
                          <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono text-foreground">
                            {shortcut.keys}
                          </kbd>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{shortcut.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">Calendly (iframe):</strong> O widget de agendamento é um serviço de terceiros 
                  e pode ter suas próprias limitações de acessibilidade. Recomendamos contato direto por email como alternativa.
                </li>
                <li>
                  <strong className="text-foreground">Conteúdo de terceiros:</strong> Links externos podem direcionar para sites 
                  que não seguem os mesmos padrões de acessibilidade.
                </li>
                <li>
                  <strong className="text-foreground">PDFs:</strong> Documentos PDF disponibilizados podem não estar totalmente 
                  acessíveis. Oferecemos versões alternativas em HTML quando solicitado.
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
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>HTML5 semântico com landmarks (header, nav, main, footer)</li>
                <li>WAI-ARIA para componentes dinâmicos</li>
                <li>CSS com suporte a prefers-reduced-motion e prefers-contrast</li>
                <li>JavaScript progressivo (funcionalidades básicas disponíveis sem JS)</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                <strong className="text-foreground">Navegadores recomendados:</strong> Chrome, Firefox, Safari, Edge (versões atuais). 
                Compatível com leitores de tela NVDA, JAWS, VoiceOver e TalkBack.
              </p>
            </section>

            {/* Assessment */}
            <section aria-labelledby="assessment">
              <h2 id="assessment" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Metodologia de Avaliação
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A acessibilidade deste site foi avaliada através de:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Ferramentas automatizadas: Lighthouse, axe DevTools, WAVE</li>
                <li>Testes manuais de navegação por teclado</li>
                <li>Verificação de contraste de cores (WCAG AA mínimo)</li>
                <li>Testes com leitores de tela (NVDA e VoiceOver)</li>
                <li>Testes em dispositivos móveis com TalkBack e VoiceOver</li>
                <li>Validação de zoom até 400% sem perda de funcionalidade</li>
              </ul>
            </section>

            {/* Feedback */}
            <section aria-labelledby="feedback" className="bg-card p-6 rounded-xl border border-border/50">
              <h2 id="feedback" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Feedback e Suporte
              </h2>
              <p className="text-muted-foreground mb-4">
                Valorizamos seu feedback! Se você encontrar barreiras de acessibilidade, tiver dificuldades em acessar 
                qualquer parte do site, ou quiser sugerir melhorias, entre em contato conosco:
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
                Procuraremos responder em até <strong className="text-foreground">5 dias úteis</strong> e trabalhar em uma solução adequada. 
                Você também pode usar este canal para solicitar versões alternativas de conteúdo.
              </p>
            </section>

            {/* Legal References */}
            <section aria-labelledby="legal">
              <h2 id="legal" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                Referências Legais
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">Lei 13.146/2015 (LBI):</strong> Lei Brasileira de Inclusão da Pessoa com Deficiência, 
                  Art. 63 - acessibilidade nos sítios da internet
                </li>
                <li>
                  <strong className="text-foreground">Decreto 5.296/2004:</strong> Regulamenta a acessibilidade de pessoas com deficiência
                </li>
                <li>
                  <strong className="text-foreground">ABNT NBR 17225:2025:</strong> Acessibilidade em serviços
                </li>
                <li>
                  <strong className="text-foreground">eMAG 3.1:</strong> Modelo de Acessibilidade em Governo Eletrônico
                </li>
                <li>
                  <strong className="text-foreground">WCAG 2.2:</strong> Web Content Accessibility Guidelines do W3C
                </li>
              </ul>
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
