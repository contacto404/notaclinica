import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditarResumenButton from './EditarResumenButton'
import WhatsAppButton from './WhatsAppButton'

export default async function SesionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: session } = await supabase
    .from('sessions')
    .select('*, transcriptions(*), summaries(*)')
    .eq('id', id).single()

  if (!session) redirect('/dashboard')

  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('id', session.patient_id)
    .single()

  if (!patient) redirect('/dashboard')

  const summary = session.summaries
  const transcription = session.transcriptions

  const { data: nextAppointment } = await supabase
    .from('appointments')
    .select('appointment_date')
    .eq('patient_id', session.patient_id)
    .gte('appointment_date', new Date().toISOString())
    .order('appointment_date', { ascending: true })
    .limit(1)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-[#FBF7F4] p-5 md:p-8">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6">
          <a href={"/dashboard/pacientes/" + patient.id} className="text-xs text-[#A08070] hover:text-[#2D1F14] transition-colors font-medium">
            ← Volver al paciente
          </a>
        </div>

        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <p className="text-xs text-[#A08070] font-medium uppercase tracking-widest mb-1">Sesión</p>
            <h1 className="text-2xl font-bold text-[#2D1F14]">{patient.full_name}</h1>
            <p className="text-sm text-[#A08070] mt-0.5">
              {new Date(session.session_date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {summary && (
              <EditarResumenButton
                summaryId={summary.id}
                initial={{
                  chief_complaint: summary.chief_complaint ?? '',
                  observations: summary.observations ?? '',
                  plan: summary.plan ?? '',
                  next_steps: summary.next_steps ?? '',
                }}
              />
            )}
            {summary && (
              <WhatsAppButton
                phone={patient.phone}
                patientName={patient.full_name}
                sessionDate={session.session_date}
                summary={{
                  chief_complaint: summary.chief_complaint,
                  observations: summary.observations,
                  plan: summary.plan,
                  next_steps: summary.next_steps,
                }}
                nextAppointment={nextAppointment?.appointment_date ?? null}
              />
            )}
            <a href={"/api/export-pdf?sessionId=" + id} target="_blank"
              className="bg-[#E8602C] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#D04F1E] transition-colors shadow-sm shrink-0">
              ⬇ Exportar PDF
            </a>
          </div>
        </div>

        {summary && (
          <div className="bg-white rounded-3xl border border-[#F0E8E0] p-6 mb-4">
            <h2 className="text-xs font-semibold text-[#A08070] uppercase tracking-widest mb-4">Resumen clínico</h2>
            <div className="flex flex-col gap-3">
              {([
                ['Motivo de consulta', summary.chief_complaint],
                ['Observaciones', summary.observations],
                ['Plan de tratamiento', summary.plan],
                ['Próximos pasos', summary.next_steps]
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="bg-[#FBF7F4] rounded-2xl p-4">
                  <p className="text-xs text-[#A08070] font-medium uppercase tracking-widest mb-1.5">{label}</p>
                  <p className="text-sm text-[#2D1F14] leading-relaxed">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {transcription && (
          <div className="bg-white rounded-3xl border border-[#F0E8E0] p-6">
            <h2 className="text-xs font-semibold text-[#A08070] uppercase tracking-widest mb-4">Transcripción</h2>
            <p className="text-sm text-[#6B4F3A] leading-relaxed border-l-2 border-[#E8602C] pl-4">
              {transcription.content}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}