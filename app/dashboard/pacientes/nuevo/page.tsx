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

  return (
    <div className="min-h-screen bg-[#FBF7F4] p-5 md:p-8">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <a href="/dashboard" className="text-xs text-[#A08070] hover:text-[#2D1F14] transition-colors font-medium">← Volver</a>
        </div>
        <div className="mb-6">
          <p className="text-xs text-[#A08070] font-medium uppercase tracking-widest mb-1">Pacientes</p>
          <h1 className="text-2xl font-bold text-[#2D1F14]">Nuevo paciente</h1>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-[#F0E8E0]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#A08070] font-medium uppercase tracking-widest">Nombre completo *</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required
                placeholder="María González"
                className="border border-[#F0E8E0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E8602C] bg-[#FBF7F4] text-[#2D1F14]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#A08070] font-medium uppercase tracking-widest">Fecha de nacimiento</label>
              <input type="date" value={fechaNac} onChange={e => setFechaNac(e.target.value)}
                className="border border-[#F0E8E0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E8602C] bg-[#FBF7F4] text-[#2D1F14]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#A08070] font-medium uppercase tracking-widest">Diagnóstico</label>
              <input type="text" value={diagnostico} onChange={e => setDiagnostico(e.target.value)}
                placeholder="Ansiedad generalizada"
                className="border border-[#F0E8E0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E8602C] bg-[#FBF7F4] text-[#2D1F14]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#A08070] font-medium uppercase tracking-widest">Teléfono (WhatsApp)</label>
              <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
                placeholder="+54 9 11 1234 5678"
                className="border border-[#F0E8E0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E8602C] bg-[#FBF7F4] text-[#2D1F14]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#A08070] font-medium uppercase tracking-widest">Notas iniciales</label>
              <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={3}
                placeholder="Observaciones iniciales..."
                className="border border-[#F0E8E0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E8602C] bg-[#FBF7F4] resize-none text-[#2D1F14]" />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={loading}
              className="bg-[#E8602C] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#D04F1E] disabled:opacity-60 transition-colors shadow-sm">
              {loading ? 'Guardando...' : 'Crear paciente'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}