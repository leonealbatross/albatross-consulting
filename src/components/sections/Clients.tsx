import { ExternalLink } from "lucide-react";

const clients = [
  {
    name: "e-core",
    url: "https://www.e-core.com",
    description: "Digital Consulting Services",
  },
  {
    name: "nuvini",
    url: "https://www.nuvini.co",
    description: "B2B SaaS Ecosystem",
  },
  {
    name: "Labor",
    url: "https://labor.org.br",
    description: "Educacional",
  },
  {
    name: "BHS",
    url: "https://www.bhs.com.br",
    description: "Inteligência Artificial",
  },
  {
    name: "EcoTrust",
    url: "https://ecotrust.io",
    description: "Cybersecurity",
  },
];

const Clients = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Clientes & Parceiros
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mt-2">
            Empresas que confiam na{" "}
            <span className="bg-gradient-to-r from-teal-400 to-primary bg-clip-text text-transparent">
              Albatross
            </span>
          </h2>
        </div>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {clients.map((client, index) => (
            <a
              key={index}
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center justify-center p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 hover:border-primary/50 hover:shadow-glow-sm transition-all duration-300"
            >
              {/* Client Name as Logo */}
              <div className="text-2xl md:text-3xl font-heading font-bold text-foreground/80 group-hover:text-primary transition-colors duration-300">
                {client.name}
              </div>
              <div className="text-xs text-muted-foreground mt-2 text-center">
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
