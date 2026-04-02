-- Fecha de cobro para ingresos en balance (por trabajo pagado)
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS paid_at DATE;

-- Datos existentes: aproximar con fecha de creación
UPDATE public.jobs
SET paid_at = (created_at AT TIME ZONE 'UTC')::date
WHERE billing_status = 'PAID'::public.billing_status
  AND paid_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_jobs_billing_paid_at
  ON public.jobs(billing_status, paid_at);

CREATE OR REPLACE FUNCTION public.jobs_set_paid_at()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.billing_status = 'PAID' AND NEW.paid_at IS NULL THEN
      NEW.paid_at := (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.billing_status = 'PAID' THEN
      IF OLD.billing_status IS DISTINCT FROM 'PAID' AND NEW.paid_at IS NULL THEN
        NEW.paid_at := (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date;
      END IF;
    ELSE
      NEW.paid_at := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_jobs_paid_at ON public.jobs;
CREATE TRIGGER trg_jobs_paid_at
  BEFORE INSERT OR UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE PROCEDURE public.jobs_set_paid_at();
