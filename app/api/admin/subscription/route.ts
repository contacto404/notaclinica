import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'decrebruno123@gmail.com'

export async function POST(request: NextRequest) {
  // Solo el admin puede tocar suscripciones
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { user_id, action, days } = await request.json()
  if (!user_id || !['activate', 'cancel'].includes(action)) {
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
  }

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (action === 'activate') {
    const d = Number(days) > 0 ? Number(days) : 30
    const periodEnd = new Date(Date.now() + d * 24 * 60 * 60 * 1000).toISOString()
    const { error } = await admin.from('subscriptions').upsert({
      user_id,
      status: 'active',
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, status: 'active', current_period_end: periodEnd })
  }

  // cancel
  const { error } = await admin.from('subscriptions')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('user_id', user_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, status: 'cancelled' })
}
