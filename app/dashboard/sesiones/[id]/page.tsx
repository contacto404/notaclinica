import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditarResumenButton from './EditarResumenButton'
import WhatsAppButton from './WhatsAppButton'
import ReporteButton from '@/app/dashboard/pacientes/[id]/ReporteButton'
import SesionTabs from './SesionTabs'
import ExportPDFButton from './ExportPDFButton'
import CopiarNotaButton from './CopiarNotaButton'

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
    .eq('professional_id', user.id)
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

  const { data: report } = await supabase
    .from('patient_reports')
    .select('*')
    .eq('session_id', id)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-5 md:p-8">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6">
          <a href={"/dashboard/pacientes/" + patient.id} className="text-xs text-[#6E6E73] hover:text-[#0A0A0A] transition-colors font-medium">
            ← Volver al paciente
          </a>
        </div>

        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <p className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest mb-1">Sesión</p>
            <h1 className="text-2xl font-bold text-[#0A0A0A]">{patient.full_name}</h1>
            <p className="text-sm text-[#6E6E73] mt-0.5">
              {new Date(session.session_date).toLocaleDateString('es-UY', {
                timeZone: 'America/Montevideo',
                day: '2-digit', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {summary && (
              <EditarResumenButton
                summaryId={summary.id}
                format={summary.format}
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
            <ReporteButton
              patientId={patient.id}
              patientName={patient.full_name}
              patientPhone={patient.phone}
              nextAppointment={nextAppointment ? { appointment_date: nextAppointment.appointment_date } : undefined}
              sessionId={id}
            />
            <ExportPDFButton sessionId={id} />
            {summary && (
              <CopiarNotaButton patientName={patient.full_name} sessionDate={session.session_date} summary={summary} />
            )}
          </div>
        </div>

        <SesionTabs
          summary={summary}
          transcription={transcription}
          report={report}
          sessionId={id}
        />

      </div>
    </div>
  )
}