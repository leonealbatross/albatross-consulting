import { Target, Lightbulb, BarChart3, Shield } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Target,
      title: "Crescimento Estratégico",
      description: "Escalamos negócios de forma sustentável com estratégias comprovadas.",
    },
    {
      icon: Lightbulb,
      title: "Inovação Orientada",
      description: "Decisões orientadas por dados e inteligência artificial.",
    },
    {
      icon: BarChart3,
      title: "M&A Integrado",
      description: "Crescimento orgânico e inorgânico trabalhando em harmonia.",
    },
    {
      icon: Shield,
      title: "Governança Sólida",
      description: "Estruturas que atraem investidores e aceleram resultados.",
    },
  ];

  return (
    <section id="sobre" className="py-24 lg:py-32 relative">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-4">
              Sobre a Albatross
            </span>
            <h2 className="heading-section text-foreground mb-6">
              Transformamos estratégia em{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">resultados mensuráveis</span>
            </h2>
            <div className="space-y-4 text-body text-muted-foreground">
              <p>
                A Albatross Consulting é uma consultoria estratégica sediada em São Paulo, 
                especializada em crescimento sustentável para empresas de tecnologia e software 
                na América Latina.
              </p>
              <p>
                Nosso modelo <strong className="text-foreground">Business Growth as a Service</strong> combina 
                experiência executiva, frameworks comprovados e execução contínua para transformar 
                estratégia em resultados mensuráveis.
              </p>
              <p>
                Apoiamos CEOs, executivos e investidores a escalar negócios de forma sustentável, 
                combinando crescimento orgânico, aquisições estratégicas, governança e decisões 
                orientadas por dados e inteligência artificial.
              </p>
            </div>
          </div>

          {/* Right - Feature Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group gradient-glass rounded-2xl p-6 border-gradient hover:shadow-glow-sm transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="heading-card text-foreground mb-2">{feature.title}</h3>
                <p className="text-subtle">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
