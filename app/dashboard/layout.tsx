import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import Link from 'next/link'
import LogoutButton from './components/LogoutButton'
import NavbarMobile from './components/NavbarMobile'
import ThemeToggle from '@/app/components/ThemeToggle'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Suscripción del usuario (cualquier estado)
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', user.id)
    .maybeSingle()

  let isActive = !!sub && sub.status === 'active' && new Date(sub.current_period_end) > new Date()

  // Primera vez sin suscripción: otorgar 30 días de prueba gratis (sin tarjeta).
  // Solo aplica si el usuario NUNCA tuvo suscripción; si venció o la canceló, va al paywall.
  if (!sub) {
    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    await admin.from('subscriptions').upsert({
      user_id: user.id,
      status: 'active',
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id', ignoreDuplicates: true })
    isActive = true
  }

  if (!isActive) redirect('/suscripcion')

  return (
    <div className="min-h-screen bg-[#F5F5F7]">

      {/* Header móvil */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#F5F5F7] border-b border-[#EDEDED]"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 8px)' }}
      >
        <div className="px-4 flex items-center justify-center h-12">
          <img src="/logo-v5.png" alt="NotaClínica" className="h-11 w-auto dark:hidden" />
          <img src="/logo-white-v5.png" alt="NotaClínica" className="h-11 w-auto hidden dark:block" />
        </div>
      </header>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-56 bg-[#F5F5F7] border-r border-[#EDEDED] py-6 px-3 z-40">
        <div className="mb-8 px-3">
          <img src="/logo-v5.png" alt="NotaClínica" className="h-10 w-auto dark:hidden" />
          <img src="/logo-white-v5.png" alt="NotaClínica" className="h-10 w-auto hidden dark:block" />
        </div>
        <nav className="flex flex-col gap-1">
          <Link href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#6E6E73] hover:bg-[#EDEDED] transition-colors">
            🏠 Inicio
          </Link>
          <Link href="/dashboard/agenda"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#6E6E73] hover:bg-[#EDEDED] transition-colors">
            📅 Agenda
          </Link>
          <Link href="/dashboard/buscar"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#6E6E73] hover:bg-[#EDEDED] transition-colors">
            🔍 Buscar
          </Link>
          <Link href="/dashboard/pacientes/nuevo"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#6E6E73] hover:bg-[#EDEDED] transition-colors">
            + Nuevo paciente
          </Link>
          <Link href="/dashboard/honorarios"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#6E6E73] hover:bg-[#EDEDED] transition-colors">
            💳 Honorarios
          </Link>
          <Link href="/dashboard/estadisticas"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#6E6E73] hover:bg-[#EDEDED] transition-colors">
            📊 Estadísticas
          </Link>
          <Link href="/dashboard/cuenta"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#6E6E73] hover:bg-[#EDEDED] transition-colors">
            ⚙️ Mi cuenta
          </Link>
        </nav>
        <div className="border-t border-[#EDEDED] pt-4 mt-auto">
          <div className="px-1 mb-3"><ThemeToggle /></div>
          <p className="text-xs text-[#6E6E73] px-3 mb-2 truncate">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>

      <NavbarMobile />

      {/* Contenido */}
      <main
        className="md:ml-56 md:pt-0 overflow-x-hidden"
        style={{
          paddingTop: 'calc(max(env(safe-area-inset-top), 8px) + 60px)',
          paddingBottom: 'calc(max(env(safe-area-inset-bottom), 8px) + 56px)'
        }}
      >
        {children}
      </main>

    </div>
  )
}