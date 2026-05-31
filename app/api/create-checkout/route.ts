import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN_PROD!

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const response = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: 'NotaClínica Pro — Suscripción mensual',
        external_reference: user.id,
        payer_email: user.email,
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: 49,
          currency_id: 'USD',
        },
        back_url: 'https://notaclinica.vercel.app/dashboard?success=true',
        notification_url: 'https://notaclinica.vercel.app/api/mp-webhook',
        status: 'pending',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error creando suscripción')
    }

    return NextResponse.json({ url: data.init_point })
  } catch (error: any) {
    console.error('MercadoPago error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}