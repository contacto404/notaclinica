'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CuentaPage() {
  const [sub, setSub] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
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

  async function handleCancelar() {
    if (!confirm('¿Seguro que querés cancelar tu suscripción? Perderás acceso al vencer el período actual.')) return
    setCancelling(true)
    await fetch('/api/cancel-subscription', { method: 'POST' })
    router.push('/suscripcion')
  }

  if (loading) return <div className="p-6 text-[#64748B]">Cargando...</div>

  const vencimiento = sub?.current_period_end 
    ? new Date(sub.current_period_end).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold text-[#0F172A] mb-6">Mi cuenta</h1>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-4">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-4">Perfil</h2>
        <p className="text-[#0F172A] font-medium">{user?.email}</p>
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
    </div>
  )
}
