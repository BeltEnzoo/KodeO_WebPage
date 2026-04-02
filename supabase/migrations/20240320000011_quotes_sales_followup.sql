-- Embudo: estado intermedio entre enviado y cierre
ALTER TYPE public.quote_status ADD VALUE 'NEGOTIATION';

ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS follow_up_at DATE,
  ADD COLUMN IF NOT EXISTS last_contact_at DATE,
  ADD COLUMN IF NOT EXISTS lost_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_quotes_status_followup
  ON public.quotes(status, follow_up_at);

CREATE INDEX IF NOT EXISTS idx_quotes_valid_until
  ON public.quotes(valid_until)
  WHERE status NOT IN ('ACCEPTED', 'REJECTED');
