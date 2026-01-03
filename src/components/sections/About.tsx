import { Target, Lightbulb, BarChart3, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSectionHighlight } from "@/hooks/use-section-highlight";

const About = () => {
  const { t } = useLanguage();
  const { sectionRef, isVisible } = useSectionHighlight();

  const features = [
    {
      icon: Target,
      title: t("about.feature1.title"),
      description: t("about.feature1.desc"),
    },
    {
      icon: Lightbulb,
      title: t("about.feature2.title"),
      description: t("about.feature2.desc"),
    },
    {
      icon: BarChart3,
      title: t("about.feature3.title"),
      description: t("about.feature3.desc"),
    },
    {
      icon: Shield,
      title: t("about.feature4.title"),
      description: t("about.feature4.desc"),
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="sobre" 
      className={`py-16 lg:py-24 xl:py-32 relative section-highlight ${isVisible ? 'visible' : ''}`}
      aria-labelledby="about-headline"
    >
      <div className="container-wide px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-primary font-semibold text-xs sm:text-sm tracking-wider uppercase mb-3 sm:mb-4">
              {t("about.label")}
            </span>
            <h2 id="about-headline" className="text-2xl sm:text-3xl lg:text-4xl font-heading font-semibold tracking-tight text-foreground mb-4 sm:mb-6">
              {t("about.headline")}{" "}
              <span className="bg-gradient-to-r from-teal-400 to-primary bg-clip-text text-transparent">{t("about.headline.highlight")}</span>
            </h2>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground">
              <p>{t("about.p1")}</p>
              <p>
                {t("about.p2.start")} <strong className="text-foreground">{t("about.p2.bold")}</strong> {t("about.p2.end")}
              </p>
              <p>{t("about.p3")}</p>
            </div>
          </div>

          {/* Right - Feature Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6" role="list" aria-label="Características da Albatross">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group gradient-glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border-gradient hover:shadow-glow-sm transition-all duration-500 hover:-translate-y-1"
                role="listitem"
              >
                <div className="w-10 h-10 sm:w-12 lg:w-14 sm:h-12 lg:h-14 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors duration-300" aria-hidden="true">
                  <feature.icon className="w-5 h-5 sm:w-6 lg:w-7 sm:h-6 lg:h-7 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-heading font-medium text-foreground mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
