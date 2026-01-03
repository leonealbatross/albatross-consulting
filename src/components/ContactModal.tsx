import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { Calendar, Send, Loader2 } from "lucide-react";
import { contactFormSchema } from "@/lib/form-sanitization";
import { supabase } from "@/integrations/supabase/client";

interface ContactModalProps {
  trigger?: React.ReactNode;
  variant?: "header" | "cta";
  sectionTitle?: string;
}

const ContactModal = ({ trigger, variant = "header", sectionTitle = "Albatross Consulting" }: ContactModalProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate and sanitize form data using zod schema
    const validationResult = contactFormSchema.safeParse(formData);
    
    if (!validationResult.success) {
      toast({
        title: t("contact.error.title") || "Validation Error",
        description: validationResult.error.errors[0]?.message || t("contact.error.description") || "Please check your input",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Use sanitized data from zod transform
    const sanitizedData = validationResult.data;

    try {
      // Send to HubSpot
      const { data, error } = await supabase.functions.invoke('hubspot-contact', {
        body: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          company: sanitizedData.company,
          message: sanitizedData.message,
          sectionTitle: sectionTitle,
        },
      });

      if (error) {
        console.error('HubSpot integration error:', error);
        // Continue with email fallback even if HubSpot fails
      } else {
        console.log('HubSpot response:', data);
      }

      // Also open mailto as backup
      const emailTo = "leone@albatross.consulting";
      const subject = encodeURIComponent(`Contato via ${sectionTitle} - Albatross Consulting`);
      const body = encodeURIComponent(
        `Seção: ${sectionTitle}\n\n` +
        `Nome: ${sanitizedData.name}\n` +
        `Email: ${sanitizedData.email}\n` +
        `Empresa: ${sanitizedData.company || "Não informada"}\n\n` +
        `Mensagem:\n${sanitizedData.message}`
      );

      window.open(`mailto:${emailTo}?subject=${subject}&body=${body}`, "_blank");

      toast({
        title: t("contact.success.title"),
        description: data?.success 
          ? "Contato enviado para o HubSpot e email!" 
          : t("contact.success.description"),
      });

      setFormData({ name: "", email: "", company: "", message: "" });
      setOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button variant={variant === "header" ? "default" : "hero"} size={variant === "header" ? "default" : "xl"} className="gap-2">
      <Calendar className="w-4 h-4" />
      {t("header.cta")}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">
            {t("contact.title")}
          </DialogTitle>
          <DialogDescription>{t("contact.description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("contact.name")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder={t("contact.name.placeholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("contact.email")}</Label>
              <Input
                id="email"
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
          <div className="space-y-2">
            <Label htmlFor="company">{t("contact.company")}</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder={t("contact.company.placeholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">{t("contact.message")}</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder={t("contact.message.placeholder")}
              rows={4}
              required
            />
          </div>
          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSubmitting ? "Enviando..." : t("contact.submit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
