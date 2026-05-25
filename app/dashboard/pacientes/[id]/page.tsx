import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function PacientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .eq('professional_id', user.id)
    .single()

  if (!patient) redirect('/dashboard')

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*, transcriptions(*), summaries(*)')
    .eq('patient_id', id)
    .order('session_date', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-52 bg-white border-r border-gray-200 min-h-screen flex flex-col">
        <div className="px-4 py-5 border-b border-gray-100">
          <span className="text-base font-medium text-gray-900">Nota<span className="text-blue-600">Clínica</span></span>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          <a href="/dashboard" className="px-3 py-2 rounded-lg text-gray-600 text-sm hover:bg-gray-50">Dashboard</a>
          <a href="/dashboard/pacientes/nuevo" className="px-3 py-2 rounded-lg text-gray-600 text-sm hover:bg-gray-50">Nuevo paciente</a>
        </nav>
      </div>
      <div className="flex-1 p-7">
        <div className="flex items-center gap-3 mb-6">
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">← Volver</a>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-xl font-medium text-blue-700">
              {patient.full_name?.[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-medium text-gray-900">{patient.full_name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{patient.diagnosis ?? 'Sin diagnóstico'}</p>
            </div>
            <a href={"/dashboard/pacientes/" + id + "/nueva-sesion"} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              🎙️ Nueva sesión
            </a>
          </div>
          {patient.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Notas</p>
              <p className="text-sm text-gray-700">{patient.notes}</p>
            </div>
          )}
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Historial de sesiones</h2>
          {sessions && sessions.length > 0 ? (
            <div className="flex flex-col divide-y divide-gray-100">
              {sessions.map((s: any) => (
                <div key={s.id} className="py-3 flex items-center gap-3">
                  <div className={"w-8 h-8 rounded-lg flex items-center justify-center text-sm " + (s.status === 'summarized' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
                    {s.status === 'summarized' ? '✓' : '⏳'}
                  </div>
                  <div className="flex-1">
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
                    <a href={"/dashboard/sesiones/" + s.id} className="text-xs text-blue-600 hover:underline">Ver resumen</a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No hay sesiones todavía.</p>
              <a href={"/dashboard/pacientes/" + id + "/nueva-sesion"} className="text-sm text-blue-600 mt-1 inline-block hover:underline">+ Iniciar primera sesión</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
