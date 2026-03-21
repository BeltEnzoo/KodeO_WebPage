-- Bucket para PDFs de presupuestos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'quote-pdfs',
  'quote-pdfs',
  false,
  5242880,  -- 5MB
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Solo admins pueden gestionar archivos del bucket
-- Los clientes accederán vía signed URLs generadas por Edge Function (que verifica ownership)
CREATE POLICY "Admins can manage quote PDFs"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'quote-pdfs'
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN')
  );
