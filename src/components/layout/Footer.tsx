import { Linkedin, Mail, Phone, MapPin } from "lucide-react";
import albatrossLogo from "@/assets/logo-albatross.png";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    services: [
      { label: "Growth Strategy", href: "#" },
      { label: "M&A Tecnologia", href: "#" },
      { label: "Business Intelligence", href: "#" },
      { label: "Governança", href: "#" },
      { label: "GenAI & Inovação", href: "#" },
      { label: "Mentoria Executiva", href: "#" },
    ],
    company: [
      { label: "Sobre", href: "#sobre" },
      { label: "Metodologia", href: "#metodologia" },
      { label: "Liderança", href: "#lideranca" },
      { label: "Carreiras", href: "#" },
      { label: "Contato", href: "#contato" },
    ],
  };

  return (
    <footer className="bg-card border-t border-border">
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
              Business Growth as a Service para empresas de tecnologia que buscam 
              crescimento sustentável e resultados mensuráveis.
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
              Serviços
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
              Empresa
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
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-subtle">
                  São Paulo, SP<br />
                  Brasil
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:contato@albatross.com.br" className="text-subtle hover:text-foreground transition-colors">
                  contato@albatross.com.br
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+551199999999" className="text-subtle hover:text-foreground transition-colors">
                  +55 11 9999-9999
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Albatross Consulting. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
