import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN_PROD!

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { patientId, patientName, sessionId, amount, description } = await request.json()

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Monto inválido' }, { status: 400 })
  }

  try {
    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Crear registro de pago pendiente
    const { data: payment } = await admin.from('payments').insert({
      professional_id: user.id,
      patient_id: patientId,
      session_id: sessionId || null,
      amount,
      currency: 'UYU',
      status: 'pending',
      description: description || `Consulta - ${patientName}`,
    }).select().single()

    // Crear preference de MercadoPago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{
          title: description || `Consulta - ${patientName}`,
          quantity: 1,
          unit_price: amount,
          currency_id: 'UYU',
        }],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/honorarios?paid=${payment.id}`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/honorarios`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/honorarios`,
        },
        auto_return: 'approved',
        external_reference: payment.id,
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mp-webhook`,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return NextResponse.json({ error: data.message }, { status: 500 })
    }

    // Guardar preference id
    await admin.from('payments').update({
      mp_preference_id: data.id
    }).eq('id', payment.id)

    return NextResponse.json({ url: data.init_point, paymentId: payment.id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}