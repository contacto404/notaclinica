-- Portal del paciente (v1): token de acceso + check-ins entre sesiones.
-- Correr en el SQL editor de Supabase.

-- Token único por paciente para el link público del portal
alter table public.patients
  add column if not exists portal_token uuid not null default gen_random_uuid();

create unique index if not exists patients_portal_token_idx
  on public.patients(portal_token);

-- Check-ins que el paciente completa desde el portal
create table public.checkins (
  id              uuid primary key default gen_random_uuid(),
  patient_id      uuid not null references public.patients(id) on delete cascade,
  professional_id uuid not null references auth.users(id) on delete cascade,
  mood            smallint,   -- ánimo 1-10
  anxiety         smallint,   -- ansiedad 1-10
  note            text,
  created_at      timestamptz not null default now()
);

create index checkins_patient_idx on public.checkins(patient_id, created_at desc);

alter table public.checkins enable row level security;

-- El profesional lee sus check-ins. La inserción desde el portal se hace
-- con la service role key (público, sin login), así que no necesita policy de insert.
create policy "own_checkins" on public.checkins
  for all using (auth.uid() = professional_id)
  with check (auth.uid() = professional_id);
