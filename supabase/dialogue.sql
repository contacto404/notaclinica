-- Diálogo separado por hablante (Profesional/Paciente) para la vista "Conversación".
-- Se genera con IA a partir de la transcripción y se guarda como JSON:
--   [{ "speaker": "profesional" | "paciente", "text": "..." }]
alter table transcriptions add column if not exists dialogue jsonb;
