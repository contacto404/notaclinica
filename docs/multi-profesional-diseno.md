# Multi-profesional — Documento de diseño

_Borrador para decidir antes de tocar código. NotaClínica hoy es de un profesional por cuenta: cada tabla (patients, sessions, summaries, appointments, payments, scale_assessments, prescriptions, checkins, consents, waitlist) está scopeada con `professional_id = auth.uid()` y RLS lo hace cumplir._

El objetivo es permitir que **varios profesionales compartan un consultorio**. Eso obliga a cambiar el modelo de acceso de toda la app, por eso conviene definir bien el diseño antes de programar.

---

## 1. Concepto central: la "clínica"

Se introduce una entidad **clínica** (consultorio/equipo) a la que pertenecen uno o más profesionales.

Tablas nuevas:

- `clinics` — `id`, `name`, `owner_id`, `created_at`.
- `clinic_members` — `clinic_id`, `user_id`, `role`, `created_at`. Roles: **owner**, **admin**, **member**.
- `clinic_invites` — `clinic_id`, `email`, `token`, `role`, `expires_at` (para invitar por mail).

Toda cuenta existente (un solo profesional) se migra a una **clínica de 1 persona** donde ese profesional es `owner`. Así nada se rompe: si nunca invita a nadie, funciona igual que hoy.

---

## 2. Decisión clave A — ¿Cómo se comparten los pacientes?

Esta es la decisión que define todo lo demás. Dos modelos:

### Modelo A — Pacientes compartidos (consultorio en equipo)
El paciente pertenece a la **clínica**, no a un profesional. Todos los miembros ven y atienden a todos los pacientes de la clínica.

- Ideal si: se cubren entre profesionales, hay recepción que agenda para todos, trabajan como equipo.
- Cambio técnico: se agrega `clinic_id` a las tablas y el acceso pasa a ser "soy miembro de la clínica del paciente".

### Modelo B — Cada profesional dueño de sus pacientes (admins ven todo)
El paciente sigue siendo de un profesional. Los **admins/owner** de la clínica pueden ver todo; los **members** solo ven lo suyo.

- Ideal si: son profesionales independientes que comparten espacio/administración, pero cada uno maneja su propia cartera con privacidad.
- Cambio técnico: se mantiene `professional_id` y se agrega una regla extra "o soy admin de su clínica".

**Recomendación:** depende de cómo trabajen. Para un consultorio de salud mental chico, suele ser **Modelo B** (privacidad clínica entre colegas, con un admin que ve todo para gestión). Para una clínica con recepción compartida, **Modelo A**.

---

## 3. Decisión clave B — ¿Qué se comparte y qué no?

Aunque se compartan pacientes, hay datos que conviene mantener separados:

- **Historia clínica / sesiones / resúmenes / escalas:** según el Modelo A o B elegido arriba.
- **Agenda / turnos:** normalmente compartida (recepción agenda para todos), o por profesional. A decidir.
- **Honorarios / pagos:** casi siempre **por profesional** (cada uno cobra lo suyo), aunque el owner pueda ver el total de la clínica.
- **Datos del profesional (firma, título, especialidad, formato de nota):** siempre individuales por usuario.

---

## 4. Decisión clave C — Facturación

Hoy se cobra **$49 USD/mes por cuenta** (MercadoPago Preapproval). Con multi-profesional:

- **Por asiento (recomendado):** la clínica paga por cada profesional activo. Es lo estándar en SaaS y lo más justo.
- **Por clínica (plan fijo):** un precio por consultorio sin importar cuántos profesionales. Más simple de vender, menos escalable.

Esto afecta `subscriptions` (hoy `user_id` → habría que pensar suscripción a nivel clínica + conteo de asientos) y el panel de admin.

---

## 5. Impacto técnico (alto)

- **RLS:** hay que reescribir las políticas de **todas** las tablas con datos de pacientes. En vez de `professional_id = auth.uid()`, pasan a usar una función tipo `is_member_of_clinic(clinic_id)` (o la variante del Modelo B). Esto es lo más delicado: un error = un profesional viendo datos de otro.
- **Queries de la app:** decenas de consultas hoy filtran por `professional_id = user.id`. Hay que revisarlas una por una.
- **Migración de datos:** crear una clínica por cada usuario existente y vincular sus pacientes/datos. Script de migración con verificación.
- **Onboarding/invitaciones:** flujo de invitar por mail + aceptar + unirse a la clínica.
- **UI nueva:** sección "Equipo/Clínica" (ver miembros, invitar, roles), selector de profesional en agenda si la agenda es compartida, indicador de "atendido por" en sesiones.

---

## 6. Plan por fases (propuesto)

1. **Fase 0 — Diseño (esto).** Cerrar las 3 decisiones de arriba.
2. **Fase 1 — Esquema + migración.** Crear `clinics`/`clinic_members`, migrar cada cuenta a su clínica de 1 persona, agregar la columna de scoping. **Sin cambiar comportamiento todavía.**
3. **Fase 2 — RLS y queries.** Reescribir políticas y consultas al nuevo modelo, con pruebas de aislamiento (un profesional NO ve datos de otra clínica).
4. **Fase 3 — Invitaciones y roles.** Invitar por mail, aceptar, panel de equipo.
5. **Fase 4 — Facturación por asiento** (si se elige ese modelo).

Cada fase se prueba y deploya antes de la siguiente.

---

## 7. Riesgos

- **Fuga de datos entre clínicas** si la RLS queda mal → el riesgo más serio. Mitigación: tests de aislamiento explícitos antes de cada deploy.
- **Migración:** correr el script en una copia antes de producción.
- **Complejidad de facturación** si se va por asientos.

---

## Decisiones a tomar para avanzar

1. **Modelo de pacientes:** ¿A (compartidos) o B (propios + admins ven todo)?
2. **Agenda:** ¿compartida entre el equipo o por profesional?
3. **Facturación:** ¿por asiento o plan fijo por clínica?

Con esas tres definidas, arranco la Fase 1 (esquema + migración), que es segura porque no cambia el comportamiento actual.
