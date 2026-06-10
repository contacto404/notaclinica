import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: NextRequest) {
  try {
    const { token, action } = await request.json()
    if (!token || !UUID_RE.test(token) || !['cancel', 'reschedule'].includes(action)) {
      return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
    }

    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: patient } = await admin
      .from('patients')
      .select('id')
      .eq('portal_token', token)
      .maybeSingle()
    if (!patient) return NextResponse.json({ error: 'Enlace no válido' }, { status: 404 })

    // Próximo turno futuro del paciente
    const { data: appt } = await admin
      .from('appointments')
      .select('id, status')
      .eq('patient_id', patient.id)
      .gte('appointment_date', new Date().toISOString())
      .order('appointment_date', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (!appt) return NextResponse.json({ error: 'No hay un turno próximo' }, { status: 404 })

    const newStatus = action === 'cancel' ? 'cancelled_by_patient' : 'reschedule_requested'
    const { error } = await admin
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', appt.id)

    if (error) return NextResponse.json({ error: 'No se pudo guardar' }, { status: 500 })

    return NextResponse.json({ ok: true, status: newStatus })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
