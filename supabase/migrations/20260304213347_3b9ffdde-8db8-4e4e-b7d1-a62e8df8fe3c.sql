-- Drop the overly permissive anonymous INSERT policy
DROP POLICY IF EXISTS "Allow anonymous insert for tracking" ON public.alba_analytics;