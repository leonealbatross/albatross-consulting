import { forwardRef } from "react";
import { Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import albatrossLogo from "@/assets/logo-albatross.png";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const { t } = useLanguage();
  const { handleClick } = useSmoothScroll();
  const currentYear = new Date().getFullYear();

  const links = {
    services: [
      { label: "Growth Strategy", href: "#servicos" },
      { label: "M&A Tecnologia", href: "#servicos" },
      { label: "Business Intelligence", href: "#servicos" },
      { label: t("services.s4.highlight"), href: "#servicos" },
      { label: "GenAI & Inovação", href: "#servicos" },
      { label: t("services.s6.title"), href: "#servicos" },
    ],
    company: [
      { label: t("footer.about"), href: "#sobre" },
      { label: t("footer.methodology"), href: "#metodologia" },
      { label: t("footer.leadership"), href: "#lideranca" },
      { label: t("footer.careers"), href: "#carreiras" },
      { label: t("footer.contact"), href: "#contato" },
    ],
  };

  return (
    <footer ref={ref} className="bg-card border-t border-border">
      <div className="container-wide py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4 sm:mb-6">
              <img 
                src={albatrossLogo} 
                alt="Albatross Consulting" 
                className="h-24 sm:h-32 w-auto object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
              {t("footer.brand")}
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/in/marcoleone/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              </a>
              <a
                href="mailto:leone@albatross.consulting"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">
              {t("footer.services")}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {links.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href.replace('#', ''))}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">
              {t("footer.company")}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href.replace('#', ''))}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-heading font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">
              {t("footer.contact")}
            </h4>
            <div className="mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm text-primary font-medium">LATAM Office</span>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  <strong className="text-foreground">Brascan Century Offices</strong><br />
                  R. Joaquim Floriano, 466. Cj 814<br />
                  Itaim Bibi, São Paulo - SP<br />
                  CEP: 04534-002
                </span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <a 
                  href="https://wa.me/5511981332775" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                </a>
                <a 
                  href="https://wa.me/5511981332775" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  +55 11 981332775
                </a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <a 
                  href="mailto:leone@albatross.consulting"
                  className="flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                </a>
                <a href="mailto:leone@albatross.consulting" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors break-all">
                  leone@albatross.consulting
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Albatross Consulting. {t("footer.copyright")}
          </p>
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6" aria-label="Links legais">
            <a 
              href="/privacy" 
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded"
            >
              {t("footer.privacy")}
            </a>
            <a 
              href="/cookies" 
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded"
            >
              Preferências de Cookies
            </a>
            <a 
              href="/accessibility" 
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded"
            >
              Acessibilidade
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
