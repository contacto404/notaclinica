import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AgendarButton from './AgendarButton'
import ReporteButton from './ReporteButton'
import ImportarHistorialButton from './ImportarHistorialButton'
import EditarPacienteButton from './EditarPacienteButton'

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

  const nextAppointment = appointments?.find(a => new Date(a.appointment_date) > new Date())
  const lastSummarizedSession = sessions?.find(s => s.status === 'summarized')

  return (
    <div className="min-h-screen bg-[#FBF7F4] p-5 md:p-8">
      <div className="max-w-3xl mx-auto">

        <div className="mb-6">
          <a href="/dashboard" className="text-xs text-[#A08070] hover:text-[#2D1F14] transition-colors font-medium">
            ← Volver
          </a>
        </div>

        {/* Header paciente */}
        <div className="bg-white rounded-3xl p-6 mb-4 border border-[#F0E8E0]">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-16 h-16 rounded-full bg-[#FDE8C8] flex items-center justify-center text-2xl font-bold text-[#E8602C] shrink-0">
              {patient.full_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#2D1F14]">{patient.full_name}</h1>
                <EditarPacienteButton patient={patient} />
              </div>
              <p className="text-sm text-[#A08070] mt-0.5">{patient.diagnosis ?? 'Sin diagnóstico'}</p>
              {patient.phone && (
                <p className="text-xs text-[#A08070] mt-0.5">📱 {patient.phone}</p>
              )}
            </div>
            <div className="flex gap-2 w-full sm:w-auto flex-wrap">
              <a href={"/dashboard/pacientes/" + id + "/historial"}
                className="border border-[#E0D0C0] text-[#6B4F3A] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#FBF7F4] flex items-center gap-2 flex-1 sm:flex-none justify-center transition-colors">
                🔍 Historial IA
              </a>
              <ReporteButton
                patientId={id}
                patientName={patient.full_name}
                patientPhone={patient.phone}
                nextAppointment={nextAppointment}
              />
              <a href={"/dashboard/pacientes/" + id + "/nueva-sesion"}
                className="bg-[#E8602C] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#D04F1E] flex items-center gap-2 flex-1 sm:flex-none justify-center transition-colors shadow-sm">
                🎙️ Nueva sesión
              </a>
            </div>
          </div>
          {patient.notes && (
            <div className="mt-5 pt-4 border-t border-[#F0E8E0]">
              <p className="text-xs text-[#A08070] font-medium uppercase tracking-widest mb-1.5">Notas</p>
              <p className="text-sm text-[#6B4F3A]">{patient.notes}</p>
            </div>
          )}
        </div>

        {/* Turno */}
        <div className="bg-white rounded-3xl p-6 mb-4 border border-[#F0E8E0]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-[#A08070] uppercase tracking-widest">Próximo turno</h2>
            <AgendarButton
              patientId={id}
              patientName={patient.full_name}
              patientPhone={patient.phone}
              hasAppointment={!!nextAppointment}
              currentAppointment={nextAppointment}
              lastSessionId={lastSummarizedSession?.id}
            />
          </div>
          {nextAppointment ? (
            <div className="bg-[#FDE8C8] rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-sm font-semibold text-[#2D1F14]">
                  {new Date(nextAppointment.appointment_date).toLocaleDateString('es-AR', {
                    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
                  })}
                </p>
                <p className="text-xs text-[#8B4513]">
                  {new Date(nextAppointment.appointment_date).toLocaleTimeString('es-AR', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                  {nextAppointment.notes && ` · ${nextAppointment.notes}`}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#A08070]">No hay turno agendado.</p>
          )}
        </div>

        {/* Historial */}
        <div className="bg-white rounded-3xl p-6 border border-[#F0E8E0]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-semibold text-[#A08070] uppercase tracking-widest">Historial de sesiones</h2>
            <ImportarHistorialButton patientId={id} />
          </div>
          {sessions && sessions.length > 0 ? (
            <div className="flex flex-col divide-y divide-[#F5EDE8]">
              {sessions.map((s: any) => (
                <div key={s.id} className="py-4 flex items-center gap-3">
                  <div className={"w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 " +
                    (s.status === 'summarized' ? 'bg-[#E8F4E8] text-[#2D6A2D]' : 'bg-[#FDE8C8] text-[#8B4513]')}>
                    {s.status === 'summarized' ? '✓' : '⏳'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#2D1F14]">
                      {new Date(s.session_date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-[#A08070] mt-0.5">
                      {s.status === 'pending' && 'Pendiente de transcripción'}
                      {s.status === 'transcribed' && 'Transcripta — resumen pendiente'}
                      {s.status === 'summarized' && 'Sesión completa'}
                    </p>
                  </div>
                  {s.status === 'summarized' && (
                    <a href={"/dashboard/sesiones/" + s.id}
                      className="text-xs text-[#E8602C] hover:underline shrink-0 font-medium">
                      Ver resumen →
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-2xl mb-2">📋</p>
              <p className="text-sm text-[#A08070]">No hay sesiones todavía.</p>
              <a href={"/dashboard/pacientes/" + id + "/nueva-sesion"}
                className="text-sm text-[#E8602C] mt-1 inline-block hover:underline">
                + Iniciar primera sesión
              </a>
            </div>
          )}
        </div>

        {/* Exportar historial */}
        <div className="mt-3 text-center">
          <a href={"/api/export-historial?patientId=" + id} target="_blank"
            className="text-xs text-[#A08070] hover:text-[#E8602C] transition-colors underline underline-offset-2">
            ↓ Exportar historial completo
          </a>
        </div>

      </div>
    </div>
  )
}