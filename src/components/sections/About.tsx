import { Target, Lightbulb, BarChart3, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

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
    <section id="sobre" className="py-24 lg:py-32 relative">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
              {t("about.label")}
            </span>
            <h2 className="heading-section text-foreground mb-6">
              {t("about.headline")}{" "}
              <span className="bg-gradient-to-r from-teal-400 to-primary bg-clip-text text-transparent">{t("about.headline.highlight")}</span>
            </h2>
            <div className="space-y-4 text-body text-muted-foreground">
              <p>{t("about.p1")}</p>
              <p>
                {t("about.p2.start")} <strong className="text-foreground">{t("about.p2.bold")}</strong> {t("about.p2.end")}
              </p>
              <p>{t("about.p3")}</p>
            </div>
          </div>

          {/* Right - Feature Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group gradient-glass rounded-2xl p-6 border-gradient hover:shadow-glow-sm transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="heading-card text-foreground mb-2">{feature.title}</h3>
                <p className="text-subtle">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
