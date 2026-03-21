# Configurar Vercel con Supabase

Para que la app funcione en producción, necesitás agregar las variables de entorno de Supabase en Vercel.

## Paso 1: Obtener las credenciales de Supabase

1. Entrá a [Supabase Dashboard](https://supabase.com/dashboard)
2. Seleccioná tu proyecto (KodeON)
3. **Settings** (engranaje) → **API**
4. Copiá:
   - **Project URL** → será `VITE_SUPABASE_URL`
   - **anon public** (clave pública) → será `VITE_SUPABASE_ANON_KEY`

## Paso 2: Agregar variables en Vercel

1. Entrá a [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleccioná tu proyecto (KodeO_WebPage)
3. **Settings** → **Environment Variables**
4. Agregá estas dos variables:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Tu Project URL de Supabase (ej: `https://xxxxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Tu anon public key de Supabase |

5. Asegurate de que estén habilitadas para **Production**, **Preview** y **Development**
6. Guardá los cambios

## Paso 3: Redesplegar

Después de agregar las variables:

1. Andá a **Deployments**
2. En el último deployment, hacé clic en los tres puntos (**⋯**)
3. Elegí **Redeploy**
4. Marcá **Use existing Build Cache** si querés acelerar, o desmarcá para hacer un build limpio

O simplemente hacé un nuevo push a GitHub y Vercel redesplegará automáticamente.

## Verificación

Cuando el deployment termine, la app debería:

- Mostrar la landing
- Permitir login con usuario de Supabase Auth
- Redirigir al panel Admin o Cliente según el rol
