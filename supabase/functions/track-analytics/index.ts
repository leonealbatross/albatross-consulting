import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VALID_EVENT_TYPES = [
  "message",
  "chat_opened",
  "first_message",
  "service_interest",
  "lead_success",
  "lead_error",
  "session_start",
  "cta_click",
  "nav_click",
  "lead_form_started",
  "lead_form_step",
  "lead_form_completed",
  "lead_form_abandoned",
  "bgaas_modal_opened",
  "bgaas_interest",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id, event_type, event_data, service_interest, lead_submitted, messages_count } = await req.json();

    // Validate required fields
    if (!session_id || !event_type) {
      return new Response(JSON.stringify({ error: "session_id and event_type are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate event_type
    if (!VALID_EVENT_TYPES.includes(event_type)) {
      return new Response(JSON.stringify({ error: "Invalid event_type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate session_id format (basic length check)
    if (typeof session_id !== "string" || session_id.length < 10 || session_id.length > 100) {
      return new Response(JSON.stringify({ error: "Invalid session_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to bypass RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error } = await supabase.from("alba_analytics").insert({
      session_id,
      event_type,
      event_data: event_data || {},
      service_interest: service_interest || null,
      lead_submitted: lead_submitted || false,
      messages_count: messages_count || 0,
    });

    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: "Failed to track event" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Track analytics error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
