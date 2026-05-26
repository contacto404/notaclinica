import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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

  return (
    <div className="p-5 md:p-7">
      <div className="mb-5">
        <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">← Volver</a>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-xl font-medium text-blue-700 shrink-0">
            {patient.full_name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-medium text-gray-900">{patient.full_name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{patient.diagnosis ?? 'Sin diagnóstico'}</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <a href={"/dashboard/pacientes/" + id + "/historial"}
              className="border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 flex-1 sm:flex-none justify-center">
              🔍 Consultar historial
            </a>
            <a href={"/dashboard/pacientes/" + id + "/nueva-sesion"}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 flex-1 sm:flex-none justify-center">
              🎙️ Nueva sesión
            </a>
          </div>
        </div>
        {patient.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Notas</p>
            <p className="text-sm text-gray-700">{patient.notes}</p>
          </div>
        )}
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Historial de sesiones</h2>
        {sessions && sessions.length > 0 ? (
          <div className="flex flex-col divide-y divide-gray-100">
            {sessions.map((s: any) => (
              <div key={s.id} className="py-3 flex items-center gap-3">
                <div className={"w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 " +
                  (s.status === 'summarized' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
                  {s.status === 'summarized' ? '✓' : '⏳'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(s.session_date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {s.status === 'pending' && 'Pendiente de transcripción'}
                    {s.status === 'transcribed' && 'Transcripta — resumen pendiente'}
                    {s.status === 'summarized' && 'Completa'}
                  </p>
                </div>
                {s.status === 'summarized' && (
                  <a href={"/dashboard/sesiones/" + s.id} className="text-xs text-blue-600 hover:underline shrink-0">
                    Ver resumen
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No hay sesiones todavía.</p>
            <a href={"/dashboard/pacientes/" + id + "/nueva-sesion"}
              className="text-sm text-blue-600 mt-1 inline-block hover:underline">
              + Iniciar primera sesión
            </a>
          </div>
        )}
      </div>
    </div>
  )
}