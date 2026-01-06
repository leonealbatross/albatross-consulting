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

// Input validation
function validateRequest(data: unknown): { valid: boolean; error?: string; data?: CandidateEmailRequest } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }
  
  const request = data as Record<string, unknown>;
  
  // Validate name
  if (typeof request.name !== 'string' || request.name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  if (request.name.length > 100) {
    return { valid: false, error: 'Name is too long (max 100 characters)' };
  }
  
  // Validate email
  if (typeof request.email !== 'string' || request.email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }
  if (request.email.length > 255) {
    return { valid: false, error: 'Email is too long (max 255 characters)' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(request.email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { 
    valid: true, 
    data: {
      name: request.name.trim(),
      email: request.email.trim().toLowerCase(),
    }
  };
}

// Escape HTML to prevent XSS in email templates
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawData = await req.json();
    
    // Validate input
    const validation = validateRequest(rawData);
    if (!validation.valid || !validation.data) {
      return new Response(
        JSON.stringify({ error: validation.error || 'Invalid request' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const { name, email } = validation.data;
    const safeName = escapeHtml(name);

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
        from: "Albatross Consulting <noreply@albatross.consulting>",
        to: [email],
        subject: "Agradecemos sua candidatura - Albatross Consulting",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px;">Olá, ${safeName}</h2>
            
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'An error occurred sending the email' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
