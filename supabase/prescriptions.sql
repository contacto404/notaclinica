-- Recetas / indicaciones al paciente (con validación por QR).
-- Correr en el SQL editor de Supabase.

create table public.prescriptions (
  id              uuid primary key default gen_random_uuid(),
  professional_id uuid not null references auth.users(id) on delete cascade,
  patient_id      uuid not null references public.patients(id) on delete cascade,
  content         text not null,                         -- indicaciones para el paciente
  created_at      timestamptz not null default now()
);

create index prescriptions_patient_idx
  on public.prescriptions (patient_id, created_at desc);

alter table public.prescriptions enable row level security;

-- El profesional solo accede a sus propias recetas
create policy "own_prescriptions" on public.prescriptions
  for all using (auth.uid() = professional_id)
  with check (auth.uid() = professional_id);

-- La página pública /verificar/[id] lee con la service role key (no necesita policy pública).
