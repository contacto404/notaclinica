'use client'

import { useState } from 'react'

export default function PortalPreconsultaForm({ token }: { token: string }) {
  const [motivo, setMotivo] = useState('')
  const [antecedentes, setAntecedentes] = useState('')
  const [medicacion, setMedicacion] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function enviar() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/preconsulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, motivo, antecedentes, medicacion }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setDone(true)
    } catch (e: any) {
      setError(e.message || 'No se pudo enviar.')
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 text-center mb-4">
        <div className="w-12 h-12 rounded-full bg-[#E8F4E8] flex items-center justify-center text-2xl mx-auto mb-3">✓</div>
        <p className="text-base font-bold text-[#0F172A] mb-1">¡Listo!</p>
        <p className="text-sm text-[#64748B]">Tu profesional va a tener esta información antes de la consulta.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 mb-4">
      <p className="text-[11px] text-[#64748B] uppercase tracking-widest mb-1">Antes de tu consulta</p>
      <p className="text-sm text-[#64748B] mb-5">Completá esto para aprovechar mejor la sesión. Solo lo ve tu profesional.</p>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0F172A]">¿Cuál es el motivo de la consulta? *</label>
          <textarea value={motivo} onChange={e => setMotivo(e.target.value)} rows={3}
            placeholder="¿Qué te trae a la consulta? ¿Desde cuándo?"
            className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC] resize-none" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0F172A]">Antecedentes relevantes</label>
          <textarea value={antecedentes} onChange={e => setAntecedentes(e.target.value)} rows={3}
            placeholder="Enfermedades previas, cirugías, alergias, antecedentes familiares… (opcional)"
            className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC] resize-none" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0F172A]">Medicación actual</label>
          <textarea value={medicacion} onChange={e => setMedicacion(e.target.value)} rows={2}
            placeholder="Medicamentos que tomás actualmente y dosis… (opcional)"
            className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC] resize-none" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button onClick={enviar} disabled={loading}
          className="bg-[#2563EB] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#1D4ED8] disabled:opacity-60 transition-colors">
          {loading ? 'Enviando…' : 'Enviar información'}
        </button>
      </div>
    </div>
  )
}
