import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No auth' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('pdf') as File
  const patientId = formData.get('patientId') as string

  if (!file || !patientId) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: base64 }
        },
        {
          type: 'text',
          text: `Analizá este historial clínico y extraé la información en formato JSON. Respondé SOLO con el JSON, sin texto adicional ni backticks.

El JSON debe tener esta estructura:
{
  "diagnosticos": ["lista de diagnósticos encontrados"],
  "medicamentos": [{"nombre": "", "dosis": "", "frecuencia": ""}],
  "sesiones": [{"fecha": "DD/MM/YYYY", "notas": "resumen de la sesión"}],
  "indicaciones": "indicaciones generales encontradas",
  "resumen": "resumen general del historial en 2-3 oraciones"
}`
        }
      ]
    }]
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  try {
    const extracted = JSON.parse(text)

    // Guardar sesiones importadas en Supabase
    if (extracted.sesiones && extracted.sesiones.length > 0) {
      for (const sesion of extracted.sesiones) {
        let fecha = new Date()
        if (sesion.fecha) {
          const parts = sesion.fecha.split('/')
          if (parts.length === 3) {
            fecha = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
          }
        }
        const { data: sessionData } = await supabase.from('sessions').insert({
          patient_id: patientId,
          status: 'summarized',
          session_date: fecha.toISOString(),
        }).select().single()

        if (sessionData && sesion.notas) {
          await supabase.from('summaries').insert({
            session_id: sessionData.id,
            chief_complaint: 'Importado de historial anterior',
            observations: sesion.notas,
            plan: extracted.indicaciones ?? '',
            next_steps: '',
          })
        }
      }
    }

    return NextResponse.json({ success: true, extracted })
  } catch {
    return NextResponse.json({ error: 'No se pudo procesar el PDF' }, { status: 500 })
  }
}