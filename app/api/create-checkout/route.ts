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
    const response = await fetch('https://api.mercadopago.com/preapproval_plan', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: 'NotaClínica Pro — Suscripción mensual',
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: 2000,
          currency_id: 'UYU',
        },
        back_url: 'https://notaclinica.vercel.app/dashboard?success=true',
      }),
    })

    const data = await response.json()
    console.log('MP Preapproval response:', JSON.stringify(data))

    if (!response.ok) {
      return NextResponse.json({ error: data.message, details: data }, { status: 500 })
    }

    return NextResponse.json({ url: data.init_point })
  } catch (error: any) {
    console.error('MercadoPago error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
