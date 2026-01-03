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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { Send, Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface DueDiligenceModalProps {
  trigger?: React.ReactNode;
}

const dueDiligenceFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  company: z.string().min(2, "Empresa é obrigatória").max(100),
  role: z.string().min(2, "Cargo é obrigatório").max(100),
  email: z.string().email("Email inválido").max(255),
  transactionType: z.string().min(1, "Tipo de transação é obrigatório"),
  dealStage: z.string().min(1, "Estágio do deal é obrigatório"),
  annualRevenue: z.string().min(1, "Receita anual é obrigatória"),
  mainObjective: z.string().min(1, "Objetivo principal é obrigatório"),
  message: z.string().max(1000).optional(),
});

const DueDiligenceModal = ({ trigger }: DueDiligenceModalProps) => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    role: "",
    email: "",
    transactionType: "",
    dealStage: "",
    annualRevenue: "",
    mainObjective: "",
    message: "",
  });

  const transactionTypes = [
    { value: "ma", label: language === "PT" ? "M&A" : language === "ES" ? "M&A" : "M&A" },
    { value: "pe", label: language === "PT" ? "Private Equity" : language === "ES" ? "Private Equity" : "Private Equity" },
    { value: "strategic", label: language === "PT" ? "Strategic Buyer" : language === "ES" ? "Comprador Estratégico" : "Strategic Buyer" },
  ];

  const dealStages = [
    { value: "pre-loi", label: language === "PT" ? "Pré-LOI" : language === "ES" ? "Pre-LOI" : "Pre-LOI" },
    { value: "post-loi", label: language === "PT" ? "Pós-LOI" : language === "ES" ? "Post-LOI" : "Post-LOI" },
    { value: "pre-closing", label: language === "PT" ? "Pré-Closing" : language === "ES" ? "Pre-Closing" : "Pre-Closing" },
  ];

  const annualRevenueRanges = [
    { value: "under-10m", label: language === "PT" ? "Abaixo de R$ 10M" : language === "ES" ? "Menos de $10M" : "Under $10M" },
    { value: "10m-50m", label: language === "PT" ? "R$ 10M - R$ 50M" : language === "ES" ? "$10M - $50M" : "$10M - $50M" },
    { value: "50m-100m", label: language === "PT" ? "R$ 50M - R$ 100M" : language === "ES" ? "$50M - $100M" : "$50M - $100M" },
    { value: "100m-500m", label: language === "PT" ? "R$ 100M - R$ 500M" : language === "ES" ? "$100M - $500M" : "$100M - $500M" },
    { value: "above-500m", label: language === "PT" ? "Acima de R$ 500M" : language === "ES" ? "Más de $500M" : "Above $500M" },
  ];

  const mainObjectives = [
    { value: "validate-predictability", label: t("duediligence.objective.validate") },
    { value: "reduce-risks", label: t("duediligence.objective.reduce") },
    { value: "accelerate-growth", label: t("duediligence.objective.accelerate") },
    { value: "integration", label: t("duediligence.objective.integration") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationResult = dueDiligenceFormSchema.safeParse(formData);
    
    if (!validationResult.success) {
      toast({
        title: t("contact.error.title") || "Erro de validação",
        description: validationResult.error.errors[0]?.message || "Por favor, verifique os campos",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('hubspot-duediligence', {
        body: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          role: formData.role,
          transactionType: formData.transactionType,
          dealStage: formData.dealStage,
          annualRevenue: formData.annualRevenue,
          mainObjective: formData.mainObjective,
          message: formData.message,
        },
      });

      if (error) {
        console.error('HubSpot integration error:', error);
      } else {
        console.log('HubSpot response:', data);
      }

      // Fallback email
      const emailTo = "leone@albatross.consulting";
      const subject = encodeURIComponent("Due Diligence Comercial para M&A - Albatross Consulting");
      const body = encodeURIComponent(
        `Serviço: Due Diligence Comercial para M&A\n\n` +
        `Nome: ${formData.name}\n` +
        `Empresa: ${formData.company}\n` +
        `Cargo: ${formData.role}\n` +
        `Email: ${formData.email}\n` +
        `Tipo de Transação: ${formData.transactionType}\n` +
        `Estágio do Deal: ${formData.dealStage}\n` +
        `Receita Anual: ${formData.annualRevenue}\n` +
        `Objetivo Principal: ${formData.mainObjective}\n\n` +
        `Mensagem:\n${formData.message || "Não informada"}`
      );

      window.open(`mailto:${emailTo}?subject=${subject}&body=${body}`, "_blank");

      toast({
        title: t("duediligence.success.title"),
        description: t("duediligence.success.description"),
      });

      setFormData({
        name: "",
        company: "",
        role: "",
        email: "",
        transactionType: "",
        dealStage: "",
        annualRevenue: "",
        mainObjective: "",
        message: "",
      });
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
    <Button className="gap-2">
      <Search className="w-4 h-4" />
      {t("duediligence.cta")}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">
            {t("duediligence.form.title")}
          </DialogTitle>
          <DialogDescription>{t("duediligence.form.description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dd-name">{t("contact.name")}</Label>
              <Input
                id="dd-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t("contact.name.placeholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dd-email">{t("contact.email")}</Label>
              <Input
                id="dd-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t("contact.email.placeholder")}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dd-company">{t("contact.company")}</Label>
              <Input
                id="dd-company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder={t("contact.company.placeholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dd-role">{t("duediligence.form.role")}</Label>
              <Input
                id="dd-role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder={t("duediligence.form.role.placeholder")}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("duediligence.form.transactionType")}</Label>
              <Select
                value={formData.transactionType}
                onValueChange={(value) => setFormData({ ...formData, transactionType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("duediligence.form.selectOption")} />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("duediligence.form.dealStage")}</Label>
              <Select
                value={formData.dealStage}
                onValueChange={(value) => setFormData({ ...formData, dealStage: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("duediligence.form.selectOption")} />
                </SelectTrigger>
                <SelectContent>
                  {dealStages.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("duediligence.form.annualRevenue")}</Label>
              <Select
                value={formData.annualRevenue}
                onValueChange={(value) => setFormData({ ...formData, annualRevenue: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("duediligence.form.selectOption")} />
                </SelectTrigger>
                <SelectContent>
                  {annualRevenueRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("duediligence.form.mainObjective")}</Label>
              <Select
                value={formData.mainObjective}
                onValueChange={(value) => setFormData({ ...formData, mainObjective: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("duediligence.form.selectOption")} />
                </SelectTrigger>
                <SelectContent>
                  {mainObjectives.map((objective) => (
                    <SelectItem key={objective.value} value={objective.value}>
                      {objective.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dd-message">{t("contact.message")} ({t("duediligence.form.optional")})</Label>
            <Textarea
              id="dd-message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={t("duediligence.form.message.placeholder")}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSubmitting ? t("contact.sending") : t("duediligence.form.submit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DueDiligenceModal;
