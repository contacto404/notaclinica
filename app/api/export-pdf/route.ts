import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  if (!sessionId) return NextResponse.json({ error: 'No sessionId' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No auth' }, { status: 401 })

  const { data: session } = await supabase
    .from('sessions')
    .select('*, patients(*), transcriptions(*), summaries(*)')
    .eq('id', sessionId)
    .single()

  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Obtener perfil del profesional
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: profile } = await admin
    .from('profiles')
    .select('professional_name, identification, title, full_name')
    .eq('id', user.id)
    .single()

  const patient = session.patients
  const summary = session.summaries
  const transcription = session.transcriptions

  const fechaDoc = new Date(session.session_date).toLocaleDateString('es-UY', {
    timeZone: 'America/Montevideo',
    day: '2-digit', month: 'long', year: 'numeric'
  })

  const fechaFirma = new Date().toLocaleDateString('es-UY', {
    timeZone: 'America/Montevideo',
    day: '2-digit', month: 'long', year: 'numeric'
  })

  // Construir bloque de firma
  const nombreProfesional = profile?.professional_name || profile?.full_name || user.email
  const firmaLineas = [
    nombreProfesional,
    profile?.title || null,
    profile?.identification ? `ID: ${profile.identification}` : null,
    `Fecha: ${fechaFirma}`
  ].filter(Boolean).join('<br>')

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #1a1a1a; }
  .header { border-bottom: 2px solid #185FA5; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
  .logo { font-size: 20px; font-weight: bold; color: #185FA5; }
  .title { font-size: 16px; color: #555; margin-top: 4px; }
  .patient-name { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
  .patient-meta { font-size: 14px; color: #666; margin-bottom: 24px; }
  .section { margin-bottom: 20px; }
  .section-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
  .section-content { font-size: 14px; line-height: 1.6; background: #f5f5f3; padding: 12px; border-radius: 6px; }
  .transcription { font-size: 13px; line-height: 1.7; color: #444; border-left: 3px solid #185FA5; padding-left: 16px; }
  .firma-section { margin-top: 48px; padding-top: 24px; border-top: 1px solid #ddd; }
  .firma-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
  .firma-linea { border-bottom: 1px solid #333; width: 280px; height: 40px; margin-bottom: 8px; }
  .firma-datos { font-size: 13px; color: #333; line-height: 1.8; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #aaa; text-align: center; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">NotaClínica</div>
      <div class="title">Resumen de sesion clinica</div>
    </div>
  </div>

  <div class="patient-name">${patient?.full_name ?? 'Paciente'}</div>
  <div class="patient-meta">
    Diagnostico: ${patient?.diagnosis ?? 'No especificado'} &nbsp;·&nbsp;
    Fecha: ${fechaDoc}
  </div>

  ${summary ? `
  <div class="section">
    <div class="section-label">Motivo de consulta</div>
    <div class="section-content">${summary.chief_complaint ?? '-'}</div>
  </div>
  <div class="section">
    <div class="section-label">Observaciones clinicas</div>
    <div class="section-content">${summary.observations ?? '-'}</div>
  </div>
  <div class="section">
    <div class="section-label">Plan terapeutico</div>
    <div class="section-content">${summary.plan ?? '-'}</div>
  </div>
  <div class="section">
    <div class="section-label">Proximos pasos</div>
    <div class="section-content">${summary.next_steps ?? '-'}</div>
  </div>
  ` : ''}

  ${transcription ? `
  <div class="section">
    <div class="section-label">Transcripcion de la sesion</div>
    <div class="transcription">${transcription.content ?? '-'}</div>
  </div>
  ` : ''}

  <div class="firma-section">
    <div class="firma-label">Firma del profesional</div>
    <div class="firma-linea"></div>
    <div class="firma-datos">${firmaLineas}</div>
  </div>

  <div class="footer">Generado por NotaClinica &nbsp;·&nbsp; ${fechaFirma}</div>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    }
  })
}