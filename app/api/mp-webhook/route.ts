import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createClient } from '@/lib/supabase/server'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN_PROD!,
})

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (body.type === 'payment') {
    try {
      const payment = new Payment(client)
      const data = await payment.get({ id: body.data.id })

      if (data.status === 'approved') {
        const userId = data.external_reference
        const supabase = await createClient()

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          status: 'active',
          mp_payment_id: String(data.id),
          current_period_end: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('Webhook error:', error)
    }
  }

  return NextResponse.json({ received: true })
}