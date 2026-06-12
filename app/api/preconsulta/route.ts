import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function clean(v: any, max = 2000): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim().slice(0, max)
  return t ? t : null
}

export async function POST(request: NextRequest) {
  try {
    const { token, motivo, antecedentes, medicacion } = await request.json()
    if (!token || !UUID_RE.test(token)) {
      return NextResponse.json({ error: 'Enlace no válido' }, { status: 400 })
    }

    const motivoClean = clean(motivo)
    if (!motivoClean) {
      return NextResponse.json({ error: 'Contanos el motivo de la consulta.' }, { status: 400 })
    }

    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: patient } = await admin
      .from('patients')
      .select('id, professional_id')
      .eq('portal_token', token)
      .maybeSingle()

    if (!patient) return NextResponse.json({ error: 'Enlace no válido' }, { status: 404 })

    const { error } = await admin.from('preconsultas').insert({
      patient_id: patient.id,
      professional_id: patient.professional_id,
      motivo: motivoClean,
      antecedentes: clean(antecedentes),
      medicacion: clean(medicacion),
    })

    if (error) return NextResponse.json({ error: 'No se pudo guardar' }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
