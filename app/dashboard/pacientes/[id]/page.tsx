import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AgendarButton from './AgendarButton'
import ReporteButton from './ReporteButton'
import RecetaButton from './RecetaButton'
import CopilotoCard from './CopilotoCard'
import PortalLinkButton from './PortalLinkButton'
import ImportarHistorialButton from './ImportarHistorialButton'
import EditarPacienteButton from './EditarPacienteButton'
import DarDeBajaButton from './DarDeBajaButton'
import CobroButton from './CobroButton'
import EvolucionChart from './EvolucionChart'
import EscalasEvaluacion from './EscalasEvaluacion'
import ConsentimientoButton from './ConsentimientoButton'

export default async function PacientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: patient } = await supabase
    .from('patients').select('*').eq('id', id).eq('professional_id', user.id).single()
  if (!patient) redirect('/dashboard')

  const { data: sessions } = await supabase
    .from('sessions').select('*, transcriptions(*), summaries(*)')
    .eq('patient_id', id).order('session_date', { ascending: false })

  const { data: appointments } = await supabase
    .from('appointments').select('*')
    .eq('patient_id', id).order('appointment_date', { ascending: true })

  // Especialidad del profesional: las escalas solo aplican a Psicología / Psiquiatría
  const { data: profile } = await supabase
    .from('profiles').select('specialty').eq('id', user.id).single()
  const showScales = profile?.specialty === 'psicologia'

  const { data: assessments } = showScales
    ? await supabase
        .from('scale_assessments').select('*')
        .eq('patient_id', id).order('assessed_at', { ascending: true })
    : { data: null }

  const { data: consent } = await supabase
    .from('consents')
    .select('*')
    .eq('patient_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: checkins } = await supabase
    .from('checkins')
    .select('mood, anxiety, note, created_at')
    .eq('patient_id', id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: preconsulta } = await supabase
    .from('preconsultas')
    .select('motivo, antecedentes, medicacion, created_at')
    .eq('patient_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextAppointment = appointments?.find(a => new Date(a.appointment_date) > new Date())
  const lastSummarizedSession = sessions?.find(s => s.status === 'summarized')
  const lastSummaryText = lastSummarizedSession?.summaries?.[0]?.content ?? null
  const totalSessions = sessions?.length ?? 0

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-5 md:p-8">
      <div className="max-w-3xl mx-auto">

        <div className="mb-6">
          <a href="/dashboard" className="text-xs text-[#64748B] hover:text-[#0F172A] transition-colors font-medium inline-block">
            ← Volver
          </a>
        </div>

        {/* Card paciente */}
        <div className="bg-white rounded-2xl p-5 mb-4 border border-[#E2E8F0]">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#DBEAFE] flex items-center justify-center text-2xl font-bold text-[#2563EB] shrink-0">
              {patient.full_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#0F172A]">{patient.full_name}</h1>
                <EditarPacienteButton patient={patient} />
              </div>
              <p className="text-sm text-[#64748B] mt-0.5">{patient.diagnosis ?? 'Sin diagnostico'}</p>
              {patient.phone && (
                <p className="text-xs text-[#64748B] mt-0.5">📱 {patient.phone}</p>
              )}
              {patient.insurance_provider && (
                <p className="text-xs text-[#64748B] mt-0.5">🏥 {patient.insurance_provider}{patient.insurance_member_id ? ` · Afiliado ${patient.insurance_member_id}` : ''}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <ConsentimientoButton patientId={id} patientName={patient.full_name} professionalId={user.id} consent={consent} />
            <a href={"/dashboard/pacientes/" + id + "/historial"} className="border border-[#E2E8F0] text-[#475569] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors">
              🔍 Historial IA
            </a>
            <ReporteButton patientId={id} patientName={patient.full_name} patientPhone={patient.phone} nextAppointment={nextAppointment} />
            <RecetaButton patientId={id} patientName={patient.full_name} />
            <PortalLinkButton token={patient.portal_token} patientPhone={patient.phone} />
            <a href="https://zoom.us/start/videomeeting" target="_blank" rel="noopener noreferrer" className="border border-[#E2E8F0] text-[#475569] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors">
              📹 Videollamada
            </a>
            <CobroButton patientId={id} patientName={patient.full_name} sessionId={lastSummarizedSession?.id} />
            <a href={"/dashboard/pacientes/" + id + "/nueva-sesion"} className="bg-[#2563EB] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1D4ED8] flex items-center gap-2 transition-colors shadow-sm">
              🎙️ Nueva sesion
            </a>
          </div>
          {patient.notes && (
            <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
              <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1.5">Notas</p>
              <p className="text-sm text-[#475569]">{patient.notes}</p>
            </div>
          )}
        </div>

        {/* Card próximo turno */}
        <div className="bg-white rounded-2xl p-5 mb-4 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">Proximo turno</h2>
            <AgendarButton patientId={id} patientName={patient.full_name} patientPhone={patient.phone} hasAppointment={!!nextAppointment} currentAppointment={nextAppointment} lastSessionId={lastSummarizedSession?.id} />
          </div>
          {nextAppointment ? (
            <div className="bg-[#DBEAFE] rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  {new Date(nextAppointment.appointment_date).toLocaleDateString('es-UY', {
                    timeZone: 'America/Montevideo',
                    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
                  })}
                </p>
                <p className="text-xs text-[#1E40AF]">
                  {new Date(nextAppointment.appointment_date).toLocaleTimeString('es-UY', {
                    timeZone: 'America/Montevideo',
                    hour: '2-digit', minute: '2-digit'
                  })}
                  {nextAppointment.notes && ` · ${nextAppointment.notes}`}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#64748B]">No hay turno agendado.</p>
          )}
        </div>

        {/* Pre-consulta enviada por el paciente */}
        {preconsulta && (
          <div className="bg-white rounded-2xl p-5 mb-4 border-l-2 border-[#0A0A0A] dark:border-white border-y border-r border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">📝 Pre-consulta del paciente</h2>
              <span className="text-[11px] text-[#94A3B8] shrink-0">
                {new Date(preconsulta.created_at).toLocaleDateString('es-UY', { timeZone: 'America/Montevideo', day: '2-digit', month: 'short' })}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1">Motivo de consulta</p>
                <p className="text-sm text-[#0F172A] leading-relaxed">{preconsulta.motivo}</p>
              </div>
              {preconsulta.antecedentes && (
                <div>
                  <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1">Antecedentes</p>
                  <p className="text-sm text-[#0F172A] leading-relaxed">{preconsulta.antecedentes}</p>
                </div>
              )}
              {preconsulta.medicacion && (
                <div>
                  <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1">Medicación actual</p>
                  <p className="text-sm text-[#0F172A] leading-relaxed">{preconsulta.medicacion}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card briefing pre-consulta */}
        {lastSummarizedSession && (
          <div className="bg-white rounded-2xl p-5 mb-4 border border-[#E2E8F0]">
            <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">🧠 Antes de entrar</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">🏥</span>
                <div>
                  <p className="text-xs text-[#64748B] font-medium">Diagnostico</p>
                  <p className="text-sm text-[#0F172A]">{patient.diagnosis ?? 'No registrado'}</p>
                </div>
              </div>
              {patient.medication && (
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">💊</span>
                  <div>
                    <p className="text-xs text-[#64748B] font-medium">Medicacion</p>
                    <p className="text-sm text-[#0F172A]">{patient.medication}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">📋</span>
                <div>
                  <p className="text-xs text-[#64748B] font-medium">Ultima sesion</p>
                  <p className="text-sm text-[#0F172A]">
                    {new Date(lastSummarizedSession.session_date).toLocaleDateString('es-UY', {
                      timeZone: 'America/Montevideo',
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </p>
                  {lastSummaryText && (
                    <p className="text-xs text-[#475569] mt-1 line-clamp-3">{lastSummaryText}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">📊</span>
                <div>
                  <p className="text-xs text-[#64748B] font-medium">Sesiones totales</p>
                  <p className="text-sm text-[#0F172A]">{totalSessions} consulta{totalSessions !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Check-ins del portal */}
        {checkins && checkins.length > 0 && (
          <div className="bg-white rounded-2xl p-5 mb-4 border border-[#E2E8F0]">
            <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">📲 Registros del paciente</h2>
            <div className="flex flex-col gap-2.5">
              {checkins.map((c: any, i: number) => (
                <div key={i} className="bg-[#F8FAFC] rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex gap-3">
                      {c.mood != null && <span className="text-xs font-medium text-[#0F172A]">Ánimo <span className="text-[#2563EB] font-bold">{c.mood}/10</span></span>}
                      {c.anxiety != null && <span className="text-xs font-medium text-[#0F172A]">Ansiedad <span className="text-[#2563EB] font-bold">{c.anxiety}/10</span></span>}
                    </div>
                    <span className="text-[11px] text-[#94A3B8] shrink-0">
                      {new Date(c.created_at).toLocaleDateString('es-UY', { timeZone: 'America/Montevideo', day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  {c.note && <p className="text-xs text-[#475569] leading-relaxed">{c.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Copiloto clínico (IA) */}
        <CopilotoCard patientId={id} />

        {/* Evolucion grafica */}
        <EvolucionChart sessions={sessions ?? []} />

        {/* Escalas de evaluacion (solo Psicologia / Psiquiatria) */}
        {showScales && (
          <EscalasEvaluacion patientId={id} assessments={assessments ?? []} />
        )}

        {/* Card historial de sesiones */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">Historial de sesiones</h2>
            <ImportarHistorialButton patientId={id} />
          </div>
          {sessions && sessions.length > 0 ? (
            <div className="flex flex-col divide-y divide-[#E2E8F0]">
              {sessions.map((s: any) => (
                <div key={s.id} className="py-4 flex items-center gap-3">
                  <div className={"w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 " + (s.status === 'summarized' ? 'bg-[#E8F4E8] text-[#2D6A2D]' : 'bg-[#DBEAFE] text-[#1E40AF]')}>
                    {s.status === 'summarized' ? '✓' : '⏳'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0F172A]">
                      {new Date(s.session_date).toLocaleDateString('es-UY', {
                        timeZone: 'America/Montevideo',
                        day: '2-digit', month: 'long', year: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {s.status === 'pending' && 'Pendiente de transcripcion'}
                      {s.status === 'transcribed' && 'Transcripta - resumen pendiente'}
                      {s.status === 'summarized' && 'Sesion completa'}
                    </p>
                  </div>
                  {s.status === 'summarized' && (
                    <a href={"/dashboard/sesiones/" + s.id} className="text-xs text-[#2563EB] hover:underline shrink-0 font-medium">
                      Ver resumen →
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-2xl mb-2">📋</p>
              <p className="text-sm text-[#64748B]">No hay sesiones todavia.</p>
              <a href={"/dashboard/pacientes/" + id + "/nueva-sesion"} className="text-sm text-[#2563EB] mt-1 inline-block hover:underline">
                + Iniciar primera sesion
              </a>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-center gap-4">
          <a href={"/api/export-historial?patientId=" + id} target="_blank" className="text-xs text-[#64748B] hover:text-[#2563EB] transition-colors underline underline-offset-2">
            Exportar historial completo
          </a>
          <span className="text-[#CBD5E1]">·</span>
          <DarDeBajaButton patientId={id} patientName={patient.full_name} />
        </div>

      </div>
    </div>
  )
}