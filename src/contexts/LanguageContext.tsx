import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "PT" | "EN" | "ES";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Translation files
const translations: Record<Language, Record<string, string>> = {
  PT: {
    // Header
    "nav.about": "Sobre",
    "nav.services": "Serviços",
    "nav.methodology": "Metodologia",
    "nav.leadership": "Liderança",
    "nav.contact": "Contato",
    "nav.schedule": "Agendar Conversa",

    // Hero
    "hero.badge": "Business Growth as a Service",
    "hero.headline": "Aceleramos o crescimento estratégico de",
    "hero.headline.highlight": "empresas de tecnologia.",
    "hero.subheadline": "Business Growth as a Service integrando estratégia, dados, M&A e execução para transformar seu negócio em uma potência de mercado.",
    "hero.cta.primary": "Agendar uma conversa estratégica",
    "hero.cta.secondary": "Conhecer nossos serviços",
    "hero.stat1.value": "25+",
    "hero.stat1.label": "Founder com Anos de Experiência",
    "hero.stat2.value": "✓",
    "hero.stat2.label": "Resultados Comprovados",
    "hero.stat3.value": "ONEtoONE",
    "hero.stat3.label": "Parceira em M&A Internacional",

    // About
    "about.label": "Sobre a Albatross",
    "about.headline": "Transformamos estratégia em",
    "about.headline.highlight": "resultados mensuráveis",
    "about.p1": "A Albatross Consulting é uma consultoria estratégica sediada em São Paulo, especializada em crescimento sustentável para empresas de tecnologia e software na América Latina.",
    "about.p2.start": "Nosso modelo",
    "about.p2.bold": "Business Growth as a Service",
    "about.p2.end": "combina experiência executiva, frameworks comprovados e execução contínua para transformar estratégia em resultados mensuráveis.",
    "about.p3": "Apoiamos CEOs, executivos e investidores a escalar negócios de forma sustentável, combinando crescimento orgânico, aquisições estratégicas, governança e decisões orientadas por dados e inteligência artificial.",
    "about.feature1.title": "Crescimento Estratégico",
    "about.feature1.desc": "Escalamos negócios de forma sustentável com estratégias comprovadas.",
    "about.feature2.title": "Inovação Orientada",
    "about.feature2.desc": "Decisões orientadas por dados e inteligência artificial.",
    "about.feature3.title": "M&A Integrado",
    "about.feature3.desc": "Crescimento orgânico e inorgânico trabalhando em harmonia.",
    "about.feature4.title": "Governança Sólida",
    "about.feature4.desc": "Estruturas que atraem investidores e aceleram resultados.",

    // Services
    "services.label": "Nossos Serviços",
    "services.headline": "Soluções completas para",
    "services.headline.highlight": "acelerar seu negócio",
    "services.subheadline": "Do planejamento estratégico à execução, oferecemos uma suíte completa de serviços para impulsionar o crescimento sustentável da sua empresa.",
    "services.learnMore": "Saiba mais",
    "services.s1.title": "Growth Strategy & Go-to-Market",
    "services.s1.desc": "Estruturamos estratégias de crescimento, modelos comerciais e execução de vendas para acelerar receita com previsibilidade.",
    "services.s1.highlight": "Crescimento Acelerado",
    "services.s2.title": "M&A para Empresas de Tecnologia",
    "services.s2.desc": "Atuação end-to-end em fusões e aquisições, do deal sourcing à integração pós-fusão, com foco em criação de valor.",
    "services.s2.highlight": "Fusões & Aquisições",
    "services.s3.title": "Business Intelligence & Data-Driven Decisions",
    "services.s3.desc": "Transformamos dados em decisões estratégicas, performance e governança escalável.",
    "services.s3.highlight": "Inteligência de Dados",
    "services.s4.title": "Governança Corporativa & Advisory Board",
    "services.s4.desc": "Estruturamos modelos de governança e conselhos consultivos alinhados à escala e atração de investidores.",
    "services.s4.highlight": "Governança",
    "services.s5.title": "GenAI & Inovação",
    "services.s5.desc": "Ajudamos empresas a utilizar IA generativa como alavanca real de eficiência, crescimento e vantagem competitiva.",
    "services.s5.highlight": "Inteligência Artificial",
    "services.s6.title": "Mentoria Executiva",
    "services.s6.desc": "Mentoria estratégica, confidencial e personalizada para líderes que precisam decidir melhor, executar mais rápido e escalar com consistência.",
    "services.s6.highlight": "Liderança Executiva",

    // Methodology
    "methodology.label": "Nossa Metodologia",
    "methodology.headline": "Da estratégia à execução com",
    "methodology.headline.highlight": "resultados comprovados",
    "methodology.subheadline": "Nosso processo estruturado garante que cada decisão seja baseada em dados, cada ação seja orientada por resultados e cada investimento gere retorno mensurável para sua empresa.",
    "methodology.diff1": "Experiência executiva em tecnologia e crescimento",
    "methodology.diff2": "Crescimento orgânico e inorgânico integrados",
    "methodology.diff3": "Forte orientação a dados, governança e resultados",
    "methodology.diff4": "Modelo contínuo (as a service), não projetos pontuais",
    "methodology.step1.title": "Diagnóstico",
    "methodology.step1.desc": "Análise profunda de performance, mercado e oportunidades estratégicas.",
    "methodology.step2.title": "Definição",
    "methodology.step2.desc": "Identificação das principais alavancas de crescimento e priorização.",
    "methodology.step3.title": "Execução",
    "methodology.step3.desc": "Implementação orientada por dados com acompanhamento contínuo.",
    "methodology.step4.title": "Escala",
    "methodology.step4.desc": "Monitoramento, otimização e expansão sustentável dos resultados.",

    // Clients
    "clients.label": "Clientes & Parceiros",
    "clients.headline": "Empresas que confiam na",
    "clients.headline.highlight": "Albatross",
    "clients.logoPlaceholder": "Logo Cliente",

    // Leadership
    "leadership.label": "Liderança",
    "leadership.name": "Marco Leone",
    "leadership.role": "Founder & Strategic Advisor",
    "leadership.bio1": "Executivo com mais de 25 anos de experiência em tecnologia, transformação digital, estratégia de crescimento, governança e M&A.",
    "leadership.bio2": "Atuação direta com CEOs, lideranças comerciais, investidores e conselhos, conectando estratégia, execução e tecnologia para geração de valor sustentável.",
    "leadership.tag1": "Estratégia de Crescimento",
    "leadership.tag2": "M&A",
    "leadership.tag3": "Governança",
    "leadership.tag4": "Transformação Digital",
    "leadership.tag5": "Go-to-Market",
    "leadership.tag6": "Liderança Executiva",

    // CTA
    "cta.badge": "Pronto para crescer?",
    "cta.headline": "Pronto para acelerar o crescimento do",
    "cta.headline.highlight": "seu negócio?",
    "cta.subheadline": "Converse com a Albatross Consulting e transforme estratégia em resultados concretos. Nossa equipe está pronta para entender seus desafios e desenhar a melhor solução para sua empresa.",
    "cta.primary": "Falar com um especialista",
    "cta.secondary": "Agendar reunião",
    "cta.trust": "Empresas de tecnologia confiam na Albatross Consulting para estruturar crescimento, governança e transformação estratégica.",

    // Footer
    "footer.brand": "Business Growth as a Service para empresas de tecnologia que buscam crescimento sustentável e resultados mensuráveis.",
    "footer.services": "Serviços",
    "footer.company": "Empresa",
    "footer.contact": "Contato",
    "footer.about": "Sobre",
    "footer.methodology": "Metodologia",
    "footer.leadership": "Liderança",
    "footer.careers": "Carreiras",
    "footer.copyright": "Todos os direitos reservados.",
    "footer.privacy": "Política de Privacidade",
    "footer.terms": "Termos de Uso",

    // Contact Modal
    "header.cta": "Agendar Conversa",
    "contact.title": "Agendar uma Conversa",
    "contact.description": "Preencha o formulário abaixo e entraremos em contato em breve para agendar uma conversa estratégica.",
    "contact.name": "Nome",
    "contact.name.placeholder": "Seu nome completo",
    "contact.email": "E-mail",
    "contact.email.placeholder": "seu@email.com",
    "contact.company": "Empresa",
    "contact.company.placeholder": "Nome da sua empresa",
    "contact.message": "Mensagem",
    "contact.message.placeholder": "Como podemos ajudar sua empresa?",
    "contact.submit": "Enviar mensagem",
    "contact.sending": "Enviando...",
    "contact.success.title": "Mensagem enviada!",
    "contact.success.description": "Entraremos em contato em breve para agendar sua conversa.",
  },

  EN: {
    // Header
    "nav.about": "About",
    "nav.services": "Services",
    "nav.methodology": "Methodology",
    "nav.leadership": "Leadership",
    "nav.contact": "Contact",
    "nav.schedule": "Schedule a Call",

    // Hero
    "hero.badge": "Business Growth as a Service",
    "hero.headline": "We accelerate strategic growth for",
    "hero.headline.highlight": "technology companies.",
    "hero.subheadline": "Business Growth as a Service integrating strategy, data, M&A and execution to transform your business into a market powerhouse.",
    "hero.cta.primary": "Schedule a strategic conversation",
    "hero.cta.secondary": "Explore our services",
    "hero.stat1.value": "25+",
    "hero.stat1.label": "Founder with Years of Experience",
    "hero.stat2.value": "✓",
    "hero.stat2.label": "Proven Results",
    "hero.stat3.value": "ONEtoONE",
    "hero.stat3.label": "International M&A Partner",

    // About
    "about.label": "About Albatross",
    "about.headline": "We transform strategy into",
    "about.headline.highlight": "measurable results",
    "about.p1": "Albatross Consulting is a strategic consulting firm based in São Paulo, specialized in sustainable growth for technology and software companies in Latin America.",
    "about.p2.start": "Our",
    "about.p2.bold": "Business Growth as a Service",
    "about.p2.end": "model combines executive experience, proven frameworks and continuous execution to transform strategy into measurable results.",
    "about.p3": "We support CEOs, executives and investors in scaling businesses sustainably, combining organic growth, strategic acquisitions, governance and data-driven decisions with artificial intelligence.",
    "about.feature1.title": "Strategic Growth",
    "about.feature1.desc": "We scale businesses sustainably with proven strategies.",
    "about.feature2.title": "Driven Innovation",
    "about.feature2.desc": "Data-driven decisions and artificial intelligence.",
    "about.feature3.title": "Integrated M&A",
    "about.feature3.desc": "Organic and inorganic growth working in harmony.",
    "about.feature4.title": "Solid Governance",
    "about.feature4.desc": "Structures that attract investors and accelerate results.",

    // Services
    "services.label": "Our Services",
    "services.headline": "Complete solutions to",
    "services.headline.highlight": "accelerate your business",
    "services.subheadline": "From strategic planning to execution, we offer a complete suite of services to drive sustainable growth for your company.",
    "services.learnMore": "Learn more",
    "services.s1.title": "Growth Strategy & Go-to-Market",
    "services.s1.desc": "We structure growth strategies, commercial models and sales execution to accelerate revenue with predictability.",
    "services.s1.highlight": "Accelerated Growth",
    "services.s2.title": "M&A for Technology Companies",
    "services.s2.desc": "End-to-end involvement in mergers and acquisitions, from deal sourcing to post-merger integration, focused on value creation.",
    "services.s2.highlight": "Mergers & Acquisitions",
    "services.s3.title": "Business Intelligence & Data-Driven Decisions",
    "services.s3.desc": "We transform data into strategic decisions, performance and scalable governance.",
    "services.s3.highlight": "Data Intelligence",
    "services.s4.title": "Corporate Governance & Advisory Board",
    "services.s4.desc": "We structure governance models and advisory boards aligned with scale and investor attraction.",
    "services.s4.highlight": "Governance",
    "services.s5.title": "GenAI & Innovation",
    "services.s5.desc": "We help companies use generative AI as a real lever for efficiency, growth and competitive advantage.",
    "services.s5.highlight": "Artificial Intelligence",
    "services.s6.title": "Executive Mentoring",
    "services.s6.desc": "Strategic, confidential and personalized mentoring for leaders who need to decide better, execute faster and scale consistently.",
    "services.s6.highlight": "Executive Leadership",

    // Methodology
    "methodology.label": "Our Methodology",
    "methodology.headline": "From strategy to execution with",
    "methodology.headline.highlight": "proven results",
    "methodology.subheadline": "Our structured process ensures that every decision is data-based, every action is results-oriented and every investment generates measurable return for your company.",
    "methodology.diff1": "Executive experience in technology and growth",
    "methodology.diff2": "Integrated organic and inorganic growth",
    "methodology.diff3": "Strong focus on data, governance and results",
    "methodology.diff4": "Continuous model (as a service), not one-off projects",
    "methodology.step1.title": "Diagnosis",
    "methodology.step1.desc": "In-depth analysis of performance, market and strategic opportunities.",
    "methodology.step2.title": "Definition",
    "methodology.step2.desc": "Identification of main growth levers and prioritization.",
    "methodology.step3.title": "Execution",
    "methodology.step3.desc": "Data-driven implementation with continuous monitoring.",
    "methodology.step4.title": "Scale",
    "methodology.step4.desc": "Monitoring, optimization and sustainable expansion of results.",

    // Clients
    "clients.label": "Clients & Partners",
    "clients.headline": "Companies that trust",
    "clients.headline.highlight": "Albatross",
    "clients.logoPlaceholder": "Client Logo",

    // Leadership
    "leadership.label": "Leadership",
    "leadership.name": "Marco Leone",
    "leadership.role": "Founder & Strategic Advisor",
    "leadership.bio1": "Executive with over 25 years of experience in technology, digital transformation, growth strategy, governance and M&A.",
    "leadership.bio2": "Direct engagement with CEOs, commercial leaders, investors and boards, connecting strategy, execution and technology for sustainable value creation.",
    "leadership.tag1": "Growth Strategy",
    "leadership.tag2": "M&A",
    "leadership.tag3": "Governance",
    "leadership.tag4": "Digital Transformation",
    "leadership.tag5": "Go-to-Market",
    "leadership.tag6": "Executive Leadership",

    // CTA
    "cta.badge": "Ready to grow?",
    "cta.headline": "Ready to accelerate the growth of",
    "cta.headline.highlight": "your business?",
    "cta.subheadline": "Talk to Albatross Consulting and transform strategy into concrete results. Our team is ready to understand your challenges and design the best solution for your company.",
    "cta.primary": "Talk to a specialist",
    "cta.secondary": "Schedule a meeting",
    "cta.trust": "Technology companies trust Albatross Consulting to structure growth, governance and strategic transformation.",

    // Footer
    "footer.brand": "Business Growth as a Service for technology companies seeking sustainable growth and measurable results.",
    "footer.services": "Services",
    "footer.company": "Company",
    "footer.contact": "Contact",
    "footer.about": "About",
    "footer.methodology": "Methodology",
    "footer.leadership": "Leadership",
    "footer.careers": "Careers",
    "footer.copyright": "All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Use",

    // Contact Modal
    "header.cta": "Schedule a Call",
    "contact.title": "Schedule a Conversation",
    "contact.description": "Fill out the form below and we'll get in touch soon to schedule a strategic conversation.",
    "contact.name": "Name",
    "contact.name.placeholder": "Your full name",
    "contact.email": "Email",
    "contact.email.placeholder": "your@email.com",
    "contact.company": "Company",
    "contact.company.placeholder": "Your company name",
    "contact.message": "Message",
    "contact.message.placeholder": "How can we help your company?",
    "contact.submit": "Send message",
    "contact.sending": "Sending...",
    "contact.success.title": "Message sent!",
    "contact.success.description": "We'll get in touch soon to schedule your conversation.",
  },

  ES: {
    // Header
    "nav.about": "Nosotros",
    "nav.services": "Servicios",
    "nav.methodology": "Metodología",
    "nav.leadership": "Liderazgo",
    "nav.contact": "Contacto",
    "nav.schedule": "Agendar una llamada",

    // Hero
    "hero.badge": "Business Growth as a Service",
    "hero.headline": "Aceleramos el crecimiento estratégico de",
    "hero.headline.highlight": "empresas de tecnología.",
    "hero.subheadline": "Business Growth as a Service integrando estrategia, datos, M&A y ejecución para transformar tu negocio en una potencia de mercado.",
    "hero.cta.primary": "Agendar una conversación estratégica",
    "hero.cta.secondary": "Conocer nuestros servicios",
    "hero.stat1.value": "25+",
    "hero.stat1.label": "Fundador con Años de Experiencia",
    "hero.stat2.value": "✓",
    "hero.stat2.label": "Resultados Comprobados",
    "hero.stat3.value": "ONEtoONE",
    "hero.stat3.label": "Socio en M&A Internacional",

    // About
    "about.label": "Sobre Albatross",
    "about.headline": "Transformamos estrategia en",
    "about.headline.highlight": "resultados medibles",
    "about.p1": "Albatross Consulting es una consultoría estratégica con sede en São Paulo, especializada en crecimiento sostenible para empresas de tecnología y software en América Latina.",
    "about.p2.start": "Nuestro modelo",
    "about.p2.bold": "Business Growth as a Service",
    "about.p2.end": "combina experiencia ejecutiva, frameworks comprobados y ejecución continua para transformar estrategia en resultados medibles.",
    "about.p3": "Apoyamos a CEOs, ejecutivos e inversores a escalar negocios de forma sostenible, combinando crecimiento orgánico, adquisiciones estratégicas, gobernanza y decisiones orientadas por datos e inteligencia artificial.",
    "about.feature1.title": "Crecimiento Estratégico",
    "about.feature1.desc": "Escalamos negocios de forma sostenible con estrategias comprobadas.",
    "about.feature2.title": "Innovación Orientada",
    "about.feature2.desc": "Decisiones orientadas por datos e inteligencia artificial.",
    "about.feature3.title": "M&A Integrado",
    "about.feature3.desc": "Crecimiento orgánico e inorgánico trabajando en armonía.",
    "about.feature4.title": "Gobernanza Sólida",
    "about.feature4.desc": "Estructuras que atraen inversores y aceleran resultados.",

    // Services
    "services.label": "Nuestros Servicios",
    "services.headline": "Soluciones completas para",
    "services.headline.highlight": "acelerar tu negocio",
    "services.subheadline": "De la planificación estratégica a la ejecución, ofrecemos una suite completa de servicios para impulsar el crecimiento sostenible de tu empresa.",
    "services.learnMore": "Saber más",
    "services.s1.title": "Growth Strategy & Go-to-Market",
    "services.s1.desc": "Estructuramos estrategias de crecimiento, modelos comerciales y ejecución de ventas para acelerar ingresos con previsibilidad.",
    "services.s1.highlight": "Crecimiento Acelerado",
    "services.s2.title": "M&A para Empresas de Tecnología",
    "services.s2.desc": "Actuación end-to-end en fusiones y adquisiciones, del deal sourcing a la integración post-fusión, con foco en creación de valor.",
    "services.s2.highlight": "Fusiones & Adquisiciones",
    "services.s3.title": "Business Intelligence & Data-Driven Decisions",
    "services.s3.desc": "Transformamos datos en decisiones estratégicas, performance y gobernanza escalable.",
    "services.s3.highlight": "Inteligencia de Datos",
    "services.s4.title": "Gobernanza Corporativa & Advisory Board",
    "services.s4.desc": "Estructuramos modelos de gobernanza y consejos consultivos alineados a la escala y atracción de inversores.",
    "services.s4.highlight": "Gobernanza",
    "services.s5.title": "GenAI & Innovación",
    "services.s5.desc": "Ayudamos a empresas a utilizar IA generativa como palanca real de eficiencia, crecimiento y ventaja competitiva.",
    "services.s5.highlight": "Inteligencia Artificial",
    "services.s6.title": "Mentoría Ejecutiva",
    "services.s6.desc": "Mentoría estratégica, confidencial y personalizada para líderes que necesitan decidir mejor, ejecutar más rápido y escalar con consistencia.",
    "services.s6.highlight": "Liderazgo Ejecutivo",

    // Methodology
    "methodology.label": "Nuestra Metodología",
    "methodology.headline": "De la estrategia a la ejecución con",
    "methodology.headline.highlight": "resultados comprobados",
    "methodology.subheadline": "Nuestro proceso estructurado garantiza que cada decisión esté basada en datos, cada acción esté orientada a resultados y cada inversión genere retorno medible para tu empresa.",
    "methodology.diff1": "Experiencia ejecutiva en tecnología y crecimiento",
    "methodology.diff2": "Crecimiento orgánico e inorgánico integrados",
    "methodology.diff3": "Fuerte orientación a datos, gobernanza y resultados",
    "methodology.diff4": "Modelo continuo (as a service), no proyectos puntuales",
    "methodology.step1.title": "Diagnóstico",
    "methodology.step1.desc": "Análisis profundo de performance, mercado y oportunidades estratégicas.",
    "methodology.step2.title": "Definición",
    "methodology.step2.desc": "Identificación de las principales palancas de crecimiento y priorización.",
    "methodology.step3.title": "Ejecución",
    "methodology.step3.desc": "Implementación orientada por datos con acompañamiento continuo.",
    "methodology.step4.title": "Escala",
    "methodology.step4.desc": "Monitoreo, optimización y expansión sostenible de los resultados.",

    // Clients
    "clients.label": "Clientes & Socios",
    "clients.headline": "Empresas que confían en",
    "clients.headline.highlight": "Albatross",
    "clients.logoPlaceholder": "Logo Cliente",

    // Leadership
    "leadership.label": "Liderazgo",
    "leadership.name": "Marco Leone",
    "leadership.role": "Founder & Strategic Advisor",
    "leadership.bio1": "Ejecutivo con más de 25 años de experiencia en tecnología, transformación digital, estrategia de crecimiento, gobernanza y M&A.",
    "leadership.bio2": "Actuación directa con CEOs, liderazgos comerciales, inversores y consejos, conectando estrategia, ejecución y tecnología para generación de valor sostenible.",
    "leadership.tag1": "Estrategia de Crecimiento",
    "leadership.tag2": "M&A",
    "leadership.tag3": "Gobernanza",
    "leadership.tag4": "Transformación Digital",
    "leadership.tag5": "Go-to-Market",
    "leadership.tag6": "Liderazgo Ejecutivo",

    // CTA
    "cta.badge": "¿Listo para crecer?",
    "cta.headline": "¿Listo para acelerar el crecimiento de",
    "cta.headline.highlight": "tu negocio?",
    "cta.subheadline": "Conversa con Albatross Consulting y transforma estrategia en resultados concretos. Nuestro equipo está listo para entender tus desafíos y diseñar la mejor solución para tu empresa.",
    "cta.primary": "Hablar con un especialista",
    "cta.secondary": "Agendar reunión",
    "cta.trust": "Empresas de tecnología confían en Albatross Consulting para estructurar crecimiento, gobernanza y transformación estratégica.",

    // Footer
    "footer.brand": "Business Growth as a Service para empresas de tecnología que buscan crecimiento sostenible y resultados medibles.",
    "footer.services": "Servicios",
    "footer.company": "Empresa",
    "footer.contact": "Contacto",
    "footer.about": "Nosotros",
    "footer.methodology": "Metodología",
    "footer.leadership": "Liderazgo",
    "footer.careers": "Carreras",
    "footer.copyright": "Todos los derechos reservados.",
    "footer.privacy": "Política de Privacidad",
    "footer.terms": "Términos de Uso",

    // Contact Modal
    "header.cta": "Agendar una Llamada",
    "contact.title": "Agendar una Conversación",
    "contact.description": "Complete el formulario a continuación y nos pondremos en contacto pronto para agendar una conversación estratégica.",
    "contact.name": "Nombre",
    "contact.name.placeholder": "Su nombre completo",
    "contact.email": "Correo electrónico",
    "contact.email.placeholder": "su@correo.com",
    "contact.company": "Empresa",
    "contact.company.placeholder": "Nombre de su empresa",
    "contact.message": "Mensaje",
    "contact.message.placeholder": "¿Cómo podemos ayudar a su empresa?",
    "contact.submit": "Enviar mensaje",
    "contact.sending": "Enviando...",
    "contact.success.title": "¡Mensaje enviado!",
    "contact.success.description": "Nos pondremos en contacto pronto para agendar su conversación.",
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("PT");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
