-- RLS (Row Level Security) y triggers para KodeON

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

-- Función helper: obtiene el perfil del usuario actual
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS public.profiles
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.profiles WHERE id = auth.uid()
$$;

-- Políticas para PROFILES
-- Los usuarios ven solo su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Solo admins pueden ver todos los perfiles (vía service role o política adicional)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN')
  );

-- Los usuarios pueden actualizar su propio perfil (solo nombre, por ejemplo)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas para CLIENTS
-- Solo admins pueden CRUD clients
CREATE POLICY "Admins can manage clients"
  ON public.clients FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN')
  );

-- Los clientes pueden ver su propio client record
CREATE POLICY "Clients can view own client"
  ON public.clients FOR SELECT
  USING (
    id IN (
      SELECT client_id FROM public.profiles WHERE id = auth.uid() AND client_id IS NOT NULL
    )
  );

-- Políticas para JOBS
-- Admins: CRUD total
CREATE POLICY "Admins can manage jobs"
  ON public.jobs FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN')
  );

-- Clientes: solo SELECT de jobs de su client_id
CREATE POLICY "Clients can view own jobs"
  ON public.jobs FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM public.profiles WHERE id = auth.uid() AND client_id IS NOT NULL
    )
  );

-- Políticas para QUOTES
CREATE POLICY "Admins can manage quotes"
  ON public.quotes FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN')
  );

CREATE POLICY "Clients can view own quotes"
  ON public.quotes FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM public.profiles WHERE id = auth.uid() AND client_id IS NOT NULL
    )
  );

-- Políticas para QUOTE_ITEMS (acceso vía quote)
CREATE POLICY "Admins can manage quote_items"
  ON public.quote_items FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN')
  );

CREATE POLICY "Clients can view own quote items"
  ON public.quote_items FOR SELECT
  USING (
    quote_id IN (
      SELECT q.id FROM public.quotes q
      JOIN public.profiles p ON p.client_id = q.client_id
      WHERE p.id = auth.uid()
    )
  );

-- Trigger: crear perfil automáticamente cuando se registra un nuevo usuario
-- NOTA: Para usuarios creados por Admin API, debemos crear el perfil manualmente
-- o usar un trigger en auth.users (si Supabase lo permite)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'CLIENT')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger en auth.users (requiere permisos sobre auth schema)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
