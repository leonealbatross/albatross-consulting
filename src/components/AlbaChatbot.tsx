import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Calendar, Mail, Loader2, Briefcase, Users, Brain, Phone, ChevronLeft, Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  interest: string;
  timeline: string;
  phone: string;
  consent: boolean;
}

type LeadStep = "idle" | "name" | "email" | "company" | "jobTitle" | "interest" | "timeline" | "phone" | "consent" | "submitting" | "success";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/alba-chat`;

// Section mapping for navigation
const SECTION_MAP: Record<string, { id: string; label: string }> = {
  "servicos": { id: "servicos", label: "Serviços" },
  "services": { id: "servicos", label: "Serviços" },
  "ma": { id: "servicos", label: "M&A Integrado" },
  "m&a": { id: "servicos", label: "M&A Integrado" },
  "governanca": { id: "servicos", label: "Governança Corporativa" },
  "governance": { id: "servicos", label: "Governança Corporativa" },
  "advisory": { id: "servicos", label: "Advisory Board" },
  "genai": { id: "servicos", label: "GenAI & Inovação" },
  "ia": { id: "servicos", label: "GenAI & Inovação" },
  "ai": { id: "servicos", label: "GenAI & Inovação" },
  "contato": { id: "cta", label: "Contato" },
  "contact": { id: "cta", label: "Contato" },
  "sobre": { id: "sobre", label: "Sobre" },
  "about": { id: "sobre", label: "Sobre" },
  "metodologia": { id: "metodologia", label: "Metodologia" },
  "methodology": { id: "metodologia", label: "Metodologia" },
  "lideranca": { id: "lideranca", label: "Liderança" },
  "leadership": { id: "lideranca", label: "Liderança" },
  "agendar": { id: "agendamento", label: "Agendamento" },
  "schedule": { id: "agendamento", label: "Agendamento" },
  "carreiras": { id: "carreiras", label: "Carreiras" },
  "careers": { id: "carreiras", label: "Carreiras" },
};

const INTEREST_OPTIONS = [
  { value: "ma", label: "M&A Integrado" },
  { value: "governanca", label: "Governança & Advisory Board" },
  { value: "genai", label: "GenAI & Inovação" },
];

const TIMELINE_OPTIONS = [
  { value: "0-30", label: "0-30 dias" },
  { value: "31-90", label: "31-90 dias" },
  { value: "90+", label: "90+ dias" },
];

const QUICK_ACTIONS = [
  { id: "services", label: "Conhecer serviços", icon: Briefcase, section: "servicos" },
  { id: "specialist", label: "Falar com especialista", icon: Users, action: "lead" },
  { id: "schedule", label: "Agendar diagnóstico", icon: Calendar, section: "agendamento" },
  { id: "contact", label: "Contato", icon: Mail, section: "cta" },
];

// Intent detection keywords
const COMMERCIAL_INTENTS = ["preço", "proposta", "reunião", "orçamento", "custo", "quanto custa", "consultor", "especialista", "agendar", "contratar", "investimento", "budget"];

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
  
  // Lead capture state
  const [leadStep, setLeadStep] = useState<LeadStep>("idle");
  const [leadData, setLeadData] = useState<LeadData>({
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

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Entry animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), prefersReducedMotion ? 0 : 1000);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  // Track events
  const trackEvent = useCallback((event: string, data?: Record<string, unknown>) => {
    console.log(`Event: ${event}`, data);
    // Here you could integrate with analytics
  }, []);

  useEffect(() => {
    if (isOpen) {
      trackEvent("open_chat");
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

  // Start lead capture flow
  const startLeadCapture = useCallback(() => {
    setLeadStep("name");
    trackEvent("lead_started");
    setMessages(prev => [...prev, {
      role: "assistant",
      content: "Ótimo! Para conectá-lo com nosso time, preciso de algumas informações. Qual é o seu nome completo?"
    }]);
  }, [trackEvent]);

  // Handle lead form input
  const handleLeadInput = useCallback(async (value: string) => {
    setMessages(prev => [...prev, { role: "user", content: value }]);
    
    switch (leadStep) {
      case "name":
        setLeadData(prev => ({ ...prev, name: value }));
        setLeadStep("email");
        setMessages(prev => [...prev, { role: "assistant", content: "E qual é o seu e-mail corporativo?" }]);
        break;
        
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setMessages(prev => [...prev, { role: "assistant", content: "Por favor, informe um e-mail válido." }]);
          return;
        }
        setLeadData(prev => ({ ...prev, email: value }));
        setLeadStep("company");
        setMessages(prev => [...prev, { role: "assistant", content: "Em qual empresa você trabalha?" }]);
        break;
        
      case "company":
        setLeadData(prev => ({ ...prev, company: value }));
        setLeadStep("jobTitle");
        setMessages(prev => [...prev, { role: "assistant", content: "E qual é o seu cargo?" }]);
        break;
        
      case "jobTitle":
        setLeadData(prev => ({ ...prev, jobTitle: value }));
        setLeadStep("interest");
        break;
        
      case "phone":
        setLeadData(prev => ({ ...prev, phone: value }));
        setLeadStep("consent");
        break;
    }
  }, [leadStep]);

  // Handle interest selection
  const handleInterestSelect = useCallback((interest: string) => {
    setLeadData(prev => ({ ...prev, interest }));
    setMessages(prev => [...prev, 
      { role: "user", content: INTEREST_OPTIONS.find(o => o.value === interest)?.label || interest },
      { role: "assistant", content: "Qual é o seu prazo aproximado? (opcional - pode pular)" }
    ]);
    setLeadStep("timeline");
  }, []);

  // Handle timeline selection
  const handleTimelineSelect = useCallback((timeline: string) => {
    setLeadData(prev => ({ ...prev, timeline }));
    setMessages(prev => [...prev, 
      { role: "user", content: TIMELINE_OPTIONS.find(o => o.value === timeline)?.label || "Prefiro não informar" },
      { role: "assistant", content: "Qual seu telefone/WhatsApp? (opcional - pode pular)" }
    ]);
    setLeadStep("phone");
  }, []);

  // Skip optional fields
  const skipOptionalField = useCallback(() => {
    if (leadStep === "timeline") {
      setMessages(prev => [...prev, 
        { role: "user", content: "Pular" },
        { role: "assistant", content: "Qual seu telefone/WhatsApp? (opcional - pode pular)" }
      ]);
      setLeadStep("phone");
    } else if (leadStep === "phone") {
      setMessages(prev => [...prev, { role: "user", content: "Pular" }]);
      setLeadStep("consent");
    }
  }, [leadStep]);

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
      
      // Create chat summary
      const chatSummary = messages
        .slice(-10)
        .map(m => `${m.role === "user" ? "User" : "Alba"}: ${m.content.substring(0, 100)}`)
        .join("\n");
      
      const { data, error } = await supabase.functions.invoke("hubspot-contact", {
        body: {
          name: leadData.name,
          email: leadData.email,
          company: leadData.company,
          message: `
Cargo: ${leadData.jobTitle}
Interesse: ${INTEREST_OPTIONS.find(o => o.value === leadData.interest)?.label || leadData.interest}
Prazo: ${TIMELINE_OPTIONS.find(o => o.value === leadData.timeline)?.label || "Não informado"}
Telefone: ${leadData.phone || "Não informado"}

--- Chat Summary ---
${chatSummary}

--- Metadata ---
Página: ${currentUrl}
UTM Source: ${utmSource}
UTM Medium: ${utmMedium}
UTM Campaign: ${utmCampaign}
Consentimento LGPD: Sim (${new Date().toISOString()})
          `.trim(),
          sectionTitle: "Alba Chatbot - Lead Qualificado",
        },
      });
      
      if (error) throw error;
      
      setLeadStep("success");
      trackEvent("lead_submitted", { hubspotId: data?.hubspotId });
      
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
  }, [leadData, messages, trackEvent]);

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
    const suggestionsMatch = content.match(/\[SUGESTOES\]\s*([\s\S]*?)\s*\[\/SUGESTOES\]/);
    if (suggestionsMatch) {
      const suggestionsText = suggestionsMatch[1].trim();
      const suggestions = suggestionsText.split("|").map(s => s.trim()).filter(s => s.length > 0);
      const cleanContent = content.replace(/\[SUGESTOES\][\s\S]*?\[\/SUGESTOES\]/g, "").trim();
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
              "fixed bottom-6 right-6 z-50 p-0 rounded-full shadow-2xl",
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
              "fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)]",
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10 px-2 h-8"
                  onClick={() => navigateToSection("agendamento")}
                  aria-label="Agendar reunião"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Agendar</span>
                </Button>
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

            {/* Quick Actions - Fixed at top */}
            <div className="px-3 py-2 border-b border-border/30 bg-muted/30 flex gap-2 overflow-x-auto scrollbar-hide">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0 text-xs gap-1.5 h-8 px-3 bg-background/50 hover:bg-primary/10"
                  onClick={() => handleQuickAction(action)}
                >
                  <action.icon className="w-3.5 h-3.5" />
                  {action.label}
                </Button>
              ))}
            </div>

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

              {/* Lead capture UI */}
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
                      Qual o seu principal interesse?
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
                    onClick={() => navigateToSection("cta")}
                  >
                    <Mail className="w-4 h-4" />
                    Contato
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
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    leadStep === "name" ? "Seu nome completo..." :
                    leadStep === "email" ? "Seu e-mail corporativo..." :
                    leadStep === "company" ? "Nome da empresa..." :
                    leadStep === "jobTitle" ? "Seu cargo..." :
                    leadStep === "phone" ? "Telefone/WhatsApp..." :
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
              
              {/* Skip button for optional phone field */}
              {leadStep === "phone" && (
                <div className="mt-2 text-center">
                  <button
                    onClick={skipOptionalField}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Pular esta etapa
                  </button>
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
