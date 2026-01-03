import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie, Settings, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = "albatross_cookie_consent";
const COOKIE_PREFERENCES_KEY = "albatross_cookie_preferences";

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
};

export const getCookiePreferences = (): CookiePreferences | null => {
  try {
    const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading cookie preferences:", e);
  }
  return null;
};

export const hasGivenConsent = (): boolean => {
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "true";
};

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = hasGivenConsent();
    if (!hasConsent) {
      // Small delay before showing banner
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      const saved = getCookiePreferences();
      if (saved) {
        setPreferences(saved);
      }
    }
  }, []);

  const savePreferences = useCallback((prefs: CookiePreferences) => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "true");
      localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
      setPreferences(prefs);
      setIsVisible(false);
      
      // Dispatch event for other components to react
      window.dispatchEvent(new CustomEvent("cookieConsentUpdated", { detail: prefs }));
    } catch (e) {
      console.error("Error saving cookie preferences:", e);
    }
  }, []);

  const acceptAll = useCallback(() => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  }, [savePreferences]);

  const rejectNonEssential = useCallback(() => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  }, [savePreferences]);

  const saveCustomPreferences = useCallback(() => {
    savePreferences(preferences);
    setShowSettings(false);
  }, [preferences, savePreferences]);

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "necessary") return; // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6",
          "bg-card/98 backdrop-blur-xl border-t border-border shadow-2xl"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-description"
      >
        <div className="container-wide max-w-5xl mx-auto">
          {!showSettings ? (
            // Main Banner
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 id="cookie-consent-title" className="font-heading font-semibold text-foreground text-sm sm:text-base mb-1">
                    Sua privacidade é importante
                  </h2>
                  <p id="cookie-consent-description" className="text-xs sm:text-sm text-muted-foreground">
                    Utilizamos cookies para melhorar sua experiência. Cookies essenciais são necessários para o funcionamento do site. 
                    Você pode personalizar suas preferências ou aceitar todos os cookies.{" "}
                    <a 
                      href="/cookies" 
                      className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded"
                    >
                      Saiba mais
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="gap-2 text-xs sm:text-sm flex-1 lg:flex-none min-h-[44px]"
                  aria-label="Configurar preferências de cookies"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Configurar</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rejectNonEssential}
                  className="text-xs sm:text-sm flex-1 lg:flex-none min-h-[44px]"
                  aria-label="Rejeitar cookies não essenciais"
                >
                  Rejeitar não essenciais
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="gap-2 text-xs sm:text-sm flex-1 lg:flex-none min-h-[44px]"
                  aria-label="Aceitar todos os cookies"
                >
                  <Check className="w-4 h-4" aria-hidden="true" />
                  Aceitar todos
                </Button>
              </div>
            </div>
          ) : (
            // Settings Panel
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-semibold text-foreground text-base sm:text-lg">
                  Configurar Cookies
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(false)}
                  className="h-8 w-8 min-h-[44px] min-w-[44px]"
                  aria-label="Fechar configurações"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-secondary/50">
                  <div>
                    <h3 className="font-medium text-foreground text-sm">Cookies Necessários</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Essenciais para o funcionamento do site. Não podem ser desativados.
                    </p>
                  </div>
                  <div className="flex items-center h-6 min-w-[44px] justify-center">
                    <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" aria-hidden="true" />
                    </div>
                    <span className="sr-only">Sempre ativo</span>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-secondary/50">
                  <div>
                    <h3 className="font-medium text-foreground text-sm">Cookies de Análise</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Nos ajudam a entender como você usa o site para melhorar a experiência.
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference("analytics")}
                    className={cn(
                      "relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card min-w-[44px]",
                      preferences.analytics ? "bg-primary" : "bg-muted"
                    )}
                    role="switch"
                    aria-checked={preferences.analytics}
                    aria-label="Ativar cookies de análise"
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                        preferences.analytics && "translate-x-5"
                      )}
                    />
                  </button>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-secondary/50">
                  <div>
                    <h3 className="font-medium text-foreground text-sm">Cookies de Marketing</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Usados para mostrar anúncios relevantes baseados em seus interesses.
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference("marketing")}
                    className={cn(
                      "relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card min-w-[44px]",
                      preferences.marketing ? "bg-primary" : "bg-muted"
                    )}
                    role="switch"
                    aria-checked={preferences.marketing}
                    aria-label="Ativar cookies de marketing"
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                        preferences.marketing && "translate-x-5"
                      )}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="min-h-[44px]"
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={saveCustomPreferences}
                  className="gap-2 min-h-[44px]"
                >
                  <Check className="w-4 h-4" />
                  Salvar preferências
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent;
