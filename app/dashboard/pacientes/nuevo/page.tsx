'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function NuevoPacientePage() {
  const [nombre, setNombre] = useState('')
  const [fechaNac, setFechaNac] = useState('')
  const [diagnostico, setDiagnostico] = useState('')
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
      notes: notas || null,
    })
    if (error) { setError(error.message) } else { router.push('/dashboard') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-52 bg-white border-r border-gray-200 min-h-screen flex flex-col">
        <div className="px-4 py-5 border-b border-gray-100">
          <span className="text-base font-medium text-gray-900">Nota<span className="text-blue-600">Clínica</span></span>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          <a href="/dashboard" className="px-3 py-2 rounded-lg text-gray-600 text-sm hover:bg-gray-50">Dashboard</a>
          <a href="/dashboard/pacientes/nuevo" className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">Nuevo paciente</a>
        </nav>
      </div>
      <div className="flex-1 p-7 max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">← Volver</a>
          <h1 className="text-xl font-medium text-gray-900">Nuevo paciente</h1>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Nombre completo *</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required placeholder="María González" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Fecha de nacimiento</label>
              <input type="date" value={fechaNac} onChange={e => setFechaNac(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Diagnóstico</label>
              <input type="text" value={diagnostico} onChange={e => setDiagnostico(e.target.value)} placeholder="Ansiedad generalizada" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500">Notas iniciales</label>
              <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={3} placeholder="Observaciones iniciales..." className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none" />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
              {loading ? 'Guardando...' : 'Crear paciente'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
