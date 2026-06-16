import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { summaryPromptFields } from '@/lib/noteFormat'
import { checkAiQuota } from '@/lib/aiUsage'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const especialidades: Record<string, {
  contexto: string
  campos: { key: string; label: string }[]
}> = {
  psicologia: {
    contexto: `Sos un asistente clinico experto en psicologia y salud mental. El medico es psicologo/a o psiquiatra.
Enfocate en: estado emocional, patrones de pensamiento, vinculacion terapeutica, evolucion animica, mecanismos de defensa, recursos del paciente y adherencia al tratamiento.`,
    campos: [
      { key: 'chief_complaint', label: 'Motivo de consulta' },
      { key: 'observations', label: 'Estado emocional y observaciones clinicas' },
      { key: 'plan', label: 'Plan terapeutico' },
      { key: 'next_steps', label: 'Proximos pasos' },
    ]
  },
  clinica: {
    contexto: `Sos un asistente clinico experto en medicina general. El medico es clinico/a.
Enfocate en: sintomas actuales, signos vitales mencionados, antecedentes relevantes, diagnostico diferencial, indicaciones farmacologicas y no farmacologicas.`,
    campos: [
      { key: 'chief_complaint', label: 'Motivo de consulta' },
      { key: 'observations', label: 'Examen clinico y observaciones' },
      { key: 'plan', label: 'Plan de tratamiento' },
      { key: 'next_steps', label: 'Proximos pasos e indicaciones' },
    ]
  },
  pediatria: {
    contexto: `Sos un asistente clinico experto en pediatria. El medico es pediatra.
Enfocate en: edad y peso del nino si se menciona, desarrollo psicomotor, alimentacion, vacunas, sintomas referidos por los padres, y recomendaciones para la familia.`,
    campos: [
      { key: 'chief_complaint', label: 'Motivo de consulta' },
      { key: 'observations', label: 'Evaluacion pediatrica y observaciones' },
      { key: 'plan', label: 'Plan de tratamiento' },
      { key: 'next_steps', label: 'Indicaciones para los padres y proximos pasos' },
    ]
  },
  ginecologia: {
    contexto: `Sos un asistente clinico experto en ginecologia y obstetricia.
Enfocate en: ciclo menstrual, sintomas ginecologicos, antecedentes obstetricos, metodos anticonceptivos, estudios indicados y seguimiento.`,
    campos: [
      { key: 'chief_complaint', label: 'Motivo de consulta' },
      { key: 'observations', label: 'Examen ginecologico y observaciones' },
      { key: 'plan', label: 'Plan de tratamiento' },
      { key: 'next_steps', label: 'Estudios y proximos pasos' },
    ]
  },
  traumatologia: {
    contexto: `Sos un asistente clinico experto en traumatologia y ortopedia.
Enfocate en: zona afectada, mecanismo de lesion, dolor (EVA si se menciona), movilidad, estudios de imagen indicados, tratamiento conservador o quirurgico y rehabilitacion.`,
    campos: [
      { key: 'chief_complaint', label: 'Motivo de consulta y zona afectada' },
      { key: 'observations', label: 'Evaluacion traumatologica' },
      { key: 'plan', label: 'Plan de tratamiento' },
      { key: 'next_steps', label: 'Rehabilitacion y proximos pasos' },
    ]
  },
  dermatologia: {
    contexto: `Sos un asistente clinico experto en dermatologia.
Enfocate en: descripcion de lesiones, localizacion, tiempo de evolucion, factores desencadenantes, tratamiento topico o sistemico indicado y seguimiento.`,
    campos: [
      { key: 'chief_complaint', label: 'Motivo de consulta' },
      { key: 'observations', label: 'Descripcion de lesiones y evaluacion dermatologica' },
      { key: 'plan', label: 'Plan de tratamiento' },
      { key: 'next_steps', label: 'Cuidados y proximos pasos' },
    ]
  },
  nutricion: {
    contexto: `Sos un asistente clinico experto en nutricion y dietetica.
Enfocate en: peso actual y objetivo si se mencionan, habitos alimentarios, actividad fisica, plan alimentario indicado, suplementacion y adherencia.`,
    campos: [
      { key: 'chief_complaint', label: 'Motivo de consulta' },
      { key: 'observations', label: 'Evaluacion nutricional y habitos' },
      { key: 'plan', label: 'Plan alimentario y tratamiento' },
      { key: 'next_steps', label: 'Metas y proximos pasos' },
    ]
  },
  kinesiologia: {
    contexto: `Sos un asistente clinico experto en kinesiologia y fisioterapia.
Enfocate en: zona de tratamiento, evaluacion funcional, tecnicas aplicadas, ejercicios indicados, evolucion y objetivos de rehabilitacion.`,
    campos: [
      { key: 'chief_complaint', label: 'Motivo de consulta' },
      { key: 'observations', label: 'Evaluacion kinesiologica' },
      { key: 'plan', label: 'Plan de rehabilitacion' },
      { key: 'next_steps', label: 'Ejercicios y proximos pasos' },
    ]
  },
  general: {
    contexto: `Sos un asistente clinico experto. Analiza la transcripcion y genera un resumen clinico preciso desde la perspectiva del medico.`,
    campos: [
      { key: 'chief_complaint', label: 'Motivo de consulta' },
      { key: 'observations', label: 'Observaciones clinicas' },
      { key: 'plan', label: 'Plan de tratamiento' },
      { key: 'next_steps', label: 'Proximos pasos' },
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    // Autenticación: solo usuarios logueados
    const authClient = await createServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    if (!(await checkAiQuota(user.id))) {
      return NextResponse.json({ error: 'Alcanzaste el límite de IA por hoy. Probá mañana.' }, { status: 429 })
    }

    const { transcription, patientName, diagnosis, patientId } = await request.json()
    const professionalId = user.id // derivado del usuario autenticado, nunca del body

    // Verificar que el paciente pertenezca al profesional
    if (patientId) {
      const { data: ownsPatient } = await supabase
        .from('patients').select('id')
        .eq('id', patientId).eq('professional_id', user.id).single()
      if (!ownsPatient) return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 403 })
    }

    // Obtener especialidad y formato de nota del medico
    let specialty = 'general'
    let noteFormat: 'standard' | 'soap' = 'standard'
    if (professionalId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('specialty, note_format')
        .eq('id', professionalId)
        .single()
      if (profile?.specialty) specialty = profile.specialty
      if (profile?.note_format === 'soap') noteFormat = 'soap'
    }

    const jsonStructure = '{\n' +
      summaryPromptFields(noteFormat).map(f => `  "${f.key}": "${f.desc}"`).join(',\n') +
      '\n}'

    const template = especialidades[specialty] ?? especialidades.general

    // Historial de sesiones anteriores
    let historialTexto = ''
    if (patientId) {
      const { data: sesionesAnteriores } = await supabase
        .from('sessions')
        .select(`session_date, summaries (chief_complaint, observations, plan, next_steps)`)
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
            return `SESION ${fecha}:
- Motivo: ${sum.chief_complaint}
- Observaciones: ${sum.observations}
- Plan: ${sum.plan}
- Proximos pasos: ${sum.next_steps}`
          })
          .join('\n\n')
      }
    }

    const historialSection = historialTexto
      ? `\nHISTORIAL DE SESIONES ANTERIORES (del mas antiguo al mas reciente):\n${historialTexto}\n`
      : ''

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `${template.contexto}

CONTEXTO:
- Paciente: ${patientName}
- Diagnostico previo: ${diagnosis || 'No especificado'}
- Especialidad: ${specialty}
${historialSection}
INSTRUCCIONES:
La transcripcion contiene el dialogo entre DOS personas: el medico y el paciente. No estan etiquetados explicitamente.
- El MEDICO hace preguntas clinicas, evalua sintomas, propone tratamientos y da indicaciones
- El PACIENTE describe sus sintomas, responde preguntas y relata su experiencia

Analiza el dialogo completo considerando ambos roles para generar un resumen clinico preciso desde la perspectiva del medico.

TRANSCRIPCION DE LA SESION DE HOY:
${transcription}

${historialTexto ? 'Considera la evolucion del paciente respecto a las sesiones anteriores.' : ''}

Responde SOLO con un JSON con esta estructura exacta, sin texto adicional:
${jsonStructure}`
      }]
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Respuesta invalida')

    const clean = content.text.replace(/```json|```/g, '').trim()
    const summary = JSON.parse(clean)

    // Diálogo separado por hablante (aislado: si falla, el resumen igual se devuelve).
    let dialogue: { speaker: 'profesional' | 'paciente'; text: string }[] = []
    try {
      const dialogueMsg = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 8192,
        messages: [{
          role: 'user',
          content: `Separá esta transcripción de una consulta clínica en turnos de diálogo entre el PROFESIONAL y el PACIENTE.
- El PROFESIONAL hace preguntas clínicas, evalúa síntomas, propone tratamientos y da indicaciones.
- El PACIENTE describe sus síntomas, responde y relata su experiencia.
Reglas: no inventes ni resumas; usá el texto real, solo segmentado y atribuido al hablante. Si hay dudas, hacé tu mejor estimación. Agrupá frases consecutivas del mismo hablante en un solo turno.

TRANSCRIPCION:
${transcription}

Respondé SOLO con un JSON array, sin texto adicional:
[{"speaker":"profesional","text":"..."},{"speaker":"paciente","text":"..."}]`
        }]
      })
      const dContent = dialogueMsg.content[0]
      if (dContent.type === 'text') {
        const dClean = dContent.text.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(dClean)
        if (Array.isArray(parsed)) {
          dialogue = parsed
            .filter((t: any) => t && typeof t.text === 'string')
            .map((t: any) => ({
              speaker: t.speaker === 'paciente' ? 'paciente' : 'profesional',
              text: String(t.text),
            }))
        }
      }
    } catch {
      dialogue = []
    }

    return NextResponse.json({ ...summary, format: noteFormat, dialogue })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}