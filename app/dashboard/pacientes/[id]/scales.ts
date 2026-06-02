// Definición de escalas de evaluación psicológica: PHQ-9 (depresión) y GAD-7 (ansiedad).
// Datos + scoring puros, reutilizables por cualquier componente.

export type ScaleId = 'phq9' | 'gad7'

export type SeverityKey =
  | 'minimo'
  | 'leve'
  | 'moderado'
  | 'moderado_severo'
  | 'severo'

export interface Severity {
  key: SeverityKey
  label: string
  /** Color sólido para barras del gráfico */
  bar: string
  /** Clases Tailwind para el pill de interpretación */
  pill: string
}

export interface ScaleDef {
  id: ScaleId
  name: string
  topic: string
  /** Enunciado que precede a las preguntas */
  intro: string
  questions: string[]
  max: number
  severity: (score: number) => Severity
}

// Opciones de frecuencia comunes a ambas escalas (últimas 2 semanas)
export const OPTIONS = [
  { value: 0, label: 'Nunca' },
  { value: 1, label: 'Varios días' },
  { value: 2, label: 'Más de la mitad de los días' },
  { value: 3, label: 'Casi todos los días' },
]

const SEVERITY: Record<SeverityKey, Severity> = {
  minimo:          { key: 'minimo',          label: 'Mínimo',           bar: '#16A34A', pill: 'bg-green-100 text-green-700' },
  leve:            { key: 'leve',            label: 'Leve',             bar: '#D97706', pill: 'bg-amber-100 text-amber-700' },
  moderado:        { key: 'moderado',        label: 'Moderado',         bar: '#EA580C', pill: 'bg-orange-100 text-orange-700' },
  moderado_severo: { key: 'moderado_severo', label: 'Moderado-severo',  bar: '#DC2626', pill: 'bg-red-100 text-red-600' },
  severo:          { key: 'severo',          label: 'Severo',           bar: '#B91C1C', pill: 'bg-red-100 text-red-700' },
}

const INTRO =
  'Durante las últimas 2 semanas, ¿con qué frecuencia le han molestado los siguientes problemas?'

export const SCALES: Record<ScaleId, ScaleDef> = {
  phq9: {
    id: 'phq9',
    name: 'PHQ-9',
    topic: 'Depresión',
    intro: INTRO,
    max: 27,
    questions: [
      'Poco interés o placer en hacer las cosas',
      'Se ha sentido decaído/a, deprimido/a o sin esperanzas',
      'Problemas para dormir, o dormir demasiado',
      'Se ha sentido cansado/a o con poca energía',
      'Falta de apetito o comer en exceso',
      'Se ha sentido mal con usted mismo/a, o que es un fracaso, o que ha quedado mal con su familia',
      'Dificultad para concentrarse en cosas, como leer o ver televisión',
      'Se ha movido o hablado tan lento que otras personas podrían notarlo; o lo contrario, ha estado tan inquieto/a que se movía mucho más de lo habitual',
      'Pensamientos de que estaría mejor muerto/a, o de hacerse daño de algún modo',
    ],
    severity: (s) => {
      if (s <= 4) return SEVERITY.minimo
      if (s <= 9) return SEVERITY.leve
      if (s <= 14) return SEVERITY.moderado
      if (s <= 19) return SEVERITY.moderado_severo
      return SEVERITY.severo
    },
  },
  gad7: {
    id: 'gad7',
    name: 'GAD-7',
    topic: 'Ansiedad',
    intro: INTRO,
    max: 21,
    questions: [
      'Sentirse nervioso/a, ansioso/a o muy alterado/a',
      'No poder dejar de preocuparse o controlar la preocupación',
      'Preocuparse demasiado por diferentes cosas',
      'Dificultad para relajarse',
      'Estar tan inquieto/a que es difícil quedarse quieto/a',
      'Molestarse o irritarse fácilmente',
      'Sentir miedo, como si algo terrible fuera a pasar',
    ],
    severity: (s) => {
      if (s <= 4) return SEVERITY.minimo
      if (s <= 9) return SEVERITY.leve
      if (s <= 14) return SEVERITY.moderado
      return SEVERITY.severo
    },
  },
}

export const SCALE_LIST: ScaleDef[] = [SCALES.phq9, SCALES.gad7]
