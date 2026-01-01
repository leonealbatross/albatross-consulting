import { 
  TrendingUp, 
  GitMerge, 
  BarChart3, 
  Building2, 
  Sparkles, 
  Users,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import ContactModal from "@/components/ContactModal";
import ServiceDetailModal from "@/components/ServiceDetailModal";

const Services = () => {
  const { t } = useLanguage();

  const bgasContent = `E se sua empresa não estivesse crescendo de verdade?

Você tem produto, time, mercado. Mas os resultados são instáveis. Sem método, tudo vira tentativa e erro. Isso custa caro, desgasta o time e trava seu valuation.

Enquanto isso, outros já tratam crescimento como serviço.

Business Growth as a Service é o que a Albatross entrega: estrutura, disciplina e resultado. O resto é ilusão de progresso.`;

  const services = [
    {
      icon: TrendingUp,
      title: t("services.s1.title"),
      description: t("services.s1.desc"),
      highlight: t("services.s1.highlight"),
      detailContent: bgasContent,
      accent: "from-primary to-teal-300",
    },
    {
      icon: GitMerge,
      title: t("services.s2.title"),
      description: t("services.s2.desc"),
      highlight: t("services.s2.highlight"),
      detailContent: `A Albatross Consulting, em parceria com a ONEtoONE Corporate Finance, atua de forma end-to-end em fusões e aquisições para empresas de tecnologia, combinando deal sourcing com alcance internacional e execução estratégica. Após a transação, a Albatross lidera a fase de pós-M&A, apoiando integração, governança, execução estratégica e captura de sinergias para garantir geração de valor sustentável no longo prazo.`,
      accent: "from-emerald-400 to-primary",
    },
    {
      icon: BarChart3,
      title: t("services.s3.title"),
      description: t("services.s3.desc"),
      highlight: t("services.s3.highlight"),
      detailContent: `Transformamos dados em decisões que aceleram crescimento e execução.

A Albatross Consulting combina frameworks consagrados de estratégia, métricas avançadas de performance e metodologia própria de Growth e Go-to-Market para estruturar governança, previsibilidade comercial e eficiência operacional.

Conectamos dados, liderança e execução para gerar impacto mensurável e crescimento sustentável.`,
      accent: "from-cyan-400 to-primary",
    },
    {
      icon: Building2,
      title: t("services.s4.title"),
      description: t("services.s4.desc"),
      highlight: t("services.s4.highlight"),
      accent: "from-blue-400 to-primary",
    },
    {
      icon: Sparkles,
      title: t("services.s5.title"),
      description: t("services.s5.desc"),
      highlight: t("services.s5.highlight"),
      accent: "from-violet-400 to-primary",
    },
    {
      icon: Users,
      title: t("services.s6.title"),
      description: t("services.s6.desc"),
      highlight: t("services.s6.highlight"),
      accent: "from-rose-400 to-primary",
    },
  ];

  return (
    <section id="servicos" className="py-16 lg:py-24 xl:py-32 bg-secondary/30 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
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
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-semibold tracking-tight text-foreground mb-4 sm:mb-6">
            {t("services.headline")}{" "}
            <span className="bg-gradient-to-r from-teal-400 to-primary bg-clip-text text-transparent">{t("services.headline.highlight")}</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
            {t("services.subheadline")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Animated border gradient */}
              <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${service.accent} opacity-0 group-hover:opacity-40 blur-sm group-hover:blur-md transition-all duration-500`} />
              
              {/* Card */}
              <div className="relative bg-card/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-border/50 group-hover:border-primary/30 transition-all duration-500 h-full">
                {/* Decorative corner accent */}
                <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-all duration-500`} />
                
                {/* Icon & Highlight */}
                <div className="relative flex items-start justify-between mb-4 sm:mb-6">
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${service.accent} opacity-0 group-hover:opacity-30 blur-md transition-all duration-500`} />
                    <div className="relative w-10 h-10 sm:w-12 lg:w-14 sm:h-12 lg:h-14 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
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
                  {service.detailContent ? (
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
                    <ContactModal 
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
                  )}
                </div>
                
                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r ${service.accent} opacity-0 group-hover:opacity-60 transition-all duration-500`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
