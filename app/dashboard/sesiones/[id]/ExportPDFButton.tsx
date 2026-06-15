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
        className="bg-[#0A0A0A] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#262626] transition-colors shadow-sm shrink-0 disabled:opacity-60"
      >
        {loading ? 'Generando...' : '⬇ Exportar PDF'}
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col">
          {/* Barra superior con safe area */}
          <div
            className="bg-white border-b border-[#EDEDED] flex items-center justify-between px-4"
            style={{ paddingTop: 'var(--safe-top)' }}
          >
            <div className="h-14 flex items-center">
              <span className="font-semibold text-[#0A0A0A] text-sm">Resumen clinico</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="h-14 flex items-center text-[#0A0A0A] font-medium text-sm"
            >
              ← Volver
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