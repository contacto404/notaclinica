'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Toast from '../components/Toast'

export default function WaitlistButton() {
  const [open, setOpen] = useState(false)
  const [fields, setFields] = useState({ full_name: '', phone: '', reason: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const supabase = createClient()

  async function handleSave() {
    if (!fields.full_name) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('waitlist').insert({
      professional_id: user.id,
      full_name: fields.full_name,
      phone: fields.phone || null,
      reason: fields.reason || null,
    })
    setFields({ full_name: '', phone: '', reason: '' })
    setLoading(false)
    setOpen(false)
    setToast('Agregado a lista de espera')
    window.location.reload()
  }

  return (
    <>
      {toast && <Toast message={toast} onDone={() => setToast('')} />}

      <button
        onClick={() => setOpen(true)}
        className="border border-[#E2E8F0] text-[#475569] px-4 py-2 rounded-xl text-sm font-medium hover:bg-white transition-colors flex items-center gap-2"
      >
        + Lista de espera
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm border border-[#E2E8F0] shadow-xl">
            <h3 className="text-base font-bold text-[#0F172A] mb-5">Agregar a lista de espera</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#64748B] font-medium uppercase tracking-widest">Nombre completo *</label>
                <input
                  type="text"
                  value={fields.full_name}
                  onChange={e => setFields(p => ({ ...p, full_name: e.target.value }))}
                  placeholder="Maria Gonzalez"
                  className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#64748B] font-medium uppercase tracking-widest">Telefono (WhatsApp)</label>
                <input
                  type="tel"
                  value={fields.phone}
                  onChange={e => setFields(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+598 99 123 456"
                  className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#64748B] font-medium uppercase tracking-widest">Motivo de consulta</label>
                <input
                  type="text"
                  value={fields.reason}
                  onChange={e => setFields(p => ({ ...p, reason: e.target.value }))}
                  placeholder="Control anual, dolor de espalda..."
                  className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <button
                onClick={handleSave}
                disabled={loading || !fields.full_name}
                className="bg-[#2563EB] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors"
              >
                {loading ? 'Guardando...' : 'Agregar a lista'}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-[#64748B] hover:text-[#0F172A] py-2 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}