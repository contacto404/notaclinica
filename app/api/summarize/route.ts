import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { transcription, patientName, diagnosis } = await request.json()

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Sos un asistente clínico. Analizá la siguiente transcripción de una consulta médica y generá un resumen clínico estructurado.

Paciente: ${patientName}
Diagnóstico previo: ${diagnosis || 'No especificado'}

Transcripción:
${transcription}

Respondé SOLO con un JSON con esta estructura exacta, sin texto adicional:
{
  "chief_complaint": "motivo principal de consulta en una oración",
  "observations": "observaciones clínicas relevantes de la consulta",
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