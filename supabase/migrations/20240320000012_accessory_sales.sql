-- Ventas de accesorios de equipos médicos
CREATE TABLE IF NOT EXISTS public.accessory_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accessory_name TEXT NOT NULL,
  equipment_name TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  acquisition_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  acquisition_date DATE NOT NULL,
  sale_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  sale_date DATE NOT NULL,
  acquisition_movement_id UUID REFERENCES public.cash_movements(id) ON DELETE SET NULL,
  sale_movement_id UUID REFERENCES public.cash_movements(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_accessory_sales_client_date
  ON public.accessory_sales(client_id, sale_date DESC);

CREATE INDEX IF NOT EXISTS idx_accessory_sales_equipment
  ON public.accessory_sales(equipment_name);

ALTER TABLE public.accessory_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage accessory_sales"
  ON public.accessory_sales FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN')
  );
