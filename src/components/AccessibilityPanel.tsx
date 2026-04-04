import React, { useState, useEffect, useCallback, useRef } from "react";
import accessibilityIcon from "@/assets/accessibility-icon.jpeg";
import { Button } from "@/components/ui/button";
import { 
  X, 
  Type, 
  Contrast, 
  Link2, 
  Eye, 
  Pause, 
  Minus, 
  Plus,
  RotateCcw,
  Monitor,
  Moon,
  Sun,
  Underline,
  MousePointer2,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AccessibilitySettings {
  fontSize: number; // 0 = normal, 1-4 = increased levels
  letterSpacing: number; // 0-3
  lineHeight: number; // 0-3
  highContrast: "off" | "dark" | "light" | "enhanced";
  underlineLinks: boolean;
  enhancedFocus: boolean;
  reducedMotion: boolean;
  readingGuide: boolean;
  largerCursor: boolean;
  dyslexiaMode: boolean;
  pauseAnimations: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 0,
  letterSpacing: 0,
  lineHeight: 0,
  highContrast: "off",
  underlineLinks: false,
  enhancedFocus: false,
  reducedMotion: false,
  readingGuide: false,
  largerCursor: false,
  dyslexiaMode: false,
  pauseAnimations: false,
};

const STORAGE_KEY = "albatross_accessibility_settings";

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement>;
}

const AccessibilityPanel = ({ isOpen, onClose, triggerRef }: AccessibilityPanelProps) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (e) {
      console.error("Error loading accessibility settings:", e);
    }

    // Check system preference for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    const fontSizeMap = ["100%", "112%", "125%", "137%", "150%"];
    root.style.fontSize = fontSizeMap[settings.fontSize] || "100%";
    
    // Letter spacing
    const letterSpacingMap = ["normal", "0.05em", "0.1em", "0.15em"];
    root.style.letterSpacing = letterSpacingMap[settings.letterSpacing] || "normal";
    
    // Line height
    const lineHeightMap = ["normal", "1.6", "1.8", "2"];
    root.style.lineHeight = lineHeightMap[settings.lineHeight] || "normal";
    
    // High contrast
    root.classList.remove("high-contrast-dark", "high-contrast-light", "high-contrast-enhanced");
    if (settings.highContrast !== "off") {
      root.classList.add(`high-contrast-${settings.highContrast}`);
    }
    
    // Underline links
    root.classList.toggle("underline-links", settings.underlineLinks);
    
    // Enhanced focus
    root.classList.toggle("enhanced-focus", settings.enhancedFocus);
    
    // Reduced motion
    root.classList.toggle("force-reduced-motion", settings.reducedMotion);
    
    // Reading guide
    root.classList.toggle("reading-guide-active", settings.readingGuide);
    
    // Larger cursor
    root.classList.toggle("larger-cursor", settings.largerCursor);
    
    // Dyslexia mode
    root.classList.toggle("dyslexia-mode", settings.dyslexiaMode);
    
    // Pause animations
    root.classList.toggle("pause-animations", settings.pauseAnimations);
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Error saving accessibility settings:", e);
    }
  }, [settings]);

  // Reading guide effect
  useEffect(() => {
    if (!settings.readingGuide) return;

    const guide = document.createElement("div");
    guide.id = "reading-guide";
    guide.setAttribute("aria-hidden", "true");
    guide.style.cssText = `
      position: fixed;
      left: 0;
      right: 0;
      height: 3rem;
      background: linear-gradient(180deg, 
        transparent 0%, 
        rgba(45, 212, 191, 0.1) 20%, 
        rgba(45, 212, 191, 0.15) 50%, 
        rgba(45, 212, 191, 0.1) 80%, 
        transparent 100%
      );
      pointer-events: none;
      z-index: 9998;
      transition: top 0.05s linear;
    `;
    document.body.appendChild(guide);

    const handleMouseMove = (e: MouseEvent) => {
      guide.style.top = `${e.clientY - 24}px`;
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      guide.remove();
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [settings.readingGuide]);

  // Focus trap for modal
  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    // Focus first element when opening
    setTimeout(() => firstFocusableRef.current?.focus(), 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef?.current?.focus();
        return;
      }

      if (e.key !== "Tab") return;

      const focusableElements = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    const root = document.documentElement;
    root.style.fontSize = "";
    root.style.letterSpacing = "";
    root.style.lineHeight = "";
  }, []);

  const incrementValue = (key: "fontSize" | "letterSpacing" | "lineHeight", max: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: Math.min(prev[key] + 1, max)
    }));
  };

  const decrementValue = (key: "fontSize" | "letterSpacing" | "lineHeight") => {
    setSettings(prev => ({
      ...prev,
      [key]: Math.max(prev[key] - 1, 0)
    }));
  };

  const contrastOptions = [
    { value: "off", label: "Desativado", icon: Monitor },
    { value: "dark", label: "Alto contraste escuro", icon: Moon },
    { value: "light", label: "Alto contraste claro", icon: Sun },
    { value: "enhanced", label: "Contraste reforçado", icon: Contrast },
  ] as const;

  return (
    <>
      {/* Accessibility Panel Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 100 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "fixed top-0 right-0 h-full w-full max-w-md z-[101]",
                "bg-background border-l border-border shadow-2xl",
                "flex flex-col overflow-hidden"
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby="accessibility-panel-title"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <img src={accessibilityIcon} alt="" className="w-5 h-5 object-contain" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="accessibility-panel-title" className="font-heading font-semibold text-foreground">
                      Acessibilidade
                    </h2>
                    <p className="text-xs text-muted-foreground">Configurações avançadas</p>
                  </div>
                </div>
                <Button
                  ref={firstFocusableRef}
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onClose();
                    triggerRef?.current?.focus();
                  }}
                  className="min-w-[44px] min-h-[44px]"
                  aria-label="Fechar painel de acessibilidade"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Font Size */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span className="text-sm font-medium text-foreground">Tamanho da fonte</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => decrementValue("fontSize")}
                      disabled={settings.fontSize === 0}
                      className="min-w-[44px] min-h-[44px]"
                      aria-label="Diminuir tamanho da fonte"
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </Button>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(settings.fontSize / 4) * 100}%` }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => incrementValue("fontSize", 4)}
                      disabled={settings.fontSize === 4}
                      className="min-w-[44px] min-h-[44px]"
                      aria-label="Aumentar tamanho da fonte"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </Button>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {["100%", "112%", "125%", "137%", "150%"][settings.fontSize]}
                    </span>
                  </div>
                </div>

                {/* Letter Spacing */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Espaçamento entre letras</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => decrementValue("letterSpacing")}
                      disabled={settings.letterSpacing === 0}
                      className="min-w-[44px] min-h-[44px]"
                      aria-label="Diminuir espaçamento"
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </Button>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(settings.letterSpacing / 3) * 100}%` }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => incrementValue("letterSpacing", 3)}
                      disabled={settings.letterSpacing === 3}
                      className="min-w-[44px] min-h-[44px]"
                      aria-label="Aumentar espaçamento"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                {/* Line Height */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Altura da linha</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => decrementValue("lineHeight")}
                      disabled={settings.lineHeight === 0}
                      className="min-w-[44px] min-h-[44px]"
                      aria-label="Diminuir altura da linha"
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </Button>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(settings.lineHeight / 3) * 100}%` }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => incrementValue("lineHeight", 3)}
                      disabled={settings.lineHeight === 3}
                      className="min-w-[44px] min-h-[44px]"
                      aria-label="Aumentar altura da linha"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                {/* High Contrast */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Contrast className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span className="text-sm font-medium text-foreground">Alto contraste</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {contrastOptions.map(option => (
                      <Button
                        key={option.value}
                        variant={settings.highContrast === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSetting("highContrast", option.value)}
                        className="gap-2 min-h-[44px] text-xs"
                      >
                        <option.icon className="w-4 h-4" aria-hidden="true" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Toggle Options */}
                <div className="space-y-3">
                  <span className="text-sm font-medium text-foreground">Opções visuais</span>
                  
                  <ToggleOption
                    icon={Underline}
                    label="Sublinhar links"
                    description="Torna todos os links sempre sublinhados"
                    checked={settings.underlineLinks}
                    onChange={(v) => updateSetting("underlineLinks", v)}
                  />
                  
                  <ToggleOption
                    icon={Eye}
                    label="Foco reforçado"
                    description="Aumenta a visibilidade do indicador de foco"
                    checked={settings.enhancedFocus}
                    onChange={(v) => updateSetting("enhancedFocus", v)}
                  />
                  
                  <ToggleOption
                    icon={Pause}
                    label="Reduzir movimento"
                    description="Desativa animações e transições"
                    checked={settings.reducedMotion || prefersReducedMotion}
                    onChange={(v) => updateSetting("reducedMotion", v)}
                    disabled={prefersReducedMotion}
                  />
                  
                  <ToggleOption
                    icon={BookOpen}
                    label="Guia de leitura"
                    description="Exibe uma régua que segue o cursor"
                    checked={settings.readingGuide}
                    onChange={(v) => updateSetting("readingGuide", v)}
                  />
                  
                  <ToggleOption
                    icon={MousePointer2}
                    label="Cursor maior"
                    description="Aumenta o tamanho do cursor"
                    checked={settings.largerCursor}
                    onChange={(v) => updateSetting("largerCursor", v)}
                  />
                  
                  <ToggleOption
                    icon={Link2}
                    label="Modo dislexia"
                    description="Fonte e espaçamento otimizados para leitura"
                    checked={settings.dyslexiaMode}
                    onChange={(v) => updateSetting("dyslexiaMode", v)}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-border bg-card space-y-3">
                <Button
                  variant="outline"
                  onClick={resetSettings}
                  className="w-full gap-2 min-h-[44px]"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  Restaurar padrão
                </Button>
                <a 
                  href="/accessibility" 
                  className="block text-center text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded py-2"
                >
                  Ver declaração de acessibilidade
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Toggle Option Component
interface ToggleOptionProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleOption = React.forwardRef<HTMLDivElement, ToggleOptionProps>(
  ({ icon: Icon, label, description, checked, onChange, disabled }, ref) => (
    <div 
      ref={ref}
      className="flex items-start justify-between gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
    >
      <div className="flex items-start gap-3">
        <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div>
          <span className="text-sm font-medium text-foreground block">{label}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors flex-shrink-0",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card",
          "min-w-[44px]",
          checked ? "bg-primary" : "bg-muted",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        aria-disabled={disabled}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
            checked && "translate-x-5"
          )}
          aria-hidden="true"
        />
      </button>
    </div>
  )
);
ToggleOption.displayName = "ToggleOption";

export default AccessibilityPanel;
