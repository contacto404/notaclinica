'use client'
import { useState } from 'react'

export default function SuscripcionPage() {
  const [loading, setLoading] = useState(false)

  async function handleSuscribirse() {
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout', { method: 'POST' })
      const data = await res.json()
      if (res.status === 401) {
        window.location.href = '/login'
        return
      }
      if (data.error) throw new Error(data.error)
      if (data.url) window.location.href = data.url
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-5">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">NotaClínica Pro</h1>
          <p className="text-[#64748B]">Documentación clínica con IA para médicos</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-8 mb-4">
          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-[#0F172A]">$49<span className="text-xl font-normal text-[#64748B]">/mes</span></p>
            <p className="text-sm text-[#2563EB] font-medium mt-1">14 días gratis, cancelá cuando quieras</p>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {[
              '✓ Transcripción automática de consultas',
              '✓ Resúmenes clínicos con IA',
              '✓ Historial con contexto entre sesiones',
              '✓ Envío por WhatsApp',
              '✓ Exportar PDF',
              '✓ Agenda y recordatorios',
              '✓ Videollamadas integradas',
              '✓ Pacientes ilimitados',
            ].map(f => (
              <p key={f} className="text-sm text-[#0F172A]">{f}</p>
            ))}
          </div>

          <button
            onClick={handleSuscribirse}
            disabled={loading}
            className="w-full bg-[#2563EB] text-white rounded-xl py-4 font-semibold text-base hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? 'Redirigiendo...' : 'Comenzar prueba gratis'}
          </button>
        </div>

        <p className="text-xs text-center text-[#64748B]">
          No se requiere tarjeta de crédito para comenzar · Cancelá cuando quieras
        </p>
      </div>
    </div>
  )
}