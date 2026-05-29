import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reportId = searchParams.get('reportId')
  if (!reportId) return NextResponse.json({ error: 'No reportId' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No auth' }, { status: 401 })

  const { data: report } = await supabase
    .from('patient_reports')
    .select('*, patients(*)')
    .eq('id', reportId)
    .single()

  if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const patient = report.patients
  const medications = report.medications ?? []

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #1a1a1a; }
  .header { border-bottom: 2px solid #2563EB; padding-bottom: 16px; margin-bottom: 24px; }
  .logo { font-size: 20px; font-weight: bold; color: #2563EB; }
  .title { font-size: 14px; color: #888; margin-top: 4px; }
  .patient-name { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
  .patient-meta { font-size: 14px; color: #666; margin-bottom: 24px; }
  .section { margin-bottom: 20px; }
  .section-label { font-size: 11px; color: #64748B; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; font-weight: bold; }
  .section-content { font-size: 14px; line-height: 1.6; background: #F8FAFC; padding: 12px; border-radius: 8px; }
  .med-row { display: flex; flex-direction: column; padding: 10px 12px; background: #F8FAFC; border-radius: 8px; margin-bottom: 8px; }
  .med-name { font-weight: bold; font-size: 14px; }
  .med-detail { font-size: 13px; color: #666; margin-top: 2px; }
  .next-apt { background: #DBEAFE; padding: 14px; border-radius: 8px; font-size: 15px; font-weight: bold; color: #1E40AF; text-align: center; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #aaa; text-align: center; }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">NotaClínica</div>
    <div class="title">Resumen médico para el paciente</div>
  </div>

  <div class="patient-name">${patient?.full_name ?? 'Paciente'}</div>
  <div class="patient-meta">
    Fecha de emisión: ${new Date(report.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
  </div>

  ${report.diagnosis ? `
  <div class="section">
    <div class="section-label">Diagnóstico</div>
    <div class="section-content">${report.diagnosis}</div>
  </div>` : ''}

  ${medications.length > 0 ? `
  <div class="section">
    <div class="section-label">Medicamentos</div>
    ${medications.map((m: any) => `
      <div class="med-row">
        <div class="med-name">${m.name}</div>
        <div class="med-detail">${m.dose ? `Dosis: ${m.dose}` : ''} ${m.frequency ? `· ${m.frequency}` : ''}</div>
        ${m.notes ? `<div class="med-detail">${m.notes}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${report.instructions ? `
  <div class="section">
    <div class="section-label">Indicaciones generales</div>
    <div class="section-content">${report.instructions}</div>
  </div>` : ''}

  ${report.next_appointment ? `
  <div class="section">
    <div class="section-label">Próxima consulta</div>
    <div class="next-apt">📅 ${new Date(report.next_appointment).toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} a las ${new Date(report.next_appointment).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</div>
  </div>` : ''}

  <div class="footer">Generado por NotaClínica · ${new Date().toLocaleDateString('es-AR')}</div>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No auth' }, { status: 401 })

  const body = await request.json()
  const { patientId, sessionId, diagnosis, medications, instructions, nextAppointment } = body

  const { data: report, error } = await supabase
    .from('patient_reports')
    .insert({
      patient_id: patientId,
      professional_id: user.id,
      session_id: sessionId || null,
      diagnosis,
      medications,
      instructions,
      next_appointment: nextAppointment || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reportId: report.id })
}