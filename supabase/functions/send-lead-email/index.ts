import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const NOTIFY_TO = "leone@albatross.consulting";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface LeadPayload {
  name: string;
  email: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  interest?: string;
  challenge?: string;
  companySize?: string;
  urgency?: string;
  timeline?: string;
  summary?: string;
  wantsScheduling?: boolean;
  calendlyUrl?: string;
}

function validate(data: unknown): { valid: boolean; error?: string; data?: LeadPayload } {
  if (!data || typeof data !== "object") return { valid: false, error: "Invalid request body" };
  const d = data as Record<string, unknown>;
  const name = typeof d.name === "string" ? d.name.trim() : "";
  const email = typeof d.email === "string" ? d.email.trim() : "";
  if (name.length < 2 || name.length > 200) return { valid: false, error: "Invalid name" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    return { valid: false, error: "Invalid email" };
  }
  const str = (v: unknown) => (typeof v === "string" ? v.slice(0, 2000) : "");
  return {
    valid: true,
    data: {
      name: name.slice(0, 200),
      email,
      company: str(d.company),
      jobTitle: str(d.jobTitle),
      phone: str(d.phone),
      interest: str(d.interest),
      challenge: str(d.challenge),
      companySize: str(d.companySize),
      urgency: str(d.urgency),
      timeline: str(d.timeline),
      summary: str(d.summary),
      wantsScheduling: d.wantsScheduling === true,
      calendlyUrl: str(d.calendlyUrl),
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const validation = validate(await req.json());
    if (!validation.valid || !validation.data) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const lead = validation.data;

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const row = (label: string, value?: string) =>
      value
        ? `<tr><td style="padding:6px 12px 6px 0;color:#666;">${label}</td><td style="padding:6px 0;"><strong>${escapeHtml(value)}</strong></td></tr>`
        : "";

    const internalHtml = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#222;">
        <h2 style="margin:0 0 4px;">Novo lead do chatbot Alba</h2>
        <p style="color:#666;margin:0 0 20px;">
          ${lead.wantsScheduling ? "O lead pediu para agendar uma conversa (Calendly aberto)." : "Lead qualificado pelo chatbot."}
        </p>
        <table style="border-collapse:collapse;font-size:14px;">
          ${row("Nome", lead.name)}
          ${row("E-mail", lead.email)}
          ${row("Empresa", lead.company)}
          ${row("Cargo", lead.jobTitle)}
          ${row("Telefone", lead.phone)}
          ${row("Interesse", lead.interest)}
          ${row("Desafio", lead.challenge)}
          ${row("Porte", lead.companySize)}
          ${row("Urgência", lead.urgency)}
          ${row("Prazo", lead.timeline)}
        </table>
        ${
          lead.summary
            ? `<h3 style="margin:24px 0 8px;">Resumo da conversa</h3>
               <pre style="white-space:pre-wrap;font-family:inherit;font-size:13px;background:#f6f6f6;padding:12px;border-radius:8px;">${escapeHtml(lead.summary)}</pre>`
            : ""
        }
      </div>`;

    const leadHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#222;">
        <h2 style="margin:0 0 16px;">Olá, ${escapeHtml(lead.name)}</h2>
        <p style="line-height:1.6;">Obrigado pelo seu contato com a Albatross Consulting. Recebemos suas informações e nossa equipe entrará em contato em breve.</p>
        ${
          lead.wantsScheduling && lead.calendlyUrl
            ? `<p style="line-height:1.6;">Se preferir, escolha já o melhor horário para uma conversa:</p>
               <p><a href="${escapeHtml(lead.calendlyUrl)}" style="display:inline-block;padding:12px 20px;background:#0f2e4a;color:#fff;text-decoration:none;border-radius:8px;">Agendar conversa</a></p>`
            : ""
        }
        <p style="line-height:1.6;margin-top:24px;">Atenciosamente,<br/>Albatross Consulting</p>
      </div>`;

    const send = (to: string[], subject: string, html: string) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Albatross Consulting <noreply@albatross.consulting>",
          to,
          subject,
          html,
        }),
      });

    const [internalRes, leadRes] = await Promise.all([
      send(
        [NOTIFY_TO],
        `${lead.wantsScheduling ? "[Agendamento] " : ""}Novo lead Alba: ${lead.name}${lead.company ? ` - ${lead.company}` : ""}`,
        internalHtml,
      ),
      send([lead.email], "Recebemos seu contato - Albatross Consulting", leadHtml),
    ]);

    if (!internalRes.ok) {
      const details = await internalRes.text();
      console.error(`Resend internal email failed [${internalRes.status}]: ${details}`);
      return new Response(JSON.stringify({ error: "Email send failed", details }), {
        status: internalRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!leadRes.ok) {
      console.error(`Resend lead confirmation failed [${leadRes.status}]: ${await leadRes.text()}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-lead-email error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
