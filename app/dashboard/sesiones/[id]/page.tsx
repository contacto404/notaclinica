import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function SesionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: session } = await supabase
    .from('sessions')
    .select('*, patients(*), transcriptions(*), summaries(*)')
    .eq('id', id).single()

  if (!session) redirect('/dashboard')

  const patient = session.patients
  const summary = session.summaries
  const transcription = session.transcriptions

  return (
    <div className="p-5 md:p-7 max-w-2xl">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <a href={"/dashboard/pacientes/" + patient?.id} className="text-sm text-gray-500 hover:text-gray-700">
            ← Volver al paciente
          </a>
          <h1 className="text-xl font-medium text-gray-900 mt-2">{patient?.full_name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date(session.session_date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <a href={"/api/export-pdf?sessionId=" + id} target="_blank"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shrink-0">
          ⬇ Exportar PDF
        </a>
      </div>

      {summary && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
          <h2 className="text-sm font-medium text-gray-900 mb-4">📋 Resumen clínico</h2>
          <div className="flex flex-col gap-3">
            {([['Motivo de consulta', summary.chief_complaint], ['Observaciones', summary.observations], ['Plan terapéutico', summary.plan], ['Próximos pasos', summary.next_steps]] as [string, string][]).map(([label, value]) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-sm text-gray-900 leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {transcription && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-3">📝 Transcripción</h2>
          <p className="text-sm text-gray-700 leading-relaxed border-l-2 border-blue-600 pl-4">
            {transcription.content}
          </p>
        </div>
      )}
    </div>
  )
}