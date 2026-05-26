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
    <div className="p-5 md:p-7 max-w-2xl flex flex-col h-screen md:h-auto">
      <div className="mb-5">
        <a href={"/dashboard/pacientes/" + patientId} className="text-sm text-gray-500 hover:text-gray-700">← Volver al paciente</a>
      </div>
      <h1 className="text-xl font-medium text-gray-900 mb-2">Consultar historial con IA</h1>
      <p className="text-sm text-gray-500 mb-6">Hacé preguntas sobre el historial clínico del paciente y la IA buscará en las sesiones registradas.</p>

      <div className="flex flex-col gap-3 mb-6 flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
            <p className="font-medium text-gray-700 mb-2">Ejemplos de preguntas:</p>
            <ul className="flex flex-col gap-1">
              <li>• ¿Cuánto tomaba de clonazepam hace 3 meses?</li>
              <li>• ¿Cuál fue el motivo de consulta en la última sesión?</li>
              <li>• ¿Hubo cambios en el plan terapéutico este año?</li>
              <li>• ¿Qué observaciones se hicieron sobre el sueño?</li>
            </ul>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`rounded-xl px-4 py-3 text-sm ${m.role === 'user' ? 'bg-blue-600 text-white self-end max-w-xs ml-auto' : 'bg-white border border-gray-200 text-gray-900'}`}>
            {m.role === 'ai' && <p className="text-xs text-gray-400 mb-1 font-medium">IA</p>}
            <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
          </div>
        ))}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-400 mb-1 font-medium">IA</p>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 shrink-0"
        >
          Preguntar
        </button>
      </div>
    </div>
  )
}