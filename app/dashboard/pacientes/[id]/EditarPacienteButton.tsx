'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function EditarPacienteButton({ patient }: {
  patient: {
    id: string
    full_name: string
    diagnosis?: string
    phone?: string
    notes?: string
    date_of_birth?: string
  }
}) {
  const [open, setOpen] = useState(false)
  const [fields, setFields] = useState({
    full_name: patient.full_name ?? '',
    diagnosis: patient.diagnosis ?? '',
    phone: patient.phone ?? '',
    notes: patient.notes ?? '',
    date_of_birth: patient.date_of_birth?.split('T')[0] ?? '',
  })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function handleSave() {
    setLoading(true)
    await supabase.from('patients').update({
      full_name: fields.full_name,
      diagnosis: fields.diagnosis || null,
      phone: fields.phone || null,
      notes: fields.notes || null,
      date_of_birth: fields.date_of_birth || null,
    }).eq('id', patient.id)
    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="text-[#64748B] hover:text-[#2563EB] transition-colors p-1 rounded-lg hover:bg-[#DBEAFE]"
        title="Editar paciente">
        ✏️
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#E2E8F0] shadow-xl my-4">
            <h3 className="text-base font-bold text-[#0F172A] mb-5">Editar paciente</h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#64748B] font-medium uppercase tracking-widest">Nombre completo *</label>
                <input type="text" value={fields.full_name} onChange={e => setFields(p => ({ ...p, full_name: e.target.value }))}
                  className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] bg-[#F8FAFC] text-[#0F172A]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#64748B] font-medium uppercase tracking-widest">Fecha de nacimiento</label>
                <input type="date" value={fields.date_of_birth} onChange={e => setFields(p => ({ ...p, date_of_birth: e.target.value }))}
                  className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] bg-[#F8FAFC] text-[#0F172A]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#64748B] font-medium uppercase tracking-widest">Diagnóstico</label>
                <input type="text" value={fields.diagnosis} onChange={e => setFields(p => ({ ...p, diagnosis: e.target.value }))}
                  placeholder="Ansiedad generalizada"
                  className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] bg-[#F8FAFC] text-[#0F172A]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#64748B] font-medium uppercase tracking-widest">Teléfono (WhatsApp)</label>
                <input type="tel" value={fields.phone} onChange={e => setFields(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+54 9 11 1234 5678"
                  className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] bg-[#F8FAFC] text-[#0F172A]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#64748B] font-medium uppercase tracking-widest">Notas</label>
                <textarea value={fields.notes} onChange={e => setFields(p => ({ ...p, notes: e.target.value }))} rows={3}
                  placeholder="Observaciones..."
                  className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] bg-[#F8FAFC] resize-none text-[#0F172A]" />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <button onClick={handleSave} disabled={loading || !fields.full_name}
                className="bg-[#2563EB] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors">
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button onClick={() => setOpen(false)}
                className="text-sm text-[#64748B] hover:text-[#0F172A] py-2 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}