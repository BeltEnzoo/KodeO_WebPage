# Assets para el PDF de presupuestos

Para que el PDF muestre el logo y la firma digital, debes subir estos archivos al bucket `pdf-assets` en Supabase Storage.

## Archivos requeridos

| Archivo       | Descripción              | Ejemplo de uso                    |
|---------------|--------------------------|-----------------------------------|
| `logo.png`    | Logo de Kode ON          | Cabecera del presupuesto          |
| `signature.png` | Tu firma digital (imagen) | Área de firma del presupuesto   |

## Cómo subir

1. Ve al [Dashboard de Supabase](https://supabase.com/dashboard) → tu proyecto → **Storage**.
2. Crea o abre el bucket `pdf-assets`.
3. Sube los archivos en la raíz del bucket (no dentro de carpetas):
   - `logo.png` – por ejemplo `src/img/1.png` renombrado
   - `signature.png` – imagen de tu firma escaneada o digital

## Iconos de redes sociales

Los iconos de Instagram y WhatsApp se descargan automáticamente desde Wikipedia Commons. Si prefieres usar tus propios iconos, puedes subir:

- `instagram.png`
- `whatsapp.png`

al mismo bucket `pdf-assets` y se usarán en lugar de los predeterminados.
