import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { IconDownload } from '../components/Icons'

// Minutos ahorrados por sesión documentada con IA (de ~10 min a ~2 min).
const MIN_AHORRADOS_POR_SESION = 8

export default async function ReporteMensualPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const ahora = new Date()
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  const hace60dias = new Date(ahora.getTime() - 60 * 24 * 60 * 60 * 1000)

  const [{ data: sessions }, { data: payments }] = await Promise.all([
    supabase.from('sessions').select('session_date, status, patient_id').eq('professional_id', user.id),
    supabase.from('payments').select('amount, status, created_at').eq('professional_id', user.id),
  ])

  const ses = sessions ?? []
  const pays = payments ?? []
  const completadas = ses.filter(s => s.status === 'summarized' || s.status === 'signed' || s.status === 'complete')

  const sesionesMes = completadas.filter(s => new Date(s.session_date) >= inicioMes).length
  const pacientesActivos = new Set(
    completadas.filter(s => new Date(s.session_date) >= hace60dias).map(s => s.patient_id)
  ).size
  const cobradoMes = pays
    .filter(p => p.status === 'paid' && new Date(p.created_at) >= inicioMes)
    .reduce((s, p) => s + (p.amount ?? 0), 0)

  const minutosMes = sesionesMes * MIN_AHORRADOS_POR_SESION
  const horasMes = Math.round((minutosMes / 60) * 10) / 10
  const consultasEquivalentes = Math.round(minutosMes / 30) // a 30 min por consulta

  const mesLabel = ahora.toLocaleDateString('es-UY', { month: 'long', year: 'numeric' })

  const kpis = [
    { label: 'Horas ahorradas', value: `${horasMes} h`, sub: 'en documentación este mes' },
    { label: 'Sesiones documentadas', value: sesionesMes, sub: 'con IA este mes' },
    { label: 'Pacientes activos', value: pacientesActivos, sub: 'con sesión en 60 días' },
    { label: 'Cobrado este mes', value: `$${cobradoMes.toLocaleString('es-UY')}`, sub: 'UYU' },
  ]

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-5 md:p-8">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6">
          <a href="/dashboard/estadisticas" className="text-xs text-[#6E6E73] hover:text-[#0A0A0A] transition-colors font-medium inline-block mb-4">← Volver a estadísticas</a>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest mb-1">Reporte de eficiencia</p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] tracking-tight capitalize">{mesLabel}</h1>
            </div>
            <a
              href="/api/reporte-mensual"
              target="_blank"
              className="shrink-0 bg-[#0A0A0A] text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[#262626] transition-colors inline-flex items-center gap-2"
            >
              <IconDownload className="w-4 h-4" /> Exportar PDF
            </a>
          </div>
        </div>

        {/* Titular ROI */}
        <div className="bg-[#0A0A0A] rounded-2xl p-6 mb-4 text-white">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#9A9A9A] mb-2">Tiempo recuperado este mes</p>
          <p className="text-4xl font-bold leading-none mb-2">{horasMes} horas</p>
          <p className="text-sm text-[#CCCCCC]">
            {sesionesMes > 0
              ? `Equivale a ${consultasEquivalentes} consultas de 30 minutos que pudiste dedicar a tus pacientes en lugar de al papeleo.`
              : 'Documentá tus sesiones con IA para empezar a medir el tiempo que ahorrás.'}
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {kpis.map(k => (
            <div key={k.label} className="bg-white rounded-2xl border border-[#EDEDED] p-4">
              <p className="text-xs text-[#6E6E73] mb-2 leading-tight">{k.label}</p>
              <p className="text-2xl font-bold text-[#0A0A0A]">{k.value}</p>
              <p className="text-xs text-[#6E6E73] mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-[#A3A3A3] leading-relaxed">
          El cálculo asume un ahorro de {MIN_AHORRADOS_POR_SESION} minutos por sesión documentada con IA (de ~10 a ~2 minutos por historia clínica). El PDF es ideal para compartir con la dirección de la clínica.
        </p>

      </div>
    </div>
  )
}
