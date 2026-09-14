-- Los clientes pueden ver (solo lectura) los equipos intervenidos de su institucion.

CREATE POLICY "Clients can view own equipment_interventions"
  ON public.equipment_interventions FOR SELECT
  USING (
    client_id IN (
      SELECT client_id FROM public.profiles WHERE id = auth.uid() AND client_id IS NOT NULL
    )
  );
