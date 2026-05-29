import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { transcription, patientName, diagnosis, patientId } = await request.json()

    // Traer las últimas 5 sesiones con resumen del paciente
    let historialTexto = ''
    if (patientId) {
      const { data: sesionesAnteriores } = await supabase
        .from('sessions')
        .select(`
          session_date,
          summaries (chief_complaint, observations, plan, next_steps)
        `)
        .eq('patient_id', patientId)
        .eq('status', 'complete')
        .order('session_date', { ascending: false })
        .limit(5)

      if (sesionesAnteriores && sesionesAnteriores.length > 0) {
        const sesiones = sesionesAnteriores.reverse()
        historialTexto = sesiones
          .filter((s: any) => s.summaries)
          .map((s: any) => {
            const fecha = new Date(s.session_date).toLocaleDateString('es-UY')
            const sum = s.summaries
            return `SESIÓN ${fecha}:
- Motivo: ${sum.chief_complaint}
- Observaciones: ${sum.observations}
- Plan: ${sum.plan}
- Próximos pasos: ${sum.next_steps}`
          })
          .join('\n\n')
      }
    }

    const historialSection = historialTexto
      ? `\nHISTORIAL DE SESIONES ANTERIORES (del más antiguo al más reciente):\n${historialTexto}\n`
      : ''

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Sos un asistente clínico. Analizá la siguiente transcripción de una consulta médica y generá un resumen clínico estructurado.

Paciente: ${patientName}
Diagnóstico previo: ${diagnosis || 'No especificado'}
${historialSection}
TRANSCRIPCIÓN DE LA SESIÓN DE HOY:
${transcription}

${historialTexto ? 'Considerá la evolución del paciente respecto a las sesiones anteriores. Si hay continuidad temática, cambios relevantes o patrones que se mantienen, mencionálos en las observaciones.' : ''}

Respondé SOLO con un JSON con esta estructura exacta, sin texto adicional:
{
  "chief_complaint": "motivo principal de consulta en una oración",
  "observations": "observaciones clínicas relevantes, incluyendo evolución respecto a sesiones anteriores si corresponde",
  "plan": "plan de tratamiento sugerido",
  "next_steps": "próximos pasos concretos"
}`
      }]
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Respuesta inválida')

    const clean = content.text.replace(/```json|```/g, '').trim()
    const summary = JSON.parse(clean)

    return NextResponse.json(summary)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}