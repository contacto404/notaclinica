'use client'
import { useState } from 'react'

const EJEMPLOS: Record<string, { label: string; text: string }[]> = {
  'Psicología': [
    { label: 'Motivo', text: 'Seguimiento de ansiedad e insomnio.' },
    { label: 'Observaciones', text: 'Refiere mejor descanso y menor rumiación; buena adherencia a las pautas.' },
    { label: 'Impresión', text: 'Cuadro ansioso en evolución favorable, con buena respuesta al abordaje.' },
    { label: 'Plan', text: 'Continuar reestructuración cognitiva y reforzar higiene del sueño.' },
  ],
  'Medicina clínica': [
    { label: 'Motivo', text: 'Control de hipertensión arterial.' },
    { label: 'Hallazgos', text: 'TA 135/85. Buena tolerancia a la medicación, sin efectos adversos.' },
    { label: 'Plan', text: 'Mantener tratamiento; control domiciliario de presión y laboratorio en 30 días.' },
  ],
  'Pediatría': [
    { label: 'Motivo', text: 'Control de niño sano (2 años).' },
    { label: 'Evaluación', text: 'Peso y talla en percentiles esperados; desarrollo acorde a la edad.' },
    { label: 'Indicaciones', text: 'Continuar esquema de vacunación y pautas de alimentación. Próximo control en 3 meses.' },
  ],
  'Nutrición': [
    { label: 'Motivo', text: 'Plan de descenso de peso.' },
    { label: 'Evaluación', text: 'Adhesión parcial al plan; mejora en hidratación y tamaño de porciones.' },
    { label: 'Plan', text: 'Ajustar distribución de macronutrientes y registro alimentario semanal.' },
  ],
  'Psiquiatría': [
    { label: 'Motivo', text: 'Seguimiento de episodio depresivo.' },
    { label: 'Estado mental', text: 'Ánimo levemente bajo, sin ideación; sueño y apetito en recuperación.' },
    { label: 'Plan', text: 'Mantener medicación y reevaluar dosis en 4 semanas.' },
  ],
}

export default function EspecialidadesDemo() {
  const keys = Object.keys(EJEMPLOS)
  const [sel, setSel] = useState(keys[0])
  return (
    <div>
      <div className="flex flex-wrap gap-2.5 mb-8">
        {keys.map(k => (
          <button
            key={k}
            onClick={() => setSel(k)}
            className={
              'text-sm rounded-full px-4 py-2 border transition-colors cursor-pointer ' +
              (sel === k
                ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                : 'bg-white text-[#525252] border-[#E5E5E5] hover:border-[#0A0A0A]')
            }
          >
            {k}
          </button>
        ))}
      </div>

      <div className="bg-[#FAFAFA] rounded-3xl border border-[#EDEDED] p-6 sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B6B6B] mb-4 font-semibold">Resumen clínico · {sel}</p>
        <div className="flex flex-col gap-3 min-h-[340px] md:min-h-[280px]">
          {EJEMPLOS[sel].map(f => (
            <div key={f.label} className="bg-white rounded-r-xl border-l-2 border-[#0A0A0A] px-4 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#A3A3A3] mb-1">{f.label}</p>
              <p className="text-sm text-[#0A0A0A] leading-snug">{f.text}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#A3A3A3] mt-4">Ejemplo ilustrativo. La estructura se adapta a cada especialidad.</p>
      </div>
    </div>
  )
}
