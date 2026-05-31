import { createClient } from '@/lib/supabase/server'
import OnboardingGuide from './components/OnboardingGuide'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .eq('professional_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-5 md:p-8">
      <OnboardingGuide />
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-3">
          <div>
            <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1">Bienvenido</p>
            <h1 className="text-xl font-semibold text-[#0F172A] leading-tight">
              {user?.user_metadata?.full_name ?? 'Tu consulta'}
            </h1>
          </div>
          <a href="/dashboard/pacientes/nuevo"
            className="bg-[#2563EB] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-colors shadow-sm shrink-0 whitespace-nowrap">
            + Nuevo paciente
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Pacientes activos', value: patients?.length ?? 0, color: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]' },
            { label: 'Sesiones este mes', value: 0, color: 'bg-[#E8F4E8]', text: 'text-[#2D6A2D]' },
            { label: 'PDFs exportados', value: 0, color: 'bg-[#E8EEF8]', text: 'text-[#2D3F6A]' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.color} rounded-2xl p-4`}>
              <p className="text-xs text-[#64748B] mb-2 leading-tight">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.text}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Pacientes */}
        <div>
          <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">Pacientes recientes</h2>
          <div className="flex flex-col gap-2">
            {patients && patients.length > 0 ? patients.map((p: any) => (
              <a key={p.id} href={"/dashboard/pacientes/" + p.id}
                className="bg-white rounded-2xl px-4 py-4 flex items-center gap-4 hover:shadow-md transition-shadow border border-[#E2E8F0]">
                <div className="w-11 h-11 rounded-full bg-[#DBEAFE] flex items-center justify-center text-base font-semibold text-[#2563EB] shrink-0">
                  {p.full_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0F172A] truncate">{p.full_name}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{p.diagnosis ?? 'Sin diagnóstico'}</p>
                </div>
                <span className="text-[#D0B8A8] text-lg shrink-0">›</span>
              </a>
            )) : (
              <div className="bg-white border border-dashed border-[#E0D0C0] rounded-2xl px-4 py-12 text-center">
                <p className="text-2xl mb-2">🌱</p>
                <p className="text-sm text-[#64748B]">Todavía no tenés pacientes.</p>
                <a href="/dashboard/pacientes/nuevo" className="text-sm text-[#2563EB] mt-1 inline-block hover:underline">
                  + Agregar el primero
                </a>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}