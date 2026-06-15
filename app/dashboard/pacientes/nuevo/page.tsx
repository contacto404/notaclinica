'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { capitalizar } from '@/lib/sessionStatus'
import { DIAGNOSTICOS_COMUNES } from '@/lib/diagnosticos'

export default function NuevoPacientePage() {
  const [nombre, setNombre] = useState('')
  const [fechaNac, setFechaNac] = useState('')
  const [diagnostico, setDiagnostico] = useState('')
  const [telefono, setTelefono] = useState('')
  const [obraSocial, setObraSocial] = useState('')
  const [afiliado, setAfiliado] = useState('')
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    // Validación de teléfono (se usa para WhatsApp): dígitos con código de país opcional
    const telLimpio = telefono.trim()
    if (telLimpio && !/^\+?[\d\s()-]{7,}$/.test(telLimpio)) {
      setError('El teléfono debe ser un número válido (ej: +54 9 11 1234 5678).')
      setLoading(false)
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { error } = await supabase.from('patients').insert({
      professional_id: user.id,
      full_name: capitalizar(nombre),
      date_of_birth: fechaNac || null,
      diagnosis: diagnostico ? capitalizar(diagnostico) : null,
      phone: telLimpio || null,
      insurance_provider: obraSocial || null,
      insurance_member_id: afiliado || null,
      notes: notas || null,
    })
    if (error) { setError(error.message) } else { router.push('/dashboard') }
    setLoading(false)
  }

  const inputClass = "border border-[#EDEDED] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0A0A0A] bg-[#F5F5F7] text-[#0A0A0A]"

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-5 md:p-8">
      <div className="max-w-lg mx-auto">
        <a href="/dashboard" className="text-xs text-[#6E6E73] hover:text-[#0A0A0A] transition-colors font-medium inline-block mb-5">← Volver</a>
        <div className="mb-5">
          <p className="text-[11px] text-[#6E6E73] font-medium uppercase tracking-widest mb-0.5">Pacientes</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] tracking-tight">Nuevo paciente</h1>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#EDEDED]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#6E6E73] font-medium uppercase tracking-[0.08em]">Nombre completo *</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required
                placeholder="María González" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#6E6E73] font-medium uppercase tracking-[0.08em]">Fecha de nacimiento</label>
              <input type="date" value={fechaNac} onChange={e => setFechaNac(e.target.value)} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#6E6E73] font-medium uppercase tracking-[0.08em]">Diagnóstico</label>
              <input type="text" value={diagnostico} onChange={e => setDiagnostico(e.target.value)}
                list="diagnosticos-comunes" placeholder="Ansiedad generalizada" className={inputClass} />
              <datalist id="diagnosticos-comunes">
                {DIAGNOSTICOS_COMUNES.map(d => <option key={d} value={d} />)}
              </datalist>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#6E6E73] font-medium uppercase tracking-[0.08em]">Teléfono (WhatsApp)</label>
              <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
                placeholder="+54 9 11 1234 5678" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#6E6E73] font-medium uppercase tracking-[0.08em]">Obra social / seguro</label>
              <input type="text" value={obraSocial} onChange={e => setObraSocial(e.target.value)}
                placeholder="Ej: BPS, SMI, particular" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#6E6E73] font-medium uppercase tracking-[0.08em]">N° de afiliado</label>
              <input type="text" value={afiliado} onChange={e => setAfiliado(e.target.value)}
                placeholder="Número de socio" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-[#6E6E73] font-medium uppercase tracking-[0.08em]">Notas iniciales</label>
              <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={3}
                placeholder="Observaciones iniciales..."
                className={inputClass + " resize-none"} />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={loading}
              className="bg-[#0A0A0A] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#262626] disabled:opacity-60 transition-colors shadow-sm">
              {loading ? 'Guardando...' : 'Crear paciente'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
