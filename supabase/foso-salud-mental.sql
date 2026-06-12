-- Features de "foso" para salud mental.
-- Correr en el SQL editor de Supabase (una sola vez).

-- 1) Marcar el origen de cada evaluación: profesional o auto-reportada por el paciente.
alter table public.scale_assessments
  add column if not exists source text not null default 'professional';

-- 2) Plan de tratamiento: objetivos terapéuticos por paciente.
create table if not exists public.treatment_goals (
  id              uuid primary key default gen_random_uuid(),
  patient_id      uuid not null references public.patients(id) on delete cascade,
  professional_id uuid not null references auth.users(id) on delete cascade,
  title           text not null,
  status          text not null default 'active',   -- active | achieved | paused
  created_at      timestamptz not null default now(),
  achieved_at     timestamptz
);

create index if not exists treatment_goals_patient_idx
  on public.treatment_goals(patient_id, created_at desc);

alter table public.treatment_goals enable row level security;

drop policy if exists "own_treatment_goals" on public.treatment_goals;
create policy "own_treatment_goals" on public.treatment_goals
  for all using (auth.uid() = professional_id)
  with check (auth.uid() = professional_id);
