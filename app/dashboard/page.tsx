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

  const horaUY = new Date().toLocaleString('en-US', { timeZone: 'America/Montevideo', hour: 'numeric', hour12: false })
  const hora = parseInt(horaUY)
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'
  const nombre = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Doctor'

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-5 md:p-8">
      <OnboardingGuide />
      <DashboardClient
        patients={patients ?? []}
        sesionesEsteMes={sesionesEsteMes ?? 0}
        pdfsExportados={pdfsExportados ?? 0}
        turnosHoy={turnosHoy ?? []}
        saludo={saludo}
        nombre={nombre}
      />
    </div>
  )
}