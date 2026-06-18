-- ============================================================
-- Repara sesiones marcadas como "Resumen pendiente" por error.
-- Causa: el código ponía status = 'complete' al terminar, pero la constraint
-- sessions_status_check solo acepta 'summarized'/'signed', así que el update
-- fallaba en silencio y la sesión quedaba en 'transcribed' aunque el resumen
-- YA estaba generado. (Ya corregido en el código: ahora escribe 'summarized'.)
--
-- Este script pone 'summarized' a las sesiones 'transcribed' que SÍ tienen
-- resumen. Las que no tienen resumen quedan pendientes de verdad.
-- Correr en Supabase → SQL Editor.
-- ============================================================

update sessions s
set status = 'summarized'
where s.status = 'transcribed'
  and exists (select 1 from summaries m where m.session_id = s.id);

-- (opcional) ver cuántas quedaron realmente pendientes (transcriptas sin resumen):
-- select count(*) from sessions s
--   where s.status = 'transcribed'
--     and not exists (select 1 from summaries m where m.session_id = s.id);
