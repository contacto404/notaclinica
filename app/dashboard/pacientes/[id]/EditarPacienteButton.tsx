'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Toast from '../../components/Toast'

export default function EditarPacienteButton({ patient }: {
  patient: {
    id: string
    full_name: string
    diagnosis?: string
    phone?: string
    notes?: string
    date_of_birth?: string
    insurance_provider?: string
    insurance_member_id?: string
  }
}) {
  const [open, setOpen] = useState(false)
  const [fields, setFields] = useState({
    full_name: patient.full_name ?? '',
    diagnosis: patient.diagnosis ?? '',
    phone: patient.phone ?? '',
    notes: patient.notes ?? '',
    date_of_birth: patient.date_of_birth?.split('T')[0] ?? '',
    insurance_provider: patient.insurance_provider ?? '',
    insurance_member_id: patient.insurance_member_id ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(false)
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
      insurance_provider: fields.insurance_provider || null,
      insurance_member_id: fields.insurance_member_id || null,
    }).eq('id', patient.id)
    setLoading(false)
    setOpen(false)
    setToast(true)
    router.refresh()
  }

  return (
    <>
      {toast && <Toast message="Paciente actualizado" onDone={() => setToast(false)} />}

      <button onClick={() => setOpen(true)}
        className="text-[#6E6E73] hover:text-[#0A0A0A] transition-colors p-1 rounded-lg hover:bg-[#F0F0F0]"
        title="Editar paciente">
        ✏️
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm border border-[#EDEDED] shadow-xl my-4">
            <h3 className="text-base font-bold text-[#0A0A0A] mb-5">Editar paciente</h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest">Nombre completo *</label>
                <input type="text" value={fields.full_name} onChange={e => setFields(p => ({ ...p, full_name: e.target.value }))}
                  className="border border-[#EDEDED] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] bg-[#F5F5F7] text-[#0A0A0A]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest">Fecha de nacimiento</label>
                <input type="date" value={fields.date_of_birth} onChange={e => setFields(p => ({ ...p, date_of_birth: e.target.value }))}
                  className="border border-[#EDEDED] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] bg-[#F5F5F7] text-[#0A0A0A]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest">Diagnóstico</label>
                <input type="text" value={fields.diagnosis} onChange={e => setFields(p => ({ ...p, diagnosis: e.target.value }))}
                  placeholder="Ansiedad generalizada"
                  className="border border-[#EDEDED] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] bg-[#F5F5F7] text-[#0A0A0A]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest">Teléfono (WhatsApp)</label>
                <input type="tel" value={fields.phone} onChange={e => setFields(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+54 9 11 1234 5678"
                  className="border border-[#EDEDED] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] bg-[#F5F5F7] text-[#0A0A0A]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest">Obra social / seguro</label>
                <input type="text" value={fields.insurance_provider} onChange={e => setFields(p => ({ ...p, insurance_provider: e.target.value }))}
                  placeholder="Ej: BPS, SMI, particular"
                  className="border border-[#EDEDED] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] bg-[#F5F5F7] text-[#0A0A0A]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest">N° de afiliado</label>
                <input type="text" value={fields.insurance_member_id} onChange={e => setFields(p => ({ ...p, insurance_member_id: e.target.value }))}
                  placeholder="Número de socio"
                  className="border border-[#EDEDED] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] bg-[#F5F5F7] text-[#0A0A0A]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest">Notas</label>
                <textarea value={fields.notes} onChange={e => setFields(p => ({ ...p, notes: e.target.value }))} rows={3}
                  placeholder="Observaciones..."
                  className="border border-[#EDEDED] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] bg-[#F5F5F7] resize-none text-[#0A0A0A]" />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <button onClick={handleSave} disabled={loading || !fields.full_name}
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