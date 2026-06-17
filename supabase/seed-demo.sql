-- ============================================================
-- Seed de datos DEMO para capturas / video de NotaClínica
-- Correr en Supabase → SQL Editor.  Cuenta demo:
--   revision.apple@notaclinica.app  (b07b4ddf-295d-4453-af65-301fc8c161b3)
-- Idempotente-ish: si lo corrés 2 veces, duplica pacientes. Para limpiar,
-- usá el bloque "LIMPIAR" del final (comentado).
-- ============================================================

do $$
declare
  prof uuid := 'b07b4ddf-295d-4453-af65-301fc8c161b3';
  pid uuid;
  sid uuid;
  i int;
  ndx int;
  patnames text[] := array[
    'María González','Juan López','Carla Pérez','Sofía Martínez','Diego Fernández',
    'Lucía Rodríguez','Andrés Silva','Valentina Castro','Martín Sosa','Camila Ortiz',
    'Federico Núñez','Paula Méndez','Ramiro Acosta','Florencia Vidal'];
  dxs text[] := array[
    'Hipertensión arterial','Trastorno de ansiedad','Diabetes tipo 2','Control de salud',
    'Migraña','Hipotiroidismo','Dislipemia','Lumbalgia crónica'];
  obras text[] := array['ASSE','SMI','Médica Uruguaya','Casmu','—'];
  motivos text[] := array[
    'Control de hipertensión arterial; refiere cefaleas ocasionales.',
    'Seguimiento de ansiedad e insomnio.',
    'Control metabólico de diabetes.',
    'Control clínico general.'];
  evols text[] := array[
    'Cifras tensionales en descenso; buena adherencia al tratamiento.',
    'Refiere mejor descanso y menor rumiación.',
    'Valores estables respecto al control previo.'];
  planes text[] := array[
    'Mantener tratamiento actual. Control en 4 semanas.',
    'Reforzar pautas de higiene del sueño.',
    'Solicitar laboratorio de control y reevaluar.'];
begin
  -- Nombre que se muestra como "Dr./Dra."
  update auth.users
     set raw_user_meta_data = coalesce(raw_user_meta_data,'{}'::jsonb) || '{"full_name":"Dra. Laura Fernández"}'::jsonb
   where id = prof;

  for i in 1..array_length(patnames,1) loop
    insert into patients (professional_id, full_name, date_of_birth, diagnosis, phone, insurance_provider, notes)
    values (
      prof, patnames[i],
      (date '1968-01-01' + (i*920 || ' days')::interval)::date,
      dxs[1 + (i % array_length(dxs,1))],
      '099' || lpad((100000 + i*317)::text, 6, '0'),
      obras[1 + (i % array_length(obras,1))],
      null)
    returning id into pid;

    -- 1 a 3 sesiones por paciente, en los últimos ~70 días
    for ndx in 1..(1 + (i % 3)) loop
      insert into sessions (patient_id, professional_id, status, session_date)
      values (pid, prof, 'summarized', now() - ((i*3 + ndx*6) || ' days')::interval)
      returning id into sid;

      insert into transcriptions (session_id, content)
      values (sid, 'Transcripción de ejemplo de la consulta (datos demo).');

      insert into summaries (session_id, chief_complaint, observations, plan, next_steps)
      values (
        sid,
        motivos[1 + ((i+ndx) % array_length(motivos,1))],
        evols[1 + ((i+ndx) % array_length(evols,1))],
        planes[1 + ((i+ndx) % array_length(planes,1))],
        'Continuar seguimiento.');
    end loop;

    -- Turno próximo para los primeros 5 pacientes (llena Agenda / Próximo turno)
    if i <= 5 then
      insert into appointments (patient_id, professional_id, appointment_date)
      values (pid, prof, now() + ((i) || ' days')::interval + interval '16 hours');
    end if;

    -- Cobros (llena Honorarios / ingresos) para los primeros 8
    if i <= 8 then
      insert into payments (professional_id, patient_id, amount, status, created_at)
      values (prof, pid, 1500, 'paid', now() - ((i*2) || ' days')::interval);
    end if;
  end loop;
end $$;

-- ============================================================
-- LIMPIAR (si querés borrar TODO lo demo de esta cuenta y empezar de cero):
-- ============================================================
-- do $$
-- declare prof uuid := 'b07b4ddf-295d-4453-af65-301fc8c161b3';
-- begin
--   delete from summaries where session_id in (select id from sessions where professional_id = prof);
--   delete from transcriptions where session_id in (select id from sessions where professional_id = prof);
--   delete from sessions where professional_id = prof;
--   delete from appointments where professional_id = prof;
--   delete from payments where professional_id = prof;
--   delete from patients where professional_id = prof;
-- end $$;
