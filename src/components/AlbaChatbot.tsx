import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Calendar, Mail, Loader2, Briefcase, Users, Brain, Phone, ChevronLeft, Check, ArrowRight, Sparkles, Trash2, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import albaAvatar from "@/assets/alba-avatar.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LeadData {
  // Qualification fields (collected FIRST)
  challenge: string;
  companySize: string;
  urgency: string;
  // Contact fields (collected AFTER qualification)
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  interest: string;
  timeline: string;
  phone: string;
  consent: boolean;
}

type LeadStep = "idle" | "challenge" | "companySize" | "urgency" | "name" | "email" | "company" | "jobTitle" | "interest" | "timeline" | "phone" | "consent" | "submitting" | "success";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/alba-chat`;

// Section mapping for navigation
const SECTION_MAP: Record<string, { id: string; label: string }> = {
  "servicos": { id: "servicos", label: "Serviços" },
  "services": { id: "servicos", label: "Serviços" },
  "ma": { id: "servicos", label: "M&A Integrado" },
  "m&a": { id: "servicos", label: "M&A Integrado" },
  "governanca": { id: "servicos", label: "Governança Corporativa" },
  "governança": { id: "servicos", label: "Governança Corporativa" },
  "governance": { id: "servicos", label: "Governança Corporativa" },
  "advisory": { id: "servicos", label: "Advisory Board" },
  "genai": { id: "servicos", label: "GenAI & Inovação" },
  "ia": { id: "servicos", label: "GenAI & Inovação" },
  "ai": { id: "servicos", label: "GenAI & Inovação" },
  "contato": { id: "contato", label: "Contato" },
  "contact": { id: "contato", label: "Contato" },
  "sobre": { id: "sobre", label: "Sobre" },
  "about": { id: "sobre", label: "Sobre" },
  "metodologia": { id: "metodologia", label: "Metodologia" },
  "methodology": { id: "metodologia", label: "Metodologia" },
  "lideranca": { id: "lideranca", label: "Liderança" },
  "liderança": { id: "lideranca", label: "Liderança" },
  "leadership": { id: "lideranca", label: "Liderança" },
  "agendar": { id: "agendamento", label: "Agendamento" },
  "schedule": { id: "agendamento", label: "Agendamento" },
  "carreiras": { id: "carreiras", label: "Carreiras" },
  "careers": { id: "carreiras", label: "Carreiras" },
};

const INTEREST_OPTIONS = [
  { value: "growth", label: "Growth Strategy & Go-to-Market" },
  { value: "governanca", label: "Governança & Advisory Board" },
  { value: "mentoria", label: "Mentoria Executiva" },
  { value: "ma", label: "M&A Integrado" },
  { value: "duediligence", label: "Due Diligence Comercial" },
  { value: "genai", label: "GenAI & Inovação" },
];

const TIMELINE_OPTIONS = [
  { value: "0-30", label: "0-30 dias" },
  { value: "31-90", label: "31-90 dias" },
  { value: "90+", label: "90+ dias" },
];

// Qualification options - BEFORE collecting contact info
const CHALLENGE_OPTIONS = [
  { value: "growth", label: "Escalar vendas/crescimento" },
  { value: "governance", label: "Profissionalizar gestão/governança" },
  { value: "ma", label: "Comprar/vender empresa" },
  { value: "efficiency", label: "Melhorar eficiência operacional" },
  { value: "leadership", label: "Desenvolver liderança" },
  { value: "other", label: "Outro desafio" },
];

const COMPANY_SIZE_OPTIONS = [
  { value: "startup", label: "Startup (até R$5M/ano)" },
  { value: "scaleup", label: "Scale-up (R$5M-50M/ano)" },
  { value: "midmarket", label: "Mid-market (R$50M-500M/ano)" },
  { value: "enterprise", label: "Enterprise (R$500M+/ano)" },
];

const URGENCY_OPTIONS = [
  { value: "urgent", label: "🔴 Urgente (preciso resolver agora)" },
  { value: "planning", label: "🟡 Planejando (próximos 3 meses)" },
  { value: "exploring", label: "🟢 Explorando (ainda estudando)" },
];

// Debug mode test data
const DEBUG_LEAD_DATA: LeadData = {
  challenge: "growth",
  companySize: "scaleup",
  urgency: "planning",
  name: "João Teste",
  email: "joao.teste@empresa.com.br",
  company: "Empresa Teste LTDA",
  jobTitle: "Diretor Comercial",
  interest: "growth",
  timeline: "31-90",
  phone: "(11) 99999-9999",
  consent: true,
};

const QUICK_ACTIONS = [
  { id: "services", label: "Conhecer serviços", icon: Briefcase, section: "servicos" },
  { id: "specialist", label: "Falar com especialista", icon: Users, action: "lead" },
  { id: "schedule", label: "Agendar diagnóstico", icon: Calendar, section: "agendamento" },
  { id: "contact", label: "Contato", icon: Mail, section: "contato" },
];

// Intent detection keywords
const COMMERCIAL_INTENTS = ["preço", "proposta", "reunião", "orçamento", "custo", "quanto custa", "consultor", "especialista", "agendar", "contratar", "investimento", "budget"];

// LocalStorage keys
const STORAGE_KEYS = {
  messages: "alba_chat_messages",
  interactionCount: "alba_interaction_count",
  sessionId: "alba_session_id",
  lastInteraction: "alba_last_interaction",
  leadDraft: "alba_lead_draft",
  leadStep: "alba_lead_step",
};

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = localStorage.getItem(STORAGE_KEYS.sessionId);
  if (!sessionId) {
    sessionId = `alba_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEYS.sessionId, sessionId);
  }
  return sessionId;
};

// Threshold for suggesting meeting
const MEETING_SUGGESTION_THRESHOLD = 5;

// 24 hours in milliseconds
const CHAT_EXPIRATION_MS = 24 * 60 * 60 * 1000;

// Lead capture steps configuration - qualification FIRST, then contact info
const LEAD_STEPS_CONFIG = [
  { key: "challenge", label: "Desafio", icon: "🎯" },
  { key: "companySize", label: "Porte", icon: "📊" },
  { key: "urgency", label: "Urgência", icon: "⏰" },
  { key: "name", label: "Nome", icon: "👤" },
  { key: "email", label: "Email", icon: "📧" },
  { key: "company", label: "Empresa", icon: "🏢" },
  { key: "jobTitle", label: "Cargo", icon: "💼" },
  { key: "interest", label: "Serviço", icon: "🛠️" },
  { key: "timeline", label: "Prazo", icon: "📅" },
  { key: "phone", label: "Telefone", icon: "📱" },
  { key: "consent", label: "Confirmar", icon: "✅" },
] as const;

// Get current step index for progress
const getStepIndex = (step: LeadStep): number => {
  const stepMap: Record<LeadStep, number> = {
    idle: -1,
    challenge: 0,
    companySize: 1,
    urgency: 2,
    name: 3,
    email: 4,
    company: 5,
    jobTitle: 6,
    interest: 7,
    timeline: 8,
    phone: 9,
    consent: 10,
    submitting: 11,
    success: 11,
  };
  return stepMap[step];
};

// Phone mask utility function with international support
const formatPhoneNumber = (value: string): string => {
  // Check if it starts with + (international format)
  const hasPlus = value.startsWith("+");
  
  // Remove all non-digits
  let digits = value.replace(/\D/g, "");
  
  // If started with +, handle international format
  if (hasPlus || digits.startsWith("55")) {
    // Remove leading 55 if present to normalize
    if (digits.startsWith("55")) {
      digits = digits.slice(2);
    }
    
    // Limit to 11 digits (DDD + 9 digits)
    const limited = digits.slice(0, 11);
    
    // Apply international mask: +55 (11) 99999-9999
    if (limited.length === 0) return "+55 ";
    if (limited.length <= 2) return `+55 (${limited}`;
    if (limited.length <= 6) return `+55 (${limited.slice(0, 2)}) ${limited.slice(2)}`;
    if (limited.length <= 10) return `+55 (${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
    return `+55 (${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  }
  
  // National format (default)
  // Limit to 11 digits (Brazilian mobile with DDD)
  const limited = digits.slice(0, 11);
  
  // Apply mask based on length: (11) 99999-9999
  if (limited.length === 0) return "";
  if (limited.length <= 2) return `(${limited}`;
  if (limited.length <= 6) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  if (limited.length <= 10) return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
  return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
};

// Check if input looks like a phone number edit (starts with "5 " for field 5)
const isPhoneFieldEdit = (value: string): boolean => {
  return /^5\s/.test(value.trim());
};

// Extract and format phone from edit command
const formatPhoneEditCommand = (value: string): string => {
  const match = value.match(/^5\s+(.+)$/);
  if (match) {
    return `5 ${formatPhoneNumber(match[1])}`;
  }
  return value;
};

const AlbaChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const [hasSuggestedMeeting, setHasSuggestedMeeting] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  
  // Lead capture state
  const [leadStep, setLeadStep] = useState<LeadStep>("idle");
  const [leadData, setLeadData] = useState<LeadData>({
    challenge: "",
    companySize: "",
    urgency: "",
    name: "",
    email: "",
    company: "",
    jobTitle: "",
    interest: "",
    timeline: "",
    phone: "",
    consent: false,
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousScrollPosition = useRef<number | null>(null);

  // Load persisted data from localStorage (with 24h expiration)
  useEffect(() => {
    try {
      const lastInteraction = localStorage.getItem(STORAGE_KEYS.lastInteraction);
      const now = Date.now();
      
      // Check if chat has expired (24 hours since last interaction)
      if (lastInteraction) {
        const lastTime = parseInt(lastInteraction, 10);
        if (!isNaN(lastTime) && now - lastTime > CHAT_EXPIRATION_MS) {
          // Clear expired data
          localStorage.removeItem(STORAGE_KEYS.messages);
          localStorage.removeItem(STORAGE_KEYS.interactionCount);
          localStorage.removeItem(STORAGE_KEYS.lastInteraction);
          console.log("Chat history expired after 24h, cleared.");
          return;
        }
      }
      
      const savedMessages = localStorage.getItem(STORAGE_KEYS.messages);
      const savedCount = localStorage.getItem(STORAGE_KEYS.interactionCount);
      
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
      
      if (savedCount) {
        const count = parseInt(savedCount, 10);
        if (!isNaN(count)) {
          setInteractionCount(count);
        }
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  }, []);

  // Load lead draft from localStorage
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEYS.leadDraft);
      const savedStep = localStorage.getItem(STORAGE_KEYS.leadStep);
      
      if (savedDraft && savedStep) {
        const parsedDraft = JSON.parse(savedDraft) as LeadData;
        const parsedStep = savedStep as LeadStep;
        
        // Only restore if step is valid and not idle/success/submitting
        if (parsedStep !== "idle" && parsedStep !== "success" && parsedStep !== "submitting") {
          setLeadData(parsedDraft);
          setLeadStep(parsedStep);
          
          // Add recovery message
          setMessages(prev => {
            // Check if recovery message already exists
            const hasRecoveryMessage = prev.some(m => m.content.includes("rascunho salvo"));
            if (!hasRecoveryMessage && prev.length > 0) {
              return [...prev, {
                role: "assistant",
                content: `📝 Encontrei seu rascunho salvo! Vamos continuar de onde paramos?\n\n**Dados recuperados:**\n${parsedDraft.challenge ? `• Desafio: ${CHALLENGE_OPTIONS.find(o => o.value === parsedDraft.challenge)?.label || parsedDraft.challenge}\n` : ""}${parsedDraft.companySize ? `• Porte: ${COMPANY_SIZE_OPTIONS.find(o => o.value === parsedDraft.companySize)?.label || parsedDraft.companySize}\n` : ""}${parsedDraft.urgency ? `• Urgência: ${URGENCY_OPTIONS.find(o => o.value === parsedDraft.urgency)?.label || parsedDraft.urgency}\n` : ""}${parsedDraft.name ? `• Nome: ${parsedDraft.name}\n` : ""}${parsedDraft.email ? `• Email: ${parsedDraft.email}\n` : ""}${parsedDraft.company ? `• Empresa: ${parsedDraft.company}\n` : ""}${parsedDraft.jobTitle ? `• Cargo: ${parsedDraft.jobTitle}\n` : ""}${parsedDraft.interest ? `• Serviço: ${INTEREST_OPTIONS.find(o => o.value === parsedDraft.interest)?.label || parsedDraft.interest}\n` : ""}${parsedDraft.phone ? `• Telefone: ${parsedDraft.phone}\n` : ""}\nContinue preenchendo ou clique em **Cancelar** para começar do zero.`
              }];
            }
            return prev;
          });
        }
      }
    } catch (error) {
      console.error("Error loading lead draft:", error);
    }
  }, []);

  // Persist lead draft to localStorage
  useEffect(() => {
    try {
      if (leadStep !== "idle" && leadStep !== "success") {
        localStorage.setItem(STORAGE_KEYS.leadDraft, JSON.stringify(leadData));
        localStorage.setItem(STORAGE_KEYS.leadStep, leadStep);
      }
    } catch (error) {
      console.error("Error saving lead draft:", error);
    }
  }, [leadData, leadStep]);

  // Clear lead draft when completed or cancelled
  const clearLeadDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.leadDraft);
      localStorage.removeItem(STORAGE_KEYS.leadStep);
    } catch (error) {
      console.error("Error clearing lead draft:", error);
    }
  }, []);

  // Persist messages to localStorage and update last interaction timestamp
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
        localStorage.setItem(STORAGE_KEYS.lastInteraction, String(Date.now()));
      } catch (error) {
        console.error("Error saving chat history:", error);
      }
    }
  }, [messages]);

  // Persist interaction count
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.interactionCount, String(interactionCount));
    } catch (error) {
      console.error("Error saving interaction count:", error);
    }
  }, [interactionCount]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Debug mode keyboard shortcut (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setIsDebugMode(prev => {
          const newValue = !prev;
          toast({
            title: newValue ? "🧪 Modo Debug ATIVO" : "Modo Debug desativado",
            description: newValue 
              ? "Use o botão 'Auto-preencher' para testar o fluxo rapidamente" 
              : "Voltando ao modo normal",
          });
          return newValue;
        });
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Entry animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), prefersReducedMotion ? 0 : 1000);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  // Track events - now sends to alba_analytics table
  const trackEvent = useCallback(async (event: string, data?: Record<string, unknown>) => {
    console.log(`Event: ${event}`, data);
    
    try {
      const sessionId = getSessionId();
      // Using type assertion since types may not be updated yet
      await (supabase.from('alba_analytics') as any).insert({
        session_id: sessionId,
        event_type: event,
        event_data: data || {},
        service_interest: (data?.service_interest as string) || null,
        lead_submitted: event === 'lead_success',
        messages_count: event === 'message' ? 1 : 0,
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, []);

  // Auto-fill debug data function
  const autoFillDebugData = useCallback(() => {
    if (!isDebugMode) return;
    
    // Fill all lead data at once
    setLeadData(DEBUG_LEAD_DATA);
    
    // Jump to consent step with all previous messages
    setMessages(prev => [...prev,
      { role: "assistant", content: "🧪 **[DEBUG] Auto-preenchendo dados de teste...**" },
      { role: "user", content: CHALLENGE_OPTIONS.find(o => o.value === DEBUG_LEAD_DATA.challenge)?.label || "" },
      { role: "assistant", content: "📊 **Qual o porte da sua empresa?**" },
      { role: "user", content: COMPANY_SIZE_OPTIONS.find(o => o.value === DEBUG_LEAD_DATA.companySize)?.label || "" },
      { role: "assistant", content: "⏰ **Qual a urgência dessa necessidade?**" },
      { role: "user", content: URGENCY_OPTIONS.find(o => o.value === DEBUG_LEAD_DATA.urgency)?.label || "" },
      { role: "assistant", content: "Perfeito! Agora vou coletar seus dados. ✨\n\n**Qual é o seu nome completo?**" },
      { role: "user", content: DEBUG_LEAD_DATA.name },
      { role: "assistant", content: "E qual é o seu **e-mail corporativo**?" },
      { role: "user", content: DEBUG_LEAD_DATA.email },
      { role: "assistant", content: "Em qual **empresa** você trabalha?" },
      { role: "user", content: DEBUG_LEAD_DATA.company },
      { role: "assistant", content: "E qual é o seu **cargo**?" },
      { role: "user", content: DEBUG_LEAD_DATA.jobTitle },
      { role: "assistant", content: "📋 **Qual serviço mais te interessa?**" },
      { role: "user", content: INTEREST_OPTIONS.find(o => o.value === DEBUG_LEAD_DATA.interest)?.label || "" },
      { role: "assistant", content: "⏱️ **Qual o prazo para tomada de decisão?**" },
      { role: "user", content: TIMELINE_OPTIONS.find(o => o.value === DEBUG_LEAD_DATA.timeline)?.label || "" },
      { role: "assistant", content: "📱 **Qual seu telefone para contato?** (com DDD)" },
      { role: "user", content: DEBUG_LEAD_DATA.phone },
      { role: "assistant", content: "✅ **Por favor, confirme seu consentimento** para que possamos entrar em contato:\n\n*Autorizo a Albatross Consulting a entrar em contato comigo com informações sobre serviços e conteúdos relevantes, conforme a LGPD.*" },
    ]);
    
    setLeadStep("consent");
    
    toast({
      title: "🧪 Dados preenchidos!",
      description: "Clique em 'Sim, autorizo' para testar o envio.",
    });
    
    trackEvent("debug_autofill");
  }, [isDebugMode, trackEvent]);

  useEffect(() => {
    if (isOpen) {
      trackEvent("chat_opened");
    }
  }, [isOpen, trackEvent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current && leadStep === "idle") {
      inputRef.current.focus();
    }
  }, [isOpen, leadStep]);

  // Navigate to section with highlight
  const navigateToSection = useCallback((sectionId: string) => {
    previousScrollPosition.current = window.scrollY;
    setIsOpen(false);
    
    const element = document.getElementById(sectionId);
    if (element) {
      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height + 20 : 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
      
      // Add temporary highlight
      element.classList.add("ring-2", "ring-primary", "ring-offset-4", "ring-offset-background", "transition-all", "duration-500");
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-primary", "ring-offset-4", "ring-offset-background");
      }, 2000);
      
      trackEvent("route_to_section", { section: sectionId });
    }
  }, [prefersReducedMotion, trackEvent]);

  // Detect commercial intent
  const detectCommercialIntent = useCallback((text: string): boolean => {
    const lowerText = text.toLowerCase();
    return COMMERCIAL_INTENTS.some(intent => lowerText.includes(intent));
  }, []);

  // Suggest meeting after threshold interactions
  const suggestMeeting = useCallback(() => {
    if (hasSuggestedMeeting) return;
    
    setHasSuggestedMeeting(true);
    trackEvent("meeting_suggestion_triggered", { interactionCount });
    
    setMessages(prev => [...prev, {
      role: "assistant",
      content: `Prezado(a), permita-me expressar minha sincera gratidão pelo seu interesse em conhecer a Albatross Consulting. É verdadeiramente um prazer acompanhá-lo(a) nesta jornada de descoberta.

Após nossa rica conversa, percebo que suas necessidades merecem atenção personalizada de nossa equipe de especialistas. Seria uma honra para nós proporcionar-lhe uma consultoria exclusiva.

**Permita-me convidá-lo(a) para um diagnóstico estratégico gratuito**, onde poderemos explorar em profundidade as melhores soluções para sua organização.

[CTA:AGENDAR]

Estou à disposição para quaisquer outras dúvidas, mas confio que uma conversa direta com nosso time trará ainda mais valor à sua experiência.`
    }]);
  }, [hasSuggestedMeeting, interactionCount, trackEvent]);

  // Start lead capture flow - NOW starts with QUALIFICATION
  const startLeadCapture = useCallback(() => {
    setLeadStep("challenge");
    trackEvent("lead_started");
    setMessages(prev => [...prev, {
      role: "assistant",
      content: "Excelente! Para conectá-lo com o especialista certo, vou fazer 3 perguntas rápidas de qualificação. 🎯\n\n**Qual é o seu maior desafio atual?**"
    }]);
  }, [trackEvent]);

  // Handle qualification step selection
  const handleChallengeSelect = useCallback((challenge: string) => {
    const challengeLabel = CHALLENGE_OPTIONS.find(o => o.value === challenge)?.label || challenge;
    setLeadData(prev => ({ ...prev, challenge }));
    setMessages(prev => [...prev, 
      { role: "user", content: challengeLabel },
      { role: "assistant", content: "📊 **Qual o porte da sua empresa?** (aproximadamente)" }
    ]);
    setLeadStep("companySize");
    trackEvent("qualification_challenge", { challenge: challengeLabel });
  }, [trackEvent]);

  const handleCompanySizeSelect = useCallback((companySize: string) => {
    const sizeLabel = COMPANY_SIZE_OPTIONS.find(o => o.value === companySize)?.label || companySize;
    setLeadData(prev => ({ ...prev, companySize }));
    setMessages(prev => [...prev, 
      { role: "user", content: sizeLabel },
      { role: "assistant", content: "⏰ **Qual a urgência dessa necessidade?**" }
    ]);
    setLeadStep("urgency");
    trackEvent("qualification_size", { companySize: sizeLabel });
  }, [trackEvent]);

  const handleUrgencySelect = useCallback((urgency: string) => {
    const urgencyLabel = URGENCY_OPTIONS.find(o => o.value === urgency)?.label || urgency;
    setLeadData(prev => ({ ...prev, urgency }));
    setMessages(prev => [...prev, 
      { role: "user", content: urgencyLabel },
      { role: "assistant", content: "Perfeito! Agora vou coletar seus dados para nosso especialista entrar em contato. ✨\n\n**Qual é o seu nome completo?**" }
    ]);
    setLeadStep("name");
    trackEvent("qualification_urgency", { urgency: urgencyLabel });
  }, [trackEvent]);

  // Handle lead form input
  const handleLeadInput = useCallback(async (value: string) => {
    setMessages(prev => [...prev, { role: "user", content: value }]);
    
    switch (leadStep) {
      case "name":
        setLeadData(prev => ({ ...prev, name: value }));
        setLeadStep("email");
        setMessages(prev => [...prev, { role: "assistant", content: "E qual é o seu **e-mail corporativo**?" }]);
        break;
        
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setMessages(prev => [...prev, { role: "assistant", content: "Por favor, informe um e-mail válido." }]);
          return;
        }
        setLeadData(prev => ({ ...prev, email: value }));
        setLeadStep("company");
        setMessages(prev => [...prev, { role: "assistant", content: "Em qual **empresa** você trabalha?" }]);
        break;
        
      case "company":
        setLeadData(prev => ({ ...prev, company: value }));
        setLeadStep("jobTitle");
        setMessages(prev => [...prev, { role: "assistant", content: "E qual é o seu **cargo**?" }]);
        break;
        
      case "jobTitle":
        setLeadData(prev => ({ ...prev, jobTitle: value }));
        setLeadStep("interest");
        break;
        
      case "phone":
        // Validate Brazilian phone format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX or +55 XX XXXXX-XXXX
        const phoneDigits = value.replace(/\D/g, "");
        if (phoneDigits.length < 10 || phoneDigits.length > 13) {
          setMessages(prev => [...prev, { 
            role: "assistant", 
            content: "Por favor, informe um telefone válido no formato brasileiro.\n\nExemplos: **(11) 99999-9999** ou **+55 11 99999-9999**" 
          }]);
          return;
        }
        setLeadData(prev => ({ ...prev, phone: value }));
        setLeadStep("consent");
        break;
    }
  }, [leadStep]);

  // Handle interest selection
  const handleInterestSelect = useCallback((interest: string) => {
    const interestLabel = INTEREST_OPTIONS.find(o => o.value === interest)?.label || interest;
    setLeadData(prev => ({ ...prev, interest }));
    setMessages(prev => [...prev, 
      { role: "user", content: interestLabel },
      { role: "assistant", content: "Qual é o seu prazo aproximado? (opcional - pode pular)" }
    ]);
    setLeadStep("timeline");
    
    // Track service interest
    trackEvent("service_interest", { service_interest: interestLabel });
  }, [trackEvent]);

  // Handle timeline selection
  const handleTimelineSelect = useCallback((timeline: string) => {
    setLeadData(prev => ({ ...prev, timeline }));
    setMessages(prev => [...prev, 
      { role: "user", content: TIMELINE_OPTIONS.find(o => o.value === timeline)?.label || "Prefiro não informar" },
      { role: "assistant", content: "Qual seu **telefone/WhatsApp** para contato?" }
    ]);
    setLeadStep("phone");
  }, []);

  // Skip optional fields (only timeline is optional now)
  const skipOptionalField = useCallback(() => {
    if (leadStep === "timeline") {
      setMessages(prev => [...prev, 
        { role: "user", content: "Pular" },
        { role: "assistant", content: "Qual seu **telefone/WhatsApp** para contato?" }
      ]);
      setLeadStep("phone");
    }
  }, [leadStep]);

  // Cancel lead capture and return to normal chat
  const cancelLeadCapture = useCallback(() => {
    setLeadStep("idle");
    setLeadData({
      challenge: "",
      companySize: "",
      urgency: "",
      name: "",
      email: "",
      company: "",
      jobTitle: "",
      interest: "",
      timeline: "",
      phone: "",
      consent: false,
    });
    clearLeadDraft(); // Clear saved draft
    setMessages(prev => [...prev, 
      { role: "user", content: "Cancelar" },
      { role: "assistant", content: "Sem problemas! O processo foi cancelado. Como posso ajudá-lo de outra forma? 😊" }
    ]);
    trackEvent("lead_cancelled");
  }, [trackEvent, clearLeadDraft]);

  // Submit lead to HubSpot
  const submitLead = useCallback(async () => {
    setLeadStep("submitting");
    trackEvent("lead_submitting");
    
    try {
      const currentUrl = window.location.href;
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get("utm_source") || "";
      const utmMedium = urlParams.get("utm_medium") || "";
      const utmCampaign = urlParams.get("utm_campaign") || "";
      
      // Create brief summary for quick reference (limit to avoid exceeding HubSpot limits)
      const briefSummary = messages
        .filter(m => m.role === "user")
        .map(m => m.content.substring(0, 100))
        .slice(-5) // Only last 5 user messages
        .join(" | ")
        .substring(0, 500);
      
      // Create truncated chat transcript (max 2000 chars to stay within limits)
      const fullChatTranscript = messages
        .slice(-10) // Only last 10 messages
        .map(m => `[${m.role === "user" ? "LEAD" : "ALBA"}]: ${m.content.substring(0, 200)}`)
        .join("\n")
        .substring(0, 2000);
      
      const { data, error } = await supabase.functions.invoke("hubspot-contact", {
        body: {
          name: leadData.name,
          email: leadData.email,
          company: leadData.company,
          message: `
══════════════════════════════════════
🎯 QUALIFICAÇÃO DO LEAD
══════════════════════════════════════
Desafio Principal: ${CHALLENGE_OPTIONS.find(o => o.value === leadData.challenge)?.label || leadData.challenge || "Não informado"}
Porte da Empresa: ${COMPANY_SIZE_OPTIONS.find(o => o.value === leadData.companySize)?.label || leadData.companySize || "Não informado"}
Urgência: ${URGENCY_OPTIONS.find(o => o.value === leadData.urgency)?.label || leadData.urgency || "Não informado"}

══════════════════════════════════════
📋 INFORMAÇÕES DO LEAD
══════════════════════════════════════
Nome: ${leadData.name}
Email: ${leadData.email}
Empresa: ${leadData.company || "Não informada"}
Cargo: ${leadData.jobTitle || "Não informado"}
Telefone: ${leadData.phone || "Não informado"}

📌 Serviço de Interesse: ${INTEREST_OPTIONS.find(o => o.value === leadData.interest)?.label || leadData.interest}
⏰ Prazo para Decisão: ${TIMELINE_OPTIONS.find(o => o.value === leadData.timeline)?.label || "Não informado"}

══════════════════════════════════════
💬 RESUMO DA CONVERSA
══════════════════════════════════════
${briefSummary}

══════════════════════════════════════
📝 TRANSCRIÇÃO COMPLETA DO CHAT
══════════════════════════════════════
${fullChatTranscript}

══════════════════════════════════════
🔗 METADATA & RASTREAMENTO
══════════════════════════════════════
Página de Origem: ${currentUrl}
UTM Source: ${utmSource || "direto"}
UTM Medium: ${utmMedium || "orgânico"}
UTM Campaign: ${utmCampaign || "n/a"}
Data/Hora: ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
Consentimento LGPD: ✅ Aceito em ${new Date().toISOString()}
          `.trim(),
          sectionTitle: "Alba Chatbot - Lead Qualificado",
        },
      });
      
      if (error) throw error;
      
      setLeadStep("success");
      clearLeadDraft(); // Clear saved draft on success
      trackEvent("lead_success", { hubspotId: data?.hubspotId, service_interest: leadData.interest });
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Perfeito! ✅ Suas informações foram enviadas. Nossa equipe entrará em contato em breve. O que gostaria de fazer agora?"
      }]);
      
    } catch (error) {
      console.error("Lead submission error:", error);
      trackEvent("lead_error", { error: String(error) });
      
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro. Tente novamente ou use o contato direto.",
        variant: "destructive",
      });
      
      setLeadStep("idle");
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Desculpe, houve um erro ao enviar. Você pode tentar novamente ou entrar em contato diretamente."
      }]);
    }
  }, [leadData, messages, trackEvent, clearLeadDraft]);

  // Handle quick action click
  const handleQuickAction = useCallback((action: typeof QUICK_ACTIONS[0]) => {
    trackEvent("click_quick_action", { action: action.id });
    
    if (action.action === "lead") {
      startLeadCapture();
    } else if (action.section) {
      navigateToSection(action.section);
    }
  }, [navigateToSection, startLeadCapture, trackEvent]);

  // Send message to AI
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setInteractionCount(prev => prev + 1);
    setDynamicSuggestions([]); // Clear previous suggestions
    
    // Track message event
    trackEvent("message", { message_type: "user" });
    
    // Track first message for funnel
    if (messages.length === 0) {
      trackEvent("first_message");
    }

    // Check for commercial intent
    if (detectCommercialIntent(input) || interactionCount >= 1) {
      // Check if should start lead capture
      const shouldCaptureLead = detectCommercialIntent(input) || 
        (interactionCount >= 1 && messages.some(m => 
          m.role === "user" && COMMERCIAL_INTENTS.some(i => m.content.toLowerCase().includes(i))
        ));
        
      if (shouldCaptureLead && leadStep === "idle") {
        setIsLoading(false);
        startLeadCapture();
        return;
      }
    }

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
      
      setFailureCount(0);
      
      // Check if we should suggest a meeting after threshold interactions
      const newInteractionCount = interactionCount + 1;
      if (newInteractionCount >= MEETING_SUGGESTION_THRESHOLD && !hasSuggestedMeeting && leadStep === "idle") {
        // Add a small delay to let the AI response finish displaying
        setTimeout(() => {
          suggestMeeting();
        }, 1500);
      }
      
    } catch (error) {
      console.error("Chat error:", error);
      setFailureCount(prev => prev + 1);
      
      if (failureCount >= 1) {
        trackEvent("handoff_requested");
        setMessages(prev => [
          ...prev,
          { 
            role: "assistant", 
            content: "Parece que estou tendo dificuldades. Que tal falar diretamente com nossa equipe? Posso ajudá-lo a agendar uma conversa ou enviar um email." 
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { 
            role: "assistant", 
            content: "Desculpe, ocorreu um erro. Por favor, tente novamente ou entre em contato diretamente pelo email leone@albatross.consulting" 
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (leadStep !== "idle" && leadStep !== "submitting" && leadStep !== "success" && leadStep !== "interest" && leadStep !== "timeline" && leadStep !== "consent") {
        handleLeadInput(input);
        setInput("");
      } else {
        sendMessage();
      }
    }
  };

  // Animation variants - using 'as const' for type safety
  const buttonVariants = {
    hidden: { scale: 0.75, opacity: 0, y: 16 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: prefersReducedMotion 
        ? { duration: 0 }
        : { type: "spring" as const, stiffness: 300, damping: 25 }
    },
    exit: { scale: 0, opacity: 0 },
    hover: prefersReducedMotion ? {} : { scale: 1.05 },
    tap: prefersReducedMotion ? {} : { scale: 0.95 },
  };

  const panelVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: prefersReducedMotion ? 0 : 0.26, 
        ease: [0.4, 0, 0.2, 1] as const
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 10,
      transition: { duration: prefersReducedMotion ? 0 : 0.2 }
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.2 }
    },
  };

  const pulseClass = prefersReducedMotion ? "" : "animate-pulse";

  // Extract suggestions from message content
  const extractSuggestions = useCallback((content: string): { cleanContent: string; suggestions: string[] } => {
    // Try with closing tag first
    const suggestionsMatch = content.match(/\[SUGESTOES\]\s*([\s\S]*?)\s*\[\/SUGESTOES\]/);
    if (suggestionsMatch) {
      const suggestionsText = suggestionsMatch[1].trim();
      const suggestions = suggestionsText.split("|").map(s => s.trim()).filter(s => s.length > 0);
      const cleanContent = content.replace(/\[SUGESTOES\][\s\S]*?\[\/SUGESTOES\]/g, "").trim();
      return { cleanContent, suggestions };
    }
    
    // Fallback: handle unclosed [SUGESTOES] tag (capture everything after it)
    const unclosedMatch = content.match(/\[SUGESTOES\]\s*([\s\S]*?)$/);
    if (unclosedMatch) {
      const suggestionsText = unclosedMatch[1].trim();
      const suggestions = suggestionsText.split("|").map(s => s.trim()).filter(s => s.length > 0);
      const cleanContent = content.replace(/\[SUGESTOES\][\s\S]*$/g, "").trim();
      return { cleanContent, suggestions };
    }
    
    return { cleanContent: content, suggestions: [] };
  }, []);

  // Update suggestions when last assistant message changes
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant" && !isLoading) {
      const { suggestions } = extractSuggestions(lastMessage.content);
      if (suggestions.length > 0) {
        setDynamicSuggestions(suggestions);
      }
    }
  }, [messages, isLoading, extractSuggestions]);

  // Render message content with CTAs (excludes suggestions block)
  const renderMessageContent = (content: string) => {
    // Remove suggestions block from display
    const { cleanContent } = extractSuggestions(content);
    const parts = cleanContent.split(/(\*\*[^*]+\*\*|\[CTA:AGENDAR\]|\[CTA:EMAIL\]|\[CTA:LEAD\]|\[NAV:[^\]]+\])/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part === "[CTA:AGENDAR]") {
        return (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="mt-2 mr-2 gap-2 bg-primary/10 border-primary/30 hover:bg-primary/20"
            onClick={() => navigateToSection("agendamento")}
          >
            <Calendar className="w-4 h-4" />
            Agendar Conversa
          </Button>
        );
      }
      if (part === "[CTA:EMAIL]") {
        return (
          <a
            key={index}
            href="mailto:leone@albatross.consulting"
            className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 text-sm rounded-md bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Enviar Email
          </a>
        );
      }
      if (part === "[CTA:LEAD]") {
        return (
          <Button
            key={index}
            variant="default"
            size="sm"
            className="mt-2 mr-2 gap-2"
            onClick={startLeadCapture}
          >
            <Users className="w-4 h-4" />
            Falar com Especialista
          </Button>
        );
      }
      if (part.startsWith("[NAV:") && part.endsWith("]")) {
        const sectionKey = part.slice(5, -1).toLowerCase();
        const section = SECTION_MAP[sectionKey];
        if (section) {
          return (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="mt-2 mr-2 gap-2"
              onClick={() => navigateToSection(section.id)}
            >
              <ArrowRight className="w-4 h-4" />
              Ver {section.label}
            </Button>
          );
        }
      }
      return part;
    });
  };

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
    setDynamicSuggestions([]);
    // Trigger send after setting input
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      sendMessage();
    }, 50);
  }, []);

  return (
    <>
      {/* Floating Avatar Button */}
      <AnimatePresence>
        {isVisible && !isOpen && (
          <motion.button
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsOpen(true)}
            className={cn(
              "fixed bottom-20 sm:bottom-6 right-6 z-50 p-0 rounded-full shadow-2xl",
              "bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-primary/50",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
              "min-w-[var(--alba-min-touch)] min-h-[var(--alba-min-touch)]"
            )}
            aria-label="Abrir chat com Alba, assistente virtual da Albatross"
            style={{
              width: "var(--alba-avatar-mobile)",
              height: "var(--alba-avatar-mobile)",
            }}
          >
            <img 
              src={albaAvatar} 
              alt="Alba - Assistente Virtual Albatross" 
              className="w-full h-full rounded-full object-cover"
              style={{
                width: "var(--alba-avatar-mobile)",
                height: "var(--alba-avatar-mobile)",
              }}
            />
            <span className={cn(
              "absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background",
              pulseClass
            )} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed bottom-20 sm:bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)]",
              "bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50",
              "flex flex-col overflow-hidden"
            )}
            role="dialog"
            aria-label="Chat com Alba"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/50">
              <div className="relative flex-shrink-0">
                <img 
                  src={albaAvatar} 
                  alt="Alba" 
                  className="rounded-full object-cover border-2 border-primary/30"
                  style={{ width: "var(--alba-avatar-header)", height: "var(--alba-avatar-header)" }}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">Alba</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium whitespace-nowrap">Online</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">Assistente Albatross Consulting</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Debug mode button */}
                {isDebugMode && leadStep === "idle" && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex gap-1.5 text-xs text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 px-2 h-8 animate-pulse"
                        onClick={autoFillDebugData}
                        aria-label="Auto-preencher dados de teste"
                      >
                        <Bug className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Auto-fill</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-popover text-popover-foreground border border-border shadow-lg">
                      <p>🧪 Preencher dados automaticamente (modo debug)</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10 px-2 h-8"
                        onClick={() => navigateToSection("agendamento")}
                        aria-label="Agendar reunião"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Agendar</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-popover text-popover-foreground border border-border shadow-lg">
                      <p>Agendar uma reunião com nossa equipe</p>
                    </TooltipContent>
                  </Tooltip>
                  <AlertDialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild disabled={messages.length === 0}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-8 w-8 rounded-full",
                              messages.length > 0 
                                ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
                                : "text-muted-foreground/40 cursor-not-allowed"
                            )}
                            aria-label="Limpar conversa"
                            disabled={messages.length === 0}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-popover text-popover-foreground border border-border shadow-lg">
                        <p>{messages.length > 0 ? "Limpar conversa" : "Nenhuma conversa para limpar"}</p>
                      </TooltipContent>
                    </Tooltip>
                    <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Limpar histórico do chat?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Essa ação não pode ser desfeita. Toda a conversa com Alba será apagada permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => {
                            setMessages([]);
                            setInteractionCount(0);
                            setHasSuggestedMeeting(false);
                            setLeadStep("idle");
                            setDynamicSuggestions([]);
                            localStorage.removeItem(STORAGE_KEYS.messages);
                            localStorage.removeItem(STORAGE_KEYS.interactionCount);
                            localStorage.removeItem(STORAGE_KEYS.lastInteraction);
                            trackEvent("chat_cleared");
                            toast({
                              title: "Conversa limpa",
                              description: "O histórico do chat foi apagado com sucesso.",
                            });
                          }}
                        >
                          Limpar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TooltipProvider>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-full"
                  aria-label="Fechar chat"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Lead Capture Progress Indicator */}
            {leadStep !== "idle" && leadStep !== "submitting" && leadStep !== "success" && (
              <div className="px-3 py-2 border-b border-border/30 bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-foreground">
                    Qualificação: {LEAD_STEPS_CONFIG[getStepIndex(leadStep)]?.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {getStepIndex(leadStep) + 1} de {LEAD_STEPS_CONFIG.length}
                  </span>
                </div>
                <div className="flex gap-1">
                  {LEAD_STEPS_CONFIG.map((step, index) => {
                    const currentIndex = getStepIndex(leadStep);
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    
                    return (
                      <div
                        key={step.key}
                        className={cn(
                          "h-1.5 flex-1 rounded-full transition-all duration-300",
                          isCompleted && "bg-primary",
                          isCurrent && "bg-primary/60 animate-pulse",
                          !isCompleted && !isCurrent && "bg-muted"
                        )}
                        title={step.label}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1.5">
                  {LEAD_STEPS_CONFIG.map((step, index) => {
                    const currentIndex = getStepIndex(leadStep);
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    
                    return (
                      <span
                        key={step.key}
                        className={cn(
                          "text-[10px] transition-all duration-300",
                          isCompleted && "text-primary",
                          isCurrent && "text-primary font-medium",
                          !isCompleted && !isCurrent && "text-muted-foreground/50"
                        )}
                        title={step.label}
                      >
                        {step.icon}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Actions - Fixed at top (hide on success state) */}
            {leadStep !== "success" && (
              <div className="px-3 py-2 border-b border-border/30 bg-muted/30">
                <div className="grid grid-cols-2 gap-1.5">
                  {QUICK_ACTIONS.map((action) => (
                    <Button
                      key={action.id}
                      variant="ghost"
                      size="sm"
                      className="text-xs gap-1.5 h-8 px-2 bg-background/50 hover:bg-primary/10 justify-start"
                      onClick={() => handleQuickAction(action)}
                    >
                      <action.icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && leadStep === "idle" && (
                <motion.div 
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center py-6"
                >
                  <img 
                    src={albaAvatar} 
                    alt="Alba" 
                    className="rounded-full mx-auto mb-4 border-2 border-primary/30"
                    style={{ width: "var(--alba-avatar-welcome)", height: "var(--alba-avatar-welcome)" }}
                  />
                  <h4 className="font-medium text-foreground mb-2">Olá! Eu sou o Alba 👋</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Assistente virtual da Albatross. Como posso ajudá-lo?
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      "Como acelerar vendas B2B?",
                      "M&A faz sentido pra mim?",
                      "Preciso de governança agora?",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInput(suggestion);
                          setTimeout(() => sendMessage(), 100);
                        }}
                        className="px-3 py-1.5 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={cn(
                    "flex gap-2",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <img 
                      src={albaAvatar} 
                      alt="Alba" 
                      className="rounded-full object-cover flex-shrink-0"
                      style={{ width: "var(--alba-avatar-message)", height: "var(--alba-avatar-message)" }}
                    />
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    )}
                  >
                    {message.role === "assistant" 
                      ? renderMessageContent(message.content)
                      : message.content
                    }
                  </div>
                </motion.div>
              ))}

              {/* Dynamic Suggestions - after messages */}
              {dynamicSuggestions.length > 0 && !isLoading && leadStep === "idle" && messages.length > 0 && (
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap gap-2 ml-10 mt-2"
                >
                  {dynamicSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1.5 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                    >
                      {suggestion}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* QUALIFICATION STEPS - collect before contact info */}
              {leadStep === "challenge" && (
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap gap-2 ml-10"
                >
                  {CHALLENGE_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleChallengeSelect(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </motion.div>
              )}

              {leadStep === "companySize" && (
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap gap-2 ml-10"
                >
                  {COMPANY_SIZE_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleCompanySizeSelect(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </motion.div>
              )}

              {leadStep === "urgency" && (
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap gap-2 ml-10"
                >
                  {URGENCY_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleUrgencySelect(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </motion.div>
              )}

              {/* Lead capture UI - SERVICE INTEREST */}
              {leadStep === "interest" && (
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-2"
                >
                  <div className="flex gap-2 items-start">
                    <img src={albaAvatar} alt="Alba" className="w-8 h-8 rounded-full" />
                    <div className="bg-muted px-4 py-2.5 rounded-2xl rounded-bl-md text-sm">
                      Qual serviço mais se alinha ao seu momento?
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-10">
                    {INTEREST_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleInterestSelect(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}

              {leadStep === "timeline" && (
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap gap-2 ml-10"
                >
                  {TIMELINE_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleTimelineSelect(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={skipOptionalField}
                  >
                    Pular
                  </Button>
                </motion.div>
              )}

              {leadStep === "consent" && (
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-3"
                >
                  <div className="flex gap-2 items-start">
                    <img src={albaAvatar} alt="Alba" className="w-8 h-8 rounded-full" />
                    <div className="bg-muted px-4 py-2.5 rounded-2xl rounded-bl-md text-sm">
                      <p className="mb-2">Posso registrar seus dados para que a Albatross entre em contato?</p>
                      <p className="text-xs text-muted-foreground">Você pode solicitar remoção a qualquer momento.</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-10">
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        setLeadData(prev => ({ ...prev, consent: true }));
                        setMessages(prev => [...prev, { role: "user", content: "Sim, autorizo" }]);
                        submitLead();
                      }}
                    >
                      <Check className="w-4 h-4" />
                      Sim, autorizo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLeadStep("idle");
                        setMessages(prev => [...prev, 
                          { role: "user", content: "Não, obrigado" },
                          { role: "assistant", content: "Sem problemas! Posso ajudá-lo de outra forma?" }
                        ]);
                      }}
                    >
                      Não, obrigado
                    </Button>
                  </div>
                </motion.div>
              )}

              {leadStep === "success" && (
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap gap-2 ml-10"
                >
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2"
                    onClick={() => navigateToSection("agendamento")}
                  >
                    <Calendar className="w-4 h-4" />
                    Agendar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => navigateToSection("servicos")}
                  >
                    <Briefcase className="w-4 h-4" />
                    Ver Serviços
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      setIsOpen(false);
                      setLeadStep("idle");
                    }}
                  >
                    <X className="w-4 h-4" />
                    Encerrar
                  </Button>
                </motion.div>
              )}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <motion.div 
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex gap-2 justify-start"
                >
                  <img 
                    src={albaAvatar} 
                    alt="Alba" 
                    className="rounded-full object-cover flex-shrink-0"
                    style={{ width: "var(--alba-avatar-message)", height: "var(--alba-avatar-message)" }}
                  />
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </motion.div>
              )}

              {leadStep === "submitting" && (
                <motion.div 
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex gap-2 justify-start"
                >
                  <img src={albaAvatar} alt="Alba" className="w-8 h-8 rounded-full" />
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Enviando...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Back to position button */}
            {previousScrollPosition.current !== null && !isOpen && (
              <Button
                variant="outline"
                size="sm"
                className="absolute top-20 left-4 gap-2"
                onClick={() => {
                  if (previousScrollPosition.current !== null) {
                    window.scrollTo({ top: previousScrollPosition.current, behavior: "smooth" });
                    previousScrollPosition.current = null;
                  }
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </Button>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border/50">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    let newValue = e.target.value;
                    
                    // Auto-format phone when in phone step
                    if (leadStep === "phone") {
                      newValue = formatPhoneNumber(newValue);
                    }
                    // Auto-format when editing phone field (command "5 ...")
                    else if (isPhoneFieldEdit(newValue)) {
                      newValue = formatPhoneEditCommand(newValue);
                    }
                    
                    setInput(newValue);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    leadStep === "name" ? "Seu nome completo..." :
                    leadStep === "email" ? "Seu e-mail corporativo..." :
                    leadStep === "company" ? "Nome da empresa..." :
                    leadStep === "jobTitle" ? "Seu cargo..." :
                    leadStep === "phone" ? "(11) 99999-9999" :
                    "Digite sua mensagem..."
                  }
                  className="flex-1 rounded-full"
                  disabled={isLoading || leadStep === "interest" || leadStep === "timeline" || leadStep === "consent" || leadStep === "submitting" || leadStep === "success"}
                />
                <Button
                  onClick={() => {
                    if (leadStep !== "idle" && leadStep !== "submitting" && leadStep !== "success" && leadStep !== "interest" && leadStep !== "timeline" && leadStep !== "consent") {
                      handleLeadInput(input);
                      setInput("");
                    } else {
                      sendMessage();
                    }
                  }}
                  disabled={!input.trim() || isLoading || leadStep === "interest" || leadStep === "timeline" || leadStep === "consent" || leadStep === "submitting"}
                  size="icon"
                  className="rounded-full h-10 w-10"
                >
                  {isLoading || leadStep === "submitting" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {/* Cancel and Skip buttons during lead capture */}
              {leadStep !== "idle" && leadStep !== "submitting" && leadStep !== "success" && (
                <div className="mt-2 flex items-center justify-center gap-4">
                  <button
                    onClick={cancelLeadCapture}
                    className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Cancelar
                  </button>
                  
                  {leadStep === "timeline" && (
                    <button
                      onClick={skipOptionalField}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Pular esta etapa
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive CSS */}
      <style>{`
        @media (min-width: 640px) {
          :root {
            --alba-avatar-mobile: var(--alba-avatar-tablet);
          }
        }
        @media (min-width: 1024px) {
          :root {
            --alba-avatar-mobile: var(--alba-avatar-desktop);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default AlbaChatbot;
