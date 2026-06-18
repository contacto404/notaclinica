'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function GenerarResumenButton({ session, patientName, diagnosis, patientId }: {
  session: any
  patientName: string
  diagnosis: string | null
  patientId: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function generar(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return
    setError('')
    const text = session.transcriptions?.[0]?.content
    if (!text) { setError('Sin transcripción'); return }
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription: text, patientName, diagnosis, patientId, professionalId: user?.id }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const { dialogue, ...summaryData } = data
      await supabase.from('summaries').insert({ session_id: session.id, ...summaryData })
      if (dialogue && dialogue.length > 0) {
        await supabase.from('transcriptions').update({ dialogue }).eq('session_id', session.id)
      }
      await supabase.from('sessions').update({ status: 'summarized' }).eq('id', session.id)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error')
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={generar}
      disabled={loading}
      className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md shrink-0 bg-[#0A0A0A] text-white hover:bg-[#262626] disabled:opacity-60 transition-colors"
      title={error || 'Generar el resumen con IA'}
    >
      {loading ? 'Generando…' : error ? 'Reintentar' : 'Generar resumen'}
    </button>
  )
}
