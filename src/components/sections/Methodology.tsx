import { Search, Compass, Play, BarChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Methodology = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Search,
      step: "01",
      title: t("methodology.step1.title"),
      description: t("methodology.step1.desc"),
    },
    {
      icon: Compass,
      step: "02",
      title: t("methodology.step2.title"),
      description: t("methodology.step2.desc"),
    },
    {
      icon: Play,
      step: "03",
      title: t("methodology.step3.title"),
      description: t("methodology.step3.desc"),
    },
    {
      icon: BarChart,
      step: "04",
      title: t("methodology.step4.title"),
      description: t("methodology.step4.desc"),
    },
  ];

  const differentiators = [
    t("methodology.diff1"),
    t("methodology.diff2"),
    t("methodology.diff3"),
    t("methodology.diff4"),
  ];

  return (
    <section id="metodologia" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
              {t("methodology.label")}
            </span>
            <h2 className="heading-section text-foreground mb-6">
              {t("methodology.headline")}{" "}
              <span className="bg-gradient-to-r from-teal-400 to-primary bg-clip-text text-transparent">{t("methodology.headline.highlight")}</span>
            </h2>
            <p className="text-body text-muted-foreground mb-8">
              {t("methodology.subheadline")}
            </p>

            {/* Differentiators */}
            <div className="space-y-4">
              {differentiators.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Steps */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-[27px] top-8 bottom-8 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden lg:block" />

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="group flex gap-6 items-start"
                >
                  {/* Step Number */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-glow-sm transition-all duration-500">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="gradient-glass rounded-2xl p-6 flex-1 border-gradient group-hover:shadow-glow-sm transition-all duration-500">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-primary font-mono text-sm font-bold">
                        {step.step}
                      </span>
                      <h3 className="heading-card text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-subtle">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
