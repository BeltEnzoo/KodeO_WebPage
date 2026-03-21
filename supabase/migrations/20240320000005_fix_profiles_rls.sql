-- Fix: La política "Admins can view all profiles" causaba recursión (500 error)
-- porque para verificar si sos admin, lee profiles, lo cual dispara RLS de nuevo.
-- Solución: función SECURITY DEFINER que bypasea RLS para el check.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN');
$$;

-- Eliminar la política problemática
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Recrearla usando la función (sin recursión)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());
