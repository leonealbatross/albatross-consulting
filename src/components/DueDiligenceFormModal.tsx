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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, Loader2, Search, CheckCircle2, Copy, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface DueDiligenceFormModalProps {
  trigger?: React.ReactNode;
}

// Step 1 Schema
const step1Schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().email("Email corporativo inválido").max(255),
  company: z.string().min(2, "Empresa é obrigatória").max(100),
  roleInTransaction: z.string().min(1, "Papel na transação é obrigatório"),
  dealStatus: z.string().min(1, "Status do deal é obrigatório"),
});

// Step 2 Schema
const step2Schema = z.object({
  jobTitle: z.string().min(1, "Cargo é obrigatório"),
  targetCompany: z.string().min(2, "Setor e geografia são obrigatórios").max(200),
  targetRevenue: z.string().min(1, "Porte da empresa-alvo é obrigatório"),
  objectives: z.array(z.string()).min(1, "Selecione pelo menos um objetivo"),
  availableData: z.array(z.string()).optional(),
  concerns: z.string().max(1000).optional(),
});

const DueDiligenceFormModal = ({ trigger }: DueDiligenceFormModalProps) => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1
    name: "",
    email: "",
    company: "",
    phone: "",
    roleInTransaction: "",
    dealStatus: "",
    // Step 2
    jobTitle: "",
    targetCompany: "",
    targetRevenue: "",
    objectives: [] as string[],
    availableData: [] as string[],
    concerns: "",
  });

  const roleOptions = [
    { value: "strategic_buyer", label: language === "PT" ? "Comprador estratégico" : language === "ES" ? "Comprador estratégico" : "Strategic Buyer" },
    { value: "private_equity", label: "Private Equity" },
    { value: "seller_management", label: language === "PT" ? "Vendedor/Management" : language === "ES" ? "Vendedor/Management" : "Seller/Management" },
    { value: "advisor", label: language === "PT" ? "Advisor (IB/M&A)" : language === "ES" ? "Asesor (IB/M&A)" : "Advisor (IB/M&A)" },
    { value: "other", label: language === "PT" ? "Outro" : language === "ES" ? "Otro" : "Other" },
  ];

  const dealStatusOptions = [
    { value: "pre_loi", label: "Pré-LOI" },
    { value: "post_loi", label: "Pós-LOI" },
    { value: "exclusivity", label: language === "PT" ? "Exclusividade" : language === "ES" ? "Exclusividad" : "Exclusivity" },
    { value: "pre_closing", label: "Pré-closing" },
    { value: "post_closing", label: language === "PT" ? "Pós-closing (plano 100 dias)" : language === "ES" ? "Post-closing (plan 100 días)" : "Post-closing (100-day plan)" },
    { value: "other", label: language === "PT" ? "Outro" : language === "ES" ? "Otro" : "Other" },
  ];

  const jobTitleOptions = [
    { value: "partner", label: language === "PT" ? "Sócio/Partner" : language === "ES" ? "Socio/Partner" : "Partner" },
    { value: "ceo", label: "CEO" },
    { value: "cfo", label: "CFO" },
    { value: "cro_vp_sales", label: "CRO/VP Sales" },
    { value: "head_ma", label: language === "PT" ? "Head de M&A/Corp Dev" : language === "ES" ? "Head de M&A/Corp Dev" : "Head of M&A/Corp Dev" },
    { value: "other", label: language === "PT" ? "Outro" : language === "ES" ? "Otro" : "Other" },
  ];

  const revenueOptions = [
    { value: "under_50m", label: language === "PT" ? "Receita anual <R$50M" : language === "ES" ? "Ingresos anuales <$50M" : "Annual revenue <$50M" },
    { value: "50m_200m", label: language === "PT" ? "R$50–200M" : language === "ES" ? "$50–200M" : "$50–200M" },
    { value: "200m_500m", label: language === "PT" ? "R$200–500M" : language === "ES" ? "$200–500M" : "$200–500M" },
    { value: "above_500m", label: language === "PT" ? ">R$500M" : language === "ES" ? ">$500M" : ">$500M" },
    { value: "unknown", label: language === "PT" ? "Não sei informar" : language === "ES" ? "No sé informar" : "Don't know" },
  ];

  const objectiveOptions = [
    { 
      value: "validate_icp", 
      label: language === "PT" ? "Validar ICP/segmentação e proposta de valor" : 
             language === "ES" ? "Validar ICP/segmentación y propuesta de valor" : 
             "Validate ICP/segmentation and value proposition" 
    },
    { 
      value: "evaluate_pricing", 
      label: language === "PT" ? "Avaliar pricing/discounting e margem" : 
             language === "ES" ? "Evaluar pricing/descuentos y margen" : 
             "Evaluate pricing/discounting and margin" 
    },
    { 
      value: "validate_sales_motions", 
      label: language === "PT" ? "Validar sales motions (SMB/Mid, B2C, Enterprise/KAM, Green Field, SDR)" : 
             language === "ES" ? "Validar sales motions (SMB/Mid, B2C, Enterprise/KAM, Green Field, SDR)" : 
             "Validate sales motions (SMB/Mid, B2C, Enterprise/KAM, Green Field, SDR)" 
    },
    { 
      value: "measure_pipeline", 
      label: language === "PT" ? "Medir saúde de pipeline (Rolling Four Quarters)" : 
             language === "ES" ? "Medir salud del pipeline (Rolling Four Quarters)" : 
             "Measure pipeline health (Rolling Four Quarters)" 
    },
    { 
      value: "test_forecast", 
      label: language === "PT" ? "Testar previsibilidade de forecast (3 anos)" : 
             language === "ES" ? "Probar previsibilidad de forecast (3 años)" : 
             "Test forecast predictability (3 years)" 
    },
    { 
      value: "evaluate_sales_ops", 
      label: language === "PT" ? "Avaliar Sales Operations (CRM, métricas, enablement, incentivos)" : 
             language === "ES" ? "Evaluar Sales Operations (CRM, métricas, enablement, incentivos)" : 
             "Evaluate Sales Operations (CRM, metrics, enablement, incentives)" 
    },
  ];

  const availableDataOptions = [
    { 
      value: "crm_export", 
      label: language === "PT" ? "Export do CRM com histórico" : 
             language === "ES" ? "Exportación del CRM con histórico" : 
             "CRM export with history" 
    },
    { 
      value: "quotas", 
      label: language === "PT" ? "Metas/quotas (12 trimestres)" : 
             language === "ES" ? "Metas/cuotas (12 trimestres)" : 
             "Goals/quotas (12 quarters)" 
    },
    { 
      value: "forecast_snapshots", 
      label: language === "PT" ? "Snapshots de forecast (semanal/mensal)" : 
             language === "ES" ? "Snapshots de forecast (semanal/mensual)" : 
             "Forecast snapshots (weekly/monthly)" 
    },
    { 
      value: "client_list", 
      label: language === "PT" ? "Lista de clientes/contratos/renovações" : 
             language === "ES" ? "Lista de clientes/contratos/renovaciones" : 
             "Client/contract/renewal list" 
    },
    { 
      value: "org_charts", 
      label: language === "PT" ? "Org charts e comp plan" : 
             language === "ES" ? "Org charts y comp plan" : 
             "Org charts and comp plan" 
    },
  ];

  const handleStep1Submit = () => {
    const result = step1Schema.safeParse({
      name: formData.name,
      email: formData.email,
      company: formData.company,
      roleInTransaction: formData.roleInTransaction,
      dealStatus: formData.dealStatus,
    });

    if (!result.success) {
      toast({
        title: language === "PT" ? "Campos obrigatórios" : language === "ES" ? "Campos obligatorios" : "Required fields",
        description: result.error.errors[0]?.message || "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setStep(2);
  };

  const handleObjectiveToggle = (value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.includes(value)
        ? prev.objectives.filter(v => v !== value)
        : [...prev.objectives, value]
    }));
  };

  const handleDataToggle = (value: string) => {
    setFormData(prev => ({
      ...prev,
      availableData: prev.availableData.includes(value)
        ? prev.availableData.filter(v => v !== value)
        : [...prev.availableData, value]
    }));
  };

  const handleSubmit = async () => {
    const result = step2Schema.safeParse({
      jobTitle: formData.jobTitle,
      targetCompany: formData.targetCompany,
      targetRevenue: formData.targetRevenue,
      objectives: formData.objectives,
      availableData: formData.availableData,
      concerns: formData.concerns,
    });

    if (!result.success) {
      toast({
        title: language === "PT" ? "Campos obrigatórios" : language === "ES" ? "Campos obligatorios" : "Required fields",
        description: result.error.errors[0]?.message || "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('hubspot-duediligence', {
        body: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          roleInTransaction: formData.roleInTransaction,
          dealStatus: formData.dealStatus,
          jobTitle: formData.jobTitle,
          targetCompany: formData.targetCompany,
          targetRevenue: formData.targetRevenue,
          objectives: formData.objectives,
          availableData: formData.availableData,
          concerns: formData.concerns,
          service: "Commercial Due Diligence (M&A)",
          source: "Website / Solicitar avaliação",
        },
      });

      if (error) {
        console.error('HubSpot integration error:', error);
      } else {
        console.log('HubSpot response:', data);
      }

      setIsCompleted(true);
      
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

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      roleInTransaction: "",
      dealStatus: "",
      jobTitle: "",
      targetCompany: "",
      targetRevenue: "",
      objectives: [],
      availableData: [],
      concerns: "",
    });
    setStep(1);
    setIsCompleted(false);
    setOpen(false);
  };

  const getScopeSummary = () => {
    const objectives = formData.objectives.map(obj => {
      const option = objectiveOptions.find(o => o.value === obj);
      return option?.label || obj;
    });

    const role = roleOptions.find(r => r.value === formData.roleInTransaction)?.label || formData.roleInTransaction;
    const status = dealStatusOptions.find(s => s.value === formData.dealStatus)?.label || formData.dealStatus;
    const revenue = revenueOptions.find(r => r.value === formData.targetRevenue)?.label || formData.targetRevenue;

    return `
RESUMO DO ESCOPO - Due Diligence Comercial

Solicitante: ${formData.name}
Empresa: ${formData.company}
Email: ${formData.email}
Papel na transação: ${role}
Status do deal: ${status}

Empresa-alvo: ${formData.targetCompany}
Porte: ${revenue}

Objetivos principais:
${objectives.map(o => `• ${o}`).join('\n')}

${formData.concerns ? `Riscos/hipóteses de preocupação:\n${formData.concerns}` : ''}
    `.trim();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getScopeSummary());
    toast({
      title: language === "PT" ? "Copiado!" : language === "ES" ? "¡Copiado!" : "Copied!",
      description: language === "PT" ? "Resumo copiado para a área de transferência" : 
                   language === "ES" ? "Resumen copiado al portapapeles" : 
                   "Summary copied to clipboard",
    });
  };

  const defaultTrigger = (
    <Button className="gap-2">
      <Search className="w-4 h-4" />
      {language === "PT" ? "Solicitar avaliação" : language === "ES" ? "Solicitar evaluación" : "Request assessment"}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      setOpen(newOpen);
    }}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        {!isCompleted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-heading">
                {language === "PT" ? "Solicitar avaliação — Due Diligence Comercial para M&A" : 
                 language === "ES" ? "Solicitar evaluación — Due Diligence Comercial para M&A" : 
                 "Request assessment — Commercial Due Diligence for M&A"}
              </DialogTitle>
              <DialogDescription>
                {language === "PT" ? "Responda em 2 minutos para recomendarmos a melhor abordagem." : 
                 language === "ES" ? "Responda en 2 minutos para recomendar el mejor enfoque." : 
                 "Answer in 2 minutes so we can recommend the best approach."}
              </DialogDescription>
            </DialogHeader>

            {/* Progress Bar */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{language === "PT" ? "Etapa" : language === "ES" ? "Paso" : "Step"} {step} {language === "PT" ? "de" : language === "ES" ? "de" : "of"} 2</span>
                <span>{step === 1 ? "50%" : "100%"}</span>
              </div>
              <Progress value={step === 1 ? 50 : 100} className="h-2" />
            </div>

            {step === 1 ? (
              /* Step 1 */
              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dd-name">
                      {language === "PT" ? "Nome completo" : language === "ES" ? "Nombre completo" : "Full name"} *
                    </Label>
                    <Input
                      id="dd-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="João Silva"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dd-email">
                      {language === "PT" ? "Email corporativo" : language === "ES" ? "Email corporativo" : "Corporate email"} *
                    </Label>
                    <Input
                      id="dd-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="joao@empresa.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dd-company">
                      {language === "PT" ? "Empresa" : language === "ES" ? "Empresa" : "Company"} *
                    </Label>
                    <Input
                      id="dd-company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={language === "PT" ? "Nome da sua empresa" : language === "ES" ? "Nombre de su empresa" : "Your company name"}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dd-phone">
                      {language === "PT" ? "Telefone/WhatsApp" : language === "ES" ? "Teléfono/WhatsApp" : "Phone/WhatsApp"} 
                      <span className="text-muted-foreground text-xs ml-1">({language === "PT" ? "opcional" : language === "ES" ? "opcional" : "optional"})</span>
                    </Label>
                    <Input
                      id="dd-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+55 11 99999-9999"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === "PT" ? "Papel na transação" : language === "ES" ? "Rol en la transacción" : "Role in transaction"} *</Label>
                    <Select
                      value={formData.roleInTransaction}
                      onValueChange={(value) => setFormData({ ...formData, roleInTransaction: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === "PT" ? "Selecione..." : language === "ES" ? "Seleccione..." : "Select..."} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{language === "PT" ? "Status e janela do deal" : language === "ES" ? "Estado y ventana del deal" : "Deal status and window"} *</Label>
                    <Select
                      value={formData.dealStatus}
                      onValueChange={(value) => setFormData({ ...formData, dealStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === "PT" ? "Selecione..." : language === "ES" ? "Seleccione..." : "Select..."} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {dealStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="button" 
                  className="w-full gap-2 mt-4" 
                  onClick={handleStep1Submit}
                >
                  {language === "PT" ? "Continuar" : language === "ES" ? "Continuar" : "Continue"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              /* Step 2 */
              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === "PT" ? "Cargo" : language === "ES" ? "Cargo" : "Job Title"} *</Label>
                    <Select
                      value={formData.jobTitle}
                      onValueChange={(value) => setFormData({ ...formData, jobTitle: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === "PT" ? "Selecione..." : language === "ES" ? "Seleccione..." : "Select..."} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {jobTitleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{language === "PT" ? "Porte da empresa-alvo" : language === "ES" ? "Tamaño de la empresa objetivo" : "Target company size"} *</Label>
                    <Select
                      value={formData.targetRevenue}
                      onValueChange={(value) => setFormData({ ...formData, targetRevenue: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === "PT" ? "Selecione..." : language === "ES" ? "Seleccione..." : "Select..."} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {revenueOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dd-target">
                    {language === "PT" ? "Empresa-alvo: setor e geografia principal" : 
                     language === "ES" ? "Empresa objetivo: sector y geografía principal" : 
                     "Target company: sector and main geography"} *
                  </Label>
                  <Input
                    id="dd-target"
                    value={formData.targetCompany}
                    onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                    placeholder={language === "PT" ? "Ex.: SaaS B2B – Brasil/LatAm" : 
                                 language === "ES" ? "Ej.: SaaS B2B – Brasil/LatAm" : 
                                 "E.g.: B2B SaaS – Brazil/LatAm"}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>
                    {language === "PT" ? "Objetivo principal do Due Diligence Comercial" : 
                     language === "ES" ? "Objetivo principal del Due Diligence Comercial" : 
                     "Main Commercial Due Diligence objectives"} *
                    <span className="text-muted-foreground text-xs ml-1">({language === "PT" ? "selecione um ou mais" : language === "ES" ? "seleccione uno o más" : "select one or more"})</span>
                  </Label>
                  <div className="grid gap-2">
                    {objectiveOptions.map((option) => (
                      <div key={option.value} className="flex items-start space-x-2">
                        <Checkbox
                          id={`obj-${option.value}`}
                          checked={formData.objectives.includes(option.value)}
                          onCheckedChange={() => handleObjectiveToggle(option.value)}
                          className="mt-0.5"
                        />
                        <label
                          htmlFor={`obj-${option.value}`}
                          className="text-sm leading-tight cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>
                    {language === "PT" ? "Quais dados vocês conseguem disponibilizar em até 5 dias úteis?" : 
                     language === "ES" ? "¿Qué datos pueden proporcionar en hasta 5 días hábiles?" : 
                     "What data can you provide within 5 business days?"}
                    <span className="text-muted-foreground text-xs ml-1">({language === "PT" ? "opcional" : language === "ES" ? "opcional" : "optional"})</span>
                  </Label>
                  <div className="grid gap-2">
                    {availableDataOptions.map((option) => (
                      <div key={option.value} className="flex items-start space-x-2">
                        <Checkbox
                          id={`data-${option.value}`}
                          checked={formData.availableData.includes(option.value)}
                          onCheckedChange={() => handleDataToggle(option.value)}
                          className="mt-0.5"
                        />
                        <label
                          htmlFor={`data-${option.value}`}
                          className="text-sm leading-tight cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dd-concerns">
                    {language === "PT" ? "Riscos/hipóteses que mais preocupam o comitê" : 
                     language === "ES" ? "Riesgos/hipótesis que más preocupan al comité" : 
                     "Risks/hypotheses that concern the committee most"}
                    <span className="text-muted-foreground text-xs ml-1">({language === "PT" ? "opcional" : language === "ES" ? "opcional" : "optional"})</span>
                  </Label>
                  <Textarea
                    id="dd-concerns"
                    value={formData.concerns}
                    onChange={(e) => setFormData({ ...formData, concerns: e.target.value })}
                    placeholder={language === "PT" ? "Ex.: Concentração de receita, dependência de poucos clientes, turnover alto em vendas..." : 
                                 language === "ES" ? "Ej.: Concentración de ingresos, dependencia de pocos clientes, alta rotación en ventas..." : 
                                 "E.g.: Revenue concentration, dependency on few clients, high sales turnover..."}
                    rows={3}
                  />
                </div>

                {/* LGPD Notice */}
                <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {language === "PT" ? "Ao enviar, você concorda em ser contatado pela Albatross Consulting para tratar da sua solicitação, conforme nossa política de privacidade." : 
                   language === "ES" ? "Al enviar, acepta ser contactado por Albatross Consulting para gestionar su solicitud, según nuestra política de privacidad." : 
                   "By submitting, you agree to be contacted by Albatross Consulting regarding your request, in accordance with our privacy policy."}
                </p>

                <div className="flex gap-3 mt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="gap-2" 
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {language === "PT" ? "Voltar" : language === "ES" ? "Volver" : "Back"}
                  </Button>
                  <Button 
                    type="button" 
                    className="flex-1 gap-2" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    {isSubmitting 
                      ? (language === "PT" ? "Enviando..." : language === "ES" ? "Enviando..." : "Sending...") 
                      : (language === "PT" ? "Solicitar avaliação" : language === "ES" ? "Solicitar evaluación" : "Request assessment")}
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Success State */
          <div className="py-6 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                {language === "PT" ? "Solicitação enviada com sucesso!" : 
                 language === "ES" ? "¡Solicitud enviada con éxito!" : 
                 "Request submitted successfully!"}
              </h3>
              <p className="text-muted-foreground">
                {language === "PT" ? "Nossa equipe entrará em contato em até 1 dia útil." : 
                 language === "ES" ? "Nuestro equipo se pondrá en contacto en hasta 1 día hábil." : 
                 "Our team will contact you within 1 business day."}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">
                  {language === "PT" ? "Resumo do escopo" : 
                   language === "ES" ? "Resumen del alcance" : 
                   "Scope summary"}
                </span>
              </div>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                {getScopeSummary()}
              </pre>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 gap-2"
                onClick={copyToClipboard}
              >
                <Copy className="w-3 h-3" />
                {language === "PT" ? "Copiar resumo" : 
                 language === "ES" ? "Copiar resumen" : 
                 "Copy summary"}
              </Button>
            </div>

            <div className="pt-2">
              <h4 className="font-medium text-sm mb-2">
                {language === "PT" ? "Próximos passos:" : 
                 language === "ES" ? "Próximos pasos:" : 
                 "Next steps:"}
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. {language === "PT" ? "Análise do seu perfil e escopo" : 
                       language === "ES" ? "Análisis de su perfil y alcance" : 
                       "Analysis of your profile and scope"}</li>
                <li>2. {language === "PT" ? "Contato para alinhar expectativas e timing" : 
                       language === "ES" ? "Contacto para alinear expectativas y timing" : 
                       "Contact to align expectations and timing"}</li>
                <li>3. {language === "PT" ? "Proposta customizada de Due Diligence Comercial" : 
                       language === "ES" ? "Propuesta personalizada de Due Diligence Comercial" : 
                       "Customized Commercial Due Diligence proposal"}</li>
              </ul>
            </div>

            <Button onClick={resetForm} className="w-full">
              {language === "PT" ? "Fechar" : language === "ES" ? "Cerrar" : "Close"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DueDiligenceFormModal;
