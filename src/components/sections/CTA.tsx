import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const CTA = forwardRef<HTMLElement>((_, ref) => {
  const { t } = useLanguage();

  return (
    <section ref={ref} id="contato" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              {t("cta.badge")}
            </span>
          </div>

          {/* Headline */}
          <h2 className="heading-section text-foreground mb-6">
            {t("cta.headline")}{" "}
            <span className="bg-gradient-to-r from-teal-400 to-primary bg-clip-text text-transparent">{t("cta.headline.highlight")}</span>
          </h2>

          <p className="text-body text-muted-foreground max-w-2xl mx-auto mb-10">
            {t("cta.subheadline")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" className="group">
              {t("cta.primary")}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="heroOutline" size="xl">
              {t("cta.secondary")}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-16 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-8">
              {t("cta.trust")}
            </p>
            
            {/* Client Logos Placeholder */}
            <div className="flex flex-wrap items-center justify-center gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-32 h-12 rounded-lg bg-secondary/50 flex items-center justify-center"
                >
                  <span className="text-xs text-muted-foreground">{t("clients.logoPlaceholder")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

CTA.displayName = "CTA";

export default CTA;
