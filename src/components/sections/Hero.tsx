import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Award, Handshake, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import heroBg from "@/assets/hero-bg.jpg";
import BGaaSModal from "@/components/BGaaSModal";

const Hero = () => {
  const { t } = useLanguage();
  const { scrollToSection, handleClick } = useSmoothScroll();
  const [bgaasModalOpen, setBgaasModalOpen] = useState(false);

  const stats = [
    { 
      icon: TrendingUp, 
      value: t("hero.stat1.value"),
      label: t("hero.stat1.label"),
      sublabel: t("hero.stat1.sublabel"),
      accent: "from-primary to-teal-300"
    },
    { 
      icon: Award, 
      value: t("hero.stat2.value"),
      label: t("hero.stat2.label"),
      sublabel: t("hero.stat2.sublabel"),
      accent: "from-emerald-400 to-primary"
    },
    { 
      icon: Handshake, 
      value: t("hero.stat3.value"),
      label: t("hero.stat3.label"),
      sublabel: t("hero.stat3.sublabel"),
      accent: "from-cyan-400 to-primary"
    },
  ];

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-headline"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        role="img"
        aria-label="Imagem de fundo representando crescimento empresarial"
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" aria-hidden="true" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="container-wide relative z-10 pt-48 sm:pt-56 md:pt-64 lg:pt-72 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge - Enhanced BGaaS Button */}
          <motion.button
            onClick={() => setBgaasModalOpen(true)}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/40 mb-8 opacity-0 animate-fade-up cursor-pointer group relative overflow-hidden min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ minWidth: "280px" }}
            aria-label="Business Growth as a Service - Clique para saber mais"
          >
            {/* Glow effect on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            
            {/* Animated pulse dot */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
            </span>
            
            <span className="relative text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
              {t("hero.badge")}
            </span>
            
            <Sparkles className="relative w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            
            {/* Shadow glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ 
                boxShadow: "0 0 20px rgba(45, 212, 191, 0.3)",
                opacity: 0 
              }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>

          {/* BGaaS Modal */}
          <BGaaSModal open={bgaasModalOpen} onOpenChange={setBgaasModalOpen} />

          {/* Main Headline */}
          <h1 
            id="hero-headline"
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading font-semibold tracking-tight leading-tight text-foreground mb-6 opacity-0 animate-fade-up stagger-1 px-2 sm:px-0"
          >
            {t("hero.headline")}{" "}
            <span className="bg-gradient-to-r from-teal-400 to-primary bg-clip-text text-transparent">{t("hero.headline.highlight")}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 opacity-0 animate-fade-up stagger-2 px-4 sm:px-0">
            {t("hero.subheadline")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16 opacity-0 animate-fade-up stagger-3 px-4 sm:px-0">
            <a 
              href="#agendamento" 
              onClick={(e) => handleClick(e, 'agendamento')}
              className="w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg"
            >
              <Button variant="hero" size="lg" className="group w-full sm:w-auto text-sm sm:text-base min-h-[48px]">
                {t("hero.cta.primary")}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </a>
            <Button 
              variant="heroOutline" 
              size="lg" 
              className="w-full sm:w-auto text-sm sm:text-base min-h-[48px] focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              onClick={() => scrollToSection('sobre')}
            >
              {t("hero.cta.secondary")}
            </Button>
          </div>

          {/* Stats - Modern Bento Style */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 opacity-0 animate-fade-up stagger-4 px-4 sm:px-0">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Animated border gradient */}
                <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${stat.accent} opacity-20 group-hover:opacity-50 blur-sm group-hover:blur-md transition-all duration-500`} />
                
                {/* Card */}
                <div className="relative overflow-hidden rounded-2xl bg-background/95 backdrop-blur-xl border border-primary/20 p-5 sm:p-6 h-full group-hover:border-primary/40 transition-all duration-300">
                  {/* Decorative corner accent */}
                  <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${stat.accent} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  <div className="relative">
                    {/* Header row: Icon + Value */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${stat.accent} opacity-0 group-hover:opacity-40 blur-md transition-all duration-500`} />
                        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                      </div>
                      <div className={`text-2xl sm:text-3xl font-heading font-bold bg-gradient-to-r ${stat.accent} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">
                      {stat.label}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {stat.sublabel}
                    </p>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r ${stat.accent} opacity-0 group-hover:opacity-60 transition-all duration-500`} />
                </div>
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
