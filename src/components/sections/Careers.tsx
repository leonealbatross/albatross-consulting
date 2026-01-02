import { useState } from "react";
import { Briefcase, Upload, Users, Rocket, Heart, Send, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSectionHighlight } from "@/hooks/use-section-highlight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { careersFormSchema } from "@/lib/form-sanitization";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  message?: string;
}

const Careers = () => {
  const { t } = useLanguage();
  const { sectionRef, isVisible } = useSectionHighlight();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t("careers.form.error.nameRequired");
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("careers.form.error.nameMin");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t("careers.form.error.emailRequired");
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = t("careers.form.error.emailInvalid");
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone.trim()) {
      const phoneRegex = /^[\d\s\-\+\(\)]{8,20}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = t("careers.form.error.phoneInvalid");
      }
    }

    // LinkedIn validation (optional but must be valid if provided)
    if (formData.linkedin.trim()) {
      const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w\-]+\/?$/i;
      const simpleLinkedinRegex = /^linkedin\.com\/in\/[\w\-]+\/?$/i;
      if (!linkedinRegex.test(formData.linkedin.trim()) && !simpleLinkedinRegex.test(formData.linkedin.trim())) {
        newErrors.linkedin = t("careers.form.error.linkedinInvalid");
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = t("careers.form.error.messageRequired");
    } else if (formData.message.trim().length < 20) {
      newErrors.message = t("careers.form.error.messageMin");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: t("careers.form.error.title"),
        description: t("careers.form.error.description"),
        variant: "destructive",
      });
      return;
    }

    // Validate and sanitize form data using zod schema
    const validationResult = careersFormSchema.safeParse(formData);
    
    if (!validationResult.success) {
      toast({
        title: t("careers.form.error.title"),
        description: validationResult.error.errors[0]?.message || t("careers.form.error.description"),
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Use sanitized data from zod transform
    const sanitizedData = validationResult.data;

    setIsSubmitting(true);

    // Send automatic response email to candidate
    try {
      const { error } = await supabase.functions.invoke("send-candidate-email", {
        body: {
          name: sanitizedData.name,
          email: sanitizedData.email,
        },
      });

      if (error) {
        console.error("Error sending confirmation email:", error);
      }
    } catch (err) {
      console.error("Error calling send-candidate-email function:", err);
    }

    // Open mailto for the company to receive the application
    const emailTo = "leone@albatross.consulting";
    const subject = encodeURIComponent("Candidatura - Albatross Consulting");
    const body = encodeURIComponent(
      `Nome: ${sanitizedData.name}\n` +
      `Email: ${sanitizedData.email}\n` +
      `Telefone: ${sanitizedData.phone || "Não informado"}\n` +
      `LinkedIn: ${sanitizedData.linkedin || "Não informado"}\n\n` +
      `Mensagem:\n${sanitizedData.message}\n\n` +
      `---\n` +
      `IMPORTANTE: Por favor, anexe seu currículo a este e-mail no formato PDF ou Word (.doc/.docx).`
    );

    window.open(`mailto:${emailTo}?subject=${subject}&body=${body}`, "_blank");

    toast({
      title: t("careers.form.success.title"),
      description: t("careers.form.success.description"),
    });

    setFormData({ name: "", email: "", phone: "", linkedin: "", message: "" });
    setErrors({});
    setIsSubmitting(false);
  };

  return (
    <section
      ref={sectionRef}
      id="carreiras"
      className={`py-20 sm:py-24 lg:py-32 bg-background relative overflow-hidden section-highlight ${isVisible ? 'visible' : ''}`}
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
                  <Label htmlFor="career-name">{t("contact.name")} *</Label>
                  <Input
                    id="career-name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    placeholder={t("contact.name.placeholder")}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="career-email">{t("contact.email")} *</Label>
                  <Input
                    id="career-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder={t("contact.email.placeholder")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="career-phone">{t("careers.form.phone")}</Label>
                  <Input
                    id="career-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    placeholder={t("careers.form.phone.placeholder")}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="career-linkedin">{t("careers.form.linkedin")}</Label>
                  <Input
                    id="career-linkedin"
                    value={formData.linkedin}
                    onChange={(e) => {
                      setFormData({ ...formData, linkedin: e.target.value });
                      if (errors.linkedin) setErrors({ ...errors, linkedin: undefined });
                    }}
                    placeholder={t("careers.form.linkedin.placeholder")}
                    className={errors.linkedin ? "border-destructive" : ""}
                  />
                  {errors.linkedin && (
                    <p className="text-xs text-destructive">{errors.linkedin}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="career-message">{t("careers.form.motivation")} *</Label>
                <Textarea
                  id="career-message"
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: undefined });
                  }}
                  placeholder={t("careers.form.motivation.placeholder")}
                  rows={4}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">{errors.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isSubmitting ? t("careers.form.sending") || "Enviando..." : t("careers.form.submit")}
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
};

export default Careers;
