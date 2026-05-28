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

  const desde = new Date()
  desde.setHours(desde.getHours() + 23)
  const hasta = new Date()
  hasta.setHours(hasta.getHours() + 25)

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, patients(*)')
    .gte('appointment_date', desde.toISOString())
    .lte('appointment_date', hasta.toISOString())

  if (!appointments || appointments.length === 0) {
    return NextResponse.json({ message: 'No hay turnos próximos' })
  }

  for (const apt of appointments) {
    const patient = apt.patients
    const fecha = new Date(apt.appointment_date).toLocaleDateString('es-AR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    })
    const hora = new Date(apt.appointment_date).toLocaleTimeString('es-AR', {
      hour: '2-digit', minute: '2-digit'
    })

    const phone = patient?.phone?.replace(/\D/g, '') ?? ''
    const mensaje = `Hola ${patient?.full_name}! Te recordamos que mañana tenés consulta médica el ${fecha} a las ${hora}. ¡Te esperamos!`
    const waLink = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`
      : null

    const { data: userData } = await supabase.auth.admin.getUserById(apt.professional_id)
    const emailProfesional = userData?.user?.email

    if (!emailProfesional) continue

    await resend.emails.send({
      from: 'NotaClínica <onboarding@resend.dev>',
      to: emailProfesional,
      subject: `Recordatorio: ${patient?.full_name} mañana a las ${hora}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #E8602C;">NotaClínica</h2>
          <p style="color: #2D1F14;">Tenés una consulta mañana:</p>
          <div style="background: #FDE8C8; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; font-weight: bold; color: #2D1F14; font-size: 18px;">${patient?.full_name}</p>
            <p style="margin: 4px 0 0; color: #8B4513;">${fecha} a las ${hora}</p>
            ${apt.notes ? `<p style="margin: 4px 0 0; color: #8B4513; font-size: 13px;">${apt.notes}</p>` : ''}
          </div>
          ${waLink ? `
          <a href="${waLink}" style="display: inline-block; background: #25D366; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 8px;">
            💬 Enviar recordatorio por WhatsApp
          </a>
          <p style="color: #A08070; font-size: 12px; margin-top: 8px;">Al tocar el botón se abre WhatsApp con el mensaje listo para enviar.</p>
          ` : '<p style="color: #A08070; font-size: 13px;">Este paciente no tiene teléfono registrado.</p>'}
        </div>
      `
    })
  }

  return NextResponse.json({ message: `${appointments.length} recordatorios enviados` })
}