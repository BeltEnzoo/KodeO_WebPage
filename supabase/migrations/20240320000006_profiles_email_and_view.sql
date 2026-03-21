-- 1) Email en profiles (evita JOIN a auth.users, que da "permission denied" con anon key)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email = '');

-- 2) Trigger: guardar email al crear usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'CLIENT'),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.profiles.name),
    updated_at = now();
  RETURN NEW;
END;
$$;

-- 3) Vista sin auth.users (solo tablas public)
DROP VIEW IF EXISTS public.clients_with_stats;
CREATE VIEW public.clients_with_stats AS
SELECT
  c.id,
  c.business_name,
  c.cuit,
  c.address,
  c.phone,
  c.email,
  c.notes,
  c.created_at,
  c.updated_at,
  p.email AS user_email,
  (SELECT COUNT(*)::int FROM public.jobs j WHERE j.client_id = c.id) AS jobs_count
FROM public.clients c
LEFT JOIN public.profiles p ON p.client_id = c.id;

ALTER VIEW public.clients_with_stats SET (security_invoker = on);
