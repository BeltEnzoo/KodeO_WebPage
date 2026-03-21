-- Gastos por trabajo y soporte para Balance
-- 1) Agregar columnas de gastos a jobs
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS expense_shipping NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS expense_repuestos NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS expense_terciarizacion NUMERIC(12,2) NOT NULL DEFAULT 0;

-- 2) RLS para cash_movements (gastos generales: prensa, publicidad, etc.)
ALTER TABLE public.cash_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage cash_movements"
  ON public.cash_movements FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN')
  );

-- Índices para consultas de balance
CREATE INDEX IF NOT EXISTS idx_cash_movements_type_date
  ON public.cash_movements(type, date);
CREATE INDEX IF NOT EXISTS idx_cash_movements_category
  ON public.cash_movements(category);
