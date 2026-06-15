import { createClient } from '@/lib/supabase/server'
import OnboardingGuide from './components/OnboardingGuide'
import DashboardClient from './components/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .eq('professional_id', user!.id)
    .order('created_at', { ascending: false })

  const inicioMes = new Date()
  inicioMes.setDate(1)
  inicioMes.setHours(0, 0, 0, 0)

  const { count: sesionesEsteMes } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('professional_id', user!.id)
    .gte('session_date', inicioMes.toISOString())

  const { count: pdfsExportados } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('professional_id', user!.id)
    .eq('status', 'summarized')
    .gte('session_date', inicioMes.toISOString())

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

  // --- Alertas clínicas (por reglas) ---
  const ahoraTs = Date.now()
  const [{ data: allSessions }, { data: assessments }] = await Promise.all([
    supabase.from('sessions').select('patient_id, session_date, status').eq('professional_id', user!.id),
    supabase.from('scale_assessments').select('patient_id, scale, score, severity, assessed_at').eq('professional_id', user!.id).order('assessed_at', { ascending: true }),
  ])

  const nombrePorId: Record<string, string> = {}
  ;(patients ?? []).forEach((p: any) => { nombrePorId[p.id] = p.full_name })

  type Alerta = { patientId: string; patientName: string; tipo: string; detalle: string; nivel: 'alta' | 'media' }
  const alertas: Alerta[] = []

  // 1) Pacientes que se alejan (última sesión completada hace >30 días)
  const completadas = (allSessions ?? []).filter((s: any) => ['summarized', 'signed', 'complete'].includes(s.status))
  const ultimaPorPaciente: Record<string, number> = {}
  completadas.forEach((s: any) => {
    const t = new Date(s.session_date).getTime()
    if (!ultimaPorPaciente[s.patient_id] || t > ultimaPorPaciente[s.patient_id]) ultimaPorPaciente[s.patient_id] = t
  })
  Object.entries(ultimaPorPaciente).forEach(([pid, t]) => {
    if (!nombrePorId[pid]) return
    const dias = Math.floor((ahoraTs - t) / 86400000)
    if (dias > 30) {
      alertas.push({ patientId: pid, patientName: nombrePorId[pid], tipo: 'Se aleja', detalle: `Hace ${dias} días sin consulta`, nivel: dias > 60 ? 'alta' : 'media' })
    }
  })

  // 2) Escalas: nivel severo o empeoramiento marcado
  const nombreEscala: Record<string, string> = { phq9: 'PHQ-9', gad7: 'GAD-7' }
  const porPacienteEscala: Record<string, any[]> = {}
  ;(assessments ?? []).forEach((a: any) => {
    const k = `${a.patient_id}|${a.scale}`
    ;(porPacienteEscala[k] ||= []).push(a)
  })
  Object.entries(porPacienteEscala).forEach(([k, arr]) => {
    const pid = k.split('|')[0]
    const scale = k.split('|')[1]
    if (!nombrePorId[pid]) return
    const last = arr[arr.length - 1]
    const prev = arr.length > 1 ? arr[arr.length - 2] : null
    if (last.severity === 'severo' || last.severity === 'moderado_severo') {
      alertas.push({ patientId: pid, patientName: nombrePorId[pid], tipo: 'Escala severa', detalle: `${nombreEscala[scale] ?? scale}: ${last.score} (${String(last.severity).replace('_', ' ')})`, nivel: 'alta' })
    } else if (prev && last.score - prev.score >= 5) {
      alertas.push({ patientId: pid, patientName: nombrePorId[pid], tipo: 'Empeorando', detalle: `${nombreEscala[scale] ?? scale}: subió de ${prev.score} a ${last.score}`, nivel: 'media' })
    }
  })

  alertas.sort((a, b) => (a.nivel === 'alta' ? 0 : 1) - (b.nivel === 'alta' ? 0 : 1))
  const alertasTop = alertas.slice(0, 6)

  const horaUY = new Date().toLocaleString('en-US', { timeZone: 'America/Montevideo', hour: 'numeric', hour12: false })
  const hora = parseInt(horaUY)
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'
  const nombre = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Doctor'

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-5 md:p-8">
      <OnboardingGuide />
      <DashboardClient
        patients={patients ?? []}
        sesionesEsteMes={sesionesEsteMes ?? 0}
        pdfsExportados={pdfsExportados ?? 0}
        turnosHoy={turnosHoy ?? []}
        alertas={alertasTop}
        saludo={saludo}
        nombre={nombre}
      />
    </div>
  )
}