# Publicar NotaClínica en App Store y Google Play

Guía paso a paso adaptada a tu setup (Capacitor 8 + `server.url` apuntando a notaclinica.vercel.app, appId `com.sortiplan.notaclinica`).

> **Aviso clave (iOS):** la app carga el sitio remoto dentro de un webview, lo que Apple puede ver como "wrapper de web" (regla 4.2). Mitigación: usás el micrófono nativo (función real de dispositivo) y es una herramienta profesional — eso ayuda. Para reducir el riesgo de rechazo: en las notas de revisión explicá el valor nativo y **dejá un usuario de prueba** para que el revisor pueda entrar (ver más abajo). Google Play es mucho más permisivo.

---

## 0. Antes de empezar (en tu Mac)

```bash
cd ~/Desktop/notaclinica
npm install
npm run build            # opcional: confirma que el web build pasa
npx cap sync             # sincroniza config y plugins a iOS y Android
```

Requisitos: Xcode actualizado (iOS), Android Studio (Android), las dos cuentas ya pagadas/confirmadas.

**Usuario de prueba para revisores (IMPORTANTE):** tanto Apple como Google necesitan poder entrar detrás del login. Creá una cuenta de prueba (ej. `revisor@notaclinica.com`) con suscripción/trial activo y tené el usuario y contraseña a mano para las fichas. Sin esto, Apple rechaza casi seguro.

---

## A. iOS — App Store

### A1. Build en Xcode
1. Abrí `ios/App/App.xcworkspace` (el `.xcworkspace`, no el `.xcodeproj`).
2. Seleccioná el target **App** → pestaña **Signing & Capabilities**:
   - Team: **Sortiplan SA** (con el D-U-N-S).
   - Bundle Identifier: `com.sortiplan.notaclinica`.
   - Dejá "Automatically manage signing" tildado.
3. Pestaña **General**: Version `1.0`, Build `1`.
4. Confirmá que está la capability/permiso de micrófono (ya tenés `NSMicrophoneUsageDescription` en Info.plist).
5. Arriba, elegí destino **Any iOS Device (arm64)**.
6. Menú **Product → Archive**. Cuando termina, se abre el Organizer.
7. **Distribute App → App Store Connect → Upload**. Seguí los pasos (deja que suba el build).

### A2. Ficha en App Store Connect
En appstoreconnect.apple.com → **Apps → +** → New App:
- Plataforma iOS, nombre **NotaClínica**, idioma principal Español, Bundle ID `com.sortiplan.notaclinica`, SKU libre (ej. `notaclinica-001`).
- Completá la ficha (texto sugerido en la sección C).
- **Categoría:** Medicina (Medical).
- **Privacy Policy URL:** `https://notaclinica.vercel.app/privacidad`.
- **App Privacy:** declará los datos que se recopilan (sección D).
- **Capturas:** necesitás al menos las de 6.7" (iPhone 15/16 Pro Max). Sacalas desde el simulador o tu iPhone.
- **Age rating:** completá el cuestionario (probablemente 17+ por contenido médico).
- En **App Review Information** poné el usuario de prueba y, en notas, el aviso de la sección E.
- Asociá el build subido a la versión y **Submit for Review**.

---

## B. Android — Google Play

### B1. Build (AAB) en Android Studio
1. Abrí la carpeta `android/` en Android Studio.
2. Versión: en `android/app/build.gradle` ya está `versionCode 1` / `versionName "1.0"` (subí estos números en cada actualización futura).
3. **Build → Generate Signed Bundle / APK → Android App Bundle (.aab)**.
4. Creá un **keystore** nuevo (o usá uno existente). ⚠️ **Guardá ese keystore y su contraseña en un lugar seguro y con backup**: si lo perdés, no podés volver a actualizar la app nunca.
5. Build variant: **release**. Genera el `.aab`.

### B2. Ficha en Google Play Console
En play.google.com/console → **Crear app**:
- Nombre **NotaClínica**, idioma Español, tipo App, gratis (con suscripción dentro).
- Subí el `.aab` primero a **Testing → Internal testing** (para probar), después promovés a **Production**.
- Completá: ficha principal (sección C), **categoría Medicina**, **Privacy Policy URL** `https://notaclinica.vercel.app/privacidad`.
- **Data safety form** (sección D) — obligatorio.
- **Content rating** (cuestionario) y **Target audience** (adultos / profesionales).
- Capturas (teléfono + opcional tablet).
- Usuario de prueba en las notas para el revisor.
- Enviá a revisión.

> Recomendado: empezá por **Internal testing** en Play para verificar que el AAB instala y la app abre bien en un Android real, antes de mandar a Production.

---

## C. Contenido de la ficha (borrador listo para usar)

**Nombre:** NotaClínica

**Subtítulo / título corto (iOS 30 caracteres):** Historia clínica con IA

**Descripción corta (Google Play, 80 caracteres):**
Resúmenes clínicos con IA. Grabá la consulta y documentá en segundos.

**Descripción completa:**
NotaClínica es la herramienta para profesionales de la salud que quieren enfocarse en sus pacientes, no en el papeleo.

Grabá la consulta y obtené un resumen clínico estructurado en segundos, gracias a la transcripción y la inteligencia artificial. NotaClínica organiza la historia de cada paciente, te da un briefing antes de cada sesión y te ahorra hasta 30 minutos por consulta.

Funciones:
• Grabación de audio y transcripción automática de la consulta
• Resúmenes clínicos con IA, adaptados a tu especialidad (incluye formato SOAP)
• Historia clínica con contexto entre sesiones
• Escalas de evaluación (PHQ-9, GAD-7) con evolución
• Agenda con recordatorios automáticos
• Recetas e indicaciones en PDF con firma y validación por QR
• Portal del paciente para registros entre sesiones
• Exportación a PDF y envío por WhatsApp

NotaClínica es una herramienta de apoyo: el criterio clínico siempre queda en manos del profesional.

**Palabras clave (iOS, separadas por coma, 100 caracteres):**
historia clinica,medico,IA,transcripcion,consulta,psicologia,resumen clinico,salud,SOAP,turnos

**Categoría:** Medicina

**Política de privacidad:** https://notaclinica.vercel.app/privacidad

---

## D. Privacidad / Seguridad de datos (qué declarar)

Es una app de salud, así que la declaración tiene que ser precisa. Datos que maneja la app:

- **Información de contacto:** email (registro/login).
- **Información de salud:** notas clínicas, diagnósticos, escalas. (Tratada como dato sensible.)
- **Audio:** grabaciones de la consulta que se transcriben. Aclará si se guardan o se descartan tras transcribir (revisá tu flujo: hoy se sube el audio para transcripción).
- **Información de pago:** se procesa con MercadoPago (no guardás tarjetas vos).

Para ambas tiendas declará: que los datos se cifran en tránsito, que cada profesional solo accede a sus propios pacientes, y que no se venden datos a terceros. En Google Play, completá el "Data safety" marcando recolección de email, datos de salud y audio, con propósito "funcionalidad de la app".

---

## E. Notas para el revisor (pegar en App Review Information)

> NotaClínica es una herramienta para profesionales de la salud. Usa el micrófono del dispositivo para grabar la consulta y generar un resumen clínico con IA (función nativa central de la app). Para probar todas las funciones detrás del login, usar la cuenta de prueba provista. Usuario: revisor@notaclinica.com / Contraseña: [completar]. El contenido clínico de prueba es ficticio.

---

## F. Después de aprobar — actualizaciones futuras

Cada vez que cambies la app:
1. `git push` (deploya la web en Vercel — como `server.url` es remoto, los cambios web se ven al instante sin re-subir a las tiendas).
2. Solo necesitás re-subir a las tiendas si cambiás algo **nativo** (plugins, permisos, ícono, config de Capacitor). En ese caso: subí `versionCode`/`Build` y repetí el archive/AAB.

> Ventaja de tu arquitectura con `server.url`: la mayoría de las mejoras (UI, features web) llegan al usuario con solo pushear a Vercel, sin pasar por revisión de tiendas.
