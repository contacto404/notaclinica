import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'decrebruno123@gmail.com'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) redirect('/dashboard')

  const adminSupabase = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: users } = await adminSupabase.auth.admin.listUsers()
  const { data: subs } = await adminSupabase.from('subscriptions').select('*')

  const data = users?.users.map(u => {
    const sub = subs?.find(s => s.user_id === u.id)
    const vence = sub?.current_period_end ? new Date(sub.current_period_end) : null
    const activa = sub?.status === 'active' && vence && vence > new Date()
    return {
      id: u.id,
      email: u.email,
      creado: new Date(u.created_at).toLocaleDateString('es-UY'),
      status: activa ? 'Activa' : sub?.status === 'cancelled' ? 'Cancelada' : sub ? 'Vencida' : 'Sin suscripción',
      vence: vence ? vence.toLocaleDateString('es-UY') : '—',
    }
  }) ?? []

  const activas = data.filter(u => u.status === 'Activa').length

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">Panel de Admin</h1>
          <a href="/dashboard" className="text-sm text-[#2563EB] hover:underline">← Volver</a>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <p className="text-sm text-[#64748B] mb-1">Total usuarios</p>
            <p className="text-3xl font-bold text-[#0F172A]">{data.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <p className="text-sm text-[#64748B] mb-1">Suscripciones activas</p>
            <p className="text-3xl font-bold text-[#2563EB]">{activas}</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <p className="text-sm text-[#64748B] mb-1">MRR estimado</p>
            <p className="text-3xl font-bold text-green-600">${activas * 49} USD</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="text-left text-xs font-semibold text-[#64748B] px-6 py-4">Email</th>
                <th className="text-left text-xs font-semibold text-[#64748B] px-6 py-4">Registrado</th>
                <th className="text-left text-xs font-semibold text-[#64748B] px-6 py-4">Estado</th>
                <th className="text-left text-xs font-semibold text-[#64748B] px-6 py-4">Vence</th>
              </tr>
            </thead>
            <tbody>
              {data.map(u => (
                <tr key={u.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
                  <td className="px-6 py-4 text-sm text-[#0F172A]">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-[#64748B]">{u.creado}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      u.status === 'Activa' ? 'bg-green-100 text-green-700' :
                      u.status === 'Cancelada' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{u.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#64748B]">{u.vence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
