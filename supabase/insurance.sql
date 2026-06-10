-- Cobertura del paciente (obra social / seguro).
-- Correr en el SQL editor de Supabase.

alter table public.patients
  add column if not exists insurance_provider text,
  add column if not exists insurance_member_id text;
