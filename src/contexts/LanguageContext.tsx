import { createContext, useContext, useState, ReactNode } from "react";

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
    "hero.stat1.label": "Anos de Experiência Executiva",
    "hero.stat1.sublabel": "Atuação prática em estratégia, crescimento e execução.",
    "hero.stat2.value": "✓",
    "hero.stat2.label": "Resultados comprovados",
    "hero.stat2.sublabel": "Entrega consistente, orientada a impacto e geração de valor.",
    "hero.stat3.value": "M&A",
    "hero.stat3.label": "Parceria em M&A",
    "hero.stat3.sublabel": "Albatross Consulting em parceria com a ONEtoONE.",

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
    "services.s4.title": "Governança Corporativa & Advisory Board",
    "services.s4.desc": "Estruturamos modelos de governança e conselhos consultivos alinhados à escala e atração de investidores.",
    "services.s4.highlight": "Governança",
    "services.s5.title": "GenAI & Inovação",
    "services.s5.desc": "Ajudamos empresas a utilizar IA generativa como alavanca real de eficiência, crescimento e vantagem competitiva.",
    "services.s5.highlight": "Inteligência Artificial",
    "services.s6.title": "Mentoria Executiva",
    "services.s6.desc": "Mentoria estratégica, confidencial e personalizada para líderes que precisam decidir melhor, executar mais rápido e escalar com consistência.",
    "services.s6.highlight": "Liderança Executiva",
    "services.s7.title": "Due Diligence Comercial para M&A",
    "services.s7.desc": "Avaliação profunda da Área Comercial e do GTM da empresa, incluindo validação das expectativas futuras de receita, previsibilidade e acuracidade dos compromissos assumidos (forecast e pipeline), e capacidade de execução comercial para reduzir riscos e acelerar criação de valor em M&A.",
    "services.s7.highlight": "GTM & Vendas",
    "services.s7.detailContent": `A Albatross Consulting conduz Due Diligence Comercial voltado a operações de M&A para validar se a "máquina de vendas" é escalável, previsível e sustentável.

A análise cobre o GTM, diferentes estratégias comerciais e a maturidade da organização de vendas, com foco em riscos, dependências e alavancas de valor que impactam valuation, earn-out e plano de integração.

ESCOPO:
• Validação do GTM: ICP/segmentação, proposta de valor, pricing, canais e cobertura
• Avaliação por estratégia comercial (B2B SMB/Mid-Market, B2C, Enterprise/KAM, Green Field, SDR Inbound/Outbound)
• Rolling Four Quarters (RFQ): pipeline health e cobertura dos próximos 4 trimestres
• Forecast: acurácia, viés, commit reliability e slippage (histórico de 3 anos)
• Processo, enablement, métricas e CRM: critérios de etapas, governança do pipeline, qualidade de dados
• Incentivos (Rewards & Recognition): alinhamento com margem, qualidade e crescimento sustentável
• Pessoas: performance de vendedores e líderes (L1→CRO) nos últimos 3 anos

ENTREGÁVEIS:
• Relatório executivo com riscos e recomendações para o deal
• Scorecard de maturidade comercial e prontidão para escala
• Anexo analítico com RFQ pipeline/forecast e performance 3 anos
• Recomendações para valuation/earn-out e plano de 100 dias`,

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

    // Scheduling
    "nav.scheduling": "Agendamento",
    "scheduling.label": "Agendamento",
    "scheduling.headline": "Agende uma",
    "scheduling.headline.highlight": "conversa estratégica",
    "scheduling.subheadline": "Escolha o melhor horário para uma reunião e descubra como podemos acelerar o crescimento da sua empresa.",
    "scheduling.feature1.title": "Flexibilidade de Horários",
    "scheduling.feature1.desc": "Escolha o dia e horário mais conveniente para você.",
    "scheduling.feature2.title": "Reunião de 30 Minutos",
    "scheduling.feature2.desc": "Conversa objetiva para entender seus desafios e apresentar soluções.",
    "scheduling.feature3.title": "Videoconferência",
    "scheduling.feature3.desc": "Reunião online via Google Meet.",
    "scheduling.calendar.title": "Selecione um horário",

    // Careers
    "nav.careers": "Carreiras",
    "careers.label": "Carreiras",
    "careers.headline": "Faça parte do",
    "careers.headline.highlight": "nosso time",
    "careers.subheadline": "Buscamos profissionais apaixonados por crescimento, estratégia e tecnologia para fazer parte da nossa equipe.",
    "careers.benefits.title": "Por que trabalhar na Albatross?",
    "careers.benefit1.title": "Crescimento Acelerado",
    "careers.benefit1.desc": "Trabalhe com empresas de tecnologia de alto impacto e acelere sua carreira.",
    "careers.benefit2.title": "Time de Elite",
    "careers.benefit2.desc": "Colabore com profissionais experientes e aprenda com os melhores.",
    "careers.benefit3.title": "Cultura Inovadora",
    "careers.benefit3.desc": "Ambiente dinâmico que valoriza inovação, autonomia e resultados.",
    "careers.upload.info": "Envie seu currículo",
    "careers.upload.formats": "Formatos aceitos: PDF, DOC, DOCX (máximo 5MB)",
    "careers.form.title": "Candidate-se",
    "careers.form.phone": "Telefone",
    "careers.form.phone.placeholder": "(11) 99999-9999",
    "careers.form.linkedin": "LinkedIn",
    "careers.form.linkedin.placeholder": "linkedin.com/in/seu-perfil",
    "careers.form.motivation": "Por que quer trabalhar na Albatross?",
    "careers.form.motivation.placeholder": "Conte-nos sobre sua motivação e experiência...",
    "careers.form.submit": "Enviar candidatura",
    "careers.form.note": "Após enviar, anexe seu currículo no email que será aberto.",
    "careers.form.success.title": "Candidatura iniciada!",
    "careers.form.success.description": "Complete sua candidatura no email que foi aberto.",
    "careers.form.error.title": "Erro no formulário",
    "careers.form.error.description": "Por favor, corrija os campos destacados.",
    "careers.form.error.nameRequired": "Nome é obrigatório",
    "careers.form.error.nameMin": "Nome deve ter pelo menos 2 caracteres",
    "careers.form.error.emailRequired": "Email é obrigatório",
    "careers.form.error.emailInvalid": "Email inválido",
    "careers.form.error.phoneInvalid": "Telefone inválido",
    "careers.form.error.linkedinInvalid": "URL do LinkedIn inválida",
    "careers.form.error.messageRequired": "Mensagem é obrigatória",
    "careers.form.error.messageMin": "Mensagem deve ter pelo menos 20 caracteres",

    // Due Diligence Modal - New 2-step form
    "duediligence.cta": "Solicitar avaliação",
    "duediligence.modal.title": "Solicitar avaliação — Due Diligence Comercial para M&A",
    "duediligence.modal.subtitle": "Responda em 2 minutos para recomendarmos a melhor abordagem.",
    "duediligence.step": "Etapa",
    "duediligence.of": "de",
    "duediligence.continue": "Continuar",
    "duediligence.back": "Voltar",
    "duediligence.submit": "Solicitar avaliação",
    "duediligence.sending": "Enviando...",
    "duediligence.select": "Selecione...",
    "duediligence.optional": "opcional",
    "duediligence.required": "Campos obrigatórios",
    "duediligence.fillRequired": "Por favor, preencha todos os campos obrigatórios",
    // Step 1 fields
    "duediligence.fullName": "Nome completo",
    "duediligence.corporateEmail": "Email corporativo",
    "duediligence.company": "Empresa",
    "duediligence.companyPlaceholder": "Nome da sua empresa",
    "duediligence.phone": "Telefone/WhatsApp",
    "duediligence.roleInTransaction": "Papel na transação",
    "duediligence.dealStatus": "Status e janela do deal",
    // Role options
    "duediligence.role.strategicBuyer": "Comprador estratégico",
    "duediligence.role.privateEquity": "Private Equity",
    "duediligence.role.sellerManagement": "Vendedor/Management",
    "duediligence.role.advisor": "Advisor (IB/M&A)",
    "duediligence.role.other": "Outro",
    // Deal status options
    "duediligence.status.preLoi": "Pré-LOI",
    "duediligence.status.postLoi": "Pós-LOI",
    "duediligence.status.exclusivity": "Exclusividade",
    "duediligence.status.preClosing": "Pré-closing",
    "duediligence.status.postClosing": "Pós-closing (plano 100 dias)",
    "duediligence.status.other": "Outro",
    // Step 2 fields
    "duediligence.jobTitle": "Cargo",
    "duediligence.targetCompanySize": "Porte da empresa-alvo",
    "duediligence.targetCompanySector": "Empresa-alvo: setor e geografia principal",
    "duediligence.targetCompanyPlaceholder": "Ex.: SaaS B2B – Brasil/LatAm",
    // Job title options
    "duediligence.title.partner": "Sócio/Partner",
    "duediligence.title.ceo": "CEO",
    "duediligence.title.cfo": "CFO",
    "duediligence.title.croVpSales": "CRO/VP Sales",
    "duediligence.title.headMa": "Head de M&A/Corp Dev",
    "duediligence.title.other": "Outro",
    // Revenue options
    "duediligence.revenue.under50m": "Receita anual <R$50M",
    "duediligence.revenue.50m200m": "R$50–200M",
    "duediligence.revenue.200m500m": "R$200–500M",
    "duediligence.revenue.above500m": ">R$500M",
    "duediligence.revenue.unknown": "Não sei informar",
    // Objectives
    "duediligence.objectives.title": "Objetivo principal do Due Diligence Comercial",
    "duediligence.objectives.selectMultiple": "selecione um ou mais",
    "duediligence.obj.validateIcp": "Validar ICP/segmentação e proposta de valor",
    "duediligence.obj.evaluatePricing": "Avaliar pricing/discounting e margem",
    "duediligence.obj.validateSalesMotions": "Validar sales motions (SMB/Mid, B2C, Enterprise/KAM, Green Field, SDR)",
    "duediligence.obj.measurePipeline": "Medir saúde de pipeline (Rolling Four Quarters)",
    "duediligence.obj.testForecast": "Testar previsibilidade de forecast (3 anos)",
    "duediligence.obj.evaluateSalesOps": "Avaliar Sales Operations (CRM, métricas, enablement, incentivos)",
    // Available data
    "duediligence.availableData.title": "Quais dados vocês conseguem disponibilizar em até 5 dias úteis?",
    "duediligence.data.crmExport": "Export do CRM com histórico",
    "duediligence.data.quotas": "Metas/quotas (12 trimestres)",
    "duediligence.data.forecastSnapshots": "Snapshots de forecast (semanal/mensal)",
    "duediligence.data.clientList": "Lista de clientes/contratos/renovações",
    "duediligence.data.orgCharts": "Org charts e comp plan",
    // Concerns
    "duediligence.concerns": "Riscos/hipóteses que mais preocupam o comitê",
    "duediligence.concernsPlaceholder": "Ex.: Concentração de receita, dependência de poucos clientes, turnover alto em vendas...",
    // LGPD
    "duediligence.lgpd": "Ao enviar, você concorda em ser contatado pela Albatross Consulting para tratar da sua solicitação, conforme nossa política de privacidade.",
    // Success state
    "duediligence.success.title": "Solicitação enviada com sucesso!",
    "duediligence.success.contact": "Nossa equipe entrará em contato em até 1 dia útil.",
    "duediligence.success.scopeSummary": "Resumo do escopo",
    "duediligence.success.copySummary": "Copiar resumo",
    "duediligence.success.copied": "Copiado!",
    "duediligence.success.copiedDesc": "Resumo copiado para a área de transferência",
    "duediligence.success.nextSteps": "Próximos passos:",
    "duediligence.success.step1": "Análise do seu perfil e escopo",
    "duediligence.success.step2": "Contato para alinhar expectativas e timing",
    "duediligence.success.step3": "Proposta customizada de Due Diligence Comercial",
    "duediligence.success.close": "Fechar",
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
    "hero.stat1.label": "Years of Executive Experience",
    "hero.stat1.sublabel": "Hands-on expertise in strategy, growth and execution.",
    "hero.stat2.value": "✓",
    "hero.stat2.label": "Proven results",
    "hero.stat2.sublabel": "Consistent delivery, focused on impact and value creation.",
    "hero.stat3.value": "M&A",
    "hero.stat3.label": "M&A Partnership",
    "hero.stat3.sublabel": "Albatross Consulting in partnership with ONEtoONE.",

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
    "services.s4.title": "Corporate Governance & Advisory Board",
    "services.s4.desc": "We structure governance models and advisory boards aligned with scale and investor attraction.",
    "services.s4.highlight": "Governance",
    "services.s5.title": "GenAI & Innovation",
    "services.s5.desc": "We help companies use generative AI as a real lever for efficiency, growth and competitive advantage.",
    "services.s5.highlight": "Artificial Intelligence",
    "services.s6.title": "Executive Mentoring",
    "services.s6.desc": "Strategic, confidential and personalized mentoring for leaders who need to decide better, execute faster and scale consistently.",
    "services.s6.highlight": "Executive Leadership",
    "services.s7.title": "Commercial Due Diligence for M&A",
    "services.s7.desc": "In-depth assessment of Go-to-Market, pipeline, forecast and commercial execution capability to reduce risks and accelerate value creation in M&A.",
    "services.s7.highlight": "GTM & Sales",
    "services.s7.detailContent": `Albatross Consulting conducts Commercial Due Diligence for M&A operations to validate whether the "sales machine" is scalable, predictable and sustainable.

The analysis covers GTM, different commercial strategies and sales organization maturity, focusing on risks, dependencies and value levers that impact valuation, earn-out and integration plan.

SCOPE:
• GTM Validation: ICP/segmentation, value proposition, pricing, channels and coverage
• Assessment by commercial strategy (B2B SMB/Mid-Market, B2C, Enterprise/KAM, Green Field, SDR Inbound/Outbound)
• Rolling Four Quarters (RFQ): pipeline health and coverage for the next 4 quarters
• Forecast: accuracy, bias, commit reliability and slippage (3-year history)
• Process, enablement, metrics and CRM: stage criteria, pipeline governance, data quality
• Incentives (Rewards & Recognition): alignment with margin, quality and sustainable growth
• People: performance of salespeople and leaders (L1→CRO) over the past 3 years

DELIVERABLES:
• Executive report with risks and recommendations for the deal
• Commercial maturity and scale readiness scorecard
• Analytical appendix with RFQ pipeline/forecast and 3-year performance
• Recommendations for valuation/earn-out and 100-day plan`,

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

    // Scheduling
    "nav.scheduling": "Scheduling",
    "scheduling.label": "Scheduling",
    "scheduling.headline": "Schedule a",
    "scheduling.headline.highlight": "strategic conversation",
    "scheduling.subheadline": "Choose the best time for a meeting and discover how we can accelerate your company's growth.",
    "scheduling.feature1.title": "Flexible Schedule",
    "scheduling.feature1.desc": "Choose the day and time most convenient for you.",
    "scheduling.feature2.title": "30-Minute Meeting",
    "scheduling.feature2.desc": "Objective conversation to understand your challenges and present solutions.",
    "scheduling.feature3.title": "Video Conference",
    "scheduling.feature3.desc": "Online meeting via Google Meet.",
    "scheduling.calendar.title": "Select a time",

    // Careers
    "nav.careers": "Careers",
    "careers.label": "Careers",
    "careers.headline": "Join",
    "careers.headline.highlight": "our team",
    "careers.subheadline": "We're looking for professionals passionate about growth, strategy and technology to be part of our team.",
    "careers.benefits.title": "Why work at Albatross?",
    "careers.benefit1.title": "Accelerated Growth",
    "careers.benefit1.desc": "Work with high-impact technology companies and accelerate your career.",
    "careers.benefit2.title": "Elite Team",
    "careers.benefit2.desc": "Collaborate with experienced professionals and learn from the best.",
    "careers.benefit3.title": "Innovative Culture",
    "careers.benefit3.desc": "Dynamic environment that values innovation, autonomy and results.",
    "careers.upload.info": "Submit your resume",
    "careers.upload.formats": "Accepted formats: PDF, DOC, DOCX (max 5MB)",
    "careers.form.title": "Apply Now",
    "careers.form.phone": "Phone",
    "careers.form.phone.placeholder": "+1 (555) 123-4567",
    "careers.form.linkedin": "LinkedIn",
    "careers.form.linkedin.placeholder": "linkedin.com/in/your-profile",
    "careers.form.motivation": "Why do you want to work at Albatross?",
    "careers.form.motivation.placeholder": "Tell us about your motivation and experience...",
    "careers.form.submit": "Submit application",
    "careers.form.note": "After submitting, attach your resume to the email that will open.",
    "careers.form.success.title": "Application started!",
    "careers.form.success.description": "Complete your application in the email that was opened.",
    "careers.form.error.title": "Form error",
    "careers.form.error.description": "Please fix the highlighted fields.",
    "careers.form.error.nameRequired": "Name is required",
    "careers.form.error.nameMin": "Name must have at least 2 characters",
    "careers.form.error.emailRequired": "Email is required",
    "careers.form.error.emailInvalid": "Invalid email",
    "careers.form.error.phoneInvalid": "Invalid phone number",
    "careers.form.error.linkedinInvalid": "Invalid LinkedIn URL",
    "careers.form.error.messageRequired": "Message is required",
    "careers.form.error.messageMin": "Message must have at least 20 characters",

    // Due Diligence Modal - New 2-step form
    "duediligence.cta": "Request assessment",
    "duediligence.modal.title": "Request assessment — Commercial Due Diligence for M&A",
    "duediligence.modal.subtitle": "Answer in 2 minutes so we can recommend the best approach.",
    "duediligence.step": "Step",
    "duediligence.of": "of",
    "duediligence.continue": "Continue",
    "duediligence.back": "Back",
    "duediligence.submit": "Request assessment",
    "duediligence.sending": "Sending...",
    "duediligence.select": "Select...",
    "duediligence.optional": "optional",
    "duediligence.required": "Required fields",
    "duediligence.fillRequired": "Please fill in all required fields",
    // Step 1 fields
    "duediligence.fullName": "Full name",
    "duediligence.corporateEmail": "Corporate email",
    "duediligence.company": "Company",
    "duediligence.companyPlaceholder": "Your company name",
    "duediligence.phone": "Phone/WhatsApp",
    "duediligence.roleInTransaction": "Role in transaction",
    "duediligence.dealStatus": "Deal status and window",
    // Role options
    "duediligence.role.strategicBuyer": "Strategic Buyer",
    "duediligence.role.privateEquity": "Private Equity",
    "duediligence.role.sellerManagement": "Seller/Management",
    "duediligence.role.advisor": "Advisor (IB/M&A)",
    "duediligence.role.other": "Other",
    // Deal status options
    "duediligence.status.preLoi": "Pre-LOI",
    "duediligence.status.postLoi": "Post-LOI",
    "duediligence.status.exclusivity": "Exclusivity",
    "duediligence.status.preClosing": "Pre-closing",
    "duediligence.status.postClosing": "Post-closing (100-day plan)",
    "duediligence.status.other": "Other",
    // Step 2 fields
    "duediligence.jobTitle": "Job Title",
    "duediligence.targetCompanySize": "Target company size",
    "duediligence.targetCompanySector": "Target company: sector and main geography",
    "duediligence.targetCompanyPlaceholder": "E.g.: B2B SaaS – Brazil/LatAm",
    // Job title options
    "duediligence.title.partner": "Partner",
    "duediligence.title.ceo": "CEO",
    "duediligence.title.cfo": "CFO",
    "duediligence.title.croVpSales": "CRO/VP Sales",
    "duediligence.title.headMa": "Head of M&A/Corp Dev",
    "duediligence.title.other": "Other",
    // Revenue options
    "duediligence.revenue.under50m": "Annual revenue <$50M",
    "duediligence.revenue.50m200m": "$50–200M",
    "duediligence.revenue.200m500m": "$200–500M",
    "duediligence.revenue.above500m": ">$500M",
    "duediligence.revenue.unknown": "Don't know",
    // Objectives
    "duediligence.objectives.title": "Main Commercial Due Diligence objectives",
    "duediligence.objectives.selectMultiple": "select one or more",
    "duediligence.obj.validateIcp": "Validate ICP/segmentation and value proposition",
    "duediligence.obj.evaluatePricing": "Evaluate pricing/discounting and margin",
    "duediligence.obj.validateSalesMotions": "Validate sales motions (SMB/Mid, B2C, Enterprise/KAM, Green Field, SDR)",
    "duediligence.obj.measurePipeline": "Measure pipeline health (Rolling Four Quarters)",
    "duediligence.obj.testForecast": "Test forecast predictability (3 years)",
    "duediligence.obj.evaluateSalesOps": "Evaluate Sales Operations (CRM, metrics, enablement, incentives)",
    // Available data
    "duediligence.availableData.title": "What data can you provide within 5 business days?",
    "duediligence.data.crmExport": "CRM export with history",
    "duediligence.data.quotas": "Goals/quotas (12 quarters)",
    "duediligence.data.forecastSnapshots": "Forecast snapshots (weekly/monthly)",
    "duediligence.data.clientList": "Client/contract/renewal list",
    "duediligence.data.orgCharts": "Org charts and comp plan",
    // Concerns
    "duediligence.concerns": "Risks/hypotheses that concern the committee most",
    "duediligence.concernsPlaceholder": "E.g.: Revenue concentration, dependency on few clients, high sales turnover...",
    // LGPD
    "duediligence.lgpd": "By submitting, you agree to be contacted by Albatross Consulting regarding your request, in accordance with our privacy policy.",
    // Success state
    "duediligence.success.title": "Request submitted successfully!",
    "duediligence.success.contact": "Our team will contact you within 1 business day.",
    "duediligence.success.scopeSummary": "Scope summary",
    "duediligence.success.copySummary": "Copy summary",
    "duediligence.success.copied": "Copied!",
    "duediligence.success.copiedDesc": "Summary copied to clipboard",
    "duediligence.success.nextSteps": "Next steps:",
    "duediligence.success.step1": "Analysis of your profile and scope",
    "duediligence.success.step2": "Contact to align expectations and timing",
    "duediligence.success.step3": "Customized Commercial Due Diligence proposal",
    "duediligence.success.close": "Close",
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
    "hero.stat1.label": "Años de Experiencia Ejecutiva",
    "hero.stat1.sublabel": "Experiencia práctica en estrategia, crecimiento y ejecución.",
    "hero.stat2.value": "✓",
    "hero.stat2.label": "Resultados Comprobados",
    "hero.stat2.sublabel": "Entrega consistente, enfocada en impacto y creación de valor.",
    "hero.stat3.value": "M&A",
    "hero.stat3.label": "Alianza en M&A",
    "hero.stat3.sublabel": "Albatross Consulting en alianza con ONEtoONE.",

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
    "services.s4.title": "Gobernanza Corporativa & Advisory Board",
    "services.s4.desc": "Estructuramos modelos de gobernanza y consejos consultivos alineados a la escala y atracción de inversores.",
    "services.s4.highlight": "Gobernanza",
    "services.s5.title": "GenAI & Innovación",
    "services.s5.desc": "Ayudamos a empresas a utilizar IA generativa como palanca real de eficiencia, crecimiento y ventaja competitiva.",
    "services.s5.highlight": "Inteligencia Artificial",
    "services.s6.title": "Mentoría Ejecutiva",
    "services.s6.desc": "Mentoría estratégica, confidencial y personalizada para líderes que necesitan decidir mejor, ejecutar más rápido y escalar con consistencia.",
    "services.s6.highlight": "Liderazgo Ejecutivo",
    "services.s7.title": "Due Diligence Comercial para M&A",
    "services.s7.desc": "Evaluación profunda del Go-to-Market, pipeline, forecast y capacidad de ejecución comercial para reducir riesgos y acelerar creación de valor en M&A.",
    "services.s7.highlight": "GTM & Ventas",
    "services.s7.detailContent": `Albatross Consulting conduce Due Diligence Comercial para operaciones de M&A para validar si la "máquina de ventas" es escalable, predecible y sostenible.

El análisis cubre el GTM, diferentes estrategias comerciales y la madurez de la organización de ventas, con enfoque en riesgos, dependencias y palancas de valor que impactan valuación, earn-out y plan de integración.

ALCANCE:
• Validación del GTM: ICP/segmentación, propuesta de valor, pricing, canales y cobertura
• Evaluación por estrategia comercial (B2B SMB/Mid-Market, B2C, Enterprise/KAM, Green Field, SDR Inbound/Outbound)
• Rolling Four Quarters (RFQ): salud del pipeline y cobertura de los próximos 4 trimestres
• Forecast: precisión, sesgo, commit reliability y slippage (histórico de 3 años)
• Proceso, enablement, métricas y CRM: criterios de etapas, gobernanza del pipeline, calidad de datos
• Incentivos (Rewards & Recognition): alineación con margen, calidad y crecimiento sostenible
• Personas: rendimiento de vendedores y líderes (L1→CRO) en los últimos 3 años

ENTREGABLES:
• Informe ejecutivo con riesgos y recomendaciones para el deal
• Scorecard de madurez comercial y preparación para escalar
• Anexo analítico con RFQ pipeline/forecast y rendimiento 3 años
• Recomendaciones para valuación/earn-out y plan de 100 días`,

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

    // Scheduling
    "nav.scheduling": "Agendamiento",
    "scheduling.label": "Agendamiento",
    "scheduling.headline": "Agende una",
    "scheduling.headline.highlight": "conversación estratégica",
    "scheduling.subheadline": "Elija el mejor horario para una reunión y descubra cómo podemos acelerar el crecimiento de su empresa.",
    "scheduling.feature1.title": "Flexibilidad de Horarios",
    "scheduling.feature1.desc": "Elija el día y horario más conveniente para usted.",
    "scheduling.feature2.title": "Reunión de 30 Minutos",
    "scheduling.feature2.desc": "Conversación objetiva para entender sus desafíos y presentar soluciones.",
    "scheduling.feature3.title": "Videoconferencia",
    "scheduling.feature3.desc": "Reunión online vía Google Meet.",
    "scheduling.calendar.title": "Seleccione un horario",

    // Careers
    "nav.careers": "Carreras",
    "careers.label": "Carreras",
    "careers.headline": "Sea parte de",
    "careers.headline.highlight": "nuestro equipo",
    "careers.subheadline": "Buscamos profesionales apasionados por crecimiento, estrategia y tecnología para formar parte de nuestro equipo.",
    "careers.benefits.title": "¿Por qué trabajar en Albatross?",
    "careers.benefit1.title": "Crecimiento Acelerado",
    "careers.benefit1.desc": "Trabaje con empresas de tecnología de alto impacto y acelere su carrera.",
    "careers.benefit2.title": "Equipo de Elite",
    "careers.benefit2.desc": "Colabore con profesionales experimentados y aprenda de los mejores.",
    "careers.benefit3.title": "Cultura Innovadora",
    "careers.benefit3.desc": "Ambiente dinámico que valora innovación, autonomía y resultados.",
    "careers.upload.info": "Envíe su currículum",
    "careers.upload.formats": "Formatos aceptados: PDF, DOC, DOCX (máximo 5MB)",
    "careers.form.title": "Postúlese",
    "careers.form.phone": "Teléfono",
    "careers.form.phone.placeholder": "+52 55 1234 5678",
    "careers.form.linkedin": "LinkedIn",
    "careers.form.linkedin.placeholder": "linkedin.com/in/su-perfil",
    "careers.form.motivation": "¿Por qué quiere trabajar en Albatross?",
    "careers.form.motivation.placeholder": "Cuéntenos sobre su motivación y experiencia...",
    "careers.form.submit": "Enviar candidatura",
    "careers.form.note": "Después de enviar, adjunte su currículum al email que se abrirá.",
    "careers.form.success.title": "¡Candidatura iniciada!",
    "careers.form.success.description": "Complete su candidatura en el email que se abrió.",
    "careers.form.error.title": "Error en el formulario",
    "careers.form.error.description": "Por favor, corrija los campos destacados.",
    "careers.form.error.nameRequired": "Nombre es obligatorio",
    "careers.form.error.nameMin": "Nombre debe tener al menos 2 caracteres",
    "careers.form.error.emailRequired": "Email es obligatorio",
    "careers.form.error.emailInvalid": "Email inválido",
    "careers.form.error.phoneInvalid": "Teléfono inválido",
    "careers.form.error.linkedinInvalid": "URL de LinkedIn inválida",
    "careers.form.error.messageRequired": "Mensaje es obligatorio",
    "careers.form.error.messageMin": "Mensaje debe tener al menos 20 caracteres",

    // Due Diligence Modal - New 2-step form
    "duediligence.cta": "Solicitar evaluación",
    "duediligence.modal.title": "Solicitar evaluación — Due Diligence Comercial para M&A",
    "duediligence.modal.subtitle": "Responda en 2 minutos para recomendar el mejor enfoque.",
    "duediligence.step": "Paso",
    "duediligence.of": "de",
    "duediligence.continue": "Continuar",
    "duediligence.back": "Volver",
    "duediligence.submit": "Solicitar evaluación",
    "duediligence.sending": "Enviando...",
    "duediligence.select": "Seleccione...",
    "duediligence.optional": "opcional",
    "duediligence.required": "Campos obligatorios",
    "duediligence.fillRequired": "Por favor, complete todos los campos obligatorios",
    // Step 1 fields
    "duediligence.fullName": "Nombre completo",
    "duediligence.corporateEmail": "Email corporativo",
    "duediligence.company": "Empresa",
    "duediligence.companyPlaceholder": "Nombre de su empresa",
    "duediligence.phone": "Teléfono/WhatsApp",
    "duediligence.roleInTransaction": "Rol en la transacción",
    "duediligence.dealStatus": "Estado y ventana del deal",
    // Role options
    "duediligence.role.strategicBuyer": "Comprador estratégico",
    "duediligence.role.privateEquity": "Private Equity",
    "duediligence.role.sellerManagement": "Vendedor/Management",
    "duediligence.role.advisor": "Asesor (IB/M&A)",
    "duediligence.role.other": "Otro",
    // Deal status options
    "duediligence.status.preLoi": "Pre-LOI",
    "duediligence.status.postLoi": "Post-LOI",
    "duediligence.status.exclusivity": "Exclusividad",
    "duediligence.status.preClosing": "Pre-closing",
    "duediligence.status.postClosing": "Post-closing (plan 100 días)",
    "duediligence.status.other": "Otro",
    // Step 2 fields
    "duediligence.jobTitle": "Cargo",
    "duediligence.targetCompanySize": "Tamaño de la empresa objetivo",
    "duediligence.targetCompanySector": "Empresa objetivo: sector y geografía principal",
    "duediligence.targetCompanyPlaceholder": "Ej.: SaaS B2B – Brasil/LatAm",
    // Job title options
    "duediligence.title.partner": "Socio/Partner",
    "duediligence.title.ceo": "CEO",
    "duediligence.title.cfo": "CFO",
    "duediligence.title.croVpSales": "CRO/VP Sales",
    "duediligence.title.headMa": "Head de M&A/Corp Dev",
    "duediligence.title.other": "Otro",
    // Revenue options
    "duediligence.revenue.under50m": "Ingresos anuales <$50M",
    "duediligence.revenue.50m200m": "$50–200M",
    "duediligence.revenue.200m500m": "$200–500M",
    "duediligence.revenue.above500m": ">$500M",
    "duediligence.revenue.unknown": "No sé informar",
    // Objectives
    "duediligence.objectives.title": "Objetivo principal del Due Diligence Comercial",
    "duediligence.objectives.selectMultiple": "seleccione uno o más",
    "duediligence.obj.validateIcp": "Validar ICP/segmentación y propuesta de valor",
    "duediligence.obj.evaluatePricing": "Evaluar pricing/descuentos y margen",
    "duediligence.obj.validateSalesMotions": "Validar sales motions (SMB/Mid, B2C, Enterprise/KAM, Green Field, SDR)",
    "duediligence.obj.measurePipeline": "Medir salud del pipeline (Rolling Four Quarters)",
    "duediligence.obj.testForecast": "Probar previsibilidad de forecast (3 años)",
    "duediligence.obj.evaluateSalesOps": "Evaluar Sales Operations (CRM, métricas, enablement, incentivos)",
    // Available data
    "duediligence.availableData.title": "¿Qué datos pueden proporcionar en hasta 5 días hábiles?",
    "duediligence.data.crmExport": "Exportación del CRM con histórico",
    "duediligence.data.quotas": "Metas/cuotas (12 trimestres)",
    "duediligence.data.forecastSnapshots": "Snapshots de forecast (semanal/mensual)",
    "duediligence.data.clientList": "Lista de clientes/contratos/renovaciones",
    "duediligence.data.orgCharts": "Org charts y comp plan",
    // Concerns
    "duediligence.concerns": "Riesgos/hipótesis que más preocupan al comité",
    "duediligence.concernsPlaceholder": "Ej.: Concentración de ingresos, dependencia de pocos clientes, alta rotación en ventas...",
    // LGPD
    "duediligence.lgpd": "Al enviar, acepta ser contactado por Albatross Consulting para gestionar su solicitud, según nuestra política de privacidad.",
    // Success state
    "duediligence.success.title": "¡Solicitud enviada con éxito!",
    "duediligence.success.contact": "Nuestro equipo se pondrá en contacto en hasta 1 día hábil.",
    "duediligence.success.scopeSummary": "Resumen del alcance",
    "duediligence.success.copySummary": "Copiar resumen",
    "duediligence.success.copied": "¡Copiado!",
    "duediligence.success.copiedDesc": "Resumen copiado al portapapeles",
    "duediligence.success.nextSteps": "Próximos pasos:",
    "duediligence.success.step1": "Análisis de su perfil y alcance",
    "duediligence.success.step2": "Contacto para alinear expectativas y timing",
    "duediligence.success.step3": "Propuesta personalizada de Due Diligence Comercial",
    "duediligence.success.close": "Cerrar",
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
