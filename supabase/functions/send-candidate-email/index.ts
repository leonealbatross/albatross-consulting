import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CandidateEmailRequest {
  name: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: CandidateEmailRequest = await req.json();

    console.log(`Sending confirmation email to candidate: ${name} (${email})`);

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Albatross Consulting <onboarding@resend.dev>",
        to: [email],
        subject: "Agradecemos sua candidatura - Albatross Consulting",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px;">Olá, ${name}</h2>
            
            <p style="line-height: 1.6; margin-bottom: 16px;">
              Agradecemos sinceramente pelo seu interesse em fazer parte da Albatross Consulting e por compartilhar seu currículo conosco.
            </p>
            
            <p style="line-height: 1.6; margin-bottom: 16px;">
              A Albatross é uma consultoria estratégica focada em Business Growth as a Service, atuando junto a CEOs, executivos e investidores em temas como crescimento, Go-to-Market, M&A, governança, dados, inovação e mentoria executiva. Nosso trabalho exige pensamento estratégico, visão sistêmica, capacidade de execução e compromisso com resultados mensuráveis.
            </p>
            
            <p style="line-height: 1.6; margin-bottom: 16px;">
              Somos uma empresa inclusiva, que valoriza a diversidade em todas as suas dimensões — gênero, raça, etnia, orientação sexual, idade, origem, formação e experiências de vida. Acreditamos que ambientes diversos são mais inovadores, éticos e eficazes na tomada de decisão. Nossos processos seguem boas práticas de diversidade, equidade e respeito, com foco em oportunidades justas e ambientes seguros.
            </p>
            
            <p style="line-height: 1.6; margin-bottom: 16px;">
              Buscamos profissionais curiosos, colaborativos e orientados a impacto, que tenham conforto em ambientes dinâmicos, senso de responsabilidade, pensamento crítico e vontade genuína de aprender e contribuir. Valorizamos autonomia, ética, clareza na comunicação e alinhamento com um trabalho consultivo de alto nível.
            </p>
            
            <p style="line-height: 1.6; margin-bottom: 16px;">
              Seu perfil será analisado com atenção e, caso haja aderência a oportunidades atuais ou futuras, entraremos em contato.
            </p>
            
            <p style="line-height: 1.6; margin-bottom: 16px;">
              Agradecemos novamente seu interesse e desejamos sucesso em sua trajetória profissional.
            </p>
            
            <p style="line-height: 1.6; margin-bottom: 8px;">
              Atenciosamente,<br>
              <strong>Equipe Albatross Consulting</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
            
            <p style="font-size: 12px; color: #666; line-height: 1.5;">
              Este é um email automático. Por favor, não responda diretamente a esta mensagem.
            </p>
          </div>
        `,
      }),
    });

    const data = await emailResponse.json();
    console.log("Email sent successfully:", data);

    if (!emailResponse.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-candidate-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
