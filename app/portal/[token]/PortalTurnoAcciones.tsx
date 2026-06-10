'use client'

import { useState } from 'react'

export default function PortalTurnoAcciones({ token, appointmentDate, initialStatus }: {
  token: string
  appointmentDate: string
  initialStatus?: string | null
}) {
  const [status, setStatus] = useState<string>(initialStatus || 'scheduled')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fecha = new Date(appointmentDate).toLocaleDateString('es-UY', {
    timeZone: 'America/Montevideo', weekday: 'long', day: '2-digit', month: 'long',
  })
  const hora = new Date(appointmentDate).toLocaleTimeString('es-UY', {
    timeZone: 'America/Montevideo', hour: '2-digit', minute: '2-digit',
  })

  async function accion(action: 'cancel' | 'reschedule') {
    if (action === 'cancel' && !window.confirm('¿Seguro que querés cancelar tu turno?')) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/portal-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setStatus(data.status)
    } catch (e: any) {
      setError(e.message || 'No se pudo procesar.')
    }
    setLoading(false)
  }

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-4 mb-5">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📅</span>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-widest">Tu próximo turno</p>
          <p className="text-sm font-semibold text-[#0F172A] dark:text-white capitalize">{fecha} · {hora}</p>
        </div>
      </div>

      {status === 'cancelled_by_patient' && (
        <p className="text-xs text-[#C2410C] dark:text-[#FDBA74] mt-3">Cancelaste este turno. Si necesitás otro, escribile a tu profesional.</p>
      )}
      {status === 'reschedule_requested' && (
        <p className="text-xs text-[#2563EB] dark:text-[#93C5FD] mt-3">Pediste otro horario. Tu profesional se va a contactar para reprogramar.</p>
      )}

      {status === 'scheduled' && (
        <>
          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
          <div className="flex gap-2 mt-4">
            <button onClick={() => accion('reschedule')} disabled={loading}
              className="flex-1 border border-[#E2E8F0] dark:border-[#334155] text-[#475569] dark:text-[#CBD5E1] rounded-xl py-2.5 text-sm font-medium hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A] disabled:opacity-60 transition-colors">
              Pedir otro horario
            </button>
            <button onClick={() => accion('cancel')} disabled={loading}
              className="flex-1 border border-[#FED7AA] text-[#C2410C] dark:text-[#FDBA74] rounded-xl py-2.5 text-sm font-medium hover:bg-[#FFF7ED] dark:hover:bg-[#7C2D12]/30 disabled:opacity-60 transition-colors">
              {loading ? '...' : 'Cancelar turno'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
