import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const SERVICE = "Commercial Due Diligence (M&A)";
const SEGMENT = "Tech / LatAm";
const SOURCE = "Website / Solicitar avaliação";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidRegex = /^[0-9a-f-]{36}$/i;

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const LABELS: Record<string, string> = {
  partner: "Sócio/Partner", principal: "Principal/Associate", ceo: "CEO", cfo: "CFO", head_ma: "Head de M&A/Corp Dev", other: "Outro",
  strategic_buyer: "Comprador estratégico", private_equity: "Private Equity", vc_growth: "Venture Capital / Growth", cvc: "CVC",
  family_office: "Family Office", search_fund: "Search Fund", seller_management: "Vendedor / Management", advisor: "Assessor M&A",
  buy_side: "Buy-side", sell_side: "Sell-side (vendor DD)", primary: "Investimento primário", secondary: "Secundária",
  exploratory: "Exploratório", pre_loi: "Pré-LOI", post_loi: "Pós-LOI / exclusividade", pre_closing: "Pré-closing", post_closing: "Pós-closing (100 dias)",
  "2w": "Até 2 semanas", "30d": "Até 30 dias", "30_90d": "30 a 90 dias", none: "Sem prazo definido",
  under_20m: "Até R$20M", "20m_100m": "R$20M a 100M", "100m_500m": "R$100M a 500M", above_500m: "Acima de R$500M", unknown: "Não sei ainda",
  icp_retention: "ICP e retenção", pricing_nrr: "Pricing e NRR", pipeline_forecast: "Pipeline e forecast",
  sales_efficiency: "Eficiência de vendas (CAC/payback)", team_salesops: "Time e SalesOps", plan_100d: "Plano de 100 dias",
};
const L = (v?: string | null) => (v ? LABELS[v] || v : "Não informado");

export function scoreLead(d: { deal_stage?: string; decision_timeline?: string; target_revenue?: string }) {
  if (["post_loi", "pre_closing"].includes(d.deal_stage || "")) return "hot";
  if (["2w", "30d"].includes(d.decision_timeline || "")) return "hot";
  if (["100m_500m", "above_500m"].includes(d.target_revenue || "")) return "hot";
  return "warm";
}

async function syncHubspot(lead: Record<string, any>): Promise<{ ok: boolean; error?: string }> {
  const token = Deno.env.get("HUBSPOT_ACCESS_TOKEN");
  if (!token) return { ok: false, error: "HUBSPOT_ACCESS_TOKEN not configured" };
  const jobTitle = lead.job_title === "other" && lead.job_title_other ? lead.job_title_other : L(lead.job_title);
  const message = `=== DUE DILIGENCE COMERCIAL PARA M&A (Tech / LatAm) ===
TAGS: Service: ${SERVICE} | Segment: ${SEGMENT} | Source: ${SOURCE}
Status: ${lead.status} | Score: ${lead.lead_score || "-"}
Perfil: ${L(lead.requester_profile)} | Lado: ${L(lead.transaction_side)}
Estágio: ${L(lead.deal_stage)} | Prazo: ${L(lead.decision_timeline)}
Porte alvo: ${L(lead.target_revenue)} | Segmento: ${L(lead.market_segment)}
Validar: ${(lead.validation_needs || []).map(L).join("; ") || "-"}
NDA antes: ${lead.nda_requested ? "Sim" : "Não"}
Contexto: ${lead.context || "-"}
UTM: ${lead.utm_source || "-"}/${lead.utm_medium || "-"}/${lead.utm_campaign || "-"} | Ref: ${lead.referrer || "-"}`.slice(0, 2500);
  const [first, ...rest] = String(lead.name).split(" ");
  const props = { email: lead.email, firstname: first, lastname: rest.join(" "), company: lead.company, phone: lead.phone || "", jobtitle: jobTitle, message, hs_lead_status: "NEW", lifecyclestage: "lead" };
  const h = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const c = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", { method: "POST", headers: h, body: JSON.stringify({ properties: props }) });
  if (c.ok) return { ok: true };
  if (c.status !== 409) return { ok: false, error: `[${c.status}] ${(await c.text()).slice(0, 500)}` };
  await c.text();
  const u = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(lead.email)}?idProperty=email`, {
    method: "PATCH", headers: h,
    body: JSON.stringify({ properties: { message, company: props.company, phone: props.phone, jobtitle: jobTitle } }),
  });
  if (u.ok) { await u.text(); return { ok: true }; }
  return { ok: false, error: `[${u.status}] ${(await u.text()).slice(0, 500)}` };
}

async function sendEmail(lead: Record<string, any>): Promise<boolean> {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return false;
  const row = (k: string, v: string) => `<p><strong>${k}:</strong> ${esc(v || "-")}</p>`;
  const html = `<h2>Nova solicitação de Due Diligence Comercial ${lead.lead_score === "hot" ? "🔥 QUENTE" : ""}</h2>
${row("Nome", lead.name)}${row("Email", lead.email)}${row("Empresa/fundo", lead.company)}
${row("Cargo", lead.job_title === "other" ? lead.job_title_other : L(lead.job_title))}${row("Telefone", lead.phone)}
${row("Perfil", L(lead.requester_profile))}${row("Lado", L(lead.transaction_side))}${row("Estágio", L(lead.deal_stage))}
${row("Prazo", L(lead.decision_timeline))}${row("Porte alvo", L(lead.target_revenue))}${row("Segmento", L(lead.market_segment))}
${row("Validar", (lead.validation_needs || []).map(L).join("; "))}${row("NDA antes", lead.nda_requested ? "Sim" : "Não")}
${row("Contexto", lead.context)}${row("Idioma", lead.language)}${row("UTM", `${lead.utm_source || "-"} / ${lead.utm_medium || "-"} / ${lead.utm_campaign || "-"}`)}
${row("Referrer", lead.referrer)}${row("HubSpot", `${lead.hubspot_sync_status}${lead.hubspot_error ? " " + lead.hubspot_error : ""}`)}
<p style="color:#718096;font-size:12px">Tags: ${SERVICE} | ${SEGMENT} | ${SOURCE}</p>`;
  try {
    const r = await new Resend(key).emails.send({
      from: "Albatross Consulting <onboarding@resend.dev>",
      to: ["leone@albatross.consulting"],
      subject: `[DD Comercial]${lead.lead_score === "hot" ? " [QUENTE]" : ""} ${lead.company} (${lead.name})`,
      html,
    });
    if ((r as any)?.error) { console.error("Resend error", JSON.stringify((r as any).error)); return false; }
    return true;
  } catch (e) { console.error("Resend exception", e); return false; }
}

const pick = (v: unknown, allowed: string[]) => (typeof v === "string" && allowed.includes(v) ? v : null);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const b = await req.json().catch(() => null);
    if (!b || typeof b !== "object") return json({ success: false, error: "Invalid body" }, 400);
    const stage = b.stage === "complete" ? "complete" : "partial";
    const name = str(b.name, 100), email = str(b.email, 255).toLowerCase(), company = str(b.company, 200);
    if (!name || !emailRegex.test(email) || !company) return json({ success: false, error: "name, email and company are required" }, 400);

    const contact = {
      name, email, company,
      job_title: pick(b.jobTitle, ["partner", "principal", "ceo", "cfo", "head_ma", "other"]),
      job_title_other: str(b.jobTitleOther, 100) || null,
      phone: str(b.phone, 30) || null,
      phone_country: str(b.phoneCountry, 10) || null,
      utm_source: str(b.utmSource, 200) || null, utm_medium: str(b.utmMedium, 200) || null, utm_campaign: str(b.utmCampaign, 200) || null,
      referrer: str(b.referrer, 500) || null, language: str(b.language, 5) || null,
    };
    let fields: Record<string, unknown> = { ...contact };
    if (stage === "complete") {
      if (b.consent !== true) return json({ success: false, error: "Consent required" }, 400);
      const tx = {
        requester_profile: pick(b.requesterProfile, ["strategic_buyer", "private_equity", "vc_growth", "cvc", "family_office", "search_fund", "seller_management", "advisor", "other"]),
        transaction_side: pick(b.transactionSide, ["buy_side", "sell_side", "primary", "secondary"]),
        deal_stage: pick(b.dealStage, ["exploratory", "pre_loi", "post_loi", "pre_closing", "post_closing"]),
        decision_timeline: pick(b.decisionTimeline, ["2w", "30d", "30_90d", "none"]),
        target_revenue: pick(b.targetRevenue, ["under_20m", "20m_100m", "100m_500m", "above_500m", "unknown"]),
      };
      if (Object.values(tx).some((v) => !v)) return json({ success: false, error: "Missing transaction fields" }, 400);
      const needs = Array.isArray(b.validationNeeds) ? b.validationNeeds.filter((x: unknown) => typeof x === "string" && LABELS[x as string]).slice(0, 10) : [];
      fields = {
        ...fields, ...tx, status: "complete",
        market_segment: str(b.marketSegment, 50) || null,
        validation_needs: needs, context: str(b.context, 2000) || null,
        nda_requested: b.ndaRequested === true, consent_lgpd: true,
        lead_score: scoreLead(tx as any), updated_at: new Date().toISOString(),
      };
    }

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const leadId = typeof b.leadId === "string" && uuidRegex.test(b.leadId) ? b.leadId : null;
    let lead: Record<string, any> | null = null;
    if (leadId) {
      // only partial rows can be completed, and only by the same email
      const { data } = await sb.from("dd_leads").update(fields).eq("id", leadId).eq("status", "partial").eq("email", email).select().maybeSingle();
      lead = data;
    }
    if (!lead) {
      const { data, error } = await sb.from("dd_leads").insert({ ...fields, status: stage }).select().single();
      if (error || !data) { console.error("dd_leads insert failed", error); return json({ success: false, error: "Could not save lead" }, 500); }
      lead = data;
    }

    if (stage === "partial") return json({ success: true, leadId: lead.id });

    const hs = await syncHubspot(lead);
    lead.hubspot_sync_status = hs.ok ? "success" : "error";
    lead.hubspot_error = hs.error || null;
    if (!hs.ok) console.error("HubSpot sync failed", hs.error);
    const emailSent = await sendEmail(lead);
    await sb.from("dd_leads").update({ hubspot_sync_status: lead.hubspot_sync_status, hubspot_error: lead.hubspot_error, email_sent: emailSent }).eq("id", lead.id);

    return json({ success: true, leadId: lead.id, leadScore: lead.lead_score, hubspotSync: lead.hubspot_sync_status, hubspotError: lead.hubspot_error, emailSent });
  } catch (e) {
    console.error("hubspot-duediligence error", e);
    return json({ success: false, error: "Internal error" }, 500);
  }
});
