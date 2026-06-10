'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  patientId: string
  patientName: string
}

export default function RecetaButton({ patientId, patientName }: Props) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerar() {
    if (!content.trim()) { setError('Escribí las indicaciones.'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Sesión expirada.'); setLoading(false); return }

    const { data, error: err } = await supabase
      .from('prescriptions')
      .insert({ professional_id: user.id, patient_id: patientId, content: content.trim() })
      .select('id')
      .single()

    if (err || !data) { setError('No se pudo generar. Intentá de nuevo.'); setLoading(false); return }

    window.open(`/api/receta?id=${data.id}`, '_blank')
    setLoading(false)
    setOpen(false)
    setContent('')
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="border border-[#E2E8F0] text-[#475569] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors">
        📝 Receta
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="mb-4">
              <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-widest mb-0.5">Receta / Indicaciones</p>
              <h2 className="text-lg font-bold text-[#0F172A]">{patientName}</h2>
            </div>

            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={7}
              autoFocus
              placeholder={"Indicaciones para el paciente…\n\nEj:\n- Sertralina 50mg, 1 por día por la mañana\n- Control en 3 semanas\n- Ejercicios de respiración antes de dormir"}
              className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC] resize-none"
            />

            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

            <p className="text-[11px] text-[#94A3B8] mt-2">Se genera un PDF con tu firma y un QR de validación.</p>

            <div className="flex gap-2 mt-4">
              <button onClick={() => setOpen(false)}
                className="flex-1 border border-[#E2E8F0] text-[#475569] rounded-xl py-2.5 text-sm font-medium hover:bg-[#F8FAFC] transition-colors">
                Cancelar
              </button>
              <button onClick={handleGenerar} disabled={loading}
                className="flex-1 bg-[#2563EB] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#1D4ED8] disabled:opacity-60 transition-colors">
                {loading ? 'Generando…' : 'Generar receta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
