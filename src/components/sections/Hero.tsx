import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Database } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroBg from "@/assets/hero-bg.jpg";
import ContactModal from "@/components/ContactModal";
import ServiceDetailModal from "@/components/ServiceDetailModal";

const Hero = () => {
  const { t } = useLanguage();

  const bgasContent = `E se sua empresa não estivesse crescendo de verdade?

Você tem produto, time, mercado. Mas os resultados são instáveis. Sem método, tudo vira tentativa e erro. Isso custa caro, desgasta o time e trava seu valuation.

Enquanto isso, outros já tratam crescimento como serviço.

Business Growth as a Service é o que a Albatross entrega: estrutura, disciplina e resultado. O resto é ilusão de progresso.`;

  const stats = [
    { 
      icon: TrendingUp, 
      value: "25+", 
      label: "Anos de Experiência",
      subtitle: "Founder"
    },
    { 
      icon: Users, 
      value: "✓", 
      label: "Resultados Comprovados",
      subtitle: null
    },
    { 
      icon: Database, 
      value: "ONEtoONE", 
      label: "Parceira em M&A Internacional",
      subtitle: null
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="container-wide relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <ServiceDetailModal
            title={t("hero.badge")}
            content={bgasContent}
            trigger={
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 mb-8 opacity-0 animate-fade-up hover:bg-secondary/70 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">
                  {t("hero.badge")}
                </span>
              </button>
            }
          />

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading font-semibold tracking-tight leading-tight text-foreground mb-6 opacity-0 animate-fade-up stagger-1 px-2 sm:px-0">
            {t("hero.headline")}{" "}
            <span className="bg-gradient-to-r from-teal-400 to-primary bg-clip-text text-transparent">{t("hero.headline.highlight")}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 opacity-0 animate-fade-up stagger-2 px-4 sm:px-0">
            {t("hero.subheadline")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16 opacity-0 animate-fade-up stagger-3 px-4 sm:px-0">
            <ContactModal 
              trigger={
                <Button variant="hero" size="lg" className="group w-full sm:w-auto text-sm sm:text-base">
                  {t("hero.cta.primary")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              }
            />
            <Button 
              variant="heroOutline" 
              size="lg" 
              className="w-full sm:w-auto text-sm sm:text-base"
              onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t("hero.cta.secondary")}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 opacity-0 animate-fade-up stagger-4 px-4 sm:px-0">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-background/80 via-background/60 to-primary/5 backdrop-blur-xl p-6 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(45,212,191,0.15)] transition-all duration-500"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Inner border glow */}
                <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                
                <div className="relative flex items-center gap-4">
                  {/* Icon container */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
                    <stat.icon className="w-7 h-7 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <div className="text-left">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-heading font-bold text-foreground tracking-tight">
                        {stat.value}
                      </span>
                      {stat.subtitle && (
                        <span className="text-lg font-heading font-bold text-primary">+</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground leading-tight mt-0.5">
                      {stat.subtitle && <span className="text-primary/80">{stat.subtitle} · </span>}
                      {stat.label}
                    </div>
                  </div>
                </div>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in stagger-5">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
