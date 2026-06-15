import { createClient as createAdmin } from '@supabase/supabase-js'
import PortalCheckinForm from './PortalCheckinForm'
import PortalTurnoAcciones from './PortalTurnoAcciones'
import PortalPreconsultaForm from './PortalPreconsultaForm'
import PortalEscalaForm from './PortalEscalaForm'
import { showsScales } from '@/lib/scales'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function PortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let patient: any = null
  if (UUID_RE.test(token)) {
    const { data } = await admin
      .from('patients')
      .select('id, full_name, professional_id')
      .eq('portal_token', token)
      .maybeSingle()
    patient = data
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-5">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-[#EDEDED] p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#FFF7ED] flex items-center justify-center text-2xl mx-auto mb-4">⚠️</div>
          <p className="text-base font-bold text-[#0A0A0A] mb-1">Enlace no válido</p>
          <p className="text-xs text-[#6E6E73]">Este enlace no es correcto o fue dado de baja. Pedile uno nuevo a tu profesional.</p>
        </div>
      </div>
    )
  }

  const ahora = new Date()
  const [{ data: turno }, { data: prof }] = await Promise.all([
    admin.from('appointments')
      .select('appointment_date, status')
      .eq('patient_id', patient.id)
      .gte('appointment_date', ahora.toISOString())
      .order('appointment_date', { ascending: true })
      .limit(1)
      .maybeSingle(),
    admin.from('profiles')
      .select('professional_name, full_name, specialty')
      .eq('id', patient.professional_id)
      .maybeSingle(),
  ])

  const profNombre = prof?.professional_name || prof?.full_name || 'tu profesional'
  const showScales = showsScales(prof?.specialty)
  const primerNombre = (patient.full_name ?? '').split(' ')[0]

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-5">
      <div className="max-w-md mx-auto pt-6">
        <p className="text-center font-light text-[#0A0A0A] text-lg mb-6 tracking-tight lowercase">notaclinica</p>

        <div className="mb-5">
          <h1 className="text-2xl font-bold text-[#0A0A0A]">Hola{primerNombre ? `, ${primerNombre}` : ''} 👋</h1>
          <p className="text-sm text-[#6E6E73] mt-1">Espacio de seguimiento con {profNombre}.</p>
        </div>

        {turno && (
          <PortalTurnoAcciones token={token} appointmentDate={turno.appointment_date} initialStatus={turno.status} />
        )}

        {turno && <PortalPreconsultaForm token={token} />}

        {showScales && <PortalEscalaForm token={token} />}

        <PortalCheckinForm token={token} />

        <p className="text-center text-[11px] text-[#A3A3A3] mt-6">Lo que registres acá lo ve únicamente {profNombre}.</p>
      </div>
    </div>
  )
}
