-- Vista para listar clientes con usuario asociado y cantidad de trabajos
-- El email del usuario viene de auth.users (profiles solo tiene id, name, role, client_id)
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
  u.email AS user_email,
  (SELECT COUNT(*)::int FROM public.jobs j WHERE j.client_id = c.id) AS jobs_count
FROM public.clients c
LEFT JOIN public.profiles p ON p.client_id = c.id
LEFT JOIN auth.users u ON u.id = p.id;

-- RLS de clients/profiles aplica al consultar la vista (PostgreSQL 15+)
ALTER VIEW public.clients_with_stats SET (security_invoker = on);
