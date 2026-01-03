import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Send, 
  Calendar,
  Target,
  TrendingUp,
  Users,
  Brain,
  Handshake,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface BGaaSModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CALENDLY_URL = "https://calendly.com/leone-albatross";

const deliverableIcons = [Target, Users, TrendingUp, Brain, Handshake];

const BGaaSModal = ({ open, onOpenChange }: BGaaSModalProps) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<"info" | "form" | "calendly">("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSection, setExpandedSection] = useState<"deliverables" | "benefits" | null>("deliverables");
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    jobTitle: "",
    phone: "",
    lgpdConsent: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Build translated arrays
  const deliverables = [
    { icon: deliverableIcons[0], text: t("bgaas.deliverables.1") },
    { icon: deliverableIcons[1], text: t("bgaas.deliverables.2") },
    { icon: deliverableIcons[2], text: t("bgaas.deliverables.3") },
    { icon: deliverableIcons[3], text: t("bgaas.deliverables.4") },
    { icon: deliverableIcons[4], text: t("bgaas.deliverables.5") },
  ];

  const benefits = [
    t("bgaas.benefits.1"),
    t("bgaas.benefits.2"),
    t("bgaas.benefits.3"),
  ];

  // Track modal open event
  useEffect(() => {
    if (open) {
      // Track: bg_service_opened
      console.log("Event: bg_service_opened");
      // Reset state on open
      setStep("info");
      setFormData({
        name: "",
        email: "",
        company: "",
        jobTitle: "",
        phone: "",
        lgpdConsent: false,
      });
      setErrors({});
    }
  }, [open]);

  // Focus trap and accessibility
  useEffect(() => {
    if (open && titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open, step]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t("bgaas.form.error.name");
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t("bgaas.form.error.email");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("bgaas.form.error.emailInvalid");
    }
    
    if (!formData.company.trim()) {
      newErrors.company = t("bgaas.form.error.company");
    }
    
    if (!formData.lgpdConsent) {
      newErrors.lgpdConsent = t("bgaas.form.error.lgpd");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send to HubSpot using existing integration
      const { data, error } = await supabase.functions.invoke('hubspot-contact', {
        body: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: `Cargo: ${formData.jobTitle || "Não informado"}\nTelefone: ${formData.phone || "Não informado"}\n\nInteresse: Business Growth as a Service - Reunião Inicial`,
          sectionTitle: "BGaaS - Business Growth as a Service",
        },
      });

      if (error) {
        console.error('HubSpot integration error:', error);
      } else {
        console.log('HubSpot response:', data);
        // Track: lead_submitted
        console.log("Event: lead_submitted");
      }

      toast({
        title: t("bgaas.toast.success.title"),
        description: t("bgaas.toast.success.desc"),
      });
      
      setStep("calendly");
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: t("bgaas.toast.error.title"),
        description: t("bgaas.toast.error.desc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenCalendly = () => {
    // Track: calendly_opened
    console.log("Event: calendly_opened");
  };

  const AccordionSection = ({ 
    title, 
    id, 
    children 
  }: { 
    title: string; 
    id: "deliverables" | "benefits"; 
    children: React.ReactNode 
  }) => {
    const isExpanded = expandedSection === id;
    
    return (
      <div className="border border-border/50 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setExpandedSection(isExpanded ? null : id)}
          className="w-full flex items-center justify-between p-3 bg-secondary/30 hover:bg-secondary/50 transition-colors"
        >
          <span className="font-medium text-sm">{title}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-3 bg-background/50">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <AnimatePresence mode="wait">
          {step === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              className="p-6"
            >
              <DialogHeader>
                <DialogTitle 
                  ref={titleRef}
                  tabIndex={-1}
                  className="text-xl sm:text-2xl font-heading font-semibold text-foreground outline-none"
                >
                  {t("bgaas.title")}
                </DialogTitle>
                <p className="text-sm sm:text-base text-muted-foreground mt-2">
                  {t("bgaas.subtitle")}
                </p>
              </DialogHeader>

              <div className="mt-6 space-y-3">
                {/* Mobile: Accordion | Desktop: Full content */}
                <div className="block sm:hidden space-y-3">
                  <AccordionSection title={t("bgaas.deliverables.title")} id="deliverables">
                    <ul className="space-y-2">
                      {deliverables.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <item.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionSection>
                  
                  <AccordionSection title={t("bgaas.benefits.title")} id="benefits">
                    <ul className="space-y-2">
                      {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionSection>
                </div>

                {/* Desktop: Full content */}
                <div className="hidden sm:block space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      {t("bgaas.deliverables.title")}
                    </h4>
                    <ul className="space-y-2.5">
                      {deliverables.map((item, index) => (
                        <motion.li 
                          key={index} 
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground leading-relaxed">{item.text}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      {t("bgaas.benefits.title")}
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {benefits.map((benefit, index) => (
                        <motion.div 
                          key={index}
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-xs text-foreground font-medium">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <motion.div 
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  onClick={() => setStep("form")}
                  className="w-full gap-2"
                  size="lg"
                >
                  {t("bgaas.cta.learnMore")}
                  <Calendar className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              className="p-6"
            >
              <DialogHeader>
                <DialogTitle 
                  ref={titleRef}
                  tabIndex={-1}
                  className="text-xl font-heading font-semibold text-foreground outline-none"
                >
                  {t("bgaas.form.title")}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("bgaas.form.subtitle")}
                </p>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bgaas-name">{t("bgaas.form.name")} *</Label>
                    <Input
                      id="bgaas-name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      placeholder={t("bgaas.form.namePlaceholder")}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bgaas-email">{t("bgaas.form.email")} *</Label>
                    <Input
                      id="bgaas-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      placeholder={t("bgaas.form.emailPlaceholder")}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bgaas-company">{t("bgaas.form.company")} *</Label>
                  <Input
                    id="bgaas-company"
                    value={formData.company}
                    onChange={(e) => {
                      setFormData({ ...formData, company: e.target.value });
                      if (errors.company) setErrors({ ...errors, company: "" });
                    }}
                    placeholder={t("bgaas.form.companyPlaceholder")}
                    className={errors.company ? "border-destructive" : ""}
                  />
                  {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bgaas-jobtitle">{t("bgaas.form.jobTitle")}</Label>
                    <Input
                      id="bgaas-jobtitle"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      placeholder={t("bgaas.form.jobTitlePlaceholder")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bgaas-phone">{t("bgaas.form.phone")}</Label>
                    <Input
                      id="bgaas-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t("bgaas.form.phonePlaceholder")}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="bgaas-lgpd"
                      checked={formData.lgpdConsent}
                      onCheckedChange={(checked) => {
                        setFormData({ ...formData, lgpdConsent: checked as boolean });
                        if (errors.lgpdConsent) setErrors({ ...errors, lgpdConsent: "" });
                      }}
                      className={errors.lgpdConsent ? "border-destructive" : ""}
                    />
                    <label 
                      htmlFor="bgaas-lgpd" 
                      className="text-xs text-muted-foreground cursor-pointer leading-relaxed"
                    >
                      {t("bgaas.form.lgpd")} *
                    </label>
                  </div>
                  {errors.lgpdConsent && (
                    <p className="text-xs text-destructive mt-1 ml-6">{errors.lgpdConsent}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("info")}
                    className="flex-1"
                  >
                    {t("bgaas.form.back")}
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t("bgaas.form.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t("bgaas.form.submit")}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {step === "calendly" && (
            <motion.div
              key="calendly"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              className="p-6"
            >
              <DialogHeader>
                <div className="flex justify-center mb-4">
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>
                <DialogTitle 
                  ref={titleRef}
                  tabIndex={-1}
                  className="text-xl font-heading font-semibold text-foreground text-center outline-none"
                >
                  {t("bgaas.success.title")}
                </DialogTitle>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  {t("bgaas.success.subtitle")}
                </p>
              </DialogHeader>

              <div className="mt-6">
                {/* Calendly Embed */}
                <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                  <iframe
                    src={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=0a0a0a&text_color=fafafa&primary_color=2dd4bf`}
                    width="100%"
                    height="500"
                    frameBorder="0"
                    title={t("bgaas.success.calendlyTitle")}
                    className="w-full"
                    style={{ border: "none" }}
                    onLoad={handleOpenCalendly}
                  />
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  {t("bgaas.success.preferLater")}{" "}
                  <a 
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {t("bgaas.success.openNewTab")}
                  </a>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default BGaaSModal;
