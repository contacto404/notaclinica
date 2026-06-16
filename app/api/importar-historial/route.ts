import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { checkAiQuota } from '@/lib/aiUsage'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No auth' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('pdf') as File
  const patientId = formData.get('patientId') as string

  if (!file || !patientId) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

  // Propiedad: el paciente debe ser del profesional
  const { data: ownsPatient } = await supabase
    .from('patients').select('id').eq('id', patientId).eq('professional_id', user.id).maybeSingle()
  if (!ownsPatient) return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 403 })

  if (!(await checkAiQuota(user.id))) {
    return NextResponse.json({ error: 'Alcanzaste el límite de IA por hoy. Probá mañana.' }, { status: 429 })
  }

  const bytes = await file.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
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
            text: `Analizá este documento y extraé cualquier información médica relevante. Respondé ÚNICAMENTE con un objeto JSON válido, sin ningún texto antes ni después, sin backticks, sin markdown.

Usá esta estructura (si no encontrás algo, usá array vacío o string vacío):
{"diagnosticos":[],"medicamentos":[],"sesiones":[],"indicaciones":"","resumen":""}`
          }
        ]
      }]
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({
        success: true,
        extracted: { diagnosticos: [], medicamentos: [], sesiones: [], indicaciones: '', resumen: 'No se encontró información estructurada en el documento.' }
      })
    }

    const extracted = JSON.parse(jsonMatch[0])

    if (extracted.sesiones && extracted.sesiones.length > 0) {
      for (const sesion of extracted.sesiones) {
        let fecha = new Date()
        if (sesion.fecha) {
          const parts = sesion.fecha.split('/')
          if (parts.length === 3) {
            fecha = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
            if (isNaN(fecha.getTime())) fecha = new Date()
          }
        }
        const { data: sessionData } = await supabase.from('sessions').insert({
          patient_id: patientId,
          professional_id: user.id,
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

  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Error procesando el PDF' }, { status: 500 })
  }
}