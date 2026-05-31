import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { createClient } from '@/lib/supabase/server'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN_PROD!,
})

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const preference = new Preference(client)

    const response = await preference.create({
      body: {
        items: [{
          id: 'notaclinica-pro',
          title: 'NotaClínica Pro — Suscripción mensual',
          quantity: 1,
          unit_price: 49,
          currency_id: 'USD',
        }],
        payer: { email: user.email },
        back_urls: {
          success: 'https://notaclinica.vercel.app/dashboard?success=true',
          failure: 'https://notaclinica.vercel.app/suscripcion?error=true',
          pending: 'https://notaclinica.vercel.app/suscripcion?pending=true',
        },
        auto_return: 'approved',
        external_reference: user.id,
        notification_url: 'https://notaclinica.vercel.app/api/mp-webhook',
      },
    })

    return NextResponse.json({ url: response.init_point })
  } catch (error: any) {
    console.error('MercadoPago error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
