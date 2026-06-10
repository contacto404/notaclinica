import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const TZ = 'America/Montevideo'

// Clave AAAA-MM en horario de Montevideo
function monthKey(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit',
  }).formatToParts(date)
  const year = parts.find(p => p.type === 'year')!.value
  const month = parts.find(p => p.type === 'month')!.value
  return `${year}-${month}`
}

// Últimos 6 meses como [{ key, label }] terminando en el mes actual
function lastSixMonths() {
  const out: { key: string; label: string }[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    out.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('es-UY', { month: 'short', year: '2-digit' }),
    })
  }
  return out
}

export default async function EstadisticasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const ahora = new Date()
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  const hace60dias = new Date(ahora.getTime() - 60 * 24 * 60 * 60 * 1000)
  const en7dias = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000)

  // --- Consultas ---
  const [
    { data: sessions },
    { data: payments },
    { data: patients },
    { data: turnosProximos },
  ] = await Promise.all([
    supabase.from('sessions')
      .select('session_date, status, patient_id')
      .eq('professional_id', user.id),
    supabase.from('payments')
      .select('amount, status, created_at')
      .eq('professional_id', user.id),
    supabase.from('patients')
      .select('id, created_at')
      .eq('professional_id', user.id),
    supabase.from('appointments')
      .select('appointment_date')
      .eq('professional_id', user.id)
      .gte('appointment_date', ahora.toISOString())
      .lte('appointment_date', en7dias.toISOString()),
  ])

  const ses = sessions ?? []
  const pays = payments ?? []
  const pacs = patients ?? []
  const completadas = ses.filter(s => s.status === 'summarized' || s.status === 'signed' || s.status === 'complete')

  // --- KPIs ---
  const sesionesEsteMes = completadas.filter(s => new Date(s.session_date) >= inicioMes).length

  const pacientesActivos = new Set(
    completadas.filter(s => new Date(s.session_date) >= hace60dias).map(s => s.patient_id)
  ).size
  const pacientesNuevosMes = pacs.filter(p => new Date(p.created_at) >= inicioMes).length

  const paysMes = pays.filter(p => new Date(p.created_at) >= inicioMes)
  const cobradoMes = paysMes.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount ?? 0), 0)
  const pendienteMes = paysMes.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount ?? 0), 0)
  const cobradoTotal = pays.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount ?? 0), 0)

  const turnos7dias = turnosProximos?.length ?? 0

  // --- Series mensuales (últimos 6 meses) ---
  const meses = lastSixMonths()

  const sesionesPorMes = meses.map(m => ({
    label: m.label,
    valor: completadas.filter(s => monthKey(new Date(s.session_date)) === m.key).length,
  }))
  const maxSesiones = Math.max(...sesionesPorMes.map(m => m.valor), 1)

  const ingresosPorMes = meses.map(m => ({
    label: m.label,
    valor: pays
      .filter(p => p.status === 'paid' && monthKey(new Date(p.created_at)) === m.key)
      .reduce((s, p) => s + (p.amount ?? 0), 0),
  }))
  const maxIngresos = Math.max(...ingresosPorMes.map(m => m.valor), 1)

  const kpis = [
    { label: 'Pacientes activos', sub: 'con sesión en 60 días', value: pacientesActivos, bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]' },
    { label: 'Sesiones este mes', sub: 'completadas', value: sesionesEsteMes, bg: 'bg-[#E8F4E8]', text: 'text-[#2D6A2D]' },
    { label: 'Cobrado este mes', sub: 'UYU', value: `$${cobradoMes.toLocaleString('es-UY')}`, bg: 'bg-[#EDE9FE]', text: 'text-[#6D28D9]' },
    { label: 'Turnos próximos', sub: '7 días', value: turnos7dias, bg: 'bg-[#E8EEF8]', text: 'text-[#2D3F6A]' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-5 md:p-8">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1">Análisis</p>
          <h1 className="text-2xl font-bold text-[#0F172A]">Estadísticas</h1>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {kpis.map(k => (
            <div key={k.label} className={`${k.bg} rounded-2xl p-4`}>
              <p className="text-xs text-[#64748B] mb-2 leading-tight">{k.label}</p>
              <p className={`text-2xl font-bold ${k.text}`}>{k.value}</p>
              <p className="text-xs text-[#64748B] mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Sesiones por mes */}
        <div className="bg-white rounded-2xl p-5 mb-4 border border-[#E2E8F0]">
          <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-5">📈 Sesiones por mes</h2>
          {completadas.length > 0 ? (
            <div className="flex items-end gap-2 h-28">
              {sesionesPorMes.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <p className="text-xs font-semibold text-[#2563EB]">{m.valor}</p>
                  <div
                    className="w-full bg-[#2563EB] rounded-t-lg transition-all"
                    style={{ height: `${(m.valor / maxSesiones) * 80}px`, minHeight: m.valor > 0 ? '8px' : '2px' }}
                  />
                  <p className="text-xs text-[#94A3B8] text-center leading-tight">{m.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#64748B] text-center py-6">Todavía no hay sesiones registradas.</p>
          )}
        </div>

        {/* Ingresos por mes */}
        <div className="bg-white rounded-2xl p-5 mb-4 border border-[#E2E8F0]">
          <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-5">💰 Ingresos por mes (UYU)</h2>
          {cobradoTotal > 0 ? (
            <div className="flex items-end gap-2 h-28">
              {ingresosPorMes.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <p className="text-[10px] font-semibold text-[#2D6A2D] leading-none">
                    {m.valor > 0 ? `$${(m.valor / 1000).toFixed(m.valor >= 10000 ? 0 : 1)}k` : ''}
                  </p>
                  <div
                    className="w-full bg-[#34A853] rounded-t-lg transition-all"
                    style={{ height: `${(m.valor / maxIngresos) * 80}px`, minHeight: m.valor > 0 ? '8px' : '2px' }}
                  />
                  <p className="text-xs text-[#94A3B8] text-center leading-tight">{m.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#64748B] text-center py-6">Todavía no hay cobros registrados.</p>
          )}
        </div>

        {/* Resumen pacientes */}
        <div className="bg-white rounded-2xl p-5 mb-4 border border-[#E2E8F0]">
          <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">👥 Pacientes</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#DBEAFE] rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-[#1E40AF]">{pacs.length}</p>
              <p className="text-xs text-[#64748B] mt-0.5">Total</p>
            </div>
            <div className="bg-[#E8F4E8] rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-[#2D6A2D]">{pacientesActivos}</p>
              <p className="text-xs text-[#64748B] mt-0.5">Activos</p>
            </div>
            <div className="bg-[#E8EEF8] rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-[#2D3F6A]">{pacientesNuevosMes}</p>
              <p className="text-xs text-[#64748B] mt-0.5">Nuevos este mes</p>
            </div>
          </div>
        </div>

        {/* Resumen cobros */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">💳 Cobros</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#E8F4E8] rounded-2xl p-3 text-center">
              <p className="text-xl font-bold text-[#2D6A2D]">${cobradoMes.toLocaleString('es-UY')}</p>
              <p className="text-xs text-[#64748B] mt-0.5">Cobrado este mes</p>
            </div>
            <div className="bg-[#FFF7ED] rounded-2xl p-3 text-center">
              <p className="text-xl font-bold text-[#C2410C]">${pendienteMes.toLocaleString('es-UY')}</p>
              <p className="text-xs text-[#64748B] mt-0.5">Pendiente este mes</p>
            </div>
            <div className="bg-[#EDE9FE] rounded-2xl p-3 text-center">
              <p className="text-xl font-bold text-[#6D28D9]">${cobradoTotal.toLocaleString('es-UY')}</p>
              <p className="text-xs text-[#64748B] mt-0.5">Cobrado total</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}