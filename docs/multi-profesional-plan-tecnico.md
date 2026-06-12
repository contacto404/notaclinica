# Plan técnico — Cuentas de clínica (multi-profesional)

Objetivo: permitir que una clínica con varios profesionales opere bajo una sola cuenta, habilitando el **Tier 2** (2–5 profesionales) y el **Tier 3** (ilimitados) del playbook de ventas. Hoy la app es de un profesional por cuenta, así que este es el cambio estructural más grande pendiente. Este documento es el plan; no se implementó código todavía.

## Cómo está hoy

Cada recurso (`patients`, `sessions`, `appointments`, `payments`, `prescriptions`, `preconsultas`, `checkins`, etc.) tiene una columna `professional_id` igual al `auth.users.id` del profesional. La seguridad a nivel de fila (RLS) es simple: `auth.uid() = professional_id`. La tabla `profiles` es 1:1 con el usuario, y la suscripción (`subscriptions`) está atada al usuario. Es un modelo limpio de un solo dueño por cuenta.

## Modelo propuesto

Se introduce la entidad **clínica** y una tabla de **membresías**:

- `clinics`: `id`, `name`, `owner_id`, `plan` (tier), `seats` (asientos según plan), `created_at`.
- `clinic_members`: `clinic_id`, `user_id`, `role` (`owner` | `admin` | `professional`), `created_at`, con índice único en `(clinic_id, user_id)`.
- Agregar `clinic_id` a todas las tablas de datos. Se mantiene `professional_id` como "profesional autor/responsable" de cada registro.

Hay que decidir el modelo de visibilidad entre colegas:

- **Modelo A — datos compartidos en la clínica.** Cualquier profesional de la clínica ve a todos los pacientes. Es simple y colaborativo, pero ofrece menos confidencialidad entre colegas.
- **Modelo B — datos por profesional con rol admin.** Cada profesional ve sus pacientes; el `owner`/`admin` ve todos; se pueden compartir pacientes puntualmente. Más privado, más complejo.

Recomendación: arrancar con el **Modelo A** para las primeras clínicas chicas (cubre la promesa con el menor esfuerzo) y migrar al **Modelo B** si un cliente exige confidencialidad por profesional, algo habitual en salud por la Ley 18.331.

## Seguridad (RLS)

Se reemplaza `auth.uid() = professional_id` por pertenencia a la clínica. Conviene crear funciones helper `is_clinic_member(clinic_id)` y `clinic_role(clinic_id)` (security definer) para usarlas en las policies:

- **select**: `is_clinic_member(clinic_id)` y, en Modelo B, además `role = 'admin' OR professional_id = auth.uid() OR paciente compartido`.
- **insert/update**: `professional_id = auth.uid()` y `is_clinic_member(clinic_id)`.

Este es el punto más delicado del proyecto: una policy mal escrita filtra datos entre clínicas o entre profesionales. Requiere tests exhaustivos antes de salir.

## Invitaciones y onboarding

El `owner` crea la clínica (al contratar Tier 2/3, o desde "Mi cuenta → Crear clínica"). Invita profesionales por email mediante una tabla `invitations` (`email`, `clinic_id`, `role`, `token`, `status`). El invitado se registra o inicia sesión y se une a la clínica. Al aceptar, el backend verifica que no se supere el límite de **asientos** del plan.

## Facturación

La suscripción pasa de estar atada al usuario a estar atada a la clínica (`subscriptions.clinic_id`). El precio es por plan, no por usuario (Tier 2 hasta 5 asientos; Tier 3 ilimitado), coherente con el modelo de implementación/retainer del playbook. En MercadoPago paga el `owner`, y el estado de la suscripción de la clínica habilita a todos los miembros.

## Cambios de UI

Se necesita un selector de clínica (si un usuario pertenece a varias), una sección "Clínica" en Mi cuenta (nombre, miembros, invitar, roles, asientos usados/total), y en el dashboard un filtro por profesional para el admin o una vista "mis pacientes" vs "todos". Al crear o editar un paciente se elige el profesional responsable. Las estadísticas y el reporte mensual deben poder verse por profesional, ya que el Tier 3 promete "reportes de eficiencia por profesional".

## Migración de datos (sin downtime)

Para cada usuario actual se crea una clínica "personal" con `owner = user` y el plan según su suscripción. Se hace backfill de `clinic_id` en todos los registros existentes con la clínica personal de su `professional_id`. La secuencia segura es: agregar columnas nullable, backfill, y recién después forzar `not null` y activar las policies nuevas.

## Plan por fases

- **Fase 0 (1–2 días):** tablas `clinics` y `clinic_members`, funciones helper y backfill de clínicas personales. Sin ningún cambio visible de UX.
- **Fase 1:** invitaciones, unión de miembros y límite de asientos. Sección Clínica en Mi cuenta.
- **Fase 2:** RLS multi-miembro, asignación de pacientes y filtros admin/profesional en el dashboard.
- **Fase 3:** facturación a nivel clínica y reportes por profesional (Tier 3).

## Esfuerzo estimado

Un MVP vendible (Fases 0–2 con Modelo A) toma del orden de 1 a 2 semanas. La versión completa con facturación por clínica y reportes por profesional, del orden de 3 a 4 semanas.

## Recomendación

Validar demanda real antes de invertir en la Fase 3. Para los primeros clientes Tier 2, el Modelo A (datos compartidos en la clínica) + invitaciones + límite de asientos cubre la promesa del playbook con el menor riesgo. La parte de RLS hay que testearla a fondo porque es donde se juega la confidencialidad de los pacientes.
