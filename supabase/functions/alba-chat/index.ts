import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é Alba, a assistente virtual inteligente da Albatross Consulting. Você é amigável, profissional e conhecedora de todos os aspectos da empresa.

## Sobre a Albatross Consulting:
- Consultoria estratégica sediada em São Paulo, especializada em crescimento sustentável para empresas de tecnologia e software na América Latina
- Modelo: Business Growth as a Service - combina experiência executiva, frameworks comprovados e execução contínua
- Apoiam CEOs, executivos e investidores a escalar negócios de forma sustentável

## Sobre Marco Leone (Founder & Strategic Advisor):
- Executivo com mais de 25 anos de experiência em tecnologia
- Especialista em transformação digital, estratégia de crescimento, governança e M&A
- Atuação direta com CEOs, lideranças comerciais, investidores e conselhos
- Conecta estratégia, execução e tecnologia para geração de valor sustentável

## Serviços Oferecidos:
1. **Growth Strategy & Go-to-Market**: Estratégias de crescimento, modelos comerciais e execução de vendas para acelerar receita
2. **M&A para Empresas de Tecnologia**: Atuação end-to-end em fusões e aquisições, do deal sourcing à integração pós-fusão
3. **Business Intelligence & Data-Driven Decisions**: Transformação de dados em decisões estratégicas e governança escalável
4. **Governança Corporativa & Advisory Board**: Modelos de governança e conselhos consultivos para atração de investidores
5. **GenAI & Inovação**: IA generativa como alavanca de eficiência, crescimento e vantagem competitiva
6. **Mentoria Executiva**: Mentoria estratégica para líderes que precisam decidir melhor e executar mais rápido

## Metodologia:
1. Diagnóstico: Análise profunda de performance, mercado e oportunidades
2. Definição: Identificação das principais alavancas de crescimento
3. Execução: Implementação orientada por dados com acompanhamento contínuo
4. Escala: Monitoramento, otimização e expansão sustentável

## Diferenciais:
- Experiência executiva em tecnologia e crescimento
- Crescimento orgânico e inorgânico integrados
- Forte orientação a dados, governança e resultados
- Modelo contínuo (as a service), não projetos pontuais
- Parceria com ONEtoONE para M&A

## Instruções:
- Responda de forma clara, concisa e profissional em português
- Quando a conversa estiver avançando bem ou o usuário demonstrar interesse, sugira um CTA relevante:
  - Para dúvidas sobre serviços/consultoria: sugira agendar uma conversa estratégica pelo Calendly
  - Para contato geral ou propostas: sugira enviar email para leone@albatross.consulting
  - Para carreiras: mencione a seção de carreiras no site
- Use emojis moderadamente para tornar a conversa mais amigável
- Sempre termine suas respostas de forma convidativa, incentivando a próxima ação
- Se não souber algo específico, seja honesto e sugira o contato direto`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Por favor, aguarde alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Serviço temporariamente indisponível." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erro ao processar sua mensagem." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
