CREATE TABLE public.dd_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'partial',
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  job_title text,
  job_title_other text,
  phone text,
  phone_country text,
  requester_profile text,
  transaction_side text,
  deal_stage text,
  decision_timeline text,
  target_revenue text,
  market_segment text,
  validation_needs text[] NOT NULL DEFAULT '{}',
  context text,
  nda_requested boolean NOT NULL DEFAULT false,
  consent_lgpd boolean NOT NULL DEFAULT false,
  lead_score text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  language text,
  hubspot_sync_status text NOT NULL DEFAULT 'pending',
  hubspot_error text,
  email_sent boolean NOT NULL DEFAULT false
);
GRANT SELECT, UPDATE, DELETE ON public.dd_leads TO authenticated;
GRANT ALL ON public.dd_leads TO service_role;
ALTER TABLE public.dd_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read dd_leads" ON public.dd_leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update dd_leads" ON public.dd_leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete dd_leads" ON public.dd_leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));