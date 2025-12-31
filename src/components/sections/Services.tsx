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

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: TrendingUp,
      title: t("services.s1.title"),
      description: t("services.s1.desc"),
      highlight: t("services.s1.highlight"),
    },
    {
      icon: GitMerge,
      title: t("services.s2.title"),
      description: t("services.s2.desc"),
      highlight: t("services.s2.highlight"),
    },
    {
      icon: BarChart3,
      title: t("services.s3.title"),
      description: t("services.s3.desc"),
      highlight: t("services.s3.highlight"),
    },
    {
      icon: Building2,
      title: t("services.s4.title"),
      description: t("services.s4.desc"),
      highlight: t("services.s4.highlight"),
    },
    {
      icon: Sparkles,
      title: t("services.s5.title"),
      description: t("services.s5.desc"),
      highlight: t("services.s5.highlight"),
    },
    {
      icon: Users,
      title: t("services.s6.title"),
      description: t("services.s6.desc"),
      highlight: t("services.s6.highlight"),
    },
  ];

  return (
    <section id="servicos" className="py-24 lg:py-32 bg-secondary/30 relative">
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

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
            {t("services.label")}
          </span>
          <h2 className="heading-section text-foreground mb-6">
            {t("services.headline")}{" "}
            <span className="bg-gradient-to-r from-teal-400 to-primary bg-clip-text text-transparent">{t("services.headline.highlight")}</span>
          </h2>
          <p className="text-body text-muted-foreground">
            {t("services.subheadline")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-glow-sm hover:-translate-y-1"
            >
              {/* Icon & Highlight */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="text-xs font-medium text-primary/80 bg-primary/10 px-3 py-1 rounded-full">
                  {service.highlight}
                </span>
              </div>

              {/* Content */}
              <h3 className="heading-card text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-subtle mb-6">{service.description}</p>

              {/* CTA */}
              <Button 
                variant="ghost" 
                className="p-0 h-auto text-primary hover:text-primary/80 group/btn"
              >
                {t("services.learnMore")}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
