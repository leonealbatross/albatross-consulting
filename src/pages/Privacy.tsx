import { useEffect } from "react";
import { ArrowLeft, Shield, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
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
              Política de Privacidade
            </h1>
            <p className="text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </header>

          <div className="prose prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <section aria-labelledby="intro">
              <h2 id="intro" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                1. Introdução
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A Albatross Consulting ("nós", "nosso" ou "empresa") está comprometida com a proteção da sua privacidade. 
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais 
                em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
            </section>

            {/* Data Controller */}
            <section aria-labelledby="controller">
              <h2 id="controller" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                2. Controlador de Dados
              </h2>
              <div className="bg-card p-6 rounded-xl border border-border/50">
                <p className="text-foreground font-medium mb-3">Albatross Consulting</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                    R. Joaquim Floriano, 466. Cj 814 - Itaim Bibi, São Paulo - SP, CEP: 04534-002
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                    <a href="mailto:privacidade@albatross.consulting" className="hover:text-primary transition-colors">
                      privacidade@albatross.consulting
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Data Collected */}
            <section aria-labelledby="data-collected">
              <h2 id="data-collected" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                3. Dados que Coletamos
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Dados fornecidos por você:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Nome completo</li>
                    <li>Endereço de e-mail</li>
                    <li>Empresa e cargo</li>
                    <li>Número de telefone (opcional)</li>
                    <li>Mensagens enviadas através de formulários</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Dados coletados automaticamente:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Endereço IP (anonimizado)</li>
                    <li>Tipo de navegador e dispositivo</li>
                    <li>Páginas visitadas e tempo de permanência</li>
                    <li>Cookies (conforme sua preferência)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Purposes */}
            <section aria-labelledby="purposes">
              <h2 id="purposes" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                4. Finalidades do Tratamento
              </h2>
              <p className="text-muted-foreground mb-4">Utilizamos seus dados para:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong className="text-foreground">Prestação de serviços:</strong> Responder às suas solicitações e fornecer consultoria</li>
                <li><strong className="text-foreground">Comunicação:</strong> Enviar informações sobre nossos serviços (com seu consentimento)</li>
                <li><strong className="text-foreground">Análise:</strong> Melhorar nosso site e serviços</li>
                <li><strong className="text-foreground">Obrigações legais:</strong> Cumprir exigências legais e regulatórias</li>
              </ul>
            </section>

            {/* Legal Basis */}
            <section aria-labelledby="legal-basis">
              <h2 id="legal-basis" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                5. Base Legal
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                O tratamento de dados pessoais é realizado com base em:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>Seu consentimento (Art. 7º, I da LGPD)</li>
                <li>Execução de contrato ou procedimentos preliminares (Art. 7º, V)</li>
                <li>Interesse legítimo da empresa (Art. 7º, IX)</li>
                <li>Cumprimento de obrigação legal (Art. 7º, II)</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section aria-labelledby="sharing">
              <h2 id="sharing" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                6. Compartilhamento de Dados
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Seus dados podem ser compartilhados com:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong className="text-foreground">Prestadores de serviços:</strong> Hospedagem (Lovable/Supabase), CRM (HubSpot)</li>
                <li><strong className="text-foreground">Parceiros comerciais:</strong> Quando necessário para prestação de serviços</li>
                <li><strong className="text-foreground">Autoridades:</strong> Quando exigido por lei</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Todos os parceiros são obrigados contratualmente a proteger seus dados.
              </p>
            </section>

            {/* Data Retention */}
            <section aria-labelledby="retention">
              <h2 id="retention" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                7. Retenção de Dados
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta política, 
                geralmente por 5 anos após o último contato, ou conforme exigido por lei.
              </p>
            </section>

            {/* Your Rights */}
            <section aria-labelledby="rights">
              <h2 id="rights" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                8. Seus Direitos
              </h2>
              <p className="text-muted-foreground mb-4">Conforme a LGPD, você tem direito a:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Confirmar a existência de tratamento de dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar anonimização, bloqueio ou eliminação de dados</li>
                <li>Solicitar portabilidade dos dados</li>
                <li>Revogar consentimento</li>
                <li>Obter informações sobre compartilhamento</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Para exercer seus direitos, entre em contato através do e-mail{" "}
                <a href="mailto:privacidade@albatross.consulting" className="text-primary hover:underline">
                  privacidade@albatross.consulting
                </a>
              </p>
            </section>

            {/* Security */}
            <section aria-labelledby="security">
              <h2 id="security" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                9. Segurança
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Implementamos medidas técnicas e organizacionais para proteger seus dados, incluindo:
                criptografia em trânsito (HTTPS), controle de acesso, backups regulares e monitoramento de segurança.
              </p>
            </section>

            {/* Changes */}
            <section aria-labelledby="changes">
              <h2 id="changes" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                10. Alterações nesta Política
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos atualizar esta política periodicamente. Alterações significativas serão comunicadas 
                através do nosso site. Recomendamos revisar esta página regularmente.
              </p>
            </section>

            {/* Contact */}
            <section aria-labelledby="contact" className="bg-card p-6 rounded-xl border border-border/50">
              <h2 id="contact" className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-4">
                11. Contato
              </h2>
              <p className="text-muted-foreground mb-4">
                Para dúvidas sobre esta política ou sobre o tratamento de seus dados:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:privacidade@albatross.consulting">
                  <Button variant="outline" className="gap-2 min-h-[44px]">
                    <Mail className="w-4 h-4" />
                    privacidade@albatross.consulting
                  </Button>
                </a>
              </div>
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

export default Privacy;
