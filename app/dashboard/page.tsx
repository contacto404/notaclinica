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
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <span className="text-lg font-bold text-[#185FA5]">NotaClínica</span>
        <a href="/dashboard/pacientes/nuevo" className="bg-[#185FA5] text-white px-4 py-2 rounded-xl text-sm font-medium">
          + Nuevo
        </a>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Métricas */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
            <p className="text-2xl font-bold text-[#185FA5]">{patients?.length ?? 0}</p>
            <p className="text-xs text-gray-500 mt-1">Pacientes</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-1">Sesiones</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500 mt-1">PDFs</p>
          </div>
        </div>

        {/* Lista pacientes */}
        <h2 className="text-sm font-medium text-gray-900 mb-3">Pacientes recientes</h2>
        <div className="flex flex-col gap-2">
          {patients && patients.length > 0 ? patients.map((p: any) => (
            <a key={p.id} href={"/dashboard/pacientes/" + p.id}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 active:bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-[#185FA5] flex-shrink-0">
                {p.full_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{p.full_name}</p>
                <p className="text-xs text-gray-500 truncate">{p.diagnosis ?? 'Sin diagnóstico'}</p>
              </div>
              <span className="text-gray-400 text-lg">›</span>
            </a>
          )) : (
            <div className="bg-white border border-dashed border-gray-200 rounded-xl px-4 py-12 text-center">
              <p className="text-sm text-gray-500">Todavía no tenés pacientes.</p>
              <a href="/dashboard/pacientes/nuevo" className="text-sm text-[#185FA5] mt-2 inline-block">
                + Agregar el primero
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        <a href="/dashboard" className="flex-1 flex flex-col items-center py-3 text-[#185FA5]">
          <span className="text-xl">🏠</span>
          <span className="text-xs mt-0.5">Inicio</span>
        </a>
        <a href="/dashboard/pacientes/nuevo" className="flex-1 flex flex-col items-center py-3 text-gray-400">
          <span className="text-xl">➕</span>
          <span className="text-xs mt-0.5">Nuevo</span>
        </a>
      </div>

      <div className="h-20" />
    </div>
  )
}
