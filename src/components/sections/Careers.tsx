import { forwardRef, useState } from "react";
import { Briefcase, Upload, Users, Rocket, Heart, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const Careers = forwardRef<HTMLElement>((_, ref) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    message: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailTo = "leone@albatross.consulting";
    const subject = encodeURIComponent("Candidatura - Albatross Consulting");
    const body = encodeURIComponent(
      `Nome: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Telefone: ${formData.phone || "Não informado"}\n` +
      `LinkedIn: ${formData.linkedin || "Não informado"}\n\n` +
      `Mensagem:\n${formData.message}`
    );

    window.open(`mailto:${emailTo}?subject=${subject}&body=${body}`, "_blank");

    toast({
      title: t("careers.form.success.title"),
      description: t("careers.form.success.description"),
    });

    setFormData({ name: "", email: "", phone: "", linkedin: "", message: "" });
  };

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

          {/* Application Form */}
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-lg">
            <div className="p-4 border-b border-border/50 bg-secondary/30">
              <h3 className="font-heading font-semibold text-foreground text-center">
                {t("careers.form.title")}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="career-name">{t("contact.name")}</Label>
                  <Input
                    id="career-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder={t("contact.name.placeholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="career-email">{t("contact.email")}</Label>
                  <Input
                    id="career-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder={t("contact.email.placeholder")}
                    required
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="career-phone">{t("careers.form.phone")}</Label>
                  <Input
                    id="career-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder={t("careers.form.phone.placeholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="career-linkedin">{t("careers.form.linkedin")}</Label>
                  <Input
                    id="career-linkedin"
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedin: e.target.value })
                    }
                    placeholder={t("careers.form.linkedin.placeholder")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="career-message">{t("careers.form.motivation")}</Label>
                <Textarea
                  id="career-message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder={t("careers.form.motivation.placeholder")}
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Send className="w-4 h-4" />
                {t("careers.form.submit")}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {t("careers.form.note")}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
});

Careers.displayName = "Careers";

export default Careers;
