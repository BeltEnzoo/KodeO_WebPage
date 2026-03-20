# KodeON Landing Page

Landing page profesional para KodeON, startup de software médico especializado en gestión de equipamiento hospitalario.

## 🚀 Características

- **Diseño Responsive**: Optimizado para móvil, tablet y desktop
- **Colores Médicos**: Paleta profesional con azul y verde médico
- **Componentes Modulares**: Estructura organizada en componentes reutilizables
- **SEO Optimizado**: Meta tags y estructura optimizada para buscadores
- **WhatsApp Integration**: Botones de contacto directo con WhatsApp Business
- **Animaciones Sutiles**: Transiciones suaves y efectos visuales profesionales

## 🛠️ Tecnologías

- **React 18** - Framework principal
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos
- **Responsive Design** - Mobile-first approach

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🎨 Estructura del Proyecto

```
src/
├── components/
│   ├── Logo.jsx          # Logo SVG personalizado
│   ├── Services.jsx      # Sección de servicios
│   ├── Benefits.jsx      # Sección de beneficios
│   ├── Testimonials.jsx  # Sección de testimonios
│   ├── Pricing.jsx       # Sección de precios
│   ├── Contact.jsx       # Sección de contacto
│   └── Footer.jsx        # Footer
├── App.jsx               # Componente principal
├── index.css             # Estilos globales con Tailwind
└── main.jsx              # Punto de entrada
```

## 🚀 Deploy en Vercel

1. **Conectar repositorio**:
   - Sube el código a GitHub
   - Conecta tu repositorio en Vercel

2. **Configuración automática**:
   - Vercel detectará automáticamente que es un proyecto Vite
   - Usará los comandos: `npm run build` y `npm run preview`

3. **Variables de entorno** (opcional):
   - No requiere variables de entorno para esta landing page

4. **Dominio personalizado**:
   - Configura `kodeon.com.ar` en Vercel
   - Actualiza los meta tags en `index.html`

## 📱 Secciones de la Landing

### 1. **Hero Section**
- Propuesta de valor clara
- Call-to-actions prominentes
- Diseño impactante con gradiente

### 2. **Servicios**
- Gestión de equipamiento médico
- Análisis y reportes
- Seguridad y cumplimiento

### 3. **Beneficios**
- Reducción de costos (30%)
- Mejora en la atención
- Implementación rápida

### 4. **Testimonios**
- Casos de uso reales
- Testimonios de directores médicos
- Calificaciones con estrellas

### 5. **Precios**
- Plan único: AR$ 30,000/mes
- Lista detallada de características
- Botón de contacto directo

### 6. **Contacto**
- Información de contacto completa
- Formulario de demo
- Horarios de atención

## 🎯 Objetivos de Conversión

- **Lead Generation**: Formularios de contacto y WhatsApp
- **Demo Requests**: Botones para agendar demostraciones
- **Pricing Clarity**: Precios transparentes y claros
- **Trust Building**: Testimonios y casos de éxito

## 📞 Información de Contacto

- **WhatsApp**: +54 9 2944 36-9647
- **Email**: contacto@kodeon.com.ar
- **Ubicación**: Buenos Aires, Argentina

## 🔧 Personalización

### Cambiar colores:
Edita `tailwind.config.js` para modificar la paleta de colores médicos.

### Actualizar contenido:
Modifica los componentes individuales en `src/components/` para cambiar textos, precios o información.

### Agregar secciones:
Crea nuevos componentes y agrégalos a `App.jsx`.

## 📈 Próximos Pasos

1. **Analytics**: Integrar Google Analytics
2. **A/B Testing**: Probar diferentes versiones de CTAs
3. **Formularios**: Agregar formularios de contacto avanzados
4. **Blog**: Sección de artículos y casos de estudio
5. **Multi-idioma**: Soporte para inglés

---

**Desarrollado con ❤️ para KodeON**

## Produccion (Frontend + API + SQLite)

Este proyecto ya esta preparado para levantar frontend y backend juntos en un mismo servidor Node.

### Variables de entorno

1. Copiar `.env.example` a `.env`
2. Completar al menos:
   - `DATABASE_URL="file:../data/app.db"`
   - `API_PORT=4000`
   - `JWT_SECRET=<tu secreto>`
   - `NODE_ENV=production`

### Comandos de despliegue

```bash
# instalar dependencias
npm install

# construir frontend
npm run build:prod

# aplicar migraciones
npx prisma migrate deploy

# generar cliente Prisma (si el entorno lo necesita)
npx prisma generate

# (solo primera vez) crear admin inicial
npm run prisma:seed

# iniciar servidor de produccion
npm run start
```

### Notas

- En desarrollo, Vite ya proxya `/api` a `http://localhost:4000`.
- En produccion, Express sirve `dist/` y tambien responde `/api`.
- Asegurate de persistir `data/app.db` y `storage/pdf/`.