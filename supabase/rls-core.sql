-- =====================================================================
-- RLS para las tablas CORE (refuerzo / defensa en profundidad).
-- La service role saltea RLS, así que las rutas con admin client siguen
-- funcionando. Las lecturas/escrituras con el cliente del usuario quedan
-- restringidas a SUS datos (professional_id = auth.uid()).
--
-- ⚠️ IMPORTANTE: correr en el SQL editor de Supabase y PROBAR enseguida
-- (entrar al dashboard, ver pacientes, abrir una sesión, generar resumen).
-- Si algo deja de verse, ejecutar el bloque de ROLLBACK del final.
-- =====================================================================

-- patients
alter table public.patients enable row level security;
drop policy if exists "own_patients" on public.patients;
create policy "own_patients" on public.patients
  for all using (professional_id = auth.uid())
  with check (professional_id = auth.uid());

-- sessions
alter table public.sessions enable row level security;
drop policy if exists "own_sessions" on public.sessions;
create policy "own_sessions" on public.sessions
  for all using (professional_id = auth.uid())
  with check (professional_id = auth.uid());

-- summaries (van por la sesión padre: no tienen professional_id)
alter table public.summaries enable row level security;
drop policy if exists "own_summaries" on public.summaries;
create policy "own_summaries" on public.summaries
  for all using (
    exists (select 1 from public.sessions s
            where s.id = summaries.session_id and s.professional_id = auth.uid())
  )
  with check (
    exists (select 1 from public.sessions s
            where s.id = summaries.session_id and s.professional_id = auth.uid())
  );

-- transcriptions (idem)
alter table public.transcriptions enable row level security;
drop policy if exists "own_transcriptions" on public.transcriptions;
create policy "own_transcriptions" on public.transcriptions
  for all using (
    exists (select 1 from public.sessions s
            where s.id = transcriptions.session_id and s.professional_id = auth.uid())
  )
  with check (
    exists (select 1 from public.sessions s
            where s.id = transcriptions.session_id and s.professional_id = auth.uid())
  );

-- appointments
alter table public.appointments enable row level security;
drop policy if exists "own_appointments" on public.appointments;
create policy "own_appointments" on public.appointments
  for all using (professional_id = auth.uid())
  with check (professional_id = auth.uid());

-- payments
alter table public.payments enable row level security;
drop policy if exists "own_payments" on public.payments;
create policy "own_payments" on public.payments
  for all using (professional_id = auth.uid())
  with check (professional_id = auth.uid());

-- patient_reports
alter table public.patient_reports enable row level security;
drop policy if exists "own_patient_reports" on public.patient_reports;
create policy "own_patient_reports" on public.patient_reports
  for all using (professional_id = auth.uid())
  with check (professional_id = auth.uid());

-- profiles (cada uno el suyo)
alter table public.profiles enable row level security;
drop policy if exists "own_profile" on public.profiles;
create policy "own_profile" on public.profiles
  for all using (id = auth.uid())
  with check (id = auth.uid());

-- =====================================================================
-- ROLLBACK (si algo se rompe, ejecutar esto para desactivar RLS):
-- alter table public.patients        disable row level security;
-- alter table public.sessions        disable row level security;
-- alter table public.summaries       disable row level security;
-- alter table public.transcriptions  disable row level security;
-- alter table public.appointments    disable row level security;
-- alter table public.payments        disable row level security;
-- alter table public.patient_reports disable row level security;
-- alter table public.profiles        disable row level security;
-- =====================================================================
