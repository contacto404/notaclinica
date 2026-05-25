import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

  const patient = session.patients
  const summary = session.summaries
  const transcription = session.transcriptions

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #1a1a1a; }
  .header { border-bottom: 2px solid #185FA5; padding-bottom: 16px; margin-bottom: 24px; }
  .logo { font-size: 20px; font-weight: bold; color: #185FA5; }
  .title { font-size: 16px; color: #555; margin-top: 4px; }
  .patient-name { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
  .patient-meta { font-size: 14px; color: #666; margin-bottom: 24px; }
  .section { margin-bottom: 20px; }
  .section-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
  .section-content { font-size: 14px; line-height: 1.6; background: #f5f5f3; padding: 12px; border-radius: 6px; }
  .transcription { font-size: 13px; line-height: 1.7; color: #444; border-left: 3px solid #185FA5; padding-left: 16px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #aaa; text-align: center; }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">NotaClínica</div>
    <div class="title">Resumen de sesión clínica</div>
  </div>
  <div class="patient-name">${patient?.full_name ?? 'Paciente'}</div>
  <div class="patient-meta">
    Diagnóstico: ${patient?.diagnosis ?? 'No especificado'} &nbsp;·&nbsp;
    Fecha: ${new Date(session.session_date).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
  </div>
  ${summary ? `
  <div class="section">
    <div class="section-label">Motivo de consulta</div>
    <div class="section-content">${summary.chief_complaint ?? '-'}</div>
  </div>
  <div class="section">
    <div class="section-label">Observaciones clínicas</div>
    <div class="section-content">${summary.observations ?? '-'}</div>
  </div>
  <div class="section">
    <div class="section-label">Plan terapéutico</div>
    <div class="section-content">${summary.plan ?? '-'}</div>
  </div>
  <div class="section">
    <div class="section-label">Próximos pasos</div>
    <div class="section-content">${summary.next_steps ?? '-'}</div>
  </div>
  ` : ''}
  ${transcription ? `
  <div class="section">
    <div class="section-label">Transcripción de la sesión</div>
    <div class="transcription">${transcription.content ?? '-'}</div>
  </div>
  ` : ''}
  <div class="footer">Generado por NotaClínica · ${new Date().toLocaleDateString('es-AR')}</div>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    }
  })
}
