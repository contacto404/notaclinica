'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function HistorialPage() {
  const params = useParams()
  const patientId = params.id as string
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([])
  const [loading, setLoading] = useState(false)

  async function handleAsk() {
    if (!question.trim() || loading) return
    const q = question.trim()
    setQuestion('')
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setLoading(true)
    try {
      const res = await fetch('/api/historial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, question: q })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.answer }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Hubo un error al consultar el historial.' }])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-5 md:p-8 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">

        <div className="mb-6">
          <a href={"/dashboard/pacientes/" + patientId} className="text-xs text-[#6E6E73] hover:text-[#0A0A0A] transition-colors font-medium">
            ← Volver al paciente
          </a>
        </div>

        <div className="mb-6">
          <p className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest mb-1">Historial</p>
          <h1 className="text-2xl font-bold text-[#0A0A0A]">Consultar con IA</h1>
          <p className="text-sm text-[#6E6E73] mt-1">Preguntá sobre el historial clínico del paciente.</p>
        </div>

        <div className="flex flex-col gap-3 mb-4 flex-1 overflow-y-auto">
          {messages.length === 0 && (
            <div className="bg-white rounded-3xl border border-[#EDEDED] p-5">
              <p className="text-xs font-semibold text-[#6E6E73] uppercase tracking-widest mb-3">Ejemplos de preguntas</p>
              <ul className="flex flex-col gap-2">
                {[
                  '¿Cuánto tomaba de clonazepam hace 3 meses?',
                  '¿Cuál fue el motivo de consulta en la última sesión?',
                  '¿Hubo cambios en el plan terapéutico este año?',
                  '¿Qué observaciones se hicieron sobre el sueño?'
                ].map(ex => (
                  <li key={ex}
                    onClick={() => setQuestion(ex)}
                    className="text-sm text-[#6E6E73] cursor-pointer hover:text-[#0A0A0A] transition-colors flex items-start gap-2">
                    <span className="text-[#0A0A0A] mt-0.5">›</span> {ex}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`rounded-2xl px-4 py-3 text-sm ${
              m.role === 'user'
                ? 'bg-[#0A0A0A] text-white self-end max-w-xs ml-auto'
                : 'bg-white border border-[#EDEDED] text-[#0A0A0A]'
            }`}>
              {m.role === 'ai' && <p className="text-xs text-[#6E6E73] mb-1 font-medium uppercase tracking-widest">IA</p>}
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          ))}

          {loading && (
            <div className="bg-white border border-[#EDEDED] rounded-2xl px-4 py-3">
              <p className="text-xs text-[#6E6E73] mb-2 font-medium uppercase tracking-widest">IA</p>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#0A0A0A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#0A0A0A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#0A0A0A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 items-end">
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk() } }}
            placeholder="Preguntá algo sobre el historial..."
            rows={2}
            className="flex-1 border border-[#EDEDED] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] resize-none bg-white text-[#0A0A0A] placeholder-[#A3A3A3]"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="bg-[#0A0A0A] text-white px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-[#262626] disabled:opacity-50 transition-colors shrink-0"
          >
            Preguntar
          </button>
        </div>

      </div>
    </div>
  )
}