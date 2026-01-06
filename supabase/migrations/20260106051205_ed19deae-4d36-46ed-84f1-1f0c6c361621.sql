-- Add explicit UPDATE and DELETE policies for alba_analytics
-- Only admins can update or delete analytics data

CREATE POLICY "Only admins can update analytics"
ON public.alba_analytics
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete analytics"
ON public.alba_analytics
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));