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
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card min-w-[44px] min-h-[44px]"
                aria-label="LinkedIn de Marco Leone (abre em nova janela)"
              >
                <Linkedin className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              </a>
              <a
                href="mailto:leone@albatross.consulting"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card min-w-[44px] min-h-[44px]"
                aria-label="Enviar email para leone@albatross.consulting"
              >
                <Mail className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">
              {t("footer.services")}
            </h4>
            <ul className="space-y-2 sm:space-y-3" role="list">
              {links.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href.replace('#', ''))}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded inline-block min-h-[44px] py-2"
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
            <ul className="space-y-2 sm:space-y-3" role="list">
              {links.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href.replace('#', ''))}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded inline-block min-h-[44px] py-2"
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
            <ul className="space-y-3 sm:space-y-4" role="list">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                <address className="text-xs sm:text-sm text-muted-foreground not-italic">
                  <strong className="text-foreground">Brascan Century Offices</strong><br />
                  R. Joaquim Floriano, 466. Cj 814<br />
                  Itaim Bibi, São Paulo - SP<br />
                  CEP: 04534-002
                </address>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <a 
                  href="https://wa.me/5511981332775" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center hover:scale-110 transition-transform min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded"
                  aria-label="Contato via WhatsApp: +55 11 981332775 (abre em nova janela)"
                >
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                </a>
                <a 
                  href="https://wa.me/5511981332775" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded"
                >
                  +55 11 981332775
                </a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <a 
                  href="mailto:leone@albatross.consulting"
                  className="flex items-center justify-center hover:scale-110 transition-transform min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded"
                  aria-label="Enviar email para leone@albatross.consulting"
                >
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                </a>
                <a href="mailto:leone@albatross.consulting" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors break-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded">
                  leone@albatross.consulting
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Commitment Statement */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
            A Albatross Consulting emprega seus melhores esforços para manter este website em conformidade com as melhores práticas e padrões internacionais de acessibilidade digital, privacidade de dados e otimização de performance, reafirmando seu compromisso com a excelência e a responsabilidade corporativa.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
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
              {t("footer.cookies")}
            </a>
            <a 
              href="/accessibility" 
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card rounded"
            >
              {t("footer.accessibility")}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
