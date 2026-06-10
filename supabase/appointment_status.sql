-- Estado del turno (para cancelación/reprogramación desde el portal del paciente).
-- Correr en el SQL editor de Supabase.

alter table public.appointments
  add column if not exists status text not null default 'scheduled';

-- Valores: 'scheduled' (por defecto) | 'cancelled_by_patient' | 'reschedule_requested'
