'use client'
import { useState } from 'react'

export default function ExportPDFButton({ sessionId }: { sessionId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const res = await fetch(`/api/export-pdf?sessionId=${sessionId}`)
      const html = await res.text()
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (e) {
      alert('Error al exportar PDF')
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="bg-[#2563EB] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition-colors shadow-sm shrink-0 disabled:opacity-60"
    >
      {loading ? 'Generando...' : '⬇ Exportar PDF'}
    </button>
  )
}