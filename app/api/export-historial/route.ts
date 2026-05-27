import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const patientId = searchParams.get('patientId')
  if (!patientId) return NextResponse.json({ error: 'No patientId' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No auth' }, { status: 401 })

  const { data: patient } = await supabase
    .from('patients').select('*').eq('id', patientId).eq('professional_id', user.id).single()
  if (!patient) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: sessions } = await supabase
    .from('sessions').select('*, transcriptions(*), summaries(*)')
    .eq('patient_id', patientId).eq('status', 'summarized')
    .order('session_date', { ascending: false })

  const sesionesHTML = (sessions ?? []).map(s => {
    const sum = s.summaries
    const tra = s.transcriptions
    return `
    <div class="sesion">
      <div class="sesion-fecha">${new Date(s.session_date).toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</div>
      ${sum ? `
        <div class="campo"><div class="campo-label">Motivo de consulta</div><div class="campo-valor">${sum.chief_complaint ?? '-'}</div></div>
        <div class="campo"><div class="campo-label">Observaciones</div><div class="campo-valor">${sum.observations ?? '-'}</div></div>
        <div class="campo"><div class="campo-label">Plan terapéutico</div><div class="campo-valor">${sum.plan ?? '-'}</div></div>
        <div class="campo"><div class="campo-label">Próximos pasos</div><div class="campo-valor">${sum.next_steps ?? '-'}</div></div>
      ` : ''}
      ${tra ? `<div class="transcripcion"><div class="campo-label">Transcripción</div><p>${tra.content ?? ''}</p></div>` : ''}
    </div>`
  }).join('<hr class="divisor">')

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #1a1a1a; font-size: 13px; }
  .header { border-bottom: 2px solid #E8602C; padding-bottom: 16px; margin-bottom: 24px; }
  .logo { font-size: 18px; font-weight: bold; color: #E8602C; }
  .titulo { font-size: 13px; color: #888; margin-top: 2px; }
  .paciente-nombre { font-size: 22px; font-weight: bold; margin-bottom: 4px; color: #2D1F14; }
  .paciente-meta { font-size: 13px; color: #A08070; margin-bottom: 8px; }
  .total { font-size: 12px; color: #A08070; margin-bottom: 28px; }
  .sesion { margin-bottom: 20px; }
  .sesion-fecha { font-size: 14px; font-weight: bold; color: #E8602C; margin-bottom: 10px; }
  .campo { background: #FBF7F4; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; }
  .campo-label { font-size: 10px; color: #A08070; text-transform: uppercase; letter-spacing: 0.08em; font-weight: bold; margin-bottom: 4px; }
  .campo-valor { font-size: 13px; color: #2D1F14; line-height: 1.5; }
  .transcripcion { border-left: 3px solid #E8602C; padding-left: 12px; margin-top: 8px; color: #6B4F3A; line-height: 1.6; }
  .divisor { border: none; border-top: 1px solid #F0E8E0; margin: 24px 0; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; font-size: 11px; color: #aaa; text-align: center; }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">NotaClínica</div>
    <div class="titulo">Historial clínico completo</div>
  </div>
  <div class="paciente-nombre">${patient.full_name}</div>
  <div class="paciente-meta">Diagnóstico: ${patient.diagnosis ?? 'No especificado'}${patient.phone ? ` · ${patient.phone}` : ''}</div>
  <div class="total">${sessions?.length ?? 0} sesiones registradas · Exportado el ${new Date().toLocaleDateString('es-AR')}</div>
  ${sesionesHTML || '<p style="color:#A08070">No hay sesiones completadas.</p>'}
  <div class="footer">Generado por NotaClínica · ${new Date().toLocaleDateString('es-AR')}</div>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })
}