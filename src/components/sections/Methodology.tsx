import { Search, Compass, Play, BarChart } from "lucide-react";

const Methodology = () => {
  const steps = [
    {
      icon: Search,
      step: "01",
      title: "Diagnóstico",
      description:
        "Análise profunda de performance, mercado e oportunidades estratégicas.",
    },
    {
      icon: Compass,
      step: "02",
      title: "Definição",
      description:
        "Identificação das principais alavancas de crescimento e priorização.",
    },
    {
      icon: Play,
      step: "03",
      title: "Execução",
      description:
        "Implementação orientada por dados com acompanhamento contínuo.",
    },
    {
      icon: BarChart,
      step: "04",
      title: "Escala",
      description:
        "Monitoramento, otimização e expansão sustentável dos resultados.",
    },
  ];

  return (
    <section id="metodologia" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
              Nossa Metodologia
            </span>
            <h2 className="heading-section text-foreground mb-6">
              Da estratégia à execução com{" "}
              <span className="bg-gradient-to-r from-teal-400 to-primary bg-clip-text text-transparent">resultados comprovados</span>
            </h2>
            <p className="text-body text-muted-foreground mb-8">
              Nosso processo estruturado garante que cada decisão seja baseada em dados, 
              cada ação seja orientada por resultados e cada investimento gere retorno 
              mensurável para sua empresa.
            </p>

            {/* Differentiators */}
            <div className="space-y-4">
              {[
                "Experiência executiva em tecnologia e crescimento",
                "Crescimento orgânico e inorgânico integrados",
                "Forte orientação a dados, governança e resultados",
                "Modelo contínuo (as a service), não projetos pontuais",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Steps */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-[27px] top-8 bottom-8 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden lg:block" />

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="group flex gap-6 items-start"
                >
                  {/* Step Number */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-glow-sm transition-all duration-500">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="gradient-glass rounded-2xl p-6 flex-1 border-gradient group-hover:shadow-glow-sm transition-all duration-500">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-primary font-mono text-sm font-bold">
                        {step.step}
                      </span>
                      <h3 className="heading-card text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-subtle">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
