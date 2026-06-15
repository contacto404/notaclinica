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
    <div className="bg-white rounded-2xl p-5 mb-4 border border-[#EDEDED]">
      <div className="flex items-center justify-between gap-3 mb-1">
        <h2 className="text-xs font-semibold text-[#6E6E73] uppercase tracking-widest">🤖 Copiloto clínico</h2>
        {(insight || error) && (
          <button onClick={analizar} disabled={loading}
            className="text-xs text-[#0A0A0A] hover:underline font-medium disabled:opacity-50">
            {loading ? 'Analizando…' : 'Volver a analizar'}
          </button>
        )}
      </div>

      {!insight && !error && (
        <>
          <p className="text-sm text-[#6E6E73] mb-4">Análisis del historial y las escalas con IA: patrones, alertas y posibles próximos pasos.</p>
          <button onClick={analizar} disabled={loading}
            className="bg-[#0A0A0A] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#262626] disabled:opacity-60 transition-colors">
            {loading ? 'Analizando…' : 'Analizar con IA'}
          </button>
        </>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {insight && (
        <div className="bg-[#F5F5F7] rounded-xl p-4 mt-3">
          <p className="text-sm text-[#0A0A0A] leading-relaxed whitespace-pre-wrap">{insight}</p>
          <p className="text-[11px] text-[#A3A3A3] mt-3">Herramienta de apoyo a la decisión. No reemplaza el criterio profesional.</p>
        </div>
      )}
    </div>
  )
}
