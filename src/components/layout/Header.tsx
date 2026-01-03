import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, Accessibility } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useActiveSection } from "@/hooks/use-active-section";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import albatrossLogo from "@/assets/logo-albatross-new.jpeg";
import { Link } from "react-router-dom";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccessibilityPanelOpen, setIsAccessibilityPanelOpen] = useState(false);
  const accessibilityTriggerRef = useRef<HTMLButtonElement>(null);
  const { language, setLanguage, t } = useLanguage();
  const { scrollToSection } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t("nav.about"), href: "#sobre", id: "sobre" },
    { label: t("nav.services"), href: "#servicos", id: "servicos" },
    { label: t("nav.methodology"), href: "#metodologia", id: "metodologia" },
    { label: t("nav.leadership"), href: "#lideranca", id: "lideranca" },
    { label: t("nav.scheduling"), href: "#agendamento", id: "agendamento" },
    { label: t("nav.careers"), href: "#carreiras", id: "carreiras" },
    { label: t("nav.contact"), href: "#contato", id: "contato" },
  ];

  const sectionIds = useMemo(() => navItems.map((item) => item.id), []);
  const activeSection = useActiveSection(sectionIds);

  const languages: { code: Language; label: string }[] = [
    { code: "PT", label: "Português" },
    { code: "EN", label: "English" },
    { code: "ES", label: "Español" },
  ];

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/50 py-3"
          : "bg-transparent py-6"
      }`}
      role="banner"
    >
      <div className="container-wide">
        <nav className="flex items-center justify-between" aria-label="Navegação principal">
          {/* Logo */}
          <a 
            href="/" 
            className="flex items-center group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg"
            aria-label="Albatross Consulting - Página inicial"
          >
            <img 
              src={albatrossLogo} 
              alt="" 
              aria-hidden="true"
              className="h-40 sm:h-64 md:h-64 lg:h-[130px] w-auto object-contain rounded transition-transform duration-300 group-hover:scale-105"
              loading="eager"
              width="130"
              height="130"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1" role="menubar">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background min-h-[44px] flex items-center ${
                  activeSection === item.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                role="menuitem"
                aria-current={activeSection === item.id ? "page" : undefined}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" aria-hidden="true" />
                )}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Accessibility Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    ref={accessibilityTriggerRef}
                    onClick={() => setIsAccessibilityPanelOpen(true)}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Configurações de acessibilidade"
                  >
                    <Accessibility className="w-5 h-5" aria-hidden="true" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Acessibilidade</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-muted-foreground hover:text-foreground min-h-[44px] focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  aria-label={`Idioma atual: ${language}. Clique para mudar.`}
                >
                  <Globe className="w-4 h-4" aria-hidden="true" />
                  {language}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className="cursor-pointer hover:bg-secondary focus:bg-secondary min-h-[44px]"
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        <div
          className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Mobile Menu Slide-in */}
        <div
          id="mobile-menu"
          className={`lg:hidden fixed top-0 right-0 h-full w-[280px] max-w-[85vw] bg-background z-50 shadow-2xl transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Menu</span>
              <div className="flex items-center gap-2">
                {/* Accessibility Button - Mobile */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAccessibilityPanelOpen(true);
                  }}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Configurações de acessibilidade"
                >
                  <Accessibility className="w-5 h-5" aria-hidden="true" />
                </button>

                {/* Language Selector - Simple like desktop */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 text-muted-foreground hover:text-foreground h-9 px-3 min-h-[44px] min-w-[44px]"
                      aria-label={`Idioma: ${language}`}
                    >
                      <Globe className="w-4 h-4" aria-hidden="true" />
                      {language}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border">
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className="cursor-pointer hover:bg-secondary min-h-[44px]"
                      >
                        {lang.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-6" aria-label="Menu mobile">
              {navItems.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center py-4 text-lg font-medium transition-colors border-b border-border/20 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded ${
                    activeSection === item.id
                      ? "text-primary"
                      : "text-foreground/80 hover:text-primary"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    setTimeout(() => {
                      scrollToSection(item.id);
                    }, 300);
                  }}
                  style={{ animationDelay: `${index * 50}ms` }}
                  aria-current={activeSection === item.id ? "page" : undefined}
                >
                  {activeSection === item.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3" aria-hidden="true" />
                  )}
                  {item.label}
                </a>
              ))}
            </nav>

          </div>
        </div>
      </div>
    </header>

    <AccessibilityPanel 
      isOpen={isAccessibilityPanelOpen} 
      onClose={() => setIsAccessibilityPanelOpen(false)}
      triggerRef={accessibilityTriggerRef}
    />
    </>
  );
};

export default Header;
