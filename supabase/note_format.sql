-- Formato de nota clínica (estándar | SOAP), elegible por profesional.
-- Correr en el SQL editor de Supabase.

-- Preferencia del profesional (por defecto, estándar)
alter table public.profiles
  add column if not exists note_format text not null default 'standard';

-- Formato con el que se generó cada resumen (null = estándar, para las notas viejas)
alter table public.summaries
  add column if not exists format text;
