import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkAiQuota } from '@/lib/aiUsage'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { patientId, question } = await request.json()
  if (!patientId || typeof question !== 'string' || !question.trim()) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }
  const pregunta = question.trim().slice(0, 1000)

  // Propiedad: el paciente debe ser del profesional logueado
  const { data: patient } = await supabase
    .from('patients')
    .select('full_name, diagnosis, notes')
    .eq('id', patientId)
    .eq('professional_id', user.id)
    .maybeSingle()
  if (!patient) return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 403 })

  if (!(await checkAiQuota(user.id))) {
    return NextResponse.json({ error: 'Alcanzaste el límite de consultas con IA por hoy. Probá de nuevo mañana.' }, { status: 429 })
  }

  const { data: sessions } = await supabase
    .from('sessions')
    .select('session_date, status, transcriptions(content), summaries(chief_complaint, observations, plan, next_steps)')
    .eq('patient_id', patientId)
    .eq('professional_id', user.id)
    .order('session_date', { ascending: false })

  if (!sessions || sessions.length === 0) {
    return NextResponse.json({ answer: 'No hay sesiones registradas para este paciente todavía.' })
  }

  const context = sessions.map((s: any) => {
    const date = new Date(s.session_date).toLocaleDateString('es-UY', { day: '2-digit', month: 'long', year: 'numeric' })
    const transcription = s.transcriptions?.content ?? ''
    const summary = s.summaries
      ? `Motivo: ${s.summaries.chief_complaint ?? '-'}\nObservaciones: ${s.summaries.observations ?? '-'}\nPlan: ${s.summaries.plan ?? '-'}\nPróximos pasos: ${s.summaries.next_steps ?? '-'}`
      : ''
    return `--- Sesión del ${date} ---\n${summary}\n${transcription ? 'Transcripción: ' + transcription : ''}`
  }).join('\n\n')

  const systemPrompt = `Sos un asistente clínico que ayuda a profesionales de salud mental a consultar el historial de sus pacientes. 
Tenés acceso al historial completo de sesiones del paciente ${patient?.full_name} (diagnóstico: ${patient?.diagnosis ?? 'no especificado'}).
Respondé de forma clara, precisa y basada únicamente en la información del historial. Si no encontrás la información, decilo claramente.
No inventes datos. Hablá en español rioplatense.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Historial del paciente:\n\n${context}\n\nPregunta: ${pregunta}`
          }
        ]
      })
    })

    const data = await response.json()
    const answer = data.content?.[0]?.text ?? 'No se pudo obtener una respuesta.'
    return NextResponse.json({ answer })
  } catch {
    return NextResponse.json({ error: 'No se pudo consultar el historial. Probá de nuevo.' }, { status: 502 })
  }
}