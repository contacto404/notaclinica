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
import PlanTratamiento from './PlanTratamiento'
import { showsScales } from '@/lib/scales'
import { isSessionDone, capitalizar } from '@/lib/sessionStatus'
import HistorialSesiones from './HistorialSesiones'

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
  const showScales = showsScales(profile?.specialty)

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

  const { data: goals } = showScales
    ? await supabase
        .from('treatment_goals')
        .select('id, title, status, created_at, achieved_at')
        .eq('patient_id', id)
        .order('created_at', { ascending: true })
    : { data: null }

  const nextAppointment = appointments?.find(a => new Date(a.appointment_date) > new Date())
  const completadas = (sessions ?? []).filter(isSessionDone)
  const lastSummarizedSession = completadas[0]
  const lastSummaryText = lastSummarizedSession?.summaries?.[0]?.content ?? null
  const totalSessions = completadas.length
  const diagnosticoNorm = patient.diagnosis ? capitalizar(patient.diagnosis) : null

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-5 md:p-8">
      <div className="max-w-3xl mx-auto">

        <div className="mb-6">
          <a href="/dashboard" className="text-xs text-[#6E6E73] hover:text-[#0A0A0A] transition-colors font-medium inline-block">
            ← Volver
          </a>
        </div>

        {/* Card paciente */}
        <div className="bg-white rounded-2xl p-5 mb-4 border border-[#EDEDED]">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#F0F0F0] flex items-center justify-center text-2xl font-bold text-[#0A0A0A] shrink-0">
              {patient.full_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#0A0A0A]">{patient.full_name}</h1>
                <EditarPacienteButton patient={patient} />
              </div>
              <p className="text-sm text-[#6E6E73] mt-0.5">{diagnosticoNorm ?? 'Sin diagnóstico'}</p>
              {patient.phone && (
                <p className="text-xs text-[#6E6E73] mt-0.5">📱 {patient.phone}</p>
              )}
              {patient.insurance_provider && (
                <p className="text-xs text-[#6E6E73] mt-0.5">🏥 {patient.insurance_provider}{patient.insurance_member_id ? ` · Afiliado ${patient.insurance_member_id}` : ''}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <ConsentimientoButton patientId={id} patientName={patient.full_name} professionalId={user.id} consent={consent} />
            <a href={"/dashboard/pacientes/" + id + "/historial"} className="border border-[#EDEDED] text-[#6E6E73] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#F5F5F7] flex items-center gap-2 transition-colors">
              🔍 Historial IA
            </a>
            <ReporteButton patientId={id} patientName={patient.full_name} patientPhone={patient.phone} nextAppointment={nextAppointment} />
            <RecetaButton patientId={id} patientName={patient.full_name} />
            <PortalLinkButton token={patient.portal_token} patientPhone={patient.phone} />
            <a href="https://zoom.us/start/videomeeting" target="_blank" rel="noopener noreferrer" className="border border-[#EDEDED] text-[#6E6E73] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#F5F5F7] flex items-center gap-2 transition-colors">
              📹 Videollamada
            </a>
            <CobroButton patientId={id} patientName={patient.full_name} sessionId={lastSummarizedSession?.id} />
          </div>
          {patient.notes && (
            <div className="mt-5 pt-4 border-t border-[#EDEDED]">
              <p className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest mb-1.5">Notas</p>
              <p className="text-sm text-[#6E6E73]">{patient.notes}</p>
            </div>
          )}
        </div>

        {/* Acción principal — destacada y sin scroll */}
        <a href={"/dashboard/pacientes/" + id + "/nueva-sesion"}
          className="flex items-center justify-center gap-2 bg-[#0A0A0A] text-white rounded-2xl py-4 mb-4 text-base font-semibold hover:bg-[#262626] transition-colors shadow-sm">
          🎙️ Nueva sesión
        </a>

        {/* Card próximo turno */}
        <div className="bg-white rounded-2xl p-5 mb-4 border border-[#EDEDED]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-[#6E6E73] uppercase tracking-widest">Próximo turno</h2>
            <AgendarButton patientId={id} patientName={patient.full_name} patientPhone={patient.phone} hasAppointment={!!nextAppointment} currentAppointment={nextAppointment} lastSessionId={lastSummarizedSession?.id} />
          </div>
          {nextAppointment ? (
            <div className="bg-[#F0F0F0] rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-sm font-semibold text-[#0A0A0A]">
                  {new Date(nextAppointment.appointment_date).toLocaleDateString('es-UY', {
                    timeZone: 'America/Montevideo',
                    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
                  })}
                </p>
                <p className="text-xs text-[#0A0A0A]">
                  {new Date(nextAppointment.appointment_date).toLocaleTimeString('es-UY', {
                    timeZone: 'America/Montevideo',
                    hour: '2-digit', minute: '2-digit'
                  })}
                  {nextAppointment.notes && ` · ${nextAppointment.notes}`}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#6E6E73]">No hay turno agendado.</p>
          )}
        </div>

        {/* Pre-consulta enviada por el paciente */}
        {preconsulta && (
          <div className="bg-white rounded-2xl p-5 mb-4 border-l-2 border-[#0A0A0A] dark:border-white border-y border-r border-[#EDEDED]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-[#6E6E73] uppercase tracking-widest">📝 Pre-consulta del paciente</h2>
              <span className="text-[11px] text-[#A3A3A3] shrink-0">
                {new Date(preconsulta.created_at).toLocaleDateString('es-UY', { timeZone: 'America/Montevideo', day: '2-digit', month: 'short' })}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest mb-1">Motivo de consulta</p>
                <p className="text-sm text-[#0A0A0A] leading-relaxed">{preconsulta.motivo}</p>
              </div>
              {preconsulta.antecedentes && (
                <div>
                  <p className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest mb-1">Antecedentes</p>
                  <p className="text-sm text-[#0A0A0A] leading-relaxed">{preconsulta.antecedentes}</p>
                </div>
              )}
              {preconsulta.medicacion && (
                <div>
                  <p className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest mb-1">Medicación actual</p>
                  <p className="text-sm text-[#0A0A0A] leading-relaxed">{preconsulta.medicacion}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card briefing pre-consulta */}
        {lastSummarizedSession && (
          <div className="bg-white rounded-2xl p-5 mb-4 border border-[#EDEDED]">
            <h2 className="text-xs font-semibold text-[#6E6E73] uppercase tracking-widest mb-4">🧠 Antes de entrar</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">🏥</span>
                <div>
                  <p className="text-xs text-[#6E6E73] font-medium">Diagnóstico</p>
                  <p className="text-sm text-[#0A0A0A]">{diagnosticoNorm ?? 'No registrado'}</p>
                </div>
              </div>
              {patient.medication && (
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">💊</span>
                  <div>
                    <p className="text-xs text-[#6E6E73] font-medium">Medicación</p>
                    <p className="text-sm text-[#0A0A0A]">{patient.medication}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">📋</span>
                <div>
                  <p className="text-xs text-[#6E6E73] font-medium">Última sesión</p>
                  <p className="text-sm text-[#0A0A0A]">
                    {new Date(lastSummarizedSession.session_date).toLocaleDateString('es-UY', {
                      timeZone: 'America/Montevideo',
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </p>
                  {lastSummaryText && (
                    <p className="text-xs text-[#6E6E73] mt-1 line-clamp-3">{lastSummaryText}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">📊</span>
                <div>
                  <p className="text-xs text-[#6E6E73] font-medium">Sesiones totales</p>
                  <p className="text-sm text-[#0A0A0A]">{totalSessions} consulta{totalSessions !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Check-ins del portal */}
        {checkins && checkins.length > 0 && (
          <div className="bg-white rounded-2xl p-5 mb-4 border border-[#EDEDED]">
            <h2 className="text-xs font-semibold text-[#6E6E73] uppercase tracking-widest mb-4">📲 Registros del paciente</h2>
            <div className="flex flex-col gap-2.5">
              {checkins.map((c: any, i: number) => (
                <div key={i} className="bg-[#F5F5F7] rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex gap-3">
                      {c.mood != null && <span className="text-xs font-medium text-[#0A0A0A]">Ánimo <span className="text-[#0A0A0A] font-bold">{c.mood}/10</span></span>}
                      {c.anxiety != null && <span className="text-xs font-medium text-[#0A0A0A]">Ansiedad <span className="text-[#0A0A0A] font-bold">{c.anxiety}/10</span></span>}
                    </div>
                    <span className="text-[11px] text-[#A3A3A3] shrink-0">
                      {new Date(c.created_at).toLocaleString('es-UY', { timeZone: 'America/Montevideo', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {c.note && <p className="text-xs text-[#6E6E73] leading-relaxed">{c.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historial de sesiones (contexto antes de entrar) */}
        <div className="flex justify-end mb-2">
          <ImportarHistorialButton patientId={id} />
        </div>
        <HistorialSesiones sessions={sessions ?? []} patientId={id} />

        {/* Copiloto clínico (IA) */}
        <CopilotoCard patientId={id} />

        {/* Evolucion grafica */}
        <EvolucionChart sessions={sessions ?? []} />

        {/* Plan de tratamiento (perfiles de salud mental) */}
        {showScales && (
          <PlanTratamiento patientId={id} goals={goals ?? []} />
        )}

        {/* Escalas de evaluacion (perfiles de salud mental) */}
        {showScales && (
          <EscalasEvaluacion patientId={id} assessments={assessments ?? []} />
        )}

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a href={"/api/export-historial?patientId=" + id} target="_blank" className="inline-flex items-center gap-2 border border-[#EDEDED] text-[#0A0A0A] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#F5F5F7] transition-colors">
            ⬇️ Exportar historial completo
          </a>
          <DarDeBajaButton patientId={id} patientName={patient.full_name} />
        </div>

      </div>
    </div>
  )
}