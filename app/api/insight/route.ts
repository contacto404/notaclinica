import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { patientId } = await request.json()
    if (!patientId) return NextResponse.json({ error: 'Falta patientId' }, { status: 400 })

    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verificar que el paciente sea del profesional
    const { data: patient } = await admin
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .eq('professional_id', user.id)
      .single()
    if (!patient) return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 403 })

    // Últimas sesiones con resumen
    const { data: sesiones } = await admin
      .from('sessions')
      .select('session_date, summaries(chief_complaint, observations, plan, next_steps)')
      .eq('patient_id', patientId)
      .eq('professional_id', user.id)
      .order('session_date', { ascending: true })
      .limit(8)

    // Escalas
    const { data: escalas } = await admin
      .from('scale_assessments')
      .select('scale, score, severity, assessed_at')
      .eq('patient_id', patientId)
      .eq('professional_id', user.id)
      .order('assessed_at', { ascending: true })

    const historial = (sesiones ?? [])
      .filter((s: any) => s.summaries)
      .map((s: any) => {
        const f = new Date(s.session_date).toLocaleDateString('es-UY')
        const sum = s.summaries
        return `Sesión ${f}: Motivo: ${sum.chief_complaint ?? '-'} | Observaciones: ${sum.observations ?? '-'} | Plan: ${sum.plan ?? '-'} | Próximos pasos: ${sum.next_steps ?? '-'}`
      }).join('\n')

    const escalasTexto = (escalas ?? [])
      .map((e: any) => `${e.scale.toUpperCase()} (${new Date(e.assessed_at).toLocaleDateString('es-UY')}): ${e.score} – ${e.severity}`)
      .join('\n')

    if (!historial && !escalasTexto) {
      return NextResponse.json({ insight: 'Todavía no hay suficientes datos (sesiones con resumen o escalas) para generar un análisis.' })
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `Sos un asistente clínico que apoya a un profesional de la salud. NO reemplazás su criterio: solo señalás patrones y posibles alertas para que el profesional decida.

PACIENTE: ${patient.full_name}
Diagnóstico: ${patient.diagnosis ?? 'No registrado'}
Medicación: ${patient.medication ?? 'No registrada'}

HISTORIAL DE SESIONES (cronológico):
${historial || 'Sin resúmenes registrados.'}

ESCALAS DE EVALUACIÓN (cronológico):
${escalasTexto || 'Sin escalas registradas.'}

Generá un análisis BREVE (máximo 150 palabras) para el profesional, en español, con estas tres partes claramente separadas:
1. PATRONES: evolución y temas recurrentes que se observan.
2. ALERTAS: señales de deterioro, riesgo o posible abandono (si las hay; si no, decilo).
3. SUGERENCIAS: posibles próximos pasos a considerar.

Sé concreto y clínico. Recordá que es una herramienta de apoyo, no un diagnóstico definitivo.`
      }]
    })

    const content = message.content[0]
    const insight = content.type === 'text' ? content.text : 'No se pudo generar el análisis.'
    return NextResponse.json({ insight })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const maxDuration = 30
