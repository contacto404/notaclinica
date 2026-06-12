-- Fix: la tabla sessions no tenía professional_id, así que las estadísticas
-- (sesiones, retención, reporte de ROI) siempre daban 0.
-- Correr en el SQL editor de Supabase.

-- 1) Agregar la columna
alter table public.sessions
  add column if not exists professional_id uuid references auth.users(id) on delete cascade;

-- 2) Backfill: tomar el profesional desde el paciente de cada sesión
update public.sessions s
set professional_id = p.professional_id
from public.patients p
where s.patient_id = p.id and s.professional_id is null;

-- 3) Índice para las consultas de estadísticas
create index if not exists sessions_professional_idx on public.sessions(professional_id);
