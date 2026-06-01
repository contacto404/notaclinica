import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

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
    contexto: `Sos un asistente clínico experto en psicología y salud mental. El médico es psicólogo/a o psiquiatra.
Enfocate en: estado emocional, patrones de pensamiento, vinculación terapéutica, evolución anímica, mecanismos de defensa, recursos del paciente y adherencia al tratamiento.`,
    campos: [
      { key: 'chief_complaint', label: 'Motivo de consulta' },
      { key: 'observations', label: 'Estado emocional y observaciones clínicas' },
      { key: 'plan', label: 'Plan terapéutico' },
      { key: 'next_steps', label: 'Próximos pasos' },
    ]
  },
  clinica: {
    contexto: `Sos un asistente clínico experto en medicina general. El médico es clínico/a.
Enfocate en: síntomas actuales, signos vitales mencionados, antecedentes relevantes, diagnóstico diferencial, indicaciones farmacológicas y no farmacológicas.`,
    campos: [
      { key: 'chief_complaint', label: 'Motivo de consulta' },
      { key: 'observations', label: 'Examen clínico y observaciones' },
      { key: 'plan', label: 'Plan de tratamiento' },
      { key: 'next_steps', label: 'Próximos pasos e indicaciones' },
    ]
  },
  pediatria: {
    contexto: `Sos un asistente clínico experto en pediatría. El médico es pediatra.
Enfocate en: edad y peso del niño si se menciona, desarrollo psicomotor, alimentación, vacunas, síntomas referidos por los padres, y recomendaciones para la familia.`,
    campos: [
      { key: 'chief_complaint', label: 'Motivo de consulta' },
      { key: 'observations', label: 'Evaluación pediátrica y observaciones' },
      { key: 'plan', label: 'Plan de tratamiento' },
      { key: 'next_steps', label: 'Indicaciones para los padres y próximos pasos' },
    ]
  },
  ginecologia: {
    contexto: `Sos un asistente clínico experto en ginecología y obstetricia.
Enfocate en: ciclo menstrual, síntomas ginecológicos, antecedentes obstétricos, métodos anticonceptivos, estudios indicados y seguimiento.`,
    campos: [
      { key: 'chief_complaint', label: 'Motivo de consulta' },
      { key: 'observations', label: 'Examen ginecológico y observaciones' },
      { key: 'plan', label: 'Plan de tratamiento' },
      { key: 'next_steps', label: 'Estudios y próximos pasos' },
    ]
  },
  traumatologia: {
    contexto: `Sos un asistente clínico experto en traumatología y ortopedia.
Enfocate en: zona afectada, mecanismo de lesión, dolor (EVA si se menciona), movilidad, estudios de imagen indicados, tratamiento conservador o quirúrgico y rehabilitación.`,
    campos: [
      { key: 'chief_complaint', label: 'Motivo de consulta y zona afectada' },
      { key: 'observations', label: 'Evalu