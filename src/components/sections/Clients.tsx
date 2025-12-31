import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Import client logos
import ecoreLogo from "@/assets/clients/ecore-logo.png";
import laborLogo from "@/assets/clients/labor-logo.svg";
import bhsLogo from "@/assets/clients/bhs-logo.png";
import ecotrustLogo from "@/assets/clients/ecotrust-logo.svg";

const clients = [
  {
    name: "e-core",
    url: "https://www.e-core.com",
    description: "Digital Consulting Services",
    logo: ecoreLogo,
  },
  {
    name: "nuvini",
    url: "https://www.nuvini.co",
    description: "B2B SaaS Ecosystem",
    logo: null, // No logo available, will use text
  },
  {
    name: "Labor",
    url: "https://labor.org.br",
    description: "Educacional",
    logo: laborLogo,
  },
  {
    name: "BHS",
    url: "https://www.bhs.com.br",
    description: "Soluções de TI para Empresas",
    logo: bhsLogo,
  },
  {
    name: "EcoTrust",
    url: "https://ecotrust.io",
    description: "Cybersecurity",
    logo: ecotrustLogo,
  },
];

// Duplicate the array for seamless infinite scroll
const duplicatedClients = [...clients, ...clients];

const Clients = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-secondary/30 overflow-hidden">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            {t("clients.label")}
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mt-2">
            {t("clients.headline")}{" "}
            <span className="bg-gradient-to-r from-teal-400 to-primary bg-clip-text text-transparent">
              {t("clients.headline.highlight")}
            </span>
          </h2>
        </div>
      </div>

      {/* Infinite Scroll Carousel */}
      <div className="relative">
        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary/30 to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling container */}
        <div className="flex animate-scroll-left hover:[animation-play-state:paused]">
          {duplicatedClients.map((client, index) => (
            <a
              key={index}
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex-shrink-0 flex flex-col items-center justify-center p-6 mx-4 w-[200px] md:w-[240px] h-[140px] rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 hover:border-primary/50 hover:shadow-glow hover:scale-105 hover:bg-background/80 transition-all duration-300 ease-out"
            >
              {/* Client Logo or Name */}
              {client.logo ? (
                <img 
                  src={client.logo} 
                  alt={`${client.name} logo`}
                  className="max-h-12 md:max-h-16 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <div className="text-2xl md:text-3xl font-heading font-bold text-foreground/80 group-hover:text-primary transition-colors duration-300">
                  {client.name}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-3 text-center">
                {client.description}
              </div>
              
              {/* External Link Icon */}
              <ExternalLink className="absolute top-3 right-3 w-4 h-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;