'use client'
import { useState } from 'react'
import Toast from '../../components/Toast'

export default function CobroButton({ patientId, patientName, sessionId }: {
  patientId: string
  patientName: string
  sessionId?: string
}) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  async function handleCobrar() {
    if (!amount || parseFloat(amount) <= 0) return
    setLoading(true)

    const res = await fetch('/api/cobro-sesion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        patientName,
        sessionId,
        amount: parseFloat(amount),
        description: description || `Consulta - ${patientName}`,
      })
    })

    const data = await res.json()
    setLoading(false)

    if (data.url) {
      setOpen(false)
      setToast('Link de pago generado')
      // Abrir link de pago
      window.open(data.url, '_blank')
    }
  }

  async function handleWhatsApp() {
    if (!amount || parseFloat(amount) <= 0) return
    setLoading(true)

    const res = await fetch('/api/cobro-sesion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        patientName,
        sessionId,
        amount: parseFloat(amount),
        description: description || `Consulta - ${patientName}`,
      })
    })

    const data = await res.json()
    setLoading(false)

    if (data.url) {
      setOpen(false)
      setToast('Link enviado por WhatsApp')
      const mensaje = `Hola ${patientName}! El monto de tu consulta de hoy es $${parseFloat(amount).toLocaleString('es-UY')} UYU. Podes pagar aqui: ${data.url}`
      window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank')
    }
  }

  return (
    <>
      {toast && <Toast message={toast} onDone={() => setToast('')} />}

      <button
        onClick={() => setOpen(true)}
        className="border border-[#EDEDED] text-[#6E6E73] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#F5F5F7] flex items-center gap-2 transition-colors">
        💳 Cobrar sesión
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm border border-[#EDEDED] shadow-xl">
            <h3 className="text-base font-bold text-[#0A0A0A] mb-5">
              Cobrar sesión — {patientName}
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest">Monto (UYU)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Ej: 1500"
                  min="1"
                  className="border border-[#EDEDED] rounded-xl px-4 py-3 text-sm text-[#0A0A0A] outline-none focus:border-[#0A0A0A] bg-[#F5F5F7]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest">Descripción (opcional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={`Consulta - ${patientName}`}
                  className="border border-[#EDEDED] rounded-xl px-4 py-3 text-sm text-[#0A0A0A] outline-none focus:border-[#0A0A0A] bg-[#F5F5F7]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <button
                onClick={handleWhatsApp}
                disabled={loading || !amount}
                className="bg-[#25D366] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#1DA851] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Generando...' : '💬 Enviar por WhatsApp'}
              </button>
              <button
                onClick={handleCobrar}
                disabled={loading || !amount}
                className="bg-[#0A0A0A] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#262626] disabled:opacity-50 transition-colors"
              >
                {loading ? 'Generando...' : '💳 Generar link de pago'}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-[#6E6E73] hover:text-[#0A0A0A] py-2 transition-colors"
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