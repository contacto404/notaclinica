# Estado de publicación en tiendas — dónde retomar

_Actualizado: 10 de junio de 2026._

## ✅ Hecho (Android / Google Play)
- AAB firmado generado (`android/app/build/outputs/bundle/release/app-release.aab`), firma vía `key.properties` + keystore `notaclinica-release.jks`.
- App **NotaClínica** creada en Play Console (paquete `com.sortiplan.notaclinica`).
- Verificación del **sitio web de la organización** en Search Console (con la cuenta correcta) — etiqueta `google-site-verification` en `app/layout.tsx` (NO borrar).
- Sitio de la organización cambiado a **https://vibraco.com.uy** y email de contacto **contacto@vibraco.com.uy** (deben coincidir en dominio).
- Versión **1.0** publicada en **Prueba interna** (sin revisión).
- Lista de testers "Equipo" creada + link de prueba: `https://play.google.com/apps/internaltest/4700427970745481666`.

## ⏳ Pendiente — Google de por medio
- Que termine la **verificación de identidad/documentos** de la cuenta de desarrollador (la revisa Google, tarda días). Necesita documento de Sortiplan SA (constancia BPS/DGI o certificado notarial) + cédula.

## ⏳ Pendiente — para pasar a Producción (Play)
- Completar **ficha de la tienda** (descripción, capturas, categoría Medicina) — textos ya redactados en `docs/publicacion-tiendas.md`.
- Completar **Data Safety** (datos de salud, audio, email) y **Content rating**.
- Definir **App access** (credenciales de prueba para el revisor — crear usuario revisor).
- Promover de Prueba interna → **Producción**.

## ⏳ Pendiente — iOS / App Store (sin empezar)
- Archive en Xcode → subir a App Store Connect → ficha → enviar a revisión.
- Riesgo a tener presente: posible rechazo por "wrapper de web" (regla 4.2); mitigar con el micrófono nativo + notas al revisor + usuario de prueba.

## Notas técnicas
- Guía completa de los pasos: `docs/publicacion-tiendas.md`.
- El keystore y `key.properties` están gitignored. **Backupear el `.jks` y las contraseñas** (hoy en `~/Desktop/notaclinica/notaclinica-release.jks`).
- Como la app usa `server.url` remoto, las mejoras de la web llegan con `git push` (deploy a Vercel) sin re-subir a las tiendas.

## Pendientes menores de la app (de antes)
- Pago de prueba de MercadoPago para confirmar el webhook con firma.
- Revocar el token de GitHub que quedó expuesto.
