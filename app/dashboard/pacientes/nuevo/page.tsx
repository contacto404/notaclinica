'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function NuevoPacientePage() {
  const [nombre, setNombre] = useState('')
  const [fechaNac, setFechaNac] = useState('')
  const [diagnostico, setDiagnostico] = useState('')
  const [telefono, setTelefono] = useState('')
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { error } = await supabase.from('patients').insert({
      professional_id: user.id,
      full_name: nombre,
      date_of_birth: fechaNac || null,
      diagnosis: diagnostico || null,
      phone: telefono || null,
      notes: notas || null,
    })
    if (error) { setError(error.message) } else { router.push('/dashboard') }
    setLoading(false)
  }

  const inputClass = "border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#2563EB] bg-[#F8FAFC] text-[#0F172A]"

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-5 md:p-8">
      <div className="max-w-lg mx-auto">
        <a href="/dashboard" className="text-xs text-[#64748B] hover:text-[#0F172A] transition-colors font-medium inline-block mb-5">← Volver</a>
        <div className="mb-5">
          <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-widest mb-0.5">Pacientes</p>
          <h1 className="text-2xl font-bold text-[#0F172A]">Nuevo paciente</h1>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#64748B] font-medium">Nombre completo *</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required
                placeholder="María González" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#64748B] font-medium">Fecha de nacimiento</label>
              <input type="date" value={fechaNac} onChange={e => setFechaNac(e.target.value)} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#64748B] font-medium">Diagnóstico</label>
              <input type="text" value={diagnostico} onChange={e => setDiagnostico(e.target.value)}
                placeholder="Ansiedad generalizada" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#64748B] font-medium">Teléfono (WhatsApp)</label>
              <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
                placeholder="+54 9 11 1234 5678" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#64748B] font-medium">Notas iniciales</label>
              <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={3}
                placeholder="Observaciones iniciales..."
                className={inputClass + " resize-none"} />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={loading}
              className="bg-[#2563EB] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#1D4ED8] disabled:opacity-60 transition-colors shadow-sm">
              {loading ? 'Guardando...' : 'Crear paciente'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
