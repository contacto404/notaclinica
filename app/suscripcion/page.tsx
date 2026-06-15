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
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-5">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#0A0A0A] mb-1">NotaClínica Pro</h1>
          <p className="text-sm text-[#6E6E73]">Documentación clínica con IA para médicos</p>
        </div>

        {/* En la app nativa no se puede cobrar por fuera de Apple/Google: mostramos una nota. */}
        <div data-show-in-app className="bg-white rounded-2xl border border-[#EDEDED] p-6 mb-4 text-center">
          <p className="text-3xl mb-3">🌐</p>
          <p className="text-base font-semibold text-[#0A0A0A] mb-1">Activá tu plan desde la web</p>
          <p className="text-sm text-[#6E6E73] leading-relaxed">
            Para comenzar tu prueba o suscribirte, ingresá a NotaClínica desde el navegador de tu computadora o celular. Después iniciá sesión acá con la misma cuenta y tenés todo disponible.
          </p>
        </div>

        <div data-hide-in-app className="bg-white rounded-2xl border border-[#EDEDED] p-6 mb-4">
          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-[#0A0A0A] leading-none">$49<span className="text-xl font-normal text-[#6E6E73]"> USD/mes</span></p>
            <p className="text-sm text-[#0A0A0A] font-medium mt-2">30 días gratis, cancelá cuando quieras</p>
          </div>

          <div className="flex flex-col gap-2.5 mb-6">
            {[
              'Transcripción automática de consultas',
              'Resúmenes clínicos con IA',
              'Historial con contexto entre sesiones',
              'Envío por WhatsApp',
              'Exportar PDF',
              'Agenda y recordatorios',
              'Videollamadas integradas',
              'Pacientes ilimitados',
            ].map(f => (
              <p key={f} className="text-sm text-[#0A0A0A] flex items-center gap-2">
                <span className="text-[#0A0A0A]">✓</span> {f}
              </p>
            ))}
          </div>

          <button
            onClick={handleSuscribirse}
            disabled={loading}
            className="w-full bg-[#0A0A0A] text-white rounded-xl py-3.5 font-semibold text-base hover:bg-[#262626] transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? 'Redirigiendo...' : 'Comenzar 30 días gratis'}
          </button>
        </div>

        <p data-hide-in-app className="text-xs text-center text-[#6E6E73]">
          30 días gratis sin tarjeta · Luego $49/mes · Cancelá cuando quieras
        </p>
      </div>
    </div>
  )
}
