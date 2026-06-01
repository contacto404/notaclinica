'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Toast from '../components/Toast'

const ESPECIALIDADES = [
  { value: 'general', label: 'General / Otra' },
  { value: 'psicologia', label: 'Psicología / Psiquiatría' },
  { value: 'clinica', label: 'Clínica médica' },
  { value: 'pediatria', label: 'Pediatría' },
  { value: 'ginecologia', label: 'Ginecología / Obstetricia' },
  { value: 'traumatologia', label: 'Traumatología / Ortopedia' },
  { value: 'dermatologia', label: 'Dermatología' },
  { value: 'nutricion', label: 'Nutrición' },
  { value: 'kinesiologia', label: 'Kinesiología / Fisioterapia' },
]

export default function CuentaPage() {
  const [sub, setSub] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [specialty, setSpecialty] = useState('general')
  const [savingSpecialty, setSavingSpecialty] = useState(false)
  const [toast, setToast] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('specialty')
        .eq('id', user?.id)
        .single()
      if (profile?.specialty) setSpecialty(profile.specialty)

      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single()
      setSub(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSaveSpecialty() {
    setSavingSpecialty(true)
    await supabase
      .from('profiles')
      .upsert({ id: user?.id, specialty, full_name: user?.user_metadata?.full_name })
    setSavingSpecialty(false)
    setToast('Especialidad guardada')
  }

  async function handleCancelar() {
    if (!confirm('¿Seguro que querés cancelar tu suscripción? Perderás acceso al vencer el período actual.')) return
    setCancelling(true)
    await fetch('/api/cancel-subscription', { method: 'POST' })
    router.push('/suscripcion')
  }

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return <div className="p-6 text-[#64748B]">Cargando...</div>

  const vencimiento = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="p-6 max-w-lg">
      {toast && <Toast message={toast} onDone={() => setToast('')} />}

      <h1 className="text-2xl font-bold text-[#0F172A] mb-6">Mi cuenta</h1>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-4">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-4">Perfil</h2>
        <p className="text-[#0F172A] font-medium">{user?.email}</p>
      </div>

      {/* Especialidad */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-4">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-4">Especialidad</h2>
        <p className="text-xs text-[#64748B] mb-3">Seleccioná tu especialidad para que la IA adapte los resúmenes clínicos.</p>
        <select
          value={specialty}
          onChange={e => setSpecialty(e.target.value)}
          className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC] mb-4"
        >
          {ESPECIALIDADES.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
        <button
          onClick={handleSaveSpecialty}
          disabled={savingSpecialty}
          className="w-full bg-[#2563EB] text-white rounded-xl py-3 font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {savingSpecialty ? 'Guardando...' : 'Guardar especialidad'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-4">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-4">Suscripción</h2>
        {sub?.status === 'active' ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#0F172A]">Plan</span>
              <span className="text-[#2563EB] font-semibold">NotaClínica Pro</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#0F172A]">Estado</span>
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">Activa</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[#0F172A]">Vence</span>
              <span className="text-[#64748B]">{vencimiento}</span>
            </div>
            <button
              onClick={handleCancelar}
              disabled={cancelling}
              className="w-full border border-red-300 text-red-600 rounded-xl py-3 font-medium hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {cancelling ? 'Cancelando...' : 'Cancelar suscripción'}
            </button>
          </>
        ) : (
          <>
            <p className="text-[#64748B] mb-4">No tenés una suscripción activa.</p>
            <button
              onClick={() => router.push('/suscripcion')}
              className="w-full bg-[#2563EB] text-white rounded-xl py-3 font-medium hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              Suscribirme
            </button>
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-4">Sesión</h2>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full border border-[#E2E8F0] text-[#475569] rounded-xl py-3 font-medium hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </button>
      </div>
    </div>
  )
}