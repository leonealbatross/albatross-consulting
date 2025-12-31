import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import albatrossLogo from "@/assets/logo-albatross-new.jpeg";
import ContactModal from "@/components/ContactModal";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t("nav.about"), href: "#sobre" },
    { label: t("nav.services"), href: "#servicos" },
    { label: t("nav.methodology"), href: "#metodologia" },
    { label: t("nav.leadership"), href: "#lideranca" },
    { label: t("nav.contact"), href: "#contato" },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: "PT", label: "Português" },
    { code: "EN", label: "English" },
    { code: "ES", label: "Español" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/50 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container-wide">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center group">
            <img 
              src={albatrossLogo} 
              alt="Albatross Consulting - Business Growth as a Service" 
              className="h-20 sm:h-32 md:h-40 lg:h-44 w-auto object-contain rounded"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <Globe className="w-4 h-4" />
                  {language}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className="cursor-pointer hover:bg-secondary"
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ContactModal />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        <div
          className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Menu Slide-in */}
        <div
          className={`lg:hidden fixed top-0 right-0 h-full w-[280px] max-w-[85vw] bg-background z-50 shadow-2xl transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Menu</span>
              <button
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-6">
              {navItems.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center py-4 text-lg font-medium text-foreground/80 hover:text-primary transition-colors border-b border-border/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Mobile Menu Footer */}
            <div className="p-6 border-t border-border/30 space-y-4">
              {/* Language Selector */}
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                      language === lang.code
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {lang.code}
                  </button>
                ))}
              </div>

              <ContactModal trigger={
                <Button variant="hero" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("header.cta")}
                </Button>
              } />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
