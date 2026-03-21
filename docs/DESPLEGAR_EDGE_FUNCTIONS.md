# Desplegar Edge Functions en Supabase

Si ves **404** o **"CORS Preflight Did Not Succeed"** al crear usuario cliente o generar PDF, la función **no está publicada** en tu proyecto.

## Opción A: CLI (recomendado)

1. Instalá la CLI (una vez):
   ```bash
   npm install -g supabase
   ```
   O usá `npx supabase` sin instalar global.

2. Iniciá sesión:
   ```bash
   npx supabase login
   ```

3. Enlazá el proyecto (el **Reference ID** está en Supabase → **Project Settings** → **General** → *Reference ID*):
   ```bash
   cd C:\TODO\PROGRAMACION\PROJECTS\KodeO_WebPage
   npx supabase link --project-ref TU_REFERENCE_ID
   ```

4. Desplegá las dos funciones:
   ```bash
   npx supabase functions deploy create-client-user
   npx supabase functions deploy generate-quote-pdf
   ```

5. Probá de nuevo en el panel: **Crear usuario cliente** y **Generar PDF**.

## Opción B: Dashboard

1. Supabase → **Edge Functions** → **Deploy a new function**.
2. Nombre exacto: `create-client-user` (con guiones).
3. Pegá el contenido de `supabase/functions/create-client-user/index.ts`.
4. Repetí para `generate-quote-pdf` con su archivo.

El nombre debe coincidir con lo que usa el front: `create-client-user` y `generate-quote-pdf`.

## Comprobar

En **Edge Functions** deberías ver las dos funciones listadas. La URL será:

`https://TU_REF.supabase.co/functions/v1/create-client-user`
