import { forwardRef } from "react";
import { Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import albatrossLogo from "@/assets/logo-albatross.png";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const links = {
    services: [
      { label: "Growth Strategy", href: "#" },
      { label: "M&A Tecnologia", href: "#" },
      { label: "Business Intelligence", href: "#" },
      { label: t("services.s4.highlight"), href: "#" },
      { label: "GenAI & Inovação", href: "#" },
      { label: t("services.s6.title"), href: "#" },
    ],
    company: [
      { label: t("footer.about"), href: "#sobre" },
      { label: t("footer.methodology"), href: "#metodologia" },
      { label: t("footer.leadership"), href: "#lideranca" },
      { label: t("footer.careers"), href: "#" },
      { label: t("footer.contact"), href: "#contato" },
    ],
  };

  return (
    <footer ref={ref} className="bg-card border-t border-border">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <img 
                src={albatrossLogo} 
                alt="Albatross Consulting" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-subtle mb-6">
              {t("footer.brand")}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-muted-foreground" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Mail className="w-5 h-5 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">
              {t("footer.services")}
            </h4>
            <ul className="space-y-3">
              {links.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-subtle hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">
              {t("footer.company")}
            </h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-subtle hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">
              {t("footer.contact")}
            </h4>
            <div className="mb-4">
              <span className="text-sm text-primary font-medium">LATAM Office</span>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-subtle">
                  <strong className="text-foreground">Brascan Century Offices</strong><br />
                  R. Joaquim Floriano, 466. Cj 814<br />
                  Itaim Bibi, São Paulo - SP, 04534-002
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+5511981332775" className="text-subtle hover:text-foreground transition-colors">
                  +55 11 981332775
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:contato@albatross.consulting" className="text-subtle hover:text-foreground transition-colors">
                  contato@albatross.consulting
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Albatross Consulting. {t("footer.copyright")}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.privacy")}
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
