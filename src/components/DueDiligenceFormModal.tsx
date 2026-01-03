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

// Email validation regex - corporate email pattern
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone validation regex - international format
const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}([-\s\.]?[0-9]{1,9})*$/;

// Step 1 Schema with enhanced validation
const step1Schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string()
    .min(1, "Email é obrigatório")
    .regex(emailRegex, "Email inválido"),
  company: z.string().min(2, "Empresa é obrigatória").max(100),
  phone: z.string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), "Telefone inválido"),
  roleInTransaction: z.string().min(1, "Papel na transação é obrigatório"),
  roleOther: z.string().optional(),
  dealStatus: z.string().min(1, "Status do deal é obrigatório"),
  dealStatusOther: z.string().optional(),
});

// Step 2 Schema
const step2Schema = z.object({
  jobTitle: z.string().min(1, "Cargo é obrigatório"),
  jobTitleOther: z.string().optional(),
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    // Step 1
    name: "",
    email: "",
    company: "",
    phone: "",
    roleInTransaction: "",
    roleOther: "",
    dealStatus: "",
    dealStatusOther: "",
    // Step 2
    jobTitle: "",
    jobTitleOther: "",
    targetCompany: "",
    targetRevenue: "",
    objectives: [] as string[],
    availableData: [] as string[],
    concerns: "",
  });

  const roleOptions = [
    { value: "strategic_buyer", label: t("duediligence.role.strategicBuyer") },
    { value: "private_equity", label: t("duediligence.role.privateEquity") },
    { value: "seller_management", label: t("duediligence.role.sellerManagement") },
    { value: "advisor", label: t("duediligence.role.advisor") },
    { value: "other", label: t("duediligence.role.other") },
  ];

  const dealStatusOptions = [
    { value: "pre_loi", label: t("duediligence.status.preLoi") },
    { value: "post_loi", label: t("duediligence.status.postLoi") },
    { value: "exclusivity", label: t("duediligence.status.exclusivity") },
    { value: "pre_closing", label: t("duediligence.status.preClosing") },
    { value: "post_closing", label: t("duediligence.status.postClosing") },
    { value: "other", label: t("duediligence.status.other") },
  ];

  const jobTitleOptions = [
    { value: "partner", label: t("duediligence.title.partner") },
    { value: "ceo", label: t("duediligence.title.ceo") },
    { value: "cfo", label: t("duediligence.title.cfo") },
    { value: "cro_vp_sales", label: t("duediligence.title.croVpSales") },
    { value: "head_ma", label: t("duediligence.title.headMa") },
    { value: "other", label: t("duediligence.title.other") },
  ];

  const revenueOptions = [
    { value: "under_50m", label: t("duediligence.revenue.under50m") },
    { value: "50m_200m", label: t("duediligence.revenue.50m200m") },
    { value: "200m_500m", label: t("duediligence.revenue.200m500m") },
    { value: "above_500m", label: t("duediligence.revenue.above500m") },
    { value: "unknown", label: t("duediligence.revenue.unknown") },
  ];

  const objectiveOptions = [
    { value: "validate_icp", label: t("duediligence.obj.validateIcp") },
    { value: "evaluate_pricing", label: t("duediligence.obj.evaluatePricing") },
    { value: "validate_sales_motions", label: t("duediligence.obj.validateSalesMotions") },
    { value: "measure_pipeline", label: t("duediligence.obj.measurePipeline") },
    { value: "test_forecast", label: t("duediligence.obj.testForecast") },
    { value: "evaluate_sales_ops", label: t("duediligence.obj.evaluateSalesOps") },
  ];

  const availableDataOptions = [
    { value: "crm_export", label: t("duediligence.data.crmExport") },
    { value: "quotas", label: t("duediligence.data.quotas") },
    { value: "forecast_snapshots", label: t("duediligence.data.forecastSnapshots") },
    { value: "client_list", label: t("duediligence.data.clientList") },
    { value: "org_charts", label: t("duediligence.data.orgCharts") },
  ];

  const getErrorMessage = (key: string): string => {
    const messages: Record<string, Record<string, string>> = {
      PT: {
        emailInvalid: "Email corporativo inválido",
        emailRequired: "Email é obrigatório",
        phoneInvalid: "Telefone inválido. Use formato: +55 11 99999-9999",
        nameMin: "Nome deve ter pelo menos 2 caracteres",
        companyRequired: "Empresa é obrigatória",
        roleRequired: "Papel na transação é obrigatório",
        roleOtherRequired: "Especifique o papel na transação",
        dealStatusRequired: "Status do deal é obrigatório",
        dealStatusOtherRequired: "Especifique o status do deal",
        jobTitleRequired: "Cargo é obrigatório",
        jobTitleOtherRequired: "Especifique o cargo",
        targetCompanyRequired: "Setor e geografia são obrigatórios",
        revenueRequired: "Porte da empresa-alvo é obrigatório",
        objectivesRequired: "Selecione pelo menos um objetivo",
      },
      EN: {
        emailInvalid: "Invalid corporate email",
        emailRequired: "Email is required",
        phoneInvalid: "Invalid phone. Use format: +1 555 123-4567",
        nameMin: "Name must have at least 2 characters",
        companyRequired: "Company is required",
        roleRequired: "Role in transaction is required",
        roleOtherRequired: "Specify the role in transaction",
        dealStatusRequired: "Deal status is required",
        dealStatusOtherRequired: "Specify the deal status",
        jobTitleRequired: "Job title is required",
        jobTitleOtherRequired: "Specify the job title",
        targetCompanyRequired: "Sector and geography are required",
        revenueRequired: "Target company size is required",
        objectivesRequired: "Select at least one objective",
      },
      ES: {
        emailInvalid: "Email corporativo inválido",
        emailRequired: "Email es obligatorio",
        phoneInvalid: "Teléfono inválido. Use formato: +52 55 1234-5678",
        nameMin: "Nombre debe tener al menos 2 caracteres",
        companyRequired: "Empresa es obligatoria",
        roleRequired: "Rol en la transacción es obligatorio",
        roleOtherRequired: "Especifique el rol en la transacción",
        dealStatusRequired: "Estado del deal es obligatorio",
        dealStatusOtherRequired: "Especifique el estado del deal",
        jobTitleRequired: "Cargo es obligatorio",
        jobTitleOtherRequired: "Especifique el cargo",
        targetCompanyRequired: "Sector y geografía son obligatorios",
        revenueRequired: "Tamaño de la empresa objetivo es obligatorio",
        objectivesRequired: "Seleccione al menos un objetivo",
      },
    };
    return messages[language]?.[key] || messages.PT[key] || key;
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = getErrorMessage("nameMin");
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = getErrorMessage("emailRequired");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = getErrorMessage("emailInvalid");
    }

    // Company validation
    if (!formData.company || formData.company.length < 2) {
      newErrors.company = getErrorMessage("companyRequired");
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = getErrorMessage("phoneInvalid");
    }

    // Role validation
    if (!formData.roleInTransaction) {
      newErrors.roleInTransaction = getErrorMessage("roleRequired");
    } else if (formData.roleInTransaction === "other" && !formData.roleOther) {
      newErrors.roleOther = getErrorMessage("roleOtherRequired");
    }

    // Deal status validation
    if (!formData.dealStatus) {
      newErrors.dealStatus = getErrorMessage("dealStatusRequired");
    } else if (formData.dealStatus === "other" && !formData.dealStatusOther) {
      newErrors.dealStatusOther = getErrorMessage("dealStatusOtherRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Job title validation
    if (!formData.jobTitle) {
      newErrors.jobTitle = getErrorMessage("jobTitleRequired");
    } else if (formData.jobTitle === "other" && !formData.jobTitleOther) {
      newErrors.jobTitleOther = getErrorMessage("jobTitleOtherRequired");
    }

    // Target company validation
    if (!formData.targetCompany || formData.targetCompany.length < 2) {
      newErrors.targetCompany = getErrorMessage("targetCompanyRequired");
    }

    // Revenue validation
    if (!formData.targetRevenue) {
      newErrors.targetRevenue = getErrorMessage("revenueRequired");
    }

    // Objectives validation
    if (formData.objectives.length === 0) {
      newErrors.objectives = getErrorMessage("objectivesRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = () => {
    if (validateStep1()) {
      setStep(2);
    } else {
      toast({
        title: t("duediligence.required"),
        description: t("duediligence.fillRequired"),
        variant: "destructive",
      });
    }
  };

  const handleObjectiveToggle = (value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.includes(value)
        ? prev.objectives.filter(v => v !== value)
        : [...prev.objectives, value]
    }));
    // Clear objective error when selection changes
    if (errors.objectives) {
      setErrors(prev => ({ ...prev, objectives: "" }));
    }
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
    if (!validateStep2()) {
      toast({
        title: t("duediligence.required"),
        description: t("duediligence.fillRequired"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare final values with "other" fields
      const finalRole = formData.roleInTransaction === "other" 
        ? formData.roleOther 
        : formData.roleInTransaction;
      const finalDealStatus = formData.dealStatus === "other" 
        ? formData.dealStatusOther 
        : formData.dealStatus;
      const finalJobTitle = formData.jobTitle === "other" 
        ? formData.jobTitleOther 
        : formData.jobTitle;

      const { data, error } = await supabase.functions.invoke('hubspot-duediligence', {
        body: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          roleInTransaction: finalRole,
          dealStatus: finalDealStatus,
          jobTitle: finalJobTitle,
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
      roleOther: "",
      dealStatus: "",
      dealStatusOther: "",
      jobTitle: "",
      jobTitleOther: "",
      targetCompany: "",
      targetRevenue: "",
      objectives: [],
      availableData: [],
      concerns: "",
    });
    setErrors({});
    setStep(1);
    setIsCompleted(false);
    setOpen(false);
  };

  const getDisplayValue = (value: string, options: { value: string; label: string }[], otherValue?: string) => {
    if (value === "other" && otherValue) {
      return otherValue;
    }
    return options.find(o => o.value === value)?.label || value;
  };

  const getScopeSummary = () => {
    const objectives = formData.objectives.map(obj => {
      const option = objectiveOptions.find(o => o.value === obj);
      return option?.label || obj;
    });

    const role = getDisplayValue(formData.roleInTransaction, roleOptions, formData.roleOther);
    const status = getDisplayValue(formData.dealStatus, dealStatusOptions, formData.dealStatusOther);
    const revenue = getDisplayValue(formData.targetRevenue, revenueOptions);
    const jobTitle = getDisplayValue(formData.jobTitle, jobTitleOptions, formData.jobTitleOther);

    return `
RESUMO DO ESCOPO - Due Diligence Comercial

Solicitante: ${formData.name}
Empresa: ${formData.company}
Email: ${formData.email}
Cargo: ${jobTitle}
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
      title: t("duediligence.success.copied"),
      description: t("duediligence.success.copiedDesc"),
    });
  };

  const defaultTrigger = (
    <Button className="gap-2">
      <Search className="w-4 h-4" />
      {t("duediligence.cta")}
    </Button>
  );

  const specifyPlaceholder = language === "PT" ? "Especifique..." : language === "ES" ? "Especifique..." : "Specify...";

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
                {t("duediligence.modal.title")}
              </DialogTitle>
              <DialogDescription>
                {t("duediligence.modal.subtitle")}
              </DialogDescription>
            </DialogHeader>

            {/* Progress Bar */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t("duediligence.step")} {step} {t("duediligence.of")} 2</span>
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
                      {t("duediligence.fullName")} *
                    </Label>
                    <Input
                      id="dd-name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                      }}
                      placeholder="João Silva"
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dd-email">
                      {t("duediligence.corporateEmail")} *
                    </Label>
                    <Input
                      id="dd-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                      }}
                      placeholder="joao@empresa.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dd-company">
                      {t("duediligence.company")} *
                    </Label>
                    <Input
                      id="dd-company"
                      value={formData.company}
                      onChange={(e) => {
                        setFormData({ ...formData, company: e.target.value });
                        if (errors.company) setErrors(prev => ({ ...prev, company: "" }));
                      }}
                      placeholder={t("duediligence.companyPlaceholder")}
                      className={errors.company ? "border-destructive" : ""}
                    />
                    {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dd-phone">
                      {t("duediligence.phone")} 
                      <span className="text-muted-foreground text-xs ml-1">({t("duediligence.optional")})</span>
                    </Label>
                    <Input
                      id="dd-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
                      }}
                      placeholder="+55 11 99999-9999"
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("duediligence.roleInTransaction")} *</Label>
                    <Select
                      value={formData.roleInTransaction}
                      onValueChange={(value) => {
                        setFormData({ ...formData, roleInTransaction: value, roleOther: "" });
                        if (errors.roleInTransaction) setErrors(prev => ({ ...prev, roleInTransaction: "" }));
                      }}
                    >
                      <SelectTrigger className={errors.roleInTransaction ? "border-destructive" : ""}>
                        <SelectValue placeholder={t("duediligence.select")} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.roleInTransaction && <p className="text-xs text-destructive">{errors.roleInTransaction}</p>}
                    
                    {/* Show input when "other" is selected */}
                    {formData.roleInTransaction === "other" && (
                      <div className="mt-2">
                        <Input
                          value={formData.roleOther}
                          onChange={(e) => {
                            setFormData({ ...formData, roleOther: e.target.value });
                            if (errors.roleOther) setErrors(prev => ({ ...prev, roleOther: "" }));
                          }}
                          placeholder={specifyPlaceholder}
                          className={errors.roleOther ? "border-destructive" : ""}
                        />
                        {errors.roleOther && <p className="text-xs text-destructive">{errors.roleOther}</p>}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>{t("duediligence.dealStatus")} *</Label>
                    <Select
                      value={formData.dealStatus}
                      onValueChange={(value) => {
                        setFormData({ ...formData, dealStatus: value, dealStatusOther: "" });
                        if (errors.dealStatus) setErrors(prev => ({ ...prev, dealStatus: "" }));
                      }}
                    >
                      <SelectTrigger className={errors.dealStatus ? "border-destructive" : ""}>
                        <SelectValue placeholder={t("duediligence.select")} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {dealStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.dealStatus && <p className="text-xs text-destructive">{errors.dealStatus}</p>}
                    
                    {/* Show input when "other" is selected */}
                    {formData.dealStatus === "other" && (
                      <div className="mt-2">
                        <Input
                          value={formData.dealStatusOther}
                          onChange={(e) => {
                            setFormData({ ...formData, dealStatusOther: e.target.value });
                            if (errors.dealStatusOther) setErrors(prev => ({ ...prev, dealStatusOther: "" }));
                          }}
                          placeholder={specifyPlaceholder}
                          className={errors.dealStatusOther ? "border-destructive" : ""}
                        />
                        {errors.dealStatusOther && <p className="text-xs text-destructive">{errors.dealStatusOther}</p>}
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  type="button" 
                  className="w-full gap-2 mt-4" 
                  onClick={handleStep1Submit}
                >
                  {t("duediligence.continue")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              /* Step 2 */
              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("duediligence.jobTitle")} *</Label>
                    <Select
                      value={formData.jobTitle}
                      onValueChange={(value) => {
                        setFormData({ ...formData, jobTitle: value, jobTitleOther: "" });
                        if (errors.jobTitle) setErrors(prev => ({ ...prev, jobTitle: "" }));
                      }}
                    >
                      <SelectTrigger className={errors.jobTitle ? "border-destructive" : ""}>
                        <SelectValue placeholder={t("duediligence.select")} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {jobTitleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.jobTitle && <p className="text-xs text-destructive">{errors.jobTitle}</p>}
                    
                    {/* Show input when "other" is selected */}
                    {formData.jobTitle === "other" && (
                      <div className="mt-2">
                        <Input
                          value={formData.jobTitleOther}
                          onChange={(e) => {
                            setFormData({ ...formData, jobTitleOther: e.target.value });
                            if (errors.jobTitleOther) setErrors(prev => ({ ...prev, jobTitleOther: "" }));
                          }}
                          placeholder={specifyPlaceholder}
                          className={errors.jobTitleOther ? "border-destructive" : ""}
                        />
                        {errors.jobTitleOther && <p className="text-xs text-destructive">{errors.jobTitleOther}</p>}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>{t("duediligence.targetCompanySize")} *</Label>
                    <Select
                      value={formData.targetRevenue}
                      onValueChange={(value) => {
                        setFormData({ ...formData, targetRevenue: value });
                        if (errors.targetRevenue) setErrors(prev => ({ ...prev, targetRevenue: "" }));
                      }}
                    >
                      <SelectTrigger className={errors.targetRevenue ? "border-destructive" : ""}>
                        <SelectValue placeholder={t("duediligence.select")} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {revenueOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.targetRevenue && <p className="text-xs text-destructive">{errors.targetRevenue}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dd-target">
                    {t("duediligence.targetCompanySector")} *
                  </Label>
                  <Input
                    id="dd-target"
                    value={formData.targetCompany}
                    onChange={(e) => {
                      setFormData({ ...formData, targetCompany: e.target.value });
                      if (errors.targetCompany) setErrors(prev => ({ ...prev, targetCompany: "" }));
                    }}
                    placeholder={t("duediligence.targetCompanyPlaceholder")}
                    className={errors.targetCompany ? "border-destructive" : ""}
                  />
                  {errors.targetCompany && <p className="text-xs text-destructive">{errors.targetCompany}</p>}
                </div>

                <div className="space-y-3">
                  <Label className={errors.objectives ? "text-destructive" : ""}>
                    {t("duediligence.objectives.title")} *
                    <span className="text-muted-foreground text-xs ml-1">({t("duediligence.objectives.selectMultiple")})</span>
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
                  {errors.objectives && <p className="text-xs text-destructive">{errors.objectives}</p>}
                </div>

                <div className="space-y-3">
                  <Label>
                    {t("duediligence.availableData.title")}
                    <span className="text-muted-foreground text-xs ml-1">({t("duediligence.optional")})</span>
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
                    {t("duediligence.concerns")}
                    <span className="text-muted-foreground text-xs ml-1">({t("duediligence.optional")})</span>
                  </Label>
                  <Textarea
                    id="dd-concerns"
                    value={formData.concerns}
                    onChange={(e) => setFormData({ ...formData, concerns: e.target.value })}
                    placeholder={t("duediligence.concernsPlaceholder")}
                    rows={3}
                  />
                </div>

                {/* LGPD Notice */}
                <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {t("duediligence.lgpd")}
                </p>

                <div className="flex gap-3 mt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="gap-2" 
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t("duediligence.back")}
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
                    {isSubmitting ? t("duediligence.sending") : t("duediligence.submit")}
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
                {t("duediligence.success.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("duediligence.success.contact")}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">
                  {t("duediligence.success.scopeSummary")}
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
                {t("duediligence.success.copySummary")}
              </Button>
            </div>

            <div className="pt-2">
              <h4 className="font-medium text-sm mb-2">
                {t("duediligence.success.nextSteps")}
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. {t("duediligence.success.step1")}</li>
                <li>2. {t("duediligence.success.step2")}</li>
                <li>3. {t("duediligence.success.step3")}</li>
              </ul>
            </div>

            <Button onClick={resetForm} className="w-full">
              {t("duediligence.success.close")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DueDiligenceFormModal;
