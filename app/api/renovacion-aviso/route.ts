import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Buscar suscripciones que vencen en exactamente 3 días
  const desde = new Date()
  desde.setDate(desde.getDate() + 3)
  desde.setHours(0, 0, 0, 0)

  const hasta = new Date()
  hasta.setDate(hasta.getDate() + 3)
  hasta.setHours(23, 59, 59, 999)

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('status', 'active')
    .gte('current_period_end', desde.toISOString())
    .lte('current_period_end', hasta.toISOString())

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ message: 'No hay suscripciones por renovar' })
  }

  for (const sub of subscriptions) {
    const { data: userData } = await supabase.auth.admin.getUserById(sub.user_id)
    const email = userData?.user?.email
    const nombre = userData?.user?.user_metadata?.full_name ?? 'Doctor/a'

    if (!email) continue

    const fechaRenovacion = new Date(sub.current_period_end).toLocaleDateString('es-UY', {
      day: 'numeric', month: 'long', year: 'numeric'
    })

    await resend.emails.send({
      from: 'NotaClínica <onboarding@resend.dev>',
      to: email,
      subject: 'Tu suscripción se renueva en 3 días',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #2563EB;">NotaClínica</h2>
          <p style="color: #0F172A;">Hola ${nombre},</p>
          <p style="color: #475569;">Te avisamos que tu suscripción se renueva automáticamente en <strong>3 días</strong>.</p>
          <div style="background: #DBEAFE; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; color: #1E40AF; font-weight: bold;">📅 Fecha de renovación: ${fechaRenovacion}</p>
            <p style="margin: 8px 0 0; color: #1E40AF;">💳 Monto: $49 USD</p>
          </div>
          <p style="color: #475569; font-size: 14px;">El cobro se realizará automáticamente a través de MercadoPago. No necesitás hacer nada.</p>
          <p style="color: #475569; font-size: 14px;">Si querés cancelar tu suscripción antes de la renovación, podés hacerlo desde <strong>Mi cuenta</strong> en la app.</p>
          <a href="https://notaclinica.vercel.app/dashboard/cuenta" style="display: inline-block; background: #2563EB; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 8px;">
            Ir a Mi cuenta
          </a>
          <p style="color: #94A3B8; font-size: 12px; margin-top: 24px;">NotaClínica · Sortiplan SA · Uruguay</p>
        </div>
      `
    })
  }

  return NextResponse.json({ message: `${subscriptions.length} avisos enviados` })
}