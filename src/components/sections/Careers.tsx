import { forwardRef, useState, useEffect, useRef } from "react";
import { Briefcase, Upload, Users, Rocket, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CareersProps {
  hubspotPortalId?: string;
  hubspotFormId?: string;
}

const Careers = forwardRef<HTMLElement, CareersProps>(
  ({ hubspotPortalId = "YOUR_PORTAL_ID", hubspotFormId = "YOUR_FORM_ID" }, ref) => {
    const { t, language } = useLanguage();
    const formContainerRef = useRef<HTMLDivElement>(null);
    const [isHubSpotLoaded, setIsHubSpotLoaded] = useState(false);

    const benefits = [
      {
        icon: Rocket,
        title: t("careers.benefit1.title"),
        desc: t("careers.benefit1.desc"),
      },
      {
        icon: Users,
        title: t("careers.benefit2.title"),
        desc: t("careers.benefit2.desc"),
      },
      {
        icon: Heart,
        title: t("careers.benefit3.title"),
        desc: t("careers.benefit3.desc"),
      },
    ];

    useEffect(() => {
      // Load HubSpot Forms script
      const script = document.createElement("script");
      script.src = "//js.hsforms.net/forms/embed/v2.js";
      script.async = true;
      script.onload = () => setIsHubSpotLoaded(true);
      document.body.appendChild(script);

      return () => {
        // Cleanup script on unmount
        const existingScript = document.querySelector(
          'script[src="//js.hsforms.net/forms/embed/v2.js"]'
        );
        if (existingScript) {
          existingScript.remove();
        }
      };
    }, []);

    useEffect(() => {
      if (isHubSpotLoaded && formContainerRef.current && window.hbspt) {
        // Clear previous form
        formContainerRef.current.innerHTML = "";
        
        // Create HubSpot form
        window.hbspt.forms.create({
          region: "na1",
          portalId: hubspotPortalId,
          formId: hubspotFormId,
          target: "#hubspot-careers-form",
          locale: language.toLowerCase(),
        });
      }
    }, [isHubSpotLoaded, hubspotPortalId, hubspotFormId, language]);

    return (
      <section
        ref={ref}
        id="carreiras"
        className="py-20 sm:py-24 lg:py-32 bg-background relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        </div>

        <div className="container-wide relative z-10">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {t("careers.label")}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-4">
              {t("careers.headline")}{" "}
              <span className="text-primary">{t("careers.headline.highlight")}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("careers.subheadline")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Benefits */}
            <div className="space-y-6">
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-6">
                {t("careers.benefits.title")}
              </h3>
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                  </div>
                </div>
              ))}

              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <Upload className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">
                    {t("careers.upload.info")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("careers.upload.formats")}
                </p>
              </div>
            </div>

            {/* HubSpot Form */}
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-lg">
              <div className="p-4 border-b border-border/50 bg-secondary/30">
                <h3 className="font-heading font-semibold text-foreground text-center">
                  {t("careers.form.title")}
                </h3>
              </div>
              <div className="p-6">
                <div
                  id="hubspot-careers-form"
                  ref={formContainerRef}
                  className="hubspot-form-wrapper"
                >
                  {!isHubSpotLoaded && (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
                
                {/* Fallback message if HubSpot IDs not configured */}
                {(hubspotPortalId === "YOUR_PORTAL_ID" || hubspotFormId === "YOUR_FORM_ID") && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      {t("careers.form.notConfigured")}
                    </p>
                    <a
                      href="mailto:carreiras@albatross.consulting"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      {t("careers.form.emailFallback")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

Careers.displayName = "Careers";

// Add HubSpot types to window
declare global {
  interface Window {
    hbspt: {
      forms: {
        create: (options: {
          region: string;
          portalId: string;
          formId: string;
          target: string;
          locale?: string;
        }) => void;
      };
    };
  }
}

export default Careers;
