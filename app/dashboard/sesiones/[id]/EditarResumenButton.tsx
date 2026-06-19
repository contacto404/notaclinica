'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Toast from '../../components/Toast'
import { summaryFields } from '@/lib/noteFormat'
import { IconEdit } from '../../components/Icons'

export default function EditarResumenButton({ summaryId, initial, format }: {
  summaryId: string
  initial: {
    chief_complaint: string
    observations: string
    plan: string
    next_steps: string
  }
  format?: string | null
}) {
  const [open, setOpen] = useState(false)
  const [fields, setFields] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function handleSave() {
    setLoading(true)
    await supabase.from('summaries').update({
      chief_complaint: fields.chief_complaint,
      observations: fields.observations,
      plan: fields.plan,
      next_steps: fields.next_steps,
    }).eq('id', summaryId)
    setLoading(false)
    setOpen(false)
    setToast(true)
    router.refresh()
  }

  const labels: [keyof typeof fields, string][] =
    summaryFields(format).map(f => [f.key, f.label])

  return (
    <>
      {toast && <Toast message="Resumen guardado" onDone={() => setToast(false)} />}

      <button onClick={() => setOpen(true)}
        className="border border-[#EDEDED] text-[#6E6E73] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#F5F5F7] transition-colors inline-flex items-center gap-2">
        <IconEdit className="w-4 h-4" /> Editar resumen
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-5 w-full max-w-lg border border-[#EDEDED] shadow-xl my-4">
            <h3 className="text-base font-bold text-[#0A0A0A] mb-5">Editar resumen clínico</h3>

            <div className="flex flex-col gap-4">
              {labels.map(([key, label]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest">{label}</label>
                  <textarea
                    value={fields[key]}
                    onChange={e => setFields(prev => ({ ...prev, [key]: e.target.value }))}
                    rows={3}
                    className="border border-[#EDEDED] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] bg-[#F5F5F7] resize-none text-[#0A0A0A]"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <button onClick={handleSave} disabled={loading}
                className="bg-[#0A0A0A] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#262626] disabled:opacity-50 transition-colors">
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button onClick={() => setOpen(false)}
                className="text-sm text-[#6E6E73] hover:text-[#0A0A0A] py-2 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}