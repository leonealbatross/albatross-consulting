import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, Lock, Clock, Award, AlertTriangle, CalendarDays, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const CALENDLY_URL = "https://calendly.com/leone-albatross";
const CONTACT_EMAIL = "leone@albatross.consulting";

const personalEmailDomains = [
  "gmail.com", "gmail.com.br", "googlemail.com", "outlook.com", "outlook.com.br", "hotmail.com", "hotmail.com.br",
  "yahoo.com", "yahoo.com.br", "ymail.com", "icloud.com", "me.com", "mac.com", "live.com", "live.com.br", "msn.com",
  "aol.com", "protonmail.com", "zoho.com", "mail.com", "gmx.com", "inbox.com",
];
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const latamCountries = [
  { value: "BR", label: "Brasil", dial: "+55" }, { value: "MX", label: "México", dial: "+52" },
  { value: "AR", label: "Argentina", dial: "+54" }, { value: "CO", label: "Colombia", dial: "+57" },
  { value: "CL", label: "Chile", dial: "+56" }, { value: "PE", label: "Perú", dial: "+51" },
  { value: "EC", label: "Ecuador", dial: "+593" }, { value: "UY", label: "Uruguay", dial: "+598" },
  { value: "PY", label: "Paraguay", dial: "+595" }, { value: "BO", label: "Bolivia", dial: "+591" },
  { value: "VE", label: "Venezuela", dial: "+58" }, { value: "CR", label: "Costa Rica", dial: "+506" },
  { value: "PA", label: "Panamá", dial: "+507" }, { value: "OTHER", label: "Other", dial: "+" },
];

type Opt = { v: string; l: Record<Language, string> };
const o = (v: string, PT: string, EN: string, ES: string): Opt => ({ v, l: { PT, EN, ES } });

const JOB = [o("partner", "Sócio/Partner", "Partner", "Socio/Partner"), o("principal", "Principal/Associate", "Principal/Associate", "Principal/Associate"),
  o("ceo", "CEO", "CEO", "CEO"), o("cfo", "CFO", "CFO", "CFO"), o("head_ma", "Head de M&A/Corp Dev", "Head of M&A/Corp Dev", "Head de M&A/Corp Dev"), o("other", "Outro", "Other", "Otro")];
const PROFILE = [o("strategic_buyer", "Comprador estratégico", "Strategic buyer", "Comprador estratégico"), o("private_equity", "Private Equity", "Private Equity", "Private Equity"),
  o("vc_growth", "Venture Capital / Growth", "Venture Capital / Growth", "Venture Capital / Growth"), o("cvc", "CVC", "CVC", "CVC"),
  o("family_office", "Family Office", "Family Office", "Family Office"), o("search_fund", "Search Fund", "Search Fund", "Search Fund"),
  o("seller_management", "Vendedor / Management", "Seller / Management", "Vendedor / Management"), o("advisor", "Assessor M&A", "M&A advisor", "Asesor M&A"), o("other", "Outro", "Other", "Otro")];
const SIDE = [o("buy_side", "Buy-side", "Buy-side", "Buy-side"), o("sell_side", "Sell-side (vendor DD)", "Sell-side (vendor DD)", "Sell-side (vendor DD)"),
  o("primary", "Investimento primário", "Primary investment", "Inversión primaria"), o("secondary", "Secundária", "Secondary", "Secundaria")];
const STAGE = [o("exploratory", "Exploratório", "Exploratory", "Exploratorio"), o("pre_loi", "Pré-LOI", "Pre-LOI", "Pre-LOI"),
  o("post_loi", "Pós-LOI / exclusividade", "Post-LOI / exclusivity", "Post-LOI / exclusividad"), o("pre_closing", "Pré-closing", "Pre-closing", "Pre-closing"),
  o("post_closing", "Pós-closing (100 dias)", "Post-closing (100 days)", "Post-closing (100 días)")];
const TIMELINE = [o("2w", "Até 2 semanas", "Within 2 weeks", "Hasta 2 semanas"), o("30d", "Até 30 dias", "Within 30 days", "Hasta 30 días"),
  o("30_90d", "30 a 90 dias", "30 to 90 days", "30 a 90 días"), o("none", "Sem prazo definido", "No set deadline", "Sin plazo definido")];
const REVENUE = [o("under_20m", "Até R$20M", "Up to R$20M", "Hasta R$20M"), o("20m_100m", "R$20M a 100M", "R$20M to 100M", "R$20M a 100M"),
  o("100m_500m", "R$100M a 500M", "R$100M to 500M", "R$100M a 500M"), o("above_500m", "Acima de R$500M", "Above R$500M", "Más de R$500M"), o("unknown", "Não sei ainda", "Not sure yet", "Aún no sé")];
const SEGMENT = [o("fintech", "Fintech", "Fintech", "Fintech"), o("healthtech", "Healthtech", "Healthtech", "Healthtech"),
  o("retail_commerce", "Retail/Commerce", "Retail/Commerce", "Retail/Commerce"), o("logistics", "Logística/Supply Chain", "Logistics/Supply Chain", "Logística/Supply Chain"),
  o("martech", "Martech/Adtech", "Martech/Adtech", "Martech/Adtech"), o("erp_backoffice", "ERP/Backoffice", "ERP/Backoffice", "ERP/Backoffice"),
  o("cybersecurity", "Cybersecurity", "Cybersecurity", "Cybersecurity"), o("data_ai", "Data/AI/Analytics", "Data/AI/Analytics", "Data/AI/Analytics"),
  o("edtech", "Edtech", "Edtech", "Edtech"), o("saas_horizontal", "SaaS horizontal", "Horizontal SaaS", "SaaS horizontal"), o("other", "Outro", "Other", "Otro")];
const NEEDS = [o("icp_retention", "ICP e retenção", "ICP and retention", "ICP y retención"), o("pricing_nrr", "Pricing e NRR", "Pricing and NRR", "Pricing y NRR"),
  o("pipeline_forecast", "Pipeline e forecast", "Pipeline and forecast", "Pipeline y forecast"), o("sales_efficiency", "Eficiência de vendas (CAC/payback)", "Sales efficiency (CAC/payback)", "Eficiencia de ventas (CAC/payback)"),
  o("team_salesops", "Time e SalesOps", "Team and SalesOps", "Equipo y SalesOps"), o("plan_100d", "Plano de 100 dias", "100 day plan", "Plan de 100 días")];

const T: Record<Language, Record<string, string>> = {
  PT: {
    title: "Avaliação de Due Diligence Comercial", subtitle: "Leva 2 minutos. Não pedimos o nome da empresa alvo. NDA disponível antes de qualquer detalhe.",
    b1: "Confidencial", b2: "Resposta em até 1 dia útil", b3: "25+ anos em software enterprise na LATAM",
    step: "Passo", of: "de", s1: "Contato", s2: "Transação",
    name: "Nome", email: "Email corporativo", company: "Empresa / fundo", job: "Cargo", jobOther: "Qual cargo?", phone: "WhatsApp / telefone", optional: "opcional",
    profile: "Seu perfil", side: "Lado", stage: "Estágio do deal", timeline: "Prazo para decisão", revenue: "Porte da empresa alvo (receita anual)",
    segment: "Segmento da alvo", segmentPh: "Selecione", needs: "O que precisa validar", context: "Contexto",
    contextPh: "Hipóteses ou riscos que preocupam. Sem nomes, se preferir.", nda: "Prefiro assinar NDA antes de compartilhar detalhes",
    consentA: "Concordo com o tratamento dos meus dados conforme a", consentB: "política de privacidade", next: "Continuar", back: "Voltar",
    submit: "Solicitar avaliação confidencial",
    eName: "Informe seu nome", eEmail: "Email inválido", ePersonal: "Use seu email corporativo", eCompany: "Informe a empresa ou fundo", eReq: "Selecione uma opção", eConsent: "Consentimento obrigatório",
    hotTitle: "Seu caso tem prazo curto. Agende agora 30 minutos com Marco Leone",
    warmTitle: "Recebemos. Retornamos em até 1 dia útil com os próximos passos e o NDA, se solicitado.",
    schedule: "Agendar uma conversa", close: "Fechar",
    errTitle: "Não conseguimos registrar sua solicitação", errText: "Seus dados continuam aqui. Tente de novo ou envie por email.", retry: "Tentar de novo", mail: "Enviar por email",
  },
  EN: {
    title: "Commercial Due Diligence Assessment", subtitle: "Takes 2 minutes. We do not ask for the target company name. NDA available before any detail.",
    b1: "Confidential", b2: "Reply within 1 business day", b3: "25+ years in enterprise software in LATAM",
    step: "Step", of: "of", s1: "Contact", s2: "Transaction",
    name: "Name", email: "Work email", company: "Company / fund", job: "Role", jobOther: "Which role?", phone: "WhatsApp / phone", optional: "optional",
    profile: "Your profile", side: "Side", stage: "Deal stage", timeline: "Decision deadline", revenue: "Target company size (annual revenue)",
    segment: "Target segment", segmentPh: "Select", needs: "What you need to validate", context: "Context",
    contextPh: "Hypotheses or risks that concern you. No names, if you prefer.", nda: "I prefer to sign an NDA before sharing details",
    consentA: "I agree to the processing of my data under the", consentB: "privacy policy", next: "Continue", back: "Back",
    submit: "Request confidential assessment",
    eName: "Enter your name", eEmail: "Invalid email", ePersonal: "Use your work email", eCompany: "Enter company or fund", eReq: "Select an option", eConsent: "Consent required",
    hotTitle: "Your case has a short deadline. Book 30 minutes with Marco Leone now",
    warmTitle: "Received. We will reply within 1 business day with next steps and the NDA, if requested.",
    schedule: "Book a call", close: "Close",
    errTitle: "We could not register your request", errText: "Your data is still here. Try again or send it by email.", retry: "Try again", mail: "Send by email",
  },
  ES: {
    title: "Evaluación de Due Diligence Comercial", subtitle: "Toma 2 minutos. No pedimos el nombre de la empresa objetivo. NDA disponible antes de cualquier detalle.",
    b1: "Confidencial", b2: "Respuesta en hasta 1 día hábil", b3: "25+ años en software enterprise en LATAM",
    step: "Paso", of: "de", s1: "Contacto", s2: "Transacción",
    name: "Nombre", email: "Email corporativo", company: "Empresa / fondo", job: "Cargo", jobOther: "¿Qué cargo?", phone: "WhatsApp / teléfono", optional: "opcional",
    profile: "Su perfil", side: "Lado", stage: "Etapa del deal", timeline: "Plazo para decisión", revenue: "Tamaño de la empresa objetivo (ingresos anuales)",
    segment: "Segmento del objetivo", segmentPh: "Seleccione", needs: "Qué necesita validar", context: "Contexto",
    contextPh: "Hipótesis o riesgos que preocupan. Sin nombres, si prefiere.", nda: "Prefiero firmar NDA antes de compartir detalles",
    consentA: "Acepto el tratamiento de mis datos conforme a la", consentB: "política de privacidad", next: "Continuar", back: "Volver",
    submit: "Solicitar evaluación confidencial",
    eName: "Ingrese su nombre", eEmail: "Email inválido", ePersonal: "Use su email corporativo", eCompany: "Ingrese la empresa o fondo", eReq: "Seleccione una opción", eConsent: "Consentimiento obligatorio",
    hotTitle: "Su caso tiene plazo corto. Agende ahora 30 minutos con Marco Leone",
    warmTitle: "Recibido. Respondemos en hasta 1 día hábil con los próximos pasos y el NDA, si fue solicitado.",
    schedule: "Agendar una conversación", close: "Cerrar",
    errTitle: "No pudimos registrar su solicitud", errText: "Sus datos siguen aquí. Intente de nuevo o envíelos por email.", retry: "Intentar de nuevo", mail: "Enviar por email",
  },
};

export const scoreLead = (d: { dealStage: string; decisionTimeline: string; targetRevenue: string }) =>
  ["post_loi", "pre_closing"].includes(d.dealStage) || ["2w", "30d"].includes(d.decisionTimeline) || ["100m_500m", "above_500m"].includes(d.targetRevenue) ? "hot" : "warm";

const track = (event: string, params: Record<string, unknown> = {}) => {
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
  if (typeof w.gtag === "function") w.gtag("event", event, params);
};

const empty = {
  name: "", email: "", company: "", jobTitle: "", jobTitleOther: "", phoneCountry: "BR", phone: "",
  requesterProfile: "", transactionSide: "", dealStage: "", decisionTimeline: "", targetRevenue: "",
  marketSegment: "", validationNeeds: [] as string[], context: "", ndaRequested: false, consent: false,
};

const Chips = ({ options, value, onChange, lang, multi = false, error }: { options: Opt[]; value: string | string[]; onChange: (v: string) => void; lang: Language; multi?: boolean; error?: string }) => (
  <div>
    <div className="flex flex-wrap gap-2" role={multi ? "group" : "radiogroup"}>
      {options.map((op) => {
        const active = multi ? (value as string[]).includes(op.v) : value === op.v;
        return (
          <button key={op.v} type="button" role={multi ? "checkbox" : "radio"} aria-checked={active} onClick={() => onChange(op.v)}
            className={cn("rounded-full border px-3 py-1.5 text-xs sm:text-sm transition-colors text-left",
              active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary/60")}>
            {op.l[lang]}
          </button>
        );
      })}
    </div>
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </div>
);

const Field = ({ label, optional, children }: { label: string; optional?: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">{label}{optional ? <span className="ml-1 text-xs font-normal text-muted-foreground">({optional})</span> : " *"}</Label>
    {children}
  </div>
);

interface DueDiligenceFormModalProps { trigger?: React.ReactNode }

const DueDiligenceFormModal = ({ trigger }: DueDiligenceFormModalProps) => {
  const { language } = useLanguage();
  const lang = (["PT", "EN", "ES"].includes(language) ? language : "PT") as Language;
  const t = T[lang];
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | "done" | "error">(1);
  const [f, setF] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [score, setScore] = useState<"hot" | "warm">("warm");
  const [tracking, setTracking] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const p = new URLSearchParams(window.location.search);
    setTracking({ utmSource: p.get("utm_source") || "", utmMedium: p.get("utm_medium") || "", utmCampaign: p.get("utm_campaign") || "", referrer: document.referrer || "" });
    track("dd_form_open", { language: lang });
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof typeof empty>(k: K, v: (typeof empty)[K]) => { setF((p) => ({ ...p, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };
  const toggleNeed = (v: string) => set("validationNeeds", f.validationNeeds.includes(v) ? f.validationNeeds.filter((x) => x !== v) : [...f.validationNeeds, v]);
  const dial = latamCountries.find((c) => c.value === f.phoneCountry)?.dial || "";
  const fullPhone = f.phone.trim() ? `${dial} ${f.phone.trim()}` : "";

  const payload = (stage: "partial" | "complete") => ({ ...f, ...tracking, phone: fullPhone, stage, leadId, language: lang });

  const validate1 = () => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = t.eName;
    const em = f.email.trim().toLowerCase();
    if (!emailRegex.test(em)) e.email = t.eEmail;
    else if (personalEmailDomains.includes(em.split("@")[1])) e.email = t.ePersonal;
    if (!f.company.trim()) e.company = t.eCompany;
    if (!f.jobTitle) e.jobTitle = t.eReq;
    setErrors(e);
    return !Object.keys(e).length;
  };
  const validate2 = () => {
    const e: Record<string, string> = {};
    (["requesterProfile", "transactionSide", "dealStage", "decisionTimeline", "targetRevenue"] as const).forEach((k) => { if (!f[k]) e[k] = t.eReq; });
    if (!f.consent) e.consent = t.eConsent;
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = async () => {
    if (!validate1()) return;
    track("dd_step1_complete");
    setStep(2);
    // partial save for abandonment recovery; never blocks the user
    try {
      const { data } = await supabase.functions.invoke("hubspot-duediligence", { body: payload("partial") });
      if (data?.leadId) setLeadId(data.leadId);
    } catch (err) { console.error("dd partial save failed", err); }
  };

  const submit = async () => {
    if (!validate2()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("hubspot-duediligence", { body: payload("complete") });
      if (error || !data?.success) throw error || new Error(data?.error || "save failed");
      const s = data.leadScore === "hot" ? "hot" : scoreLead(f) as "hot" | "warm";
      setScore(s);
      setStep("done");
      track("dd_submit_success", { lead_score: s });
    } catch (err) {
      console.error("dd submit failed", err);
      track("dd_submit_error");
      setStep("error");
    } finally { setLoading(false); }
  };

  const label = (opts: Opt[], v: string) => opts.find((x) => x.v === v)?.l[lang] || v || "-";
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${t.title}: ${f.company}`)}&body=${encodeURIComponent(
    [`${t.name}: ${f.name}`, `${t.email}: ${f.email}`, `${t.company}: ${f.company}`, `${t.job}: ${f.jobTitle === "other" ? f.jobTitleOther : label(JOB, f.jobTitle)}`,
      `${t.phone}: ${fullPhone || "-"}`, `${t.profile}: ${label(PROFILE, f.requesterProfile)}`, `${t.side}: ${label(SIDE, f.transactionSide)}`,
      `${t.stage}: ${label(STAGE, f.dealStage)}`, `${t.timeline}: ${label(TIMELINE, f.decisionTimeline)}`, `${t.revenue}: ${label(REVENUE, f.targetRevenue)}`,
      `${t.segment}: ${label(SEGMENT, f.marketSegment)}`, `${t.needs}: ${f.validationNeeds.map((v) => label(NEEDS, v)).join("; ") || "-"}`,
      `${t.nda}: ${f.ndaRequested ? "✓" : "-"}`, `${t.context}: ${f.context || "-"}`].join("\n"))}`;
  const calendly = `${CALENDLY_URL}?name=${encodeURIComponent(f.name)}&email=${encodeURIComponent(f.email)}`;

  const reset = useCallback(() => { setStep(1); setF(empty); setErrors({}); setLeadId(null); setScore("warm"); }, []);
  const onOpenChange = (v: boolean) => { setOpen(v); if (!v && (step === "done")) setTimeout(reset, 300); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger || <Button>{t.submit}</Button>}</DialogTrigger>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-2xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-lg sm:text-xl font-heading pr-6">{t.title}</DialogTitle>
          <DialogDescription className="text-sm">{t.subtitle}</DialogDescription>
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] sm:text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Lock className="h-3 w-3" />{t.b1}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{t.b2}</span>
            <span className="inline-flex items-center gap-1"><Award className="h-3 w-3" />{t.b3}</span>
          </div>
        </DialogHeader>

        {(step === 1 || step === 2) && (
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{t.step} {step} {t.of} 2 · {step === 1 ? t.s1 : t.s2}</span>
            <div className="h-1 flex-1 rounded-full bg-muted"><div className="h-1 rounded-full bg-primary transition-all" style={{ width: step === 1 ? "50%" : "100%" }} /></div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 pt-2">
            <Field label={t.name}><Input value={f.name} maxLength={100} autoComplete="name" onChange={(e) => set("name", e.target.value)} />{errors.name && <p className="text-xs text-destructive">{errors.name}</p>}</Field>
            <Field label={t.email}><Input type="email" value={f.email} maxLength={255} autoComplete="email" onChange={(e) => set("email", e.target.value)} />{errors.email && <p className="text-xs text-destructive">{errors.email}</p>}</Field>
            <Field label={t.company}><Input value={f.company} maxLength={200} autoComplete="organization" onChange={(e) => set("company", e.target.value)} />{errors.company && <p className="text-xs text-destructive">{errors.company}</p>}</Field>
            <Field label={t.job}>
              <Chips options={JOB} value={f.jobTitle} lang={lang} onChange={(v) => set("jobTitle", v)} error={errors.jobTitle} />
              {f.jobTitle === "other" && <Input className="mt-2" placeholder={t.jobOther} value={f.jobTitleOther} maxLength={100} onChange={(e) => set("jobTitleOther", e.target.value)} />}
            </Field>
            <Field label={t.phone} optional={t.optional}>
              <div className="flex gap-2">
                <Select value={f.phoneCountry} onValueChange={(v) => set("phoneCountry", v)}>
                  <SelectTrigger className="w-[112px] shrink-0"><SelectValue /></SelectTrigger>
                  <SelectContent>{latamCountries.map((c) => <SelectItem key={c.value} value={c.value}>{c.value === "OTHER" ? "+ ..." : `${c.value} ${c.dial}`}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="tel" inputMode="tel" autoComplete="tel-national" value={f.phone} maxLength={20} onChange={(e) => set("phone", e.target.value.replace(/[^\d\s()+-]/g, ""))} />
              </div>
            </Field>
            <Button className="w-full" onClick={next}>{t.next}<ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 pt-2">
            <Field label={t.profile}><Chips options={PROFILE} value={f.requesterProfile} lang={lang} onChange={(v) => set("requesterProfile", v)} error={errors.requesterProfile} /></Field>
            <Field label={t.side}><Chips options={SIDE} value={f.transactionSide} lang={lang} onChange={(v) => set("transactionSide", v)} error={errors.transactionSide} /></Field>
            <Field label={t.stage}><Chips options={STAGE} value={f.dealStage} lang={lang} onChange={(v) => set("dealStage", v)} error={errors.dealStage} /></Field>
            <Field label={t.timeline}><Chips options={TIMELINE} value={f.decisionTimeline} lang={lang} onChange={(v) => set("decisionTimeline", v)} error={errors.decisionTimeline} /></Field>
            <Field label={t.revenue}><Chips options={REVENUE} value={f.targetRevenue} lang={lang} onChange={(v) => set("targetRevenue", v)} error={errors.targetRevenue} /></Field>
            <Field label={t.segment} optional={t.optional}>
              <Select value={f.marketSegment} onValueChange={(v) => set("marketSegment", v)}>
                <SelectTrigger><SelectValue placeholder={t.segmentPh} /></SelectTrigger>
                <SelectContent>{SEGMENT.map((s) => <SelectItem key={s.v} value={s.v}>{s.l[lang]}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label={t.needs} optional={t.optional}><Chips options={NEEDS} value={f.validationNeeds} lang={lang} multi onChange={toggleNeed} /></Field>
            <Field label={t.context} optional={t.optional}><Textarea rows={3} maxLength={2000} placeholder={t.contextPh} value={f.context} onChange={(e) => set("context", e.target.value)} /></Field>
            <label className="flex items-start gap-3 text-sm cursor-pointer"><Checkbox className="mt-0.5" checked={f.ndaRequested} onCheckedChange={(v) => set("ndaRequested", v === true)} /><span>{t.nda}</span></label>
            <div>
              <label className="flex items-start gap-3 text-sm cursor-pointer">
                <Checkbox className="mt-0.5" checked={f.consent} onCheckedChange={(v) => set("consent", v === true)} />
                <span>{t.consentA} <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">{t.consentB}</a>. *</span>
              </label>
              {errors.consent && <p className="mt-1 text-xs text-destructive">{errors.consent}</p>}
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => setStep(1)} disabled={loading}><ArrowLeft className="mr-2 h-4 w-4" />{t.back}</Button>
              <Button className="flex-1" onClick={submit} disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t.submit}</Button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-4 pt-2 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
            <p className="text-base sm:text-lg font-medium">{score === "hot" ? t.hotTitle : t.warmTitle}</p>
            {score === "hot" ? (
              <iframe title="Calendly" src={`${calendly}&hide_gdpr_banner=1`} className="h-[620px] w-full rounded-md border border-border" />
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button variant="outline" asChild><a href={calendly} target="_blank" rel="noopener noreferrer"><CalendarDays className="mr-2 h-4 w-4" />{t.schedule}</a></Button>
                <Button onClick={() => onOpenChange(false)}>{t.close}</Button>
              </div>
            )}
          </div>
        )}

        {step === "error" && (
          <div className="space-y-4 pt-2 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
            <p className="text-base font-medium">{t.errTitle}</p>
            <p className="text-sm text-muted-foreground">{t.errText}</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={() => { setStep(2); submit(); }} disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t.retry}</Button>
              <Button variant="outline" asChild><a href={mailto}><Mail className="mr-2 h-4 w-4" />{t.mail}</a></Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DueDiligenceFormModal;
