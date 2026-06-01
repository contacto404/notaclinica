'use client'
import { useState } from 'react'

export default function ExportPDFButton({ sessionId }: { sessionId: string }) {
  const [loading, setLoading] = useState(false)
  const [html, setHtml] = useState('')
  const [open, setOpen] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const res = await fetch(`/api/export-pdf?sessionId=${sessionId}`)
      const text = await res.text()
      setHtml(text)
      setOpen(true)
    } catch (e) {
      alert('Error al exportar PDF')
    }
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={handleExport}
        disabled={loading}
        className="bg-[#2563EB] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition-colors shadow-sm shrink-0 disabled:opacity-60"
      >
        {loading ? 'Generando...' : '⬇ Exportar PDF'}
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] bg-white">
            <span className="font-semibold text-[#0F172A] text-sm">Resumen clínico</span>
            <button
              onClick={() => setOpen(false)}
              className="text-[#64748B] hover:text-[#0F172A] text-2xl leading-none px-2"
            >
              ×
            </button>
          </div>
          <iframe
            srcDoc={html}
            className="flex-1 w-full border-0"
            title="Resumen clinico"
          />
        </div>
      )}
    </>
  )
}