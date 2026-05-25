import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .eq('professional_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-52 bg-white border-r border-gray-200 min-h-screen flex flex-col">
        <div className="px-4 py-5 border-b border-gray-100">
          <span className="text-base font-medium text-gray-900">Nota<span className="text-blue-600">Clínica</span></span>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          <a href="/dashboard" className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">Dashboard</a>
          <a href="/dashboard/pacientes/nuevo" className="px-3 py-2 rounded-lg text-gray-600 text-sm hover:bg-gray-50">Nuevo paciente</a>
        </nav>
        <div className="p-4 border-t border-gray-100 text-xs text-gray-500 truncate">{user.email}</div>
      </div>
      <div className="flex-1 p-7">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium text-gray-900">Dashboard</h1>
          <a href="/dashboard/pacientes/nuevo" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Nuevo paciente</a>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-7">
          <div className="bg-gray-100 rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">Pacientes activos</p><p className="text-2xl font-medium">{patients?.length ?? 0}</p></div>
          <div className="bg-gray-100 rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">Sesiones este mes</p><p className="text-2xl font-medium">0</p></div>
          <div className="bg-gray-100 rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">PDFs exportados</p><p className="text-2xl font-medium">0</p></div>
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-900 mb-3">Pacientes recientes</h2>
          <div className="flex flex-col gap-2">
            {patients && patients.length > 0 ? patients.map((p: any) => (
              <a key={p.id} href={"/dashboard/pacientes/" + p.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-blue-400">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">{p.full_name?.[0]}</div>
                <div className="flex-1"><p className="text-sm font-medium text-gray-900">{p.full_name}</p><p className="text-xs text-gray-500">{p.diagnosis ?? 'Sin diagnóstico'}</p></div>
              </a>
            )) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-xl px-4 py-10 text-center">
                <p className="text-sm text-gray-500">Todavía no tenés pacientes.</p>
                <a href="/dashboard/pacientes/nuevo" className="text-sm text-blue-600 mt-1 inline-block hover:underline">+ Agregar el primero</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
