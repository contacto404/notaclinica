import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import AdminClient from './AdminClient'

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
  const { data: patients } = await adminSupabase.from('patients').select('user_id')
  const { data: sessions } = await adminSupabase.from('sessions').select('user_id, created_at')

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const data = users?.users.map(u => {
    const sub = subs?.find(s => s.user_id === u.id)
    const vence = sub?.current_period_end ? new Date(sub.current_period_end) : null
    const activa = sub?.status === 'active' && vence && vence > now
    const patientCount = patients?.filter(p => p.user_id === u.id).length ?? 0
    const sessionCount = sessions?.filter(s => s.user_id === u.id).length ?? 0
    const lastSession = sessions?.filter(s => s.user_id === u.id).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]?.created_at

    return {
      id: u.id,
      email: u.email ?? '',
      creado: new Date(u.created_at).toLocaleDateString('es-UY'),
      creadoDate: new Date(u.created_at),
      status: activa ? 'Activa' : sub?.status === 'cancelled' ? 'Cancelada' : sub ? 'Vencida' : 'Sin suscripción',
      vence: vence ? vence.toLocaleDateString('es-UY') : '—',
      venceDate: vence,
      patientCount,
      sessionCount,
      lastSession: lastSession ? new Date(lastSession).toLocaleDateString('es-UY') : '—',
    }
  }) ?? []

  const activas = data.filter(u => u.status === 'Activa').length
  const canceladas = data.filter(u => u.status === 'Cancelada').length
  const nuevosEstaSeamana = data.filter(u => u.creadoDate > weekAgo).length
  const nuevosEsteMes = data.filter(u => u.creadoDate > monthAgo).length

  return (
    <AdminClient
      data={data}
      stats={{ activas, canceladas, total: data.length, nuevosEsteSemana: nuevosEstaSeamana, nuevosEsteMes, mrr: activas * 49 }}
    />
  )
}
