// Formato de notas clínicas: estándar (por defecto) o SOAP.
// Ambos guardan en las mismas 4 columnas de `summaries`; solo cambian las etiquetas.

export type NoteFormat = 'standard' | 'soap'

export type SummaryField = { key: 'chief_complaint' | 'observations' | 'plan' | 'next_steps'; label: string }

export function summaryFields(format?: string | null): SummaryField[] {
  if (format === 'soap') {
    return [
      { key: 'chief_complaint', label: 'Subjetivo' },
      { key: 'observations', label: 'Objetivo' },
      { key: 'plan', label: 'Análisis' },
      { key: 'next_steps', label: 'Plan' },
    ]
  }
  return [
    { key: 'chief_complaint', label: 'Motivo de consulta' },
    { key: 'observations', label: 'Observaciones' },
    { key: 'plan', label: 'Plan de tratamiento' },
    { key: 'next_steps', label: 'Próximos pasos' },
  ]
}

// Descripciones para el prompt de la IA según el formato.
export function summaryPromptFields(format?: string | null): { key: string; desc: string }[] {
  if (format === 'soap') {
    return [
      { key: 'chief_complaint', desc: 'SUBJETIVO: lo que relata el paciente, síntomas y motivo en sus palabras' },
      { key: 'observations', desc: 'OBJETIVO: hallazgos observables, signos, datos de la evaluación' },
      { key: 'plan', desc: 'ANÁLISIS: interpretación clínica, impresión diagnóstica, evolución' },
      { key: 'next_steps', desc: 'PLAN: conducta, tratamiento, indicaciones y próximos pasos' },
    ]
  }
  return [
    { key: 'chief_complaint', desc: 'motivo principal de consulta' },
    { key: 'observations', desc: 'observaciones clínicas según la especialidad' },
    { key: 'plan', desc: 'plan de tratamiento' },
    { key: 'next_steps', desc: 'próximos pasos concretos' },
  ]
}
