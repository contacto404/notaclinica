'use client'

import { useState } from 'react'

export default function CopilotoCard({ patientId }: { patientId: string }) {
  const [loading, setLoading] = useState(false)
  const [insight, setInsight] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function analizar() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setInsight(data.insight)
    } catch (e: any) {
      setError(e.message || 'No se pudo generar el análisis.')
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 border border-[#E2E8F0]">
      <div className="flex items-center justify-between gap-3 mb-1">
        <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">🤖 Copiloto clínico</h2>
        {(insight || error) && (
          <button onClick={analizar} disabled={loading}
            className="text-xs text-[#2563EB] hover:underline font-medium disabled:opacity-50">
            {loading ? 'Analizando…' : 'Volver a analizar'}
          </button>
        )}
      </div>

      {!insight && !error && (
        <>
          <p className="text-sm text-[#64748B] mb-4">Análisis del historial y las escalas con IA: patrones, alertas y posibles próximos pasos.</p>
          <button onClick={analizar} disabled={loading}
            className="bg-[#2563EB] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1D4ED8] disabled:opacity-60 transition-colors">
            {loading ? 'Analizando…' : 'Analizar con IA'}
          </button>
        </>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {insight && (
        <div className="bg-[#F8FAFC] rounded-xl p-4 mt-3">
          <p className="text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap">{insight}</p>
          <p className="text-[11px] text-[#94A3B8] mt-3">Herramienta de apoyo a la decisión. No reemplaza el criterio profesional.</p>
        </div>
      )}
    </div>
  )
}
