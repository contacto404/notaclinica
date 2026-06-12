-- Mejoras derivadas del playbook de ventas.
-- Correr en el SQL editor de Supabase (una sola vez).

-- 1) Firma digital del profesional (data URL de la imagen) para recetas y PDFs.
alter table public.profiles
  add column if not exists signature_url text;

-- 2) Pre-consulta: el paciente la completa desde el portal antes de la sesión.
create table if not exists public.preconsultas (
  id              uuid primary key default gen_random_uuid(),
  patient_id      uuid not null references public.patients(id) on delete cascade,
  professional_id uuid not null references auth.users(id) on delete cascade,
  motivo          text not null,
  antecedentes    text,
  medicacion      text,
  created_at      timestamptz not null default now()
);

create index if not exists preconsultas_patient_idx
  on public.preconsultas(patient_id, created_at desc);

alter table public.preconsultas enable row level security;

-- El profesional lee sus pre-consultas. La inserción desde el portal se hace
-- con la service role key (público, sin login), así que no necesita policy de insert.
drop policy if exists "own_preconsultas" on public.preconsultas;
create policy "own_preconsultas" on public.preconsultas
  for all using (auth.uid() = professional_id)
  with check (auth.uid() = professional_id);
