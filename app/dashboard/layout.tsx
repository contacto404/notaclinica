import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import LogoutButton from './components/LogoutButton'
import NavbarMobile from './components/NavbarMobile'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  const isActive = sub && new Date(sub.current_period_end) > new Date()
  if (!isActive) redirect('/suscripcion')

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Header móvil */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#F8FAFC] border-b border-[#E2E8F0]"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 44px)' }}
      >
        <div className="px-4 flex items-center justify-center h-14">
          <span className="font-bold text-[#0F172A] text-lg">NotaClínica</span>
        </div>
      </header>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-56 bg-[#F8FAFC] border-r border-[#E2E8F0] py-6 px-3 z-40">
        <div className="mb-8 px-3">
          <span className="font-bold text-[#0F172A] text-lg">NotaClínica</span>
        </div>
        <nav className="flex flex-col gap-1">
          <Link href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#475569] hover:bg-[#E2E8F0] transition-colors">
            🏠 Inicio
          </Link>
          <Link href="/dashboard/agenda"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#475569] hover:bg-[#E2E8F0] transition-colors">
            📅 Agenda
          </Link>
          <Link href="/dashboard/pacientes/nuevo"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#475569] hover:bg-[#E2E8F0] transition-colors">
            + Nuevo paciente
          </Link>
          <Link href="/dashboard/honorarios"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#475569] hover:bg-[#E2E8F0] transition-colors">
            💳 Honorarios
          </Link>
          <Link href="/dashboard/estadisticas"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#475569] hover:bg-[#E2E8F0] transition-colors">
            📊 Estadísticas
          </Link>
          <Link href="/dashboard/cuenta"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#475569] hover:bg-[#E2E8F0] transition-colors">
            ⚙️ Mi cuenta
          </Link>
        </nav>
        <div className="border-t border-[#E2E8F0] pt-4 mt-auto">
          <p className="text-xs text-[#64748B] px-3 mb-2 truncate">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>

      <NavbarMobile />

      {/* Contenido */}
      <main
        className="md:ml-56 md:pt-0 overflow-x-hidden"
        style={{
          paddingTop: 'calc(max(env(safe-area-inset-top), 44px) + 56px)',
          paddingBottom: 'calc(max(env(safe-area-inset-bottom), 8px) + 56px)'
        }}
      >
        {children}
      </main>

    </div>
  )
}