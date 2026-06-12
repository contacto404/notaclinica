import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

function esc(s: string | null | undefined): string {
  return (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'No id' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No auth' }, { status: 401 })

  // RLS asegura que solo el dueño lea su receta
  const { data: receta } = await supabase
    .from('prescriptions')
    .select('*, patients(full_name, diagnosis)')
    .eq('id', id)
    .single()

  if (!receta || receta.professional_id !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: profile } = await admin
    .from('profiles')
    .select('professional_name, identification, title, full_name, signature_url')
    .eq('id', user.id)
    .single()

  const fecha = new Date(receta.created_at).toLocaleDateString('es-UY', {
    timeZone: 'America/Montevideo', day: '2-digit', month: 'long', year: 'numeric'
  })

  const nombreProfesional = profile?.professional_name || profile?.full_name || user.email
  const firmaLineas = [
    nombreProfesional,
    profile?.title || null,
    profile?.identification ? `ID: ${profile.identification}` : null,
  ].filter(Boolean).map(esc).join('<br>')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://notaclinica.vercel.app'
  const verifyUrl = `${appUrl}/verificar/${receta.id}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&margin=0&data=${encodeURIComponent(verifyUrl)}`

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #1a1a1a; }
  .header { border-bottom: 2px solid #0A0A0A; padding-bottom: 16px; margin-bottom: 24px; }
  .logo { font-size: 20px; font-weight: bold; color: #0A0A0A; }
  .title { font-size: 15px; color: #555; margin-top: 4px; }
  .patient-name { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
  .patient-meta { font-size: 14px; color: #666; margin-bottom: 28px; }
  .section-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
  .indicaciones { font-size: 15px; line-height: 1.8; white-space: pre-wrap; background: #f5f7fa; padding: 18px; border-radius: 8px; min-height: 120px; }
  .bottom { margin-top: 48px; display: flex; justify-content: space-between; align-items: flex-end; }
  .firma-linea { border-bottom: 1px solid #333; width: 260px; height: 40px; margin-bottom: 8px; }
  .firma-img { display: block; max-height: 70px; max-width: 260px; object-fit: contain; margin-bottom: 4px; }
  .firma-datos { font-size: 13px; color: #333; line-height: 1.7; }
  .qr { text-align: center; font-size: 10px; color: #999; }
  .qr img { display: block; margin-bottom: 4px; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 11px; color: #aaa; text-align: center; }
  @media print { body { margin: 24px; } }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">NotaClínica</div>
    <div class="title">Indicaciones / Receta</div>
  </div>

  <div class="patient-name">${esc(receta.patients?.full_name) || 'Paciente'}</div>
  <div class="patient-meta">
    ${receta.patients?.diagnosis ? 'Diagnóstico: ' + esc(receta.patients.diagnosis) + ' &nbsp;·&nbsp; ' : ''}Fecha: ${fecha}
  </div>

  <div class="section-label">Indicaciones</div>
  <div class="indicaciones">${esc(receta.content)}</div>

  <div class="bottom">
    <div>
      ${profile?.signature_url
        ? `<img class="firma-img" src="${profile.signature_url}" alt="Firma" />`
        : `<div class="firma-linea"></div>`}
      <div class="firma-datos">${firmaLineas}<br>Fecha: ${fecha}</div>
    </div>
    <div class="qr">
      <img src="${qrUrl}" width="110" height="110" alt="QR de validación" />
      Validar autenticidad
    </div>
  </div>

  <div class="footer">Generado por NotaClínica &nbsp;·&nbsp; Escaneá el QR para verificar la autenticidad de este documento</div>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })
}
