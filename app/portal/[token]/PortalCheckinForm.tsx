'use client'

import { useState } from 'react'

function Slider({ label, value, onChange, lowLabel, highLabel }: {
  label: string; value: number; onChange: (v: number) => void; lowLabel: string; highLabel: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-[#0F172A]">{label}</label>
        <span className="text-sm font-bold text-[#2563EB] tabular-nums">{value}/10</span>
      </div>
      <input type="range" min={1} max={10} step={1} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[#2563EB]" />
      <div className="flex justify-between text-[11px] text-[#94A3B8] mt-0.5">
        <span>{lowLabel}</span><span>{highLabel}</span>
      </div>
    </div>
  )
}

export default function PortalCheckinForm({ token }: { token: string }) {
  const [mood, setMood] = useState(5)
  const [anxiety, setAnxiety] = useState(5)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function enviar() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, mood, anxiety, note }),
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
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#E8F4E8] flex items-center justify-center text-2xl mx-auto mb-3">✓</div>
        <p className="text-base font-bold text-[#0F172A] mb-1">¡Gracias!</p>
        <p className="text-sm text-[#64748B]">Tu registro se envió. Nos vemos en la próxima sesión.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
      <p className="text-[11px] text-[#64748B] uppercase tracking-widest mb-1">Registro de hoy</p>
      <p className="text-sm text-[#64748B] mb-5">¿Cómo venís desde la última sesión?</p>

      <div className="flex flex-col gap-5">
        <Slider label="Ánimo" value={mood} onChange={setMood} lowLabel="Muy bajo" highLabel="Muy bien" />
        <Slider label="Ansiedad" value={anxiety} onChange={setAnxiety} lowLabel="Tranquilo/a" highLabel="Muy ansioso/a" />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#0F172A]">¿Algo que quieras contarle a tu profesional?</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={4}
            placeholder="Opcional…"
            className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC] resize-none" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button onClick={enviar} disabled={loading}
          className="bg-[#2563EB] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#1D4ED8] disabled:opacity-60 transition-colors">
          {loading ? 'Enviando…' : 'Enviar registro'}
        </button>
      </div>
    </div>
  )
}
