import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function clampScore(v: any): number | null {
  const n = Number(v)
  if (!Number.isFinite(n)) return null
  return Math.max(1, Math.min(10, Math.round(n)))
}

export async function POST(request: NextRequest) {
  try {
    const { token, mood, anxiety, note } = await request.json()
    if (!token || !UUID_RE.test(token)) {
      return NextResponse.json({ error: 'Enlace no válido' }, { status: 400 })
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

    const cleanNote = typeof note === 'string' ? note.slice(0, 1000) : null

    const { error } = await admin.from('checkins').insert({
      patient_id: patient.id,
      professional_id: patient.professional_id,
      mood: clampScore(mood),
      anxiety: clampScore(anxiety),
      note: cleanNote && cleanNote.trim() ? cleanNote.trim() : null,
    })

    if (error) return NextResponse.json({ error: 'No se pudo guardar' }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
