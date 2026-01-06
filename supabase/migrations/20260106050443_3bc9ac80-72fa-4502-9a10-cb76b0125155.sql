-- Add RLS policies to prevent unauthorized modification of user_roles
-- Only service role (backend) should be able to modify roles

-- Policy to prevent direct INSERT by authenticated users
CREATE POLICY "Only service role can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Policy to prevent direct UPDATE by authenticated users
CREATE POLICY "Only service role can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (false);

-- Policy to prevent direct DELETE by authenticated users
CREATE POLICY "Only service role can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (false);

-- Add unique partial index to ensure only ONE admin can exist
-- This prevents race conditions in admin creation
CREATE UNIQUE INDEX IF NOT EXISTS idx_single_admin 
ON public.user_roles (role) 
WHERE role = 'admin';

-- Update the has_role function to be more secure with input validation
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate inputs
  IF _user_id IS NULL OR _role IS NULL THEN
    RETURN false;
  END IF;
  
  -- Only check roles for authenticated users
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;