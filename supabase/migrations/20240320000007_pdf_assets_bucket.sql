-- Bucket para assets del PDF: logo, firma, iconos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pdf-assets',
  'pdf-assets',
  false,
  1048576,
  ARRAY['image/png', 'image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Admins pueden subir/ver; Edge Function usa service_role (bypasea RLS)
CREATE POLICY "Admins can manage pdf-assets"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'pdf-assets'
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN')
  );
