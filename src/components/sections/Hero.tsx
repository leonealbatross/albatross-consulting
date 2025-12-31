import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Database } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 mb-8 opacity-0 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Business Growth as a Service
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="heading-display text-foreground mb-6 opacity-0 animate-fade-up stagger-1">
            Aceleramos o crescimento estratégico de{" "}
            <span className="bg-gradient-to-r from-teal-400 to-primary bg-clip-text text-transparent">empresas de tecnologia.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-body text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-up stagger-2">
            Business Growth as a Service integrando estratégia, dados, M&A e execução
            para transformar seu negócio em uma potência de mercado.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0 animate-fade-up stagger-3">
            <Button variant="hero" size="xl" className="group">
              Agendar uma conversa estratégica
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Conhecer nossos serviços
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-0 animate-fade-up stagger-4">
            {[
              { icon: TrendingUp, value: "25+", label: "Anos de Experiência" },
              { icon: Users, value: "100+", label: "Empresas Impactadas" },
              { icon: Database, value: "ONEtoONE", label: "Parceira em M&A Internacional" },
            ].map((stat, index) => (
              <div
                key={index}
                className="gradient-glass rounded-2xl p-6 border-gradient hover:shadow-glow-sm transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-heading font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
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
