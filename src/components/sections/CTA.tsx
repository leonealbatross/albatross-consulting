import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";


const CTA = forwardRef<HTMLElement>((_, ref) => {
  const { t } = useLanguage();

  return (
    <section ref={ref} id="contato" className="py-16 lg:py-24 xl:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container-wide relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 sm:mb-8">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-primary">
              {t("cta.badge")}
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-semibold tracking-tight text-foreground mb-4 sm:mb-6">
            {t("cta.headline")}{" "}
            <span className="bg-gradient-to-r from-teal-400 to-primary bg-clip-text text-transparent">{t("cta.headline.highlight")}</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10">
            {t("cta.subheadline")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a href="#agendamento">
              <Button variant="hero" size="lg" className="group w-full sm:w-auto text-sm sm:text-base">
                {t("cta.primary")}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <a href="mailto:leone@albatross.consulting">
              <Button variant="heroOutline" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                {t("cta.secondary")}
              </Button>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-16 border-t border-border/30">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t("cta.trust")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

CTA.displayName = "CTA";

export default CTA;
