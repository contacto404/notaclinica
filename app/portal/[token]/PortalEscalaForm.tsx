'use client'

import { useState } from 'react'
import { SCALES, OPTIONS, SCALE_LIST, type ScaleId } from '@/lib/scales'

export default function PortalEscalaForm({ token }: { token: string }) {
  const [selected, setSelected] = useState<ScaleId | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [doneScales, setDoneScales] = useState<ScaleId[]>([])

  function pick(id: ScaleId) {
    setSelected(id)
    setAnswers(Array(SCALES[id].questions.length).fill(null))
    setError('')
  }

  const def = selected ? SCALES[selected] : null
  const answered = !!def && answers.every(a => a !== null)

  async function enviar() {
    if (!def || !answered) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/portal-escala', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, scale: def.id, answers }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setDoneScales(prev => [...prev, def.id])
      setSelected(null)
      setAnswers([])
    } catch (e: any) {
      setError(e.message || 'No se pudo enviar.')
    }
    setLoading(false)
  }

  const pending = SCALE_LIST.filter(s => !doneScales.includes(s.id))

  // Todas completadas
  if (pending.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 text-center mb-4">
        <div className="w-12 h-12 rounded-full bg-[#E8F4E8] flex items-center justify-center text-2xl mx-auto mb-3">✓</div>
        <p className="text-base font-bold text-[#0F172A] mb-1">¡Gracias!</p>
        <p className="text-sm text-[#64748B]">Tus cuestionarios llegaron a tu profesional.</p>
      </div>
    )
  }

  // Respondiendo una escala
  if (def) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 mb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] text-[#64748B] uppercase tracking-widest">{def.name} · {def.topic}</p>
          <button onClick={() => { setSelected(null); setError('') }} className="text-xs text-[#94A3B8] hover:text-[#64748B] cursor-pointer">Volver</button>
        </div>
        <p className="text-sm text-[#64748B] mb-5">{def.intro}</p>

        <div className="flex flex-col gap-5">
          {def.questions.map((q, qi) => (
            <div key={qi}>
              <p className="text-sm text-[#0F172A] mb-2">
                <span className="text-[#94A3B8] font-medium">{qi + 1}.</span> {q}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {OPTIONS.map(opt => {
                  const active = answers[qi] === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAnswers(prev => prev.map((a, i) => (i === qi ? opt.value : a)))}
                      className={
                        'text-left text-xs rounded-xl px-3 py-2 border transition-colors cursor-pointer ' +
                        (active
                          ? 'bg-[#2563EB] text-white border-[#2563EB]'
                          : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#E2E8F0]')
                      }
                    >
                      <span className={'font-bold mr-1 ' + (active ? 'text-white' : 'text-[#94A3B8]')}>{opt.value}</span>
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button onClick={enviar} disabled={!answered || loading}
            className="bg-[#2563EB] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#1D4ED8] disabled:opacity-60 transition-colors">
            {loading ? 'Enviando…' : answered ? 'Enviar cuestionario' : `Respondé las ${def.questions.length} preguntas`}
          </button>
        </div>
      </div>
    )
  }

  // Selección de escala
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 mb-4">
      <p className="text-[11px] text-[#64748B] uppercase tracking-widest mb-1">Cuestionarios</p>
      <p className="text-sm text-[#64748B] mb-4">Ayudá a tu profesional a seguir tu evolución. Toma 2 minutos.</p>
      <div className="flex flex-col gap-2">
        {pending.map(s => (
          <button key={s.id} onClick={() => pick(s.id)}
            className="flex items-center justify-between border border-[#E2E8F0] rounded-xl px-4 py-3 text-left hover:border-[#2563EB] transition-colors cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">{s.topic}</p>
              <p className="text-xs text-[#64748B]">{s.name} · {s.questions.length} preguntas</p>
            </div>
            <span className="text-[#94A3B8]">›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
