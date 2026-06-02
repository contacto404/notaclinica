-- Escalas de evaluación psicológica (PHQ-9, GAD-7)
-- Correr en el SQL editor de Supabase.

create table public.scale_assessments (
  id              uuid primary key default gen_random_uuid(),
  patient_id      uuid not null references public.patients(id) on delete cascade,
  professional_id uuid not null references auth.users(id) on delete cascade,
  scale           text not null check (scale in ('phq9','gad7')),
  answers         smallint[] not null,          -- respuestas por ítem (0-3 c/u)
  score           smallint not null,            -- puntaje total calculado
  severity        text not null,                -- minimo | leve | moderado | moderado_severo | severo
  assessed_at     date not null default current_date,   -- fecha de la evaluación (editable)
  created_at      timestamptz not null default now()    -- auditoría
);

create index scale_assessments_patient_scale_idx
  on public.scale_assessments (patient_id, scale, assessed_at);

alter table public.scale_assessments enable row level security;

create policy "own_assessments" on public.scale_assessments
  for all using (auth.uid() = professional_id)
  with check (auth.uid() = professional_id);
