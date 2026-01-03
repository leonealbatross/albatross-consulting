import { 
  TrendingUp, 
  GitMerge, 
  Building2, 
  Sparkles, 
  Users,
  ArrowRight,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSectionHighlight } from "@/hooks/use-section-highlight";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import ServiceDetailModal from "@/components/ServiceDetailModal";
import DueDiligenceFormModal from "@/components/DueDiligenceFormModal";

const Services = () => {
  const { t } = useLanguage();
  const { sectionRef, isVisible } = useSectionHighlight();
  const { handleClick } = useSmoothScroll();

  const services = [
    // 1. Growth Strategy & Go-to-Market
    {
      icon: TrendingUp,
      title: t("services.s1.title"),
      description: t("services.s1.desc"),
      highlight: t("services.s1.highlight"),
      detailContent: `GROWTH STRATEGY & GO-TO-MARKET
Estruturamos estratégias de crescimento e modelos comerciais com foco em execução e impacto mensurável.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 O QUE FAZEMOS

A Albatross Consulting aplica frameworks consagrados como PESTEL, SWOT por área, Ansoff, OKRs, KPIs comerciais, funil de vendas e rituais de gestão para desenhar modelos comerciais eficientes e escaláveis.

Atuamos da estratégia à operação, conectando planejamento estratégico com execução comercial para gerar resultados tangíveis.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ BENEFÍCIOS ENTREGUES

• Aumento consistente de vendas e receita
• Maior previsibilidade e acuracidade do forecast
• Geração de caixa e ampliação de margens
• Redução de churn e níveis de desconto
• Modelos comerciais escaláveis e replicáveis
• Ritmos de gestão eficientes (daily, weekly, monthly reviews)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CASOS DE USO TÍPICOS

• Scale-ups buscando estruturar área comercial para crescimento acelerado
• Empresas em transição de founder-led sales para sales team estruturado
• Negócios precisando melhorar conversão e encurtar ciclo de vendas
• Organizações buscando expandir para novos mercados ou segmentos
• Empresas preparando-se para rodadas de investimento ou M&A

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 ENTREGÁVEIS

• Diagnóstico comercial completo (processos, pessoas, tecnologia)
• Estratégia Go-to-Market com playbooks de vendas
• Definição de OKRs e KPIs comerciais
• Estruturação de funil de vendas e métricas
• Rituais de gestão e cadências de acompanhamento
• Treinamento e capacitação da equipe comercial`,
      accent: "from-primary to-teal-300",
    },
    // 2. Governança Corporativa & Advisory Board
    {
      icon: Building2,
      title: t("services.s4.title"),
      description: t("services.s4.desc"),
      highlight: t("services.s4.highlight"),
      detailContent: `GOVERNANÇA CORPORATIVA & ADVISORY BOARD
Estruturamos governança que sustenta crescimento e confiança institucional.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 O QUE FAZEMOS

A Albatross Consulting apoia empresas na criação e organização de modelos de governança e Advisory Boards alinhados à estratégia, escala e atração de investidores.

Atuamos na composição de conselhos, recrutamento de conselheiros e executivos (GO), definição de ritos, métricas e tomada de decisão, fortalecendo liderança, transparência e geração de valor sustentável.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ BENEFÍCIOS ENTREGUES

• Governança estruturada e profissionalizada
• Maior atratividade para investidores e parceiros
• Tomada de decisão mais ágil e fundamentada
• Transparência e accountability em todos os níveis
• Sucessão planejada e gestão de talentos executivos
• Compliance e gestão de riscos corporativos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CASOS DE USO TÍPICOS

• Empresas familiares em processo de profissionalização
• Scale-ups recebendo investimento institucional
• Empresas preparando-se para IPO ou venda estratégica
• Organizações buscando atrair executivos de alto nível
• Negócios precisando de mentoria estratégica externa

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 ENTREGÁVEIS

• Diagnóstico de maturidade de governança
• Estruturação de Advisory Board ou Conselho
• Recrutamento de conselheiros e executivos
• Definição de estatutos, regimentos e políticas
• Implementação de rituais de governança
• Dashboards de indicadores e reporting executivo`,
      accent: "from-blue-400 to-primary",
    },
    // 3. Mentoria Executiva
    {
      icon: Users,
      title: t("services.s6.title"),
      description: t("services.s6.desc"),
      highlight: t("services.s6.highlight"),
      detailContent: `MENTORIA EXECUTIVA
Desenvolvimento de líderes com foco em resultados e alta performance.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 O QUE FAZEMOS

Mentoria executiva da Albatross, fundamentada em práticas modernas e consagradas como ICF Core Competencies, GROW, SBI, Liderança Situacional (Hersey-Blanchard) e frameworks de performance executiva.

Voltada a CEOs, CROs e líderes comerciais, a mentoria apoia decisões estratégicas, execução, liderança, performance de vendas e escala com foco em clareza, velocidade, accountability e resultados sustentáveis.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ BENEFÍCIOS ENTREGUES

• Clareza estratégica e foco nas prioridades certas
• Desenvolvimento de competências de liderança
• Melhoria na tomada de decisão sob pressão
• Aumento de performance individual e do time
• Gestão eficaz de conflitos e stakeholders
• Equilíbrio entre vida profissional e pessoal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CASOS DE USO TÍPICOS

• CEOs e fundadores em transição de papel (operacional → estratégico)
• CROs e VPs de Vendas buscando acelerar resultados
• Executivos assumindo novos desafios ou promoções
• Líderes enfrentando momentos críticos (turnaround, M&A, IPO)
• Gestores desenvolvendo próxima geração de liderança

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 FORMATO & METODOLOGIA

• Sessões individuais quinzenais ou mensais (90 min)
• Plano de desenvolvimento personalizado
• Feedback 360° e assessment de competências
• Ferramentas práticas e frameworks aplicáveis
• Acompanhamento de metas e accountability
• Acesso a network exclusivo de executivos`,
      accent: "from-rose-400 to-primary",
    },
    // 4. M&A para Empresas de Tecnologia
    {
      icon: GitMerge,
      title: t("services.s2.title"),
      description: t("services.s2.desc"),
      highlight: t("services.s2.highlight"),
      detailContent: `M&A INTEGRADO PARA EMPRESAS DE TECNOLOGIA
Fusões e aquisições end-to-end com foco em geração de valor sustentável.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 O QUE FAZEMOS

A Albatross Consulting, em parceria com a ONEtoONE Corporate Finance, atua de forma end-to-end em fusões e aquisições para empresas de tecnologia, combinando deal sourcing com alcance internacional e execução estratégica.

Após a transação, a Albatross lidera a fase de pós-M&A, apoiando integração, governança, execução estratégica e captura de sinergias para garantir geração de valor sustentável no longo prazo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ BENEFÍCIOS ENTREGUES

• Acesso a deal flow internacional qualificado
• Valuation fundamentado e negociação profissional
• Integração pós-M&A estruturada e eficiente
• Captura efetiva de sinergias operacionais e comerciais
• Governança de integração com KPIs claros
• Retenção de talentos e cultura organizacional

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CASOS DE USO TÍPICOS

• Empresas de tecnologia buscando compradores estratégicos
• Scale-ups preparando-se para venda ou fusão
• Corporates buscando aquisições para crescimento inorgânico
• Private Equity realizando add-ons em portfólio
• Empresas recém-adquiridas precisando de suporte de integração

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 ENTREGÁVEIS

• Deal sourcing e screening de oportunidades
• Preparação de empresa para venda (sell-side)
• Suporte a due diligence comercial e operacional
• Estruturação e negociação de deals
• PMI (Post-Merger Integration) completo
• Acompanhamento de 100 dias e captura de sinergias`,
      accent: "from-emerald-400 to-primary",
    },
    // 5. Due Diligence Comercial para M&A
    {
      icon: Search,
      title: t("services.s7.title"),
      description: t("services.s7.desc"),
      highlight: t("services.s7.highlight"),
      detailContent: `DUE DILIGENCE COMERCIAL PARA M&A
Análise profunda da operação comercial para suportar decisões de investimento.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 O QUE FAZEMOS

A Albatross Consulting realiza due diligence comercial especializada para investidores e empresas em processos de M&A, avaliando a qualidade da operação comercial, sustentabilidade da receita e riscos do negócio.

Nossa análise vai além dos números, mergulhando em processos, pessoas, tecnologia e cultura comercial para dar visibilidade completa ao investidor.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ BENEFÍCIOS ENTREGUES

• Visão clara da qualidade e sustentabilidade da receita
• Identificação de riscos comerciais e operacionais
• Avaliação de dependência de clientes e concentração
• Análise de churn, LTV, CAC e unit economics
• Validação de pipeline e forecast
• Recomendações para captura de valor pós-deal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CASOS DE USO TÍPICOS

• Private Equity avaliando aquisições de empresas de tecnologia
• Venture Capital em rodadas de investimento
• Corporates em processos de M&A estratégico
• Family Offices analisando oportunidades de investimento
• Fundos de investimento realizando add-ons

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 ENTREGÁVEIS

• Relatório executivo de due diligence comercial
• Análise de modelo comercial e go-to-market
• Avaliação de processos de vendas e CS
• Análise de métricas (ARR, churn, NRR, CAC, LTV)
• Assessment de time comercial e liderança
• Red flags e recomendações para negociação`,
      accent: "from-amber-400 to-primary",
      isDueDiligence: true,
    },
    // 6. GenAI & Inovação
    {
      icon: Sparkles,
      title: t("services.s5.title"),
      description: t("services.s5.desc"),
      highlight: t("services.s5.highlight"),
      detailContent: `GENAI & INOVAÇÃO
Transformamos IA generativa em resultados concretos de negócio.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 O QUE FAZEMOS

A Albatross Consulting apoia empresas na aplicação prática de IA generativa por meio da criação de automações focadas em eficiência operacional, redução de custos e ganho de produtividade.

Desenvolvemos dashboards avançados de Sales Intelligence para melhorar previsibilidade, acuracidade de forecast e qualidade da tomada de decisão comercial, conectando dados, execução e crescimento sustentável.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ BENEFÍCIOS ENTREGUES

• Automação de tarefas repetitivas e operacionais
• Redução significativa de custos operacionais
• Ganhos de produtividade em toda organização
• Insights acionáveis com Sales Intelligence
• Melhor previsibilidade e acuracidade de forecast
• Vantagem competitiva através de inovação

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CASOS DE USO TÍPICOS

• Automação de propostas comerciais e contratos
• Chatbots inteligentes para atendimento e vendas
• Análise automatizada de calls de vendas
• Dashboards de Sales Intelligence e forecasting
• Enriquecimento automático de leads e dados
• Automação de relatórios e análises recorrentes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 ENTREGÁVEIS

• Diagnóstico de oportunidades de automação
• MVP de solução GenAI customizada
• Dashboards de Sales Intelligence
• Integração com CRM e ferramentas existentes
• Treinamento de times para adoção
• Suporte e evolução contínua da solução`,
      accent: "from-violet-400 to-primary",
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="servicos" 
      className={`py-16 lg:py-24 xl:py-32 bg-secondary/30 relative section-highlight ${isVisible ? 'visible' : ''}`}
      aria-labelledby="services-headline"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container-wide relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16">
          <span className="inline-block text-primary font-semibold text-xs sm:text-sm tracking-wider uppercase mb-3 sm:mb-4">
            {t("services.label")}
          </span>
          <h2 id="services-headline" className="text-2xl sm:text-3xl lg:text-4xl font-heading font-semibold tracking-tight text-foreground mb-4 sm:mb-6">
            {t("services.headline")}{" "}
            <span className="bg-gradient-to-r from-teal-400 to-primary bg-clip-text text-transparent">{t("services.headline.highlight")}</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
            {t("services.subheadline")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6" role="list" aria-label="Nossos serviços">
          {services.map((service, index) => (
            <article
              key={index}
              className="group relative"
              role="listitem"
            >
              {/* Animated border gradient */}
              <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${service.accent} opacity-0 group-hover:opacity-40 blur-sm group-hover:blur-md transition-all duration-500`} aria-hidden="true" />
              
              {/* Card */}
              <div className="relative bg-card/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-border/50 group-hover:border-primary/30 transition-all duration-500 h-full">
                {/* Decorative corner accent */}
                <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-all duration-500`} aria-hidden="true" />
                
                {/* Icon & Highlight */}
                <div className="relative flex items-start justify-between mb-4 sm:mb-6">
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${service.accent} opacity-0 group-hover:opacity-30 blur-md transition-all duration-500`} aria-hidden="true" />
                    <div className="relative w-10 h-10 sm:w-12 lg:w-14 sm:h-12 lg:h-14 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-all duration-300" aria-hidden="true">
                      <service.icon className="w-5 h-5 sm:w-6 lg:w-7 sm:h-6 lg:h-7 text-primary" />
                    </div>
                  </div>
                  <span className={`text-[10px] sm:text-xs font-medium bg-gradient-to-r ${service.accent} bg-clip-text text-transparent border border-primary/20 px-2 sm:px-3 py-1 rounded-full`}>
                    {service.highlight}
                  </span>
                </div>

                {/* Content */}
                <h3 className={`text-base sm:text-lg lg:text-xl font-heading font-medium text-foreground mb-2 sm:mb-3 group-hover:bg-gradient-to-r group-hover:${service.accent} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">{service.description}</p>

                {/* CTA */}
                <div className="relative">
                  {service.isDueDiligence ? (
                    <DueDiligenceFormModal
                      trigger={
                        <Button 
                          variant="ghost" 
                          className="p-0 h-auto text-sm text-primary hover:text-primary/80 group/btn"
                        >
                          {t("duediligence.cta")}
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      }
                    />
                  ) : service.detailContent ? (
                    <ServiceDetailModal
                      title={service.title}
                      content={service.detailContent}
                      trigger={
                        <Button 
                          variant="ghost" 
                          className="p-0 h-auto text-sm text-primary hover:text-primary/80 group/btn"
                        >
                          {t("services.learnMore")}
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      }
                    />
                  ) : (
                    <a href="#agendamento" onClick={(e) => handleClick(e, 'agendamento')}>
                      <Button 
                        variant="ghost" 
                        className="p-0 h-auto text-sm text-primary hover:text-primary/80 group/btn"
                      >
                        {t("services.learnMore")}
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </a>
                  )}
                </div>
                
                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r ${service.accent} opacity-0 group-hover:opacity-60 transition-all duration-500`} aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
