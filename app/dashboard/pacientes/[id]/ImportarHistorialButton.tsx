'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { IconDownload, IconFileText, IconSparkles, IconCheck } from '../../components/Icons'

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
        className="border border-[#EDEDED] text-[#6E6E73] px-4 py-2 rounded-xl text-xs font-medium hover:bg-[#F5F5F7] flex items-center gap-1.5 transition-colors">
        <IconDownload className="w-3.5 h-3.5" /> Importar historial
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-lg border border-[#EDEDED] shadow-xl">

            {!result ? (
              <>
                <h3 className="text-base font-bold text-[#0A0A0A] mb-2">Importar historial anterior</h3>
                <p className="text-xs text-[#6E6E73] mb-5">Subí un PDF de otra app o sistema. La IA va a extraer diagnósticos, medicamentos y sesiones automáticamente.</p>

                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-[#EDEDED] rounded-2xl p-8 text-center cursor-pointer hover:border-[#0A0A0A] transition-colors mb-4">
                  <IconFileText className="w-8 h-8 mx-auto mb-2 text-[#A3A3A3]" />
                  <p className="text-sm font-medium text-[#0A0A0A]">
                    {file ? file.name : 'Tocá para seleccionar un PDF'}
                  </p>
                  <p className="text-xs text-[#6E6E73] mt-1">Solo archivos PDF</p>
                  <input ref={fileRef} type="file" accept=".pdf" className="hidden"
                    onChange={e => setFile(e.target.files?.[0] ?? null)} />
                </div>

                {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

                <div className="flex flex-col gap-2">
                  <button onClick={handleImport} disabled={!file || loading}
                    className="bg-[#0A0A0A] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#262626] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                    {loading ? 'Procesando con IA...' : <><IconSparkles className="w-4 h-4" /> Importar y extraer datos</>}
                  </button>
                  <button onClick={() => setOpen(false)}
                    className="text-sm text-[#6E6E73] hover:text-[#0A0A0A] py-2 transition-colors">
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-[#0A0A0A] mb-1 flex items-center gap-2"><IconCheck className="w-5 h-5" /> Historial importado</h3>
                <p className="text-xs text-[#6E6E73] mb-4">Se encontró y guardó la siguiente información:</p>

                <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
                  {result.resumen && (
                    <div className="bg-[#F5F5F7] rounded-2xl p-4">
                      <p className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest mb-1">Resumen</p>
                      <p className="text-sm text-[#0A0A0A]">{result.resumen}</p>
                    </div>
                  )}
                  {result.diagnosticos?.length > 0 && (
                    <div className="bg-[#F5F5F7] rounded-2xl p-4">
                      <p className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest mb-1">Diagnósticos</p>
                      {result.diagnosticos.map((d: string, i: number) => (
                        <p key={i} className="text-sm text-[#0A0A0A]">· {d}</p>
                      ))}
                    </div>
                  )}
                  {result.medicamentos?.length > 0 && (
                    <div className="bg-[#F5F5F7] rounded-2xl p-4">
                      <p className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest mb-1">Medicamentos</p>
                      {result.medicamentos.map((m: any, i: number) => (
                        <p key={i} className="text-sm text-[#0A0A0A]">· {m.nombre} {m.dosis} {m.frecuencia}</p>
                      ))}
                    </div>
                  )}
                  {result.sesiones?.length > 0 && (
                    <div className="bg-[#F5F5F7] rounded-2xl p-4">
                      <p className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest mb-1">{result.sesiones.length} sesiones importadas</p>
                      {result.sesiones.slice(0, 3).map((s: any, i: number) => (
                        <p key={i} className="text-sm text-[#0A0A0A]">· {s.fecha}: {s.notas?.slice(0, 60)}...</p>
                      ))}
                      {result.sesiones.length > 3 && (
                        <p className="text-xs text-[#6E6E73] mt-1">y {result.sesiones.length - 3} más...</p>
                      )}
                    </div>
                  )}
                </div>

                <button onClick={handleDone}
                  className="w-full mt-4 bg-[#0A0A0A] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#262626] transition-colors">
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