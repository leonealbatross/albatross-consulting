import { forwardRef } from "react";
import { Calendar, Clock, Video } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SchedulingProps {
  calendlyUrl?: string;
}

const Scheduling = forwardRef<HTMLElement, SchedulingProps>(
  ({ calendlyUrl = "https://calendly.com/albatross-consulting" }, ref) => {
    const { t } = useLanguage();

    const features = [
      {
        icon: Calendar,
        title: t("scheduling.feature1.title"),
        desc: t("scheduling.feature1.desc"),
      },
      {
        icon: Clock,
        title: t("scheduling.feature2.title"),
        desc: t("scheduling.feature2.desc"),
      },
      {
        icon: Video,
        title: t("scheduling.feature3.title"),
        desc: t("scheduling.feature3.desc"),
      },
    ];

    return (
      <section
        ref={ref}
        id="agendamento"
        className="py-20 sm:py-24 lg:py-32 bg-secondary/30 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        </div>

        <div className="container-wide relative z-10">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {t("scheduling.label")}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-4">
              {t("scheduling.headline")}{" "}
              <span className="text-primary">{t("scheduling.headline.highlight")}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("scheduling.subheadline")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calendly Embed */}
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-lg">
              <div className="p-4 border-b border-border/50 bg-secondary/30">
                <h3 className="font-heading font-semibold text-foreground text-center">
                  {t("scheduling.calendar.title")}
                </h3>
              </div>
              <div className="relative" style={{ minHeight: "650px" }}>
                <iframe
                  src={`${calendlyUrl}?hide_gdpr_banner=1&background_color=0a0a0a&text_color=fafafa&primary_color=c084fc`}
                  width="100%"
                  height="650"
                  frameBorder="0"
                  title="Calendly Scheduling"
                  className="w-full"
                  style={{ border: "none" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

Scheduling.displayName = "Scheduling";

export default Scheduling;
