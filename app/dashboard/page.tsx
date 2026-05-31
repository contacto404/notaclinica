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

  // Sesiones este mes
  const inicioMes = new Date()
  inicioMes.setDate(1)
  inicioMes.setHours(0, 0, 0, 0)

  const { count: sesionesEsteMes } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('professional_id', user!.id)
    .gte('session_date', inicioMes.toISOString())

  // PDFs exportados (sesiones con status summarized este mes)
  const { count: pdfsExportados } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('professional_id', user!.id)
    .eq('status', 'summarized')
    .gte('session_date', inicioMes.toISOString())

  // Turnos de hoy
  const hoyInicio = new Date()
  hoyInicio.setHours(0, 0, 0, 0)
  const hoyFin = new Date()
  hoyFin.setHours(23, 59, 59, 999)

  const { data: turnosHoy } = await supabase
    .from('appointments')
    .select('*, patients(*)')
    .eq('professional_id', user!.id)
    .gte('appointment_date', hoyInicio.toISOString())
    .lte('appointment_date', hoyFin.toISOString())
    .order('appointment_date', { ascending: true })

  // Saludo según hora del día en Montevideo
  const horaUY = new Date().toLocaleString('en-US', { timeZone: 'America/Montevideo', hour: 'numeric', hour12: false })
  const hora = parseInt(horaUY)
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'

  const nombre = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Doctor'

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-5 md:p-8">
      <OnboardingGuide />
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-3">
          <div>
            <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1">{saludo}</p>
            <h1 className="text-xl font-semibold text-[#0F172A] leading-tight">
              {nombre}
            </h1>
          </div>
          <a href="/dashboard/pacientes/nuevo"
            className="bg-[#2563EB] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-colors shadow-sm shrink-0 whitespace-nowrap">
            + Nuevo paciente
          </a>
        </div>

        {/* Turnos hoy */}
        {turnosHoy && turnosHoy.length > 0 && (
          <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl p-4 mb-6">
            <p className="text-xs font-semibold text-[#C2410C] uppercase tracking-widest mb-3">📅 Hoy</p>
            <div className="flex flex-col gap-2">
              {turnosHoy.map((t: any) => (
                <a key={t.id} href={"/dashboard/pacientes/" + t.patient_id}
                  className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border border-[#FED7AA] hover:shadow-sm transition-shadow">
                  <div className="bg-[#FFF7ED] rounded-lg px-2 py-1 text-center shrink-0">
                    <p className="text-sm font-bold text-[#C2410C]">
                      {new Date(t.appointment_date).toLocaleTimeString('es-UY', {
                        timeZone: 'America/Montevideo',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0F172A] truncate">{t.patients?.full_name}</p>
                    {t.notes && <p className="text-xs text-[#64748B]">{t.notes}</p>}
                  </div>
                  <span className="text-[#D0B8A8] text-lg shrink-0">›</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Pacientes activos', value: patients?.length ?? 0, color: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]' },
            { label: 'Sesiones este mes', value: sesionesEsteMes ?? 0, color: 'bg-[#E8F4E8]', text: 'text-[#2D6A2D]' },
            { label: 'PDFs exportados', value: pdfsExportados ?? 0, color: 'bg-[#E8EEF8]', text: 'text-[#2D3F6A]' },
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