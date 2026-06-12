import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const MIN_AHORRADOS_POR_SESION = 8

function esc(s: string | null | undefined): string {
  return (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No auth' }, { status: 401 })

  const ahora = new Date()
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  const hace60dias = new Date(ahora.getTime() - 60 * 24 * 60 * 60 * 1000)

  const [{ data: sessions }, { data: payments }] = await Promise.all([
    supabase.from('sessions').select('session_date, status, patient_id').eq('professional_id', user.id),
    supabase.from('payments').select('amount, status, created_at').eq('professional_id', user.id),
  ])

  const ses = sessions ?? []
  const pays = payments ?? []
  const completadas = ses.filter(s => s.status === 'summarized' || s.status === 'signed' || s.status === 'complete')

  const sesionesMes = completadas.filter(s => new Date(s.session_date) >= inicioMes).length
  const pacientesActivos = new Set(
    completadas.filter(s => new Date(s.session_date) >= hace60dias).map(s => s.patient_id)
  ).size
  const cobradoMes = pays
    .filter(p => p.status === 'paid' && new Date(p.created_at) >= inicioMes)
    .reduce((s, p) => s + (p.amount ?? 0), 0)

  const minutosMes = sesionesMes * MIN_AHORRADOS_POR_SESION
  const horasMes = Math.round((minutosMes / 60) * 10) / 10
  const consultasEquivalentes = Math.round(minutosMes / 30)
  const mesLabel = ahora.toLocaleDateString('es-UY', { month: 'long', year: 'numeric' })

  // Datos del profesional para el encabezado
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: profile } = await admin
    .from('profiles')
    .select('professional_name, full_name')
    .eq('id', user.id)
    .single()
  const nombreProfesional = profile?.professional_name || profile?.full_name || user.email

  const kpis = [
    { label: 'Horas ahorradas en documentación', value: `${horasMes} h` },
    { label: 'Sesiones documentadas con IA', value: String(sesionesMes) },
    { label: 'Pacientes activos (60 días)', value: String(pacientesActivos) },
    { label: 'Cobrado este mes (UYU)', value: `$${cobradoMes.toLocaleString('es-UY')}` },
  ]

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #1a1a1a; }
  .header { border-bottom: 2px solid #0A0A0A; padding-bottom: 16px; margin-bottom: 28px; }
  .logo { font-size: 20px; font-weight: bold; color: #0A0A0A; }
  .title { font-size: 15px; color: #555; margin-top: 4px; }
  .meta { font-size: 13px; color: #666; margin-bottom: 28px; }
  .hero { background: #0A0A0A; color: #fff; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
  .hero-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #9A9A9A; margin-bottom: 8px; }
  .hero-value { font-size: 34px; font-weight: bold; margin-bottom: 8px; }
  .hero-desc { font-size: 13px; color: #CCCCCC; line-height: 1.6; }
  .grid { width: 100%; border-collapse: separate; border-spacing: 10px; margin-bottom: 20px; }
  .kpi { background: #F5F5F5; border-radius: 10px; padding: 16px; width: 50%; }
  .kpi-label { font-size: 12px; color: #666; margin-bottom: 8px; }
  .kpi-value { font-size: 26px; font-weight: bold; color: #0A0A0A; }
  .note { font-size: 11px; color: #999; line-height: 1.6; margin-top: 8px; }
  .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #eee; font-size: 11px; color: #aaa; text-align: center; }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">NotaClínica</div>
    <div class="title">Reporte mensual de eficiencia</div>
  </div>

  <div class="meta">
    Profesional: ${esc(nombreProfesional)} &nbsp;·&nbsp; Período: <span style="text-transform:capitalize">${mesLabel}</span>
  </div>

  <div class="hero">
    <div class="hero-label">Tiempo recuperado este mes</div>
    <div class="hero-value">${horasMes} horas</div>
    <div class="hero-desc">${sesionesMes > 0
      ? `Equivale a ${consultasEquivalentes} consultas de 30 minutos dedicadas a pacientes en lugar de al papeleo.`
      : 'Sin sesiones documentadas este mes todavía.'}</div>
  </div>

  <table class="grid">
    <tr>
      <td class="kpi"><div class="kpi-label">${kpis[0].label}</div><div class="kpi-value">${kpis[0].value}</div></td>
      <td class="kpi"><div class="kpi-label">${kpis[1].label}</div><div class="kpi-value">${kpis[1].value}</div></td>
    </tr>
    <tr>
      <td class="kpi"><div class="kpi-label">${kpis[2].label}</div><div class="kpi-value">${kpis[2].value}</div></td>
      <td class="kpi"><div class="kpi-label">${kpis[3].label}</div><div class="kpi-value">${kpis[3].value}</div></td>
    </tr>
  </table>

  <div class="note">
    Cálculo basado en un ahorro estimado de ${MIN_AHORRADOS_POR_SESION} minutos por sesión documentada con IA
    (de ~10 a ~2 minutos por historia clínica).
  </div>

  <div class="footer">Generado por NotaClínica &nbsp;·&nbsp; ${ahora.toLocaleDateString('es-UY', { timeZone: 'America/Montevideo', day: '2-digit', month: 'long', year: 'numeric' })}</div>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })
}
