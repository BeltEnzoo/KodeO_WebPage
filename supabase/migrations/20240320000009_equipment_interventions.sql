-- Inventario / equipos intervenidos (taller o campo)

CREATE TABLE IF NOT EXISTS public.equipment_interventions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  location TEXT NOT NULL DEFAULT 'TALLER', -- TALLER | CAMPO
  equipment_name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  intake_date DATE,
  diagnosis TEXT,
  technical_action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.equipment_interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage equipment_interventions"
  ON public.equipment_interventions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN')
  );

CREATE INDEX IF NOT EXISTS idx_equipment_interventions_client_id
  ON public.equipment_interventions(client_id);

CREATE INDEX IF NOT EXISTS idx_equipment_interventions_intake_date
  ON public.equipment_interventions(intake_date);

