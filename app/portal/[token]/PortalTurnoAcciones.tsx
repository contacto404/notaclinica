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
    <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#EDEDED] dark:border-[#262626] p-4 mb-5">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📅</span>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-[#6E6E73] dark:text-[#A3A3A3] uppercase tracking-widest">Tu próximo turno</p>
          <p className="text-sm font-semibold text-[#0A0A0A] dark:text-white capitalize">{fecha} · {hora}</p>
        </div>
      </div>

      {status === 'cancelled_by_patient' && (
        <p className="text-xs text-[#C2410C] dark:text-[#FDBA74] mt-3">Cancelaste este turno. Si necesitás otro, escribile a tu profesional.</p>
      )}
      {status === 'reschedule_requested' && (
        <p className="text-xs text-[#0A0A0A] dark:text-[#FFFFFF] mt-3">Pediste otro horario. Tu profesional se va a contactar para reprogramar.</p>
      )}

      {status === 'scheduled' && (
        <>
          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
          <div className="flex gap-2 mt-4">
            <button onClick={() => accion('reschedule')} disabled={loading}
              className="flex-1 border border-[#EDEDED] dark:border-[#262626] text-[#6E6E73] dark:text-[#D2D2D7] rounded-xl py-2.5 text-sm font-medium hover:bg-[#F5F5F7] dark:hover:bg-[#0A0A0A] disabled:opacity-60 transition-colors">
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
