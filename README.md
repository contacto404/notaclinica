# NotaClínica

Documentación clínica con IA para profesionales de la salud. Grabá la consulta y obtené un resumen clínico estructurado en segundos.

**Producción:** https://notaclinica.vercel.app

## Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Estilos:** Tailwind v4 (con modo claro/oscuro)
- **Base de datos / auth / storage:** Supabase (PostgreSQL + RLS)
- **Deploy:** Vercel (deploy automático al pushear a `main`)
- **Mobile:** Capacitor 8 (iOS + Android) cargando el sitio remoto vía `server.url`
- **IA — resúmenes:** Anthropic Claude
- **Transcripción:** OpenAI Whisper
- **Pagos:** MercadoPago (suscripción Preapproval + cobro por sesión Preference)
- **Email:** Resend

## Funcionalidades principales

Grabación y transcripción de la consulta, resúmenes con IA por especialidad (incluye formato SOAP), historial clínico con contexto entre sesiones, escalas PHQ-9/GAD-7 con evolución, agenda con recordatorios automáticos, recetas en PDF con firma y QR de validación, portal del paciente (check-ins y gestión de turnos), búsqueda global, alertas clínicas y copiloto con IA, cobros con MercadoPago, panel de admin.

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:3000
```

## Variables de entorno (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
ANTHROPIC_API_KEY
RESEND_API_KEY
CRON_SECRET
MP_ACCESS_TOKEN_PROD / MP_PUBLIC_KEY_PROD
MP_ACCESS_TOKEN_TEST / MP_PUBLIC_KEY_TEST
MP_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL
```

## Base de datos

Las tablas viven en Supabase. Los scripts SQL para crear/extender tablas están en `supabase/` (correr en el SQL Editor de Supabase). RLS habilitado en todas las tablas con datos de pacientes; las API routes usan la service role key.

## Deploy

```bash
git add . && git commit -m "mensaje" && git push     # Vercel deploya solo
```

Como la app móvil usa `server.url` remoto, las mejoras de la web llegan al usuario con el push, sin re-subir a las tiendas (salvo cambios nativos).

## Mobile (Capacitor)

```bash
npx cap sync            # sincroniza config/plugins a iOS y Android
npx cap open ios        # abre Xcode
npx cap open android    # abre Android Studio
```

La guía de publicación en App Store / Google Play está en `docs/publicacion-tiendas.md`.

## Estructura

- `app/` — páginas y API routes (App Router)
- `lib/supabase/` — clientes de Supabase (browser y server)
- `supabase/` — scripts SQL
- `docs/` — documentación (publicación, estado, diseño)
- `ios/`, `android/` — proyectos nativos de Capacitor

## Documentos

- `docs/publicacion-tiendas.md` — guía para publicar en las tiendas
- `docs/estado-publicacion.md` — estado actual de la publicación
- `AGENTS.md` — notas para asistentes de IA

© Sortiplan SA · Uruguay
