import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AnimatedInput } from "@/components/ui/animated-input";
import { AnimatedTextarea } from "@/components/ui/animated-textarea";
import { AnimatedSelect } from "@/components/ui/animated-select";
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

// Animation variants
const slideVariants = {
  enterFromRight: {
    x: 50,
    opacity: 0,
  },
  enterFromLeft: {
    x: -50,
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exitToLeft: {
    x: -50,
    opacity: 0,
  },
  exitToRight: {
    x: 50,
    opacity: 0,
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

interface DueDiligenceFormModalProps {
  trigger?: React.ReactNode;
}

// Personal email domains to block
const personalEmailDomains = [
  "gmail.com", "gmail.com.br", "googlemail.com",
  "outlook.com", "outlook.com.br", "hotmail.com", "hotmail.com.br",
  "yahoo.com", "yahoo.com.br", "ymail.com",
  "icloud.com", "me.com", "mac.com",
  "live.com", "live.com.br", "msn.com",
  "aol.com", "protonmail.com", "zoho.com",
  "mail.com", "gmx.com", "inbox.com"
];

// Email validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// CNPJ validation function
const validateCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return false;
  
  // Check for known invalid CNPJs
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  // Validate check digits
  let size = cleaned.length - 2;
  let numbers = cleaned.substring(0, size);
  const digits = cleaned.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  size = size + 1;
  numbers = cleaned.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(digits.charAt(1));
};

// Format CNPJ with mask
const formatCNPJ = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').slice(0, 14);
  return cleaned
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

// Country dial codes mapping
const countryDialCodes: Record<string, { code: string; length: number; format: (v: string) => string }> = {
  BR: { 
    code: "55", 
    length: 11, 
    format: (v: string) => {
      const cleaned = v.slice(0, 11);
      if (cleaned.length <= 2) return cleaned;
      if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
  },
  MX: { 
    code: "52", 
    length: 10, 
    format: (v: string) => {
      const cleaned = v.slice(0, 10);
      if (cleaned.length <= 2) return cleaned;
      if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
  },
  AR: { 
    code: "54", 
    length: 10, 
    format: (v: string) => {
      const cleaned = v.slice(0, 10);
      if (cleaned.length <= 2) return cleaned;
      if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
  },
  CO: { 
    code: "57", 
    length: 10, 
    format: (v: string) => {
      const cleaned = v.slice(0, 10);
      if (cleaned.length <= 3) return cleaned;
      if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
  },
  CL: { 
    code: "56", 
    length: 9, 
    format: (v: string) => {
      const cleaned = v.slice(0, 9);
      if (cleaned.length <= 1) return cleaned;
      if (cleaned.length <= 5) return `${cleaned.slice(0, 1)} ${cleaned.slice(1)}`;
      return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 5)} ${cleaned.slice(5)}`;
    }
  },
  PE: { code: "51", length: 9, format: (v: string) => v.slice(0, 9) },
  EC: { code: "593", length: 9, format: (v: string) => v.slice(0, 9) },
  UY: { code: "598", length: 8, format: (v: string) => v.slice(0, 8) },
  PY: { code: "595", length: 9, format: (v: string) => v.slice(0, 9) },
  BO: { code: "591", length: 8, format: (v: string) => v.slice(0, 8) },
  VE: { code: "58", length: 10, format: (v: string) => v.slice(0, 10) },
  CR: { code: "506", length: 8, format: (v: string) => v.slice(0, 8) },
  PA: { code: "507", length: 8, format: (v: string) => v.slice(0, 8) },
  OTHER: { code: "", length: 15, format: (v: string) => v.slice(0, 15) },
};

// Detect country from dial code
const detectCountryFromDialCode = (phoneNumber: string): string | null => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check for 3-digit codes first (more specific)
  const threeDigitCodes = ['593', '598', '595', '591', '506', '507'];
  for (const code of threeDigitCodes) {
    if (cleaned.startsWith(code)) {
      const country = Object.entries(countryDialCodes).find(([_, data]) => data.code === code);
      return country ? country[0] : null;
    }
  }
  
  // Check for 2-digit codes
  const twoDigitCodes = ['55', '52', '54', '57', '56', '51', '58'];
  for (const code of twoDigitCodes) {
    if (cleaned.startsWith(code)) {
      const country = Object.entries(countryDialCodes).find(([_, data]) => data.code === code);
      return country ? country[0] : null;
    }
  }
  
  return null;
};

// Format phone with country-specific mask
const formatPhoneWithCountry = (value: string, countryCode: string): string => {
  const countryData = countryDialCodes[countryCode] || countryDialCodes.OTHER;
  const dialCode = countryData.code;
  
  // If value starts with +, handle the full international format
  if (value.startsWith('+')) {
    const cleaned = value.replace(/\D/g, '');
    
    // Check if dial code matches
    if (dialCode && cleaned.startsWith(dialCode)) {
      const localNumber = cleaned.slice(dialCode.length);
      const formatted = countryData.format(localNumber);
      return `+${dialCode} ${formatted}`;
    }
    
    // Return with + and cleaned number
    return '+' + cleaned.slice(0, 15);
  }
  
  // If no +, add dial code prefix and format
  const cleaned = value.replace(/\D/g, '');
  const formatted = countryData.format(cleaned);
  
  if (dialCode) {
    return `+${dialCode} ${formatted}`;
  }
  
  return formatted;
};

// Get phone placeholder based on country
const getPhonePlaceholder = (countryCode: string): string => {
  const placeholders: Record<string, string> = {
    BR: "+55 (11) 99999-9999",
    MX: "+52 (55) 1234-5678",
    AR: "+54 (11) 1234-5678",
    CO: "+57 300 123 4567",
    CL: "+56 9 1234 5678",
    PE: "+51 999 999 999",
    EC: "+593 99 999 9999",
    UY: "+598 99 999 999",
    PY: "+595 99 999 999",
    BO: "+591 7 999 9999",
    VE: "+58 412 123 4567",
    CR: "+506 8888 8888",
    PA: "+507 6666 6666",
    OTHER: "+1 555 123 4567",
  };
  return placeholders[countryCode] || placeholders.OTHER;
};

// LatAm countries with dial codes for display
const latamCountries = [
  { value: "BR", label: { PT: "Brasil", EN: "Brazil", ES: "Brasil" }, dialCode: "+55" },
  { value: "MX", label: { PT: "México", EN: "Mexico", ES: "México" }, dialCode: "+52" },
  { value: "AR", label: { PT: "Argentina", EN: "Argentina", ES: "Argentina" }, dialCode: "+54" },
  { value: "CO", label: { PT: "Colômbia", EN: "Colombia", ES: "Colombia" }, dialCode: "+57" },
  { value: "CL", label: { PT: "Chile", EN: "Chile", ES: "Chile" }, dialCode: "+56" },
  { value: "PE", label: { PT: "Peru", EN: "Peru", ES: "Perú" }, dialCode: "+51" },
  { value: "EC", label: { PT: "Equador", EN: "Ecuador", ES: "Ecuador" }, dialCode: "+593" },
  { value: "UY", label: { PT: "Uruguai", EN: "Uruguay", ES: "Uruguay" }, dialCode: "+598" },
  { value: "PY", label: { PT: "Paraguai", EN: "Paraguay", ES: "Paraguay" }, dialCode: "+595" },
  { value: "BO", label: { PT: "Bolívia", EN: "Bolivia", ES: "Bolivia" }, dialCode: "+591" },
  { value: "VE", label: { PT: "Venezuela", EN: "Venezuela", ES: "Venezuela" }, dialCode: "+58" },
  { value: "CR", label: { PT: "Costa Rica", EN: "Costa Rica", ES: "Costa Rica" }, dialCode: "+506" },
  { value: "PA", label: { PT: "Panamá", EN: "Panama", ES: "Panamá" }, dialCode: "+507" },
  { value: "OTHER", label: { PT: "Outro", EN: "Other", ES: "Otro" }, dialCode: "" },
];

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
    phone: "",
    company: "",
    country: "",
    taxId: "",
    transactionType: "",
    transactionTypeOther: "",
    dealStatus: "",
    dealStatusOther: "",
    // Step 2
    requesterProfile: "",
    requesterProfileOther: "",
    jobTitle: "",
    jobTitleOther: "",
    marketSegment: "",
    marketSegmentOther: "",
    revenueModel: "",
    revenueModelOther: "",
    targetCompany: "",
    targetRevenue: "",
    objectives: [] as string[],
    availableData: [] as string[],
    concerns: "",
  });

  // Options for Step 1
  const transactionTypeOptions = useMemo(() => [
    { value: "buy_side", label: t("duediligence.transaction.buySide") },
    { value: "sell_side", label: t("duediligence.transaction.sellSide") },
    { value: "ma_strategic", label: t("duediligence.transaction.maStrategic") },
    { value: "primary_vc", label: t("duediligence.transaction.primaryVc") },
    { value: "secondary", label: t("duediligence.transaction.secondary") },
    { value: "other", label: t("duediligence.other") },
  ], [t]);

  const dealStatusOptions = useMemo(() => [
    { value: "pre_loi", label: t("duediligence.status.preLoi") },
    { value: "post_loi", label: t("duediligence.status.postLoi") },
    { value: "exclusivity", label: t("duediligence.status.exclusivity") },
    { value: "pre_closing", label: t("duediligence.status.preClosing") },
    { value: "post_closing", label: t("duediligence.status.postClosing") },
    { value: "exploratory", label: t("duediligence.status.exploratory") },
    { value: "other", label: t("duediligence.other") },
  ], [t]);

  // Options for Step 2
  const requesterProfileOptions = useMemo(() => [
    { value: "strategic_buyer", label: t("duediligence.profile.strategicBuyer") },
    { value: "private_equity", label: t("duediligence.profile.privateEquity") },
    { value: "venture_capital", label: t("duediligence.profile.ventureCapital") },
    { value: "growth_equity", label: t("duediligence.profile.growthEquity") },
    { value: "cvc", label: t("duediligence.profile.cvc") },
    { value: "family_office", label: t("duediligence.profile.familyOffice") },
    { value: "search_fund", label: t("duediligence.profile.searchFund") },
    { value: "seller_management", label: t("duediligence.profile.sellerManagement") },
    { value: "advisor", label: t("duediligence.profile.advisor") },
    { value: "other", label: t("duediligence.other") },
  ], [t]);

  const jobTitleOptions = useMemo(() => [
    { value: "partner", label: t("duediligence.title.partner") },
    { value: "principal", label: t("duediligence.title.principal") },
    { value: "ceo", label: t("duediligence.title.ceo") },
    { value: "cfo", label: t("duediligence.title.cfo") },
    { value: "cro_vp_sales", label: t("duediligence.title.croVpSales") },
    { value: "head_ma", label: t("duediligence.title.headMa") },
    { value: "other", label: t("duediligence.other") },
  ], [t]);

  const marketSegmentOptions = useMemo(() => [
    { value: "fintech", label: "Fintech" },
    { value: "healthtech", label: "Healthtech" },
    { value: "retail_commerce", label: t("duediligence.segment.retailCommerce") },
    { value: "logistics", label: t("duediligence.segment.logistics") },
    { value: "martech", label: "Martech/Adtech" },
    { value: "erp_backoffice", label: "ERP/Backoffice" },
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "data_ai", label: "Data/AI/Analytics" },
    { value: "edtech", label: "Edtech" },
    { value: "saas_horizontal", label: t("duediligence.segment.saasHorizontal") },
    { value: "other", label: t("duediligence.other") },
  ], [t]);

  const revenueModelOptions = useMemo(() => [
    { value: "saas", label: t("duediligence.revenueModel.saas") },
    { value: "usage_based", label: t("duediligence.revenueModel.usageBased") },
    { value: "marketplace", label: t("duediligence.revenueModel.marketplace") },
    { value: "transactional", label: t("duediligence.revenueModel.transactional") },
    { value: "services", label: t("duediligence.revenueModel.services") },
    { value: "hardware_software", label: t("duediligence.revenueModel.hardwareSoftware") },
    { value: "other", label: t("duediligence.revenueModel.otherHybrid") },
  ], [t]);

  const revenueOptions = useMemo(() => [
    { value: "startup", label: t("duediligence.revenue.startup") },
    { value: "under_50m", label: t("duediligence.revenue.under50m") },
    { value: "50m_200m", label: t("duediligence.revenue.50m200m") },
    { value: "200m_500m", label: t("duediligence.revenue.200m500m") },
    { value: "above_500m", label: t("duediligence.revenue.above500m") },
    { value: "unknown", label: t("duediligence.revenue.unknown") },
  ], [t]);

  const objectiveOptions = useMemo(() => [
    { value: "validate_icp", label: t("duediligence.obj.validateIcp") },
    { value: "evaluate_pricing", label: t("duediligence.obj.evaluatePricing") },
    { value: "validate_sales_motions", label: t("duediligence.obj.validateSalesMotions") },
    { value: "measure_pipeline", label: t("duediligence.obj.measurePipeline") },
    { value: "test_forecast", label: t("duediligence.obj.testForecast") },
    { value: "evaluate_sales_ops", label: t("duediligence.obj.evaluateSalesOps") },
    { value: "vendor_dd", label: t("duediligence.obj.vendorDd") },
  ], [t]);

  const availableDataOptions = useMemo(() => [
    { value: "crm_export", label: t("duediligence.data.crmExport") },
    { value: "quotas", label: t("duediligence.data.quotas") },
    { value: "forecast_snapshots", label: t("duediligence.data.forecastSnapshots") },
    { value: "client_list", label: t("duediligence.data.clientList") },
    { value: "org_charts", label: t("duediligence.data.orgCharts") },
  ], [t]);

  const getErrorMessage = (key: string): string => {
    const messages: Record<string, Record<string, string>> = {
      PT: {
        emailRequired: "Email é obrigatório",
        emailInvalid: "Email inválido",
        emailPersonal: "Use seu email corporativo para receber a avaliação",
        phoneRequired: "Telefone é obrigatório",
        phoneInvalid: "Telefone inválido",
        nameMin: "Nome deve ter pelo menos 2 caracteres",
        companyRequired: "Empresa é obrigatória",
        countryRequired: "País é obrigatório",
        taxIdRequired: "CNPJ é obrigatório",
        taxIdInvalid: "CNPJ inválido",
        taxIdMinLength: "ID fiscal deve ter pelo menos 8 caracteres",
        transactionRequired: "Tipo de transação é obrigatório",
        transactionOtherRequired: "Especifique o tipo de transação",
        dealStatusRequired: "Status do deal é obrigatório",
        dealStatusOtherRequired: "Especifique o status do deal",
        profileRequired: "Perfil do solicitante é obrigatório",
        profileOtherRequired: "Especifique o perfil",
        jobTitleRequired: "Cargo é obrigatório",
        jobTitleOtherRequired: "Especifique o cargo",
        segmentRequired: "Segmento de mercado é obrigatório",
        segmentOtherRequired: "Especifique o segmento",
        revenueModelRequired: "Modelo de receita é obrigatório",
        revenueModelOtherRequired: "Especifique o modelo",
        targetCompanyRequired: "Setor e geografia são obrigatórios",
        revenueRequired: "Porte da empresa-alvo é obrigatório",
        objectivesRequired: "Selecione pelo menos um objetivo",
        availableDataRequired: "Selecione pelo menos um dado disponível",
        concernsRequired: "Riscos/hipóteses são obrigatórios",
      },
      EN: {
        emailRequired: "Email is required",
        emailInvalid: "Invalid email",
        emailPersonal: "Use your corporate email to receive the assessment",
        phoneRequired: "Phone is required",
        phoneInvalid: "Invalid phone number",
        nameMin: "Name must have at least 2 characters",
        companyRequired: "Company is required",
        countryRequired: "Country is required",
        taxIdRequired: "Company Tax ID is required",
        taxIdInvalid: "Invalid Tax ID",
        taxIdMinLength: "Tax ID must have at least 8 characters",
        transactionRequired: "Transaction type is required",
        transactionOtherRequired: "Specify the transaction type",
        dealStatusRequired: "Deal status is required",
        dealStatusOtherRequired: "Specify the deal status",
        profileRequired: "Requester profile is required",
        profileOtherRequired: "Specify the profile",
        jobTitleRequired: "Job title is required",
        jobTitleOtherRequired: "Specify the job title",
        segmentRequired: "Market segment is required",
        segmentOtherRequired: "Specify the segment",
        revenueModelRequired: "Revenue model is required",
        revenueModelOtherRequired: "Specify the model",
        targetCompanyRequired: "Sector and geography are required",
        revenueRequired: "Target company size is required",
        objectivesRequired: "Select at least one objective",
        availableDataRequired: "Select at least one available data",
        concernsRequired: "Risks/hypotheses are required",
      },
      ES: {
        emailRequired: "Email es obligatorio",
        emailInvalid: "Email inválido",
        emailPersonal: "Use su email corporativo para recibir la evaluación",
        phoneRequired: "Teléfono es obligatorio",
        phoneInvalid: "Teléfono inválido",
        nameMin: "Nombre debe tener al menos 2 caracteres",
        companyRequired: "Empresa es obligatoria",
        countryRequired: "País es obligatorio",
        taxIdRequired: "ID fiscal / NIF / RUC es obligatorio",
        taxIdInvalid: "ID fiscal inválido",
        taxIdMinLength: "ID fiscal debe tener al menos 8 caracteres",
        transactionRequired: "Tipo de transacción es obligatorio",
        transactionOtherRequired: "Especifique el tipo de transacción",
        dealStatusRequired: "Estado del deal es obligatorio",
        dealStatusOtherRequired: "Especifique el estado del deal",
        profileRequired: "Perfil del solicitante es obligatorio",
        profileOtherRequired: "Especifique el perfil",
        jobTitleRequired: "Cargo es obligatorio",
        jobTitleOtherRequired: "Especifique el cargo",
        segmentRequired: "Segmento de mercado es obligatorio",
        segmentOtherRequired: "Especifique el segmento",
        revenueModelRequired: "Modelo de ingresos es obligatorio",
        revenueModelOtherRequired: "Especifique el modelo",
        targetCompanyRequired: "Sector y geografía son obligatorios",
        revenueRequired: "Tamaño de la empresa objetivo es obligatorio",
        objectivesRequired: "Seleccione al menos un objetivo",
        availableDataRequired: "Seleccione al menos un dato disponible",
        concernsRequired: "Riesgos/hipótesis son obligatorios",
      },
    };
    return messages[language]?.[key] || messages.PT[key] || key;
  };

  // Field validation helpers for animated inputs
  const isNameValid = useCallback(() => {
    return formData.name.trim().length >= 2;
  }, [formData.name]);

  const isEmailValid = useCallback(() => {
    if (!formData.email) return false;
    if (!emailRegex.test(formData.email)) return false;
    const domain = formData.email.split('@')[1]?.toLowerCase();
    return !personalEmailDomains.includes(domain);
  }, [formData.email]);

  const isPhoneValid = useCallback(() => {
    const cleanedPhone = formData.phone.replace(/\D/g, '');
    return cleanedPhone.length >= 8;
  }, [formData.phone]);

  const isCompanyValid = useCallback(() => {
    return formData.company.trim().length >= 2;
  }, [formData.company]);

  const isTaxIdValid = useCallback(() => {
    if (!formData.taxId) return false;
    if (formData.country === "BR") {
      return validateCNPJ(formData.taxId);
    }
    const cleanedTaxId = formData.taxId.replace(/[^a-zA-Z0-9]/g, '');
    return cleanedTaxId.length >= 8;
  }, [formData.taxId, formData.country]);

  const isTargetCompanyValid = useCallback(() => {
    return formData.targetCompany.trim().length >= 5;
  }, [formData.targetCompany]);

  const isConcernsValid = useCallback(() => {
    return formData.concerns.trim().length >= 10;
  }, [formData.concerns]);

  const getTaxIdLabel = (): string => {
    if (formData.country === "BR") {
      return "CNPJ";
    }
    if (language === "EN") return "Company Tax ID";
    if (language === "ES") return "ID fiscal / NIF / RUC";
    return "CNPJ / ID Fiscal";
  };

  const handlePhoneChange = (value: string) => {
    // Auto-detect country from dial code when user types + followed by numbers
    if (value.startsWith('+') && value.length >= 3) {
      const detectedCountry = detectCountryFromDialCode(value);
      if (detectedCountry && detectedCountry !== formData.country) {
        // Auto-update country based on dial code
        setFormData(prev => ({ 
          ...prev, 
          country: detectedCountry,
          phone: formatPhoneWithCountry(value, detectedCountry),
          taxId: "" // Reset tax ID when country changes
        }));
        if (errors.phone) setErrors(prev => ({ ...prev, phone: "", country: "", taxId: "" }));
        return;
      }
    }
    
    // Format with current country
    const formatted = formatPhoneWithCountry(value, formData.country || "BR");
    setFormData({ ...formData, phone: formatted });
    if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
  };

  const handleTaxIdChange = (value: string) => {
    let formatted = value;
    if (formData.country === "BR") {
      formatted = formatCNPJ(value);
    } else {
      // Allow alphanumeric, max 20 chars
      formatted = value.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 20);
    }
    setFormData({ ...formData, taxId: formatted });
    if (errors.taxId) setErrors(prev => ({ ...prev, taxId: "" }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = getErrorMessage("nameMin");
    }

    // Email validation - check format and personal domains
    if (!formData.email) {
      newErrors.email = getErrorMessage("emailRequired");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = getErrorMessage("emailInvalid");
    } else {
      const domain = formData.email.split('@')[1]?.toLowerCase();
      if (personalEmailDomains.includes(domain)) {
        newErrors.email = getErrorMessage("emailPersonal");
      }
    }

    // Phone validation - required
    if (!formData.phone) {
      newErrors.phone = getErrorMessage("phoneRequired");
    } else {
      const cleanedPhone = formData.phone.replace(/\D/g, '');
      if (cleanedPhone.length < 8) {
        newErrors.phone = getErrorMessage("phoneInvalid");
      }
    }

    // Company validation
    if (!formData.company || formData.company.trim().length < 2) {
      newErrors.company = getErrorMessage("companyRequired");
    }

    // Country validation
    if (!formData.country) {
      newErrors.country = getErrorMessage("countryRequired");
    }

    // Tax ID validation
    if (!formData.taxId) {
      newErrors.taxId = getErrorMessage("taxIdRequired");
    } else if (formData.country === "BR") {
      if (!validateCNPJ(formData.taxId)) {
        newErrors.taxId = getErrorMessage("taxIdInvalid");
      }
    } else {
      const cleanedTaxId = formData.taxId.replace(/[^a-zA-Z0-9]/g, '');
      if (cleanedTaxId.length < 8) {
        newErrors.taxId = getErrorMessage("taxIdMinLength");
      }
    }

    // Transaction type validation
    if (!formData.transactionType) {
      newErrors.transactionType = getErrorMessage("transactionRequired");
    } else if (formData.transactionType === "other" && !formData.transactionTypeOther) {
      newErrors.transactionTypeOther = getErrorMessage("transactionOtherRequired");
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

    // Requester profile validation
    if (!formData.requesterProfile) {
      newErrors.requesterProfile = getErrorMessage("profileRequired");
    } else if (formData.requesterProfile === "other" && !formData.requesterProfileOther) {
      newErrors.requesterProfileOther = getErrorMessage("profileOtherRequired");
    }

    // Job title validation
    if (!formData.jobTitle) {
      newErrors.jobTitle = getErrorMessage("jobTitleRequired");
    } else if (formData.jobTitle === "other" && !formData.jobTitleOther) {
      newErrors.jobTitleOther = getErrorMessage("jobTitleOtherRequired");
    }

    // Market segment validation
    if (!formData.marketSegment) {
      newErrors.marketSegment = getErrorMessage("segmentRequired");
    } else if (formData.marketSegment === "other" && !formData.marketSegmentOther) {
      newErrors.marketSegmentOther = getErrorMessage("segmentOtherRequired");
    }

    // Revenue model validation
    if (!formData.revenueModel) {
      newErrors.revenueModel = getErrorMessage("revenueModelRequired");
    } else if (formData.revenueModel === "other" && !formData.revenueModelOther) {
      newErrors.revenueModelOther = getErrorMessage("revenueModelOtherRequired");
    }

    // Target company validation
    if (!formData.targetCompany || formData.targetCompany.trim().length < 2) {
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

    // Available data validation - now required
    if (formData.availableData.length === 0) {
      newErrors.availableData = getErrorMessage("availableDataRequired");
    }

    // Concerns validation - now required
    if (!formData.concerns || formData.concerns.trim().length < 10) {
      newErrors.concerns = getErrorMessage("concernsRequired");
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
    if (errors.availableData) {
      setErrors(prev => ({ ...prev, availableData: "" }));
    }
  };

  const getPhoneE164 = (): string => {
    const cleaned = formData.phone.replace(/\D/g, '');
    if (formData.country === "BR" && !cleaned.startsWith("55")) {
      return "+55" + cleaned;
    }
    return "+" + cleaned;
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
      const finalTransactionType = formData.transactionType === "other" 
        ? formData.transactionTypeOther 
        : formData.transactionType;
      const finalDealStatus = formData.dealStatus === "other" 
        ? formData.dealStatusOther 
        : formData.dealStatus;
      const finalRequesterProfile = formData.requesterProfile === "other" 
        ? formData.requesterProfileOther 
        : formData.requesterProfile;
      const finalJobTitle = formData.jobTitle === "other" 
        ? formData.jobTitleOther 
        : formData.jobTitle;
      const finalMarketSegment = formData.marketSegment === "other" 
        ? formData.marketSegmentOther 
        : formData.marketSegment;
      const finalRevenueModel = formData.revenueModel === "other" 
        ? formData.revenueModelOther 
        : formData.revenueModel;

      const { data, error } = await supabase.functions.invoke('hubspot-duediligence', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: getPhoneE164(),
          company: formData.company,
          country: formData.country,
          taxId: formData.taxId,
          transactionType: finalTransactionType,
          dealStatus: finalDealStatus,
          requesterProfile: finalRequesterProfile,
          jobTitle: finalJobTitle,
          marketSegment: finalMarketSegment,
          revenueModel: finalRevenueModel,
          targetCompany: formData.targetCompany,
          targetRevenue: formData.targetRevenue,
          objectives: formData.objectives,
          availableData: formData.availableData,
          concerns: formData.concerns,
          // Tags
          service: "Commercial Due Diligence (M&A)",
          segment: "Tech / LatAm",
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
      phone: "",
      company: "",
      country: "",
      taxId: "",
      transactionType: "",
      transactionTypeOther: "",
      dealStatus: "",
      dealStatusOther: "",
      requesterProfile: "",
      requesterProfileOther: "",
      jobTitle: "",
      jobTitleOther: "",
      marketSegment: "",
      marketSegmentOther: "",
      revenueModel: "",
      revenueModelOther: "",
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

    const availableDataLabels = formData.availableData.map(d => {
      const option = availableDataOptions.find(o => o.value === d);
      return option?.label || d;
    });

    const countryLabel = latamCountries.find(c => c.value === formData.country)?.label[language] || formData.country;

    return `
RESUMO DO ESCOPO - Due Diligence Comercial (Tech / LatAm)

IDENTIFICAÇÃO:
• Solicitante: ${formData.name}
• Empresa: ${formData.company}
• Email: ${formData.email}
• Telefone: ${formData.phone}
• País: ${countryLabel}
• ${getTaxIdLabel()}: ${formData.taxId}

TRANSAÇÃO:
• Tipo: ${getDisplayValue(formData.transactionType, transactionTypeOptions, formData.transactionTypeOther)}
• Status: ${getDisplayValue(formData.dealStatus, dealStatusOptions, formData.dealStatusOther)}

PERFIL:
• Instituição: ${getDisplayValue(formData.requesterProfile, requesterProfileOptions, formData.requesterProfileOther)}
• Cargo: ${getDisplayValue(formData.jobTitle, jobTitleOptions, formData.jobTitleOther)}

EMPRESA-ALVO:
• Segmento: ${getDisplayValue(formData.marketSegment, marketSegmentOptions, formData.marketSegmentOther)}
• Modelo de receita: ${getDisplayValue(formData.revenueModel, revenueModelOptions, formData.revenueModelOther)}
• Setor/Geografia: ${formData.targetCompany}
• Porte: ${getDisplayValue(formData.targetRevenue, revenueOptions)}

OBJETIVOS DO DUE DILIGENCE:
${objectives.map(o => `• ${o}`).join('\n')}

DADOS DISPONÍVEIS:
${availableDataLabels.map(d => `• ${d}`).join('\n')}

RISCOS/HIPÓTESES:
${formData.concerns}
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
  const phonePlaceholder = getPhonePlaceholder(formData.country || "BR");

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      setOpen(newOpen);
    }}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        {!isCompleted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-heading leading-tight">
                {t("duediligence.modal.title")}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {t("duediligence.modal.subtitle")}
              </DialogDescription>
            </DialogHeader>

            {/* Progress Bar */}
            <motion.div 
              className="mt-4 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t("duediligence.step")} {step} {t("duediligence.of")} 2</span>
                <span>{step === 1 ? "50%" : "100%"}</span>
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ originX: 0 }}
              >
                <Progress value={step === 1 ? 50 : 100} className="h-2" />
              </motion.div>
            </motion.div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                /* Step 1 - Identification + Initial Qualification */
                <motion.div
                  key="step1"
                  initial="enterFromLeft"
                  animate="center"
                  exit="exitToLeft"
                  variants={slideVariants}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-4 mt-6"
                >
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dd-name">
                      {t("duediligence.fullName")} *
                    </Label>
                    <AnimatedInput
                      id="dd-name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                      }}
                      placeholder="João Silva"
                      hasError={!!errors.name}
                      isValid={isNameValid()}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dd-email">
                      {t("duediligence.corporateEmail")} *
                    </Label>
                    <AnimatedInput
                      id="dd-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                      }}
                      placeholder="joao@empresa.com"
                      hasError={!!errors.email}
                      isValid={isEmailValid()}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                </div>

                {/* Phone + Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dd-phone">
                      {t("duediligence.phone")} *
                    </Label>
                    <AnimatedInput
                      id="dd-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder={phonePlaceholder}
                      hasError={!!errors.phone}
                      isValid={isPhoneValid()}
                    />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dd-company">
                      {t("duediligence.company")} *
                    </Label>
                    <AnimatedInput
                      id="dd-company"
                      value={formData.company}
                      onChange={(e) => {
                        setFormData({ ...formData, company: e.target.value });
                        if (errors.company) setErrors(prev => ({ ...prev, company: "" }));
                      }}
                      placeholder={t("duediligence.companyPlaceholder")}
                      hasError={!!errors.company}
                      isValid={isCompanyValid()}
                    />
                    {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
                  </div>
                </div>

                {/* Country + Tax ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("duediligence.country")} *</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => {
                        // Update phone with new country dial code
                        const dialCode = countryDialCodes[value]?.code;
                        const newPhone = dialCode ? `+${dialCode} ` : "";
                        setFormData({ ...formData, country: value, taxId: "", phone: newPhone });
                        if (errors.country) setErrors(prev => ({ ...prev, country: "", taxId: "", phone: "" }));
                      }}
                    >
                      <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                        <SelectValue placeholder={t("duediligence.select")} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {latamCountries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.dialCode ? `${country.label[language]} (${country.dialCode})` : country.label[language]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dd-taxid">
                      {getTaxIdLabel()} *
                    </Label>
                    <AnimatedInput
                      id="dd-taxid"
                      value={formData.taxId}
                      onChange={(e) => handleTaxIdChange(e.target.value)}
                      placeholder={formData.country === "BR" ? "00.000.000/0000-00" : "Tax ID"}
                      hasError={!!errors.taxId}
                      isValid={isTaxIdValid()}
                      disabled={!formData.country}
                    />
                  </div>
                </div>

                {/* Transaction Type + Deal Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("duediligence.transactionType")} *</Label>
                    <Select
                      value={formData.transactionType}
                      onValueChange={(value) => {
                        setFormData({ ...formData, transactionType: value, transactionTypeOther: "" });
                        if (errors.transactionType) setErrors(prev => ({ ...prev, transactionType: "" }));
                      }}
                    >
                      <SelectTrigger className={errors.transactionType ? "border-destructive" : ""}>
                        <SelectValue placeholder={t("duediligence.select")} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {transactionTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.transactionType && <p className="text-xs text-destructive">{errors.transactionType}</p>}
                    
                    {formData.transactionType === "other" && (
                      <div className="mt-2">
                        <Input
                          value={formData.transactionTypeOther}
                          onChange={(e) => {
                            setFormData({ ...formData, transactionTypeOther: e.target.value });
                            if (errors.transactionTypeOther) setErrors(prev => ({ ...prev, transactionTypeOther: "" }));
                          }}
                          placeholder={specifyPlaceholder}
                          className={errors.transactionTypeOther ? "border-destructive" : ""}
                        />
                        {errors.transactionTypeOther && <p className="text-xs text-destructive">{errors.transactionTypeOther}</p>}
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
              </motion.div>
              ) : (
                /* Step 2 - Investment Context + Deep Qualification */
                <motion.div
                  key="step2"
                  initial="enterFromRight"
                  animate="center"
                  exit="exitToRight"
                  variants={slideVariants}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-4 mt-6"
                >
                {/* Requester Profile + Job Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("duediligence.requesterProfile")} *</Label>
                    <Select
                      value={formData.requesterProfile}
                      onValueChange={(value) => {
                        setFormData({ ...formData, requesterProfile: value, requesterProfileOther: "" });
                        if (errors.requesterProfile) setErrors(prev => ({ ...prev, requesterProfile: "" }));
                      }}
                    >
                      <SelectTrigger className={errors.requesterProfile ? "border-destructive" : ""}>
                        <SelectValue placeholder={t("duediligence.select")} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50 max-h-60">
                        {requesterProfileOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.requesterProfile && <p className="text-xs text-destructive">{errors.requesterProfile}</p>}
                    
                    {formData.requesterProfile === "other" && (
                      <div className="mt-2">
                        <Input
                          value={formData.requesterProfileOther}
                          onChange={(e) => {
                            setFormData({ ...formData, requesterProfileOther: e.target.value });
                            if (errors.requesterProfileOther) setErrors(prev => ({ ...prev, requesterProfileOther: "" }));
                          }}
                          placeholder={specifyPlaceholder}
                          className={errors.requesterProfileOther ? "border-destructive" : ""}
                        />
                        {errors.requesterProfileOther && <p className="text-xs text-destructive">{errors.requesterProfileOther}</p>}
                      </div>
                    )}
                  </div>
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
                </div>

                {/* Market Segment + Revenue Model */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("duediligence.marketSegment")} *</Label>
                    <Select
                      value={formData.marketSegment}
                      onValueChange={(value) => {
                        setFormData({ ...formData, marketSegment: value, marketSegmentOther: "" });
                        if (errors.marketSegment) setErrors(prev => ({ ...prev, marketSegment: "" }));
                      }}
                    >
                      <SelectTrigger className={errors.marketSegment ? "border-destructive" : ""}>
                        <SelectValue placeholder={t("duediligence.select")} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50 max-h-60">
                        {marketSegmentOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.marketSegment && <p className="text-xs text-destructive">{errors.marketSegment}</p>}
                    
                    {formData.marketSegment === "other" && (
                      <div className="mt-2">
                        <Input
                          value={formData.marketSegmentOther}
                          onChange={(e) => {
                            setFormData({ ...formData, marketSegmentOther: e.target.value });
                            if (errors.marketSegmentOther) setErrors(prev => ({ ...prev, marketSegmentOther: "" }));
                          }}
                          placeholder={specifyPlaceholder}
                          className={errors.marketSegmentOther ? "border-destructive" : ""}
                        />
                        {errors.marketSegmentOther && <p className="text-xs text-destructive">{errors.marketSegmentOther}</p>}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>{t("duediligence.revenueModelLabel")} *</Label>
                    <Select
                      value={formData.revenueModel}
                      onValueChange={(value) => {
                        setFormData({ ...formData, revenueModel: value, revenueModelOther: "" });
                        if (errors.revenueModel) setErrors(prev => ({ ...prev, revenueModel: "" }));
                      }}
                    >
                      <SelectTrigger className={errors.revenueModel ? "border-destructive" : ""}>
                        <SelectValue placeholder={t("duediligence.select")} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {revenueModelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.revenueModel && <p className="text-xs text-destructive">{errors.revenueModel}</p>}
                    
                    {formData.revenueModel === "other" && (
                      <div className="mt-2">
                        <Input
                          value={formData.revenueModelOther}
                          onChange={(e) => {
                            setFormData({ ...formData, revenueModelOther: e.target.value });
                            if (errors.revenueModelOther) setErrors(prev => ({ ...prev, revenueModelOther: "" }));
                          }}
                          placeholder={specifyPlaceholder}
                          className={errors.revenueModelOther ? "border-destructive" : ""}
                        />
                        {errors.revenueModelOther && <p className="text-xs text-destructive">{errors.revenueModelOther}</p>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Target Company Sector + Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dd-target">
                      {t("duediligence.targetCompanySector")} *
                    </Label>
                    <AnimatedInput
                      id="dd-target"
                      value={formData.targetCompany}
                      onChange={(e) => {
                        setFormData({ ...formData, targetCompany: e.target.value });
                        if (errors.targetCompany) setErrors(prev => ({ ...prev, targetCompany: "" }));
                      }}
                      placeholder={t("duediligence.targetCompanyPlaceholder")}
                      hasError={!!errors.targetCompany}
                      isValid={isTargetCompanyValid()}
                    />
                    {errors.targetCompany && <p className="text-xs text-destructive">{errors.targetCompany}</p>}
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

                {/* Objectives - Multiple choice */}
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

                {/* Available Data - Required checkbox */}
                <div className="space-y-3">
                  <Label className={errors.availableData ? "text-destructive" : ""}>
                    {t("duediligence.availableData.title")} *
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
                  {errors.availableData && <p className="text-xs text-destructive">{errors.availableData}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dd-concerns" className={errors.concerns ? "text-destructive" : ""}>
                    {t("duediligence.concerns")} *
                  </Label>
                  <AnimatedTextarea
                    id="dd-concerns"
                    value={formData.concerns}
                    onChange={(e) => {
                      setFormData({ ...formData, concerns: e.target.value });
                      if (errors.concerns) setErrors(prev => ({ ...prev, concerns: "" }));
                    }}
                    placeholder={t("duediligence.concernsPlaceholder")}
                    rows={3}
                    hasError={!!errors.concerns}
                    isValid={isConcernsValid()}
                  />
                  {errors.concerns && <p className="text-xs text-destructive">{errors.concerns}</p>}
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
              </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Success State */
          <motion.div 
            className="py-6 text-center space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
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

            {/* Next Steps */}
            <div className="bg-primary/5 rounded-lg p-4 text-left border border-primary/20">
              <h4 className="font-medium text-sm mb-3">{t("duediligence.success.nextSteps")}</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                  {t("duediligence.success.step1")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                  {t("duediligence.success.step2")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
                  {t("duediligence.success.step3")}
                </li>
              </ol>
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

            <Button 
              className="w-full" 
              onClick={resetForm}
            >
              {t("duediligence.success.close")}
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DueDiligenceFormModal;
