import { NextResponse } from 'next/server'

// Stripe ya no se usa: el cobro se hace con MercadoPago.
// Esta ruta quedó desactivada. Podés borrar la carpeta app/api/stripe-webhook.
export async function POST() {
  return NextResponse.json({ error: 'Endpoint no disponible' }, { status: 410 })
}
