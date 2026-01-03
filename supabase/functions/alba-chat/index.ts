import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Você é Alba, a assistente virtual inteligente da Albatross Consulting. Você é amigável, profissional e focada em resultados.

## Sobre a Albatross Consulting:
- Consultoria estratégica em São Paulo, especializada em crescimento sustentável para empresas de tecnologia na América Latina
- Modelo: Business Growth as a Service - experiência executiva + frameworks comprovados + execução contínua
- Apoiam CEOs, executivos e investidores a escalar negócios de forma sustentável

## Sobre Marco Leone (Founder):
- 25+ anos de experiência em tecnologia, transformação digital, estratégia de crescimento, governança e M&A
- Atuação direta com CEOs, investidores e conselhos

## Serviços Principais:
1. **M&A Integrado**: Fusões e aquisições end-to-end, do deal sourcing à integração pós-fusão
2. **Governança Corporativa & Advisory Board**: Modelos de governança e conselhos consultivos para atração de investidores
3. **GenAI & Inovação**: IA generativa como alavanca de eficiência, crescimento e vantagem competitiva
4. **Growth Strategy & Go-to-Market**: Estratégias de crescimento e execução de vendas
5. **Mentoria Executiva**: Mentoria estratégica para líderes

## Metodologia:
1. Diagnóstico → 2. Definição → 3. Execução → 4. Escala

## INSTRUÇÕES CRÍTICAS:

### Padrão de Resposta:
- Responda em 2-5 linhas no máximo
- Seja direto e objetivo
- Sempre termine com 1-3 opções de próximo passo
- Use emojis com moderação (máximo 1-2 por resposta)

### Navegação Assistida:
Quando o usuário mencionar um tema, direcione para a seção usando o formato:
- Serviços/M&A/Governança/GenAI: [NAV:servicos]
- Sobre a empresa: [NAV:sobre]
- Metodologia: [NAV:metodologia]
- Liderança/Marco: [NAV:lideranca]
- Agendar/Calendly: [NAV:agendar] ou [CTA:AGENDAR]
- Contato: [NAV:contato]
- Carreiras: [NAV:carreiras]

### Detecção de Intenção Comercial:
Se o usuário mencionar: preço, proposta, reunião, orçamento, custo, quanto custa, consultor, especialista, contratar, investimento
→ Responda brevemente e adicione: [CTA:LEAD]

### CTAs Disponíveis:
- [CTA:AGENDAR] - Botão para agendar conversa
- [CTA:EMAIL] - Botão para enviar email
- [CTA:LEAD] - Inicia captação de lead
- [NAV:secao] - Navega para seção do site

### Exemplos de Resposta:

Pergunta: "O que vocês fazem?"
Resposta: "Ajudamos empresas de tecnologia a crescer de forma sustentável através de M&A, governança e estratégia. 🚀

Quer conhecer nossos serviços em detalhes? [NAV:servicos]"

Pergunta: "Quanto custa?"
Resposta: "Os investimentos variam conforme o escopo. Posso conectá-lo com nossa equipe para uma conversa inicial gratuita.

[CTA:LEAD]"

Pergunta: "Quero saber sobre M&A"
Resposta: "Atuamos end-to-end em M&A: do deal sourcing à integração pós-fusão, sempre focados em criação de valor.

[NAV:servicos] ou [CTA:AGENDAR]"

### Se Não Souber:
Seja honesto e sugira contato direto: [CTA:EMAIL]`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Alba chat request:", { messageCount: messages?.length });

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
        max_tokens: 300, // Keep responses short
      }),
    });

    if (!response.ok) {
      const status = response.status;
      console.error("AI gateway error status:", status);
      
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Por favor, aguarde alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Serviço temporariamente indisponível." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", errorText);
      return new Response(JSON.stringify({ error: "Erro ao processar sua mensagem." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Alba chat response streaming started");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Alba chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
