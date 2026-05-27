'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function ImportarHistorialButton({ patientId }: { patientId: string }) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function handleImport() {
    if (!file) return
    setLoading(true)
    setError('')
    const formData = new FormData()
    formData.append('pdf', file)
    formData.append('patientId', patientId)

    const res = await fetch('/api/importar-historial', { method: 'POST', body: formData })
    const data = await res.json()

    if (data.error) {
      setError(data.error)
    } else {
      setResult(data.extracted)
    }
    setLoading(false)
  }

  function handleDone() {
    setOpen(false)
    setFile(null)
    setResult(null)
    router.refresh()
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="border border-[#E0D0C0] text-[#6B4F3A] px-4 py-2 rounded-xl text-xs font-medium hover:bg-[#FBF7F4] flex items-center gap-1.5 transition-colors">
        📂 Importar historial
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-[#F0E8E0] shadow-xl">

            {!result ? (
              <>
                <h3 className="text-base font-bold text-[#2D1F14] mb-2">Importar historial anterior</h3>
                <p className="text-xs text-[#A08070] mb-5">Subí un PDF de otra app o sistema. La IA va a extraer diagnósticos, medicamentos y sesiones automáticamente.</p>

                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-[#F0E8E0] rounded-2xl p-8 text-center cursor-pointer hover:border-[#E8602C] transition-colors mb-4">
                  <p className="text-3xl mb-2">📄</p>
                  <p className="text-sm font-medium text-[#2D1F14]">
                    {file ? file.name : 'Tocá para seleccionar un PDF'}
                  </p>
                  <p className="text-xs text-[#A08070] mt-1">Solo archivos PDF</p>
                  <input ref={fileRef} type="file" accept=".pdf" className="hidden"
                    onChange={e => setFile(e.target.files?.[0] ?? null)} />
                </div>

                {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

                <div className="flex flex-col gap-2">
                  <button onClick={handleImport} disabled={!file || loading}
                    className="bg-[#E8602C] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#D04F1E] disabled:opacity-50 transition-colors">
                    {loading ? '🔄 Procesando con IA...' : '✨ Importar y extraer datos'}
                  </button>
                  <button onClick={() => setOpen(false)}
                    className="text-sm text-[#A08070] hover:text-[#2D1F14] py-2 transition-colors">
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-[#2D1F14] mb-1">✅ Historial importado</h3>
                <p className="text-xs text-[#A08070] mb-4">Se encontró y guardó la siguiente información:</p>

                <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
                  {result.resumen && (
                    <div className="bg-[#FBF7F4] rounded-2xl p-4">
                      <p className="text-xs text-[#A08070] font-medium uppercase tracking-widest mb-1">Resumen</p>
                      <p className="text-sm text-[#2D1F14]">{result.resumen}</p>
                    </div>
                  )}
                  {result.diagnosticos?.length > 0 && (
                    <div className="bg-[#FBF7F4] rounded-2xl p-4">
                      <p className="text-xs text-[#A08070] font-medium uppercase tracking-widest mb-1">Diagnósticos</p>
                      {result.diagnosticos.map((d: string, i: number) => (
                        <p key={i} className="text-sm text-[#2D1F14]">· {d}</p>
                      ))}
                    </div>
                  )}
                  {result.medicamentos?.length > 0 && (
                    <div className="bg-[#FBF7F4] rounded-2xl p-4">
                      <p className="text-xs text-[#A08070] font-medium uppercase tracking-widest mb-1">Medicamentos</p>
                      {result.medicamentos.map((m: any, i: number) => (
                        <p key={i} className="text-sm text-[#2D1F14]">· {m.nombre} {m.dosis} {m.frecuencia}</p>
                      ))}
                    </div>
                  )}
                  {result.sesiones?.length > 0 && (
                    <div className="bg-[#FBF7F4] rounded-2xl p-4">
                      <p className="text-xs text-[#A08070] font-medium uppercase tracking-widest mb-1">{result.sesiones.length} sesiones importadas</p>
                      {result.sesiones.slice(0, 3).map((s: any, i: number) => (
                        <p key={i} className="text-sm text-[#2D1F14]">· {s.fecha}: {s.notas?.slice(0, 60)}...</p>
                      ))}
                      {result.sesiones.length > 3 && (
                        <p className="text-xs text-[#A08070] mt-1">y {result.sesiones.length - 3} más...</p>
                      )}
                    </div>
                  )}
                </div>

                <button onClick={handleDone}
                  className="w-full mt-4 bg-[#E8602C] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#D04F1E] transition-colors">
                  Ver historial actualizado
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}