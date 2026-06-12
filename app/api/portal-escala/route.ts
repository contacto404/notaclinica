import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { SCALES, type ScaleId } from '@/lib/scales'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function todayMontevideo() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Montevideo' })
}

export async function POST(request: NextRequest) {
  try {
    const { token, scale, answers } = await request.json()

    if (!token || !UUID_RE.test(token)) {
      return NextResponse.json({ error: 'Enlace no válido' }, { status: 400 })
    }
    if (scale !== 'phq9' && scale !== 'gad7') {
      return NextResponse.json({ error: 'Escala inválida' }, { status: 400 })
    }
    const def = SCALES[scale as ScaleId]

    if (!Array.isArray(answers) || answers.length !== def.questions.length) {
      return NextResponse.json({ error: 'Respuestas incompletas' }, { status: 400 })
    }
    const clean = answers.map((a: any) => Number(a))
    if (clean.some((n) => !Number.isInteger(n) || n < 0 || n > 3)) {
      return NextResponse.json({ error: 'Respuestas inválidas' }, { status: 400 })
    }

    const score = clean.reduce((s, n) => s + n, 0)
    const severity = def.severity(score).key

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

    const { error } = await admin.from('scale_assessments').insert({
      patient_id: patient.id,
      professional_id: patient.professional_id,
      scale,
      answers: clean,
      score,
      severity,
      assessed_at: todayMontevideo(),
      source: 'patient',
    })

    if (error) return NextResponse.json({ error: 'No se pudo guardar' }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
