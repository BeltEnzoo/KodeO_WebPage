# Migración a Supabase

Este documento describe cómo migrar el backend de Express/Prisma/SQLite a Supabase.

## Beneficios de Supabase (plan gratuito)

- **Base de datos PostgreSQL**: 500 MB
- **Autenticación**: 50.000 usuarios activos/mes
- **Storage**: 1 GB
- **Edge Functions**: 500.000 invocaciones/mes
- **Sin servidor**: No necesitas mantener un backend Express

## Requisitos previos

1. Cuenta en [Supabase](https://supabase.com)
2. Proyecto creado en Supabase
3. [Supabase CLI](https://supabase.com/docs/guides/cli) instalado (opcional, para migraciones locales)

## Pasos de configuración

### 1. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (o `.env.local`):

```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

Obtén estas claves en: **Supabase Dashboard** → **Project Settings** → **API**.

### 2. Aplicar migraciones

En el **Supabase Dashboard** → **SQL Editor**, ejecuta en orden los archivos de `supabase/migrations/`:

1. `20240320000001_initial_schema.sql`
2. `20240320000002_rls_and_triggers.sql`
3. `20240320000003_storage.sql`
4. `20240320000004_views.sql`

O bien usa la CLI:

```bash
npx supabase link --project-ref TU_PROJECT_REF
npx supabase db push
```

### 3. Desplegar Edge Functions

```bash
npx supabase functions deploy create-client-user
npx supabase functions deploy generate-quote-pdf
```

Configura los secretos si es necesario (la URL y service role key se inyectan automáticamente).

### 4. Crear el primer usuario administrador

**Opción A – Desde la app:**

1. Ve a `/login`
2. Si tienes "Confirmación de email" desactivada en Auth → Providers, regístrate manualmente:
   - En **Supabase Dashboard** → **Authentication** → **Users** → **Add user**
   - Crea un usuario con email y contraseña
2. Luego ejecuta en **SQL Editor**:

```sql
UPDATE public.profiles
SET role = 'ADMIN'
WHERE id = (SELECT id FROM auth.users WHERE email = 'tu-email@ejemplo.com');
```

**Opción B – Solo registro:**

1. Desactiva temporalmente la confirmación de email en Auth → Providers
2. Ve a la app y crea una cuenta con el email que quieras como admin
3. Ejecuta el SQL anterior para asignar el rol ADMIN

## Estructura actual

- **Frontend**: React + Vite (sin cambios en la landing)
- **Auth**: Supabase Auth con tabla `profiles` para roles (ADMIN/CLIENT)
- **Datos**: Supabase Postgres con RLS
- **PDFs**: Supabase Storage (bucket `quote-pdfs`) + Edge Function `generate-quote-pdf`
- **Usuarios cliente**: Edge Function `create-client-user` (usa Admin API)

## Código legacy (opcional)

El servidor Express en `server/` y Prisma en `prisma/` se mantienen para referencia o rollback. Para eliminarlos:

1. Quita las dependencias de `package.json`: express, prisma, @prisma/client, bcryptjs, jsonwebtoken, cookie-parser, cors, pdf-lib (si ya no lo usas en el frontend)
2. Elimina las carpetas `server/` y `prisma/`
3. Actualiza los scripts de `package.json` (quita `api:dev`, `start`, `prisma:*`)

## Desarrollo local

```bash
npm run dev
```

La app usará `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` para conectar a tu proyecto Supabase (puede ser local o remoto).

Para probar Edge Functions localmente:

```bash
npx supabase start
npx supabase functions serve
```

## Producción

Despliega el frontend en Vercel, Netlify o similar. Configura las variables de entorno:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

No expongas nunca la `service_role_key` en el frontend.
