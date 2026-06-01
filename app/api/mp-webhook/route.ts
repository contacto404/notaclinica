import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN_PROD!

export async function POST(req: NextRequest) {
  const body = await req.json()

  const adminSupabase = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    if (body.type === 'payment') {
      const res = await fetch(`https://api.mercadopago.com/v1/payments/${body.data.id}`, {
        headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
      })
      const payment = await res.json()

      if (payment.status === 'approved') {
        // Verificar si es pago de sesion (tiene external_reference que es un UUID de payments)
        const externalRef = payment.external_reference

        // Intentar actualizar como pago de sesion primero
        const { data: sessionPayment } = await adminSupabase
          .from('payments')
          .select('id')
          .eq('id', externalRef)
          .single()

        if (sessionPayment) {
          // Es un pago de sesion
          await adminSupabase.from('payments').update({
            status: 'paid',
            mp_payment_id: String(payment.id),
            paid_at: new Date().toISOString(),
          }).eq('id', externalRef)
        } else {
          // Es un pago de suscripcion
          await adminSupabase.from('subscriptions').upsert({
            user_id: externalRef,
            status: 'active',
            mp_payment_id: String(payment.id),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' })
        }
      }
    }

    if (body.type === 'subscription_preapproval') {
      const res = await fetch(`https://api.mercadopago.com/preapproval/${body.data.id}`, {
        headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
      })
      const sub = await res.json()

      if (sub.status === 'authorized') {
        await adminSupabase.from('subscriptions').upsert({
          user_id: sub.external_reference,
          status: 'active',
          mp_payment_id: sub.id,
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
      }

      if (sub.status === 'cancelled' || sub.status === 'paused') {
        await adminSupabase.from('subscriptions')
          .update({ status: 'inactive', updated_at: new Date().toISOString() })
          .eq('user_id', sub.external_reference)
      }
    }
  } catch (error) {
    console.error('Webhook error:', error)
  }

  return NextResponse.json({ received: true })
}