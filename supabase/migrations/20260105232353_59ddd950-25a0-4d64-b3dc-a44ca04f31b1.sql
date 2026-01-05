-- Tabela para analytics do chatbot Alba
CREATE TABLE public.alba_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  service_interest TEXT,
  lead_submitted BOOLEAN DEFAULT false,
  messages_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_alba_analytics_created_at ON public.alba_analytics(created_at DESC);
CREATE INDEX idx_alba_analytics_event_type ON public.alba_analytics(event_type);
CREATE INDEX idx_alba_analytics_session_id ON public.alba_analytics(session_id);
CREATE INDEX idx_alba_analytics_service_interest ON public.alba_analytics(service_interest);

-- Enable RLS
ALTER TABLE public.alba_analytics ENABLE ROW LEVEL SECURITY;

-- Política para inserção anônima (tracking)
CREATE POLICY "Allow anonymous insert for tracking" 
ON public.alba_analytics 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Política para leitura apenas autenticados (dashboard admin)
CREATE POLICY "Authenticated users can read analytics" 
ON public.alba_analytics 
FOR SELECT 
TO authenticated
USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.alba_analytics;