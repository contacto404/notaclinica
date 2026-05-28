import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './components/LogoutButton'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-[#FBF7F4]">

      {/* Header móvil */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#FBF7F4] border-b border-[#F0E8E0] px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-[#2D1F14] text-sm">NotaClínica</span>
        <LogoutButton />
      </header>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-56 bg-[#FBF7F4] border-r border-[#F0E8E0] py-6 px-3 z-40">
        <div className="mb-8 px-3">
          <span className="font-bold text-[#2D1F14] text-lg">NotaClínica</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <Link href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#6B4F3A] hover:bg-[#F0E8E0] transition-colors">
            🏠 Inicio
          </Link>
          <Link href="/dashboard/agenda"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#6B4F3A] hover:bg-[#F0E8E0] transition-colors">
            📅 Agenda
          </Link>
          <Link href="/dashboard/pacientes/nuevo"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#6B4F3A] hover:bg-[#F0E8E0] transition-colors">
            ➕ Nuevo paciente
          </Link>
        </nav>

        <div className="border-t border-[#F0E8E0] pt-4 mt-4">
          <p className="text-xs text-[#A08070] px-3 mb-2 truncate">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="md:ml-56 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* Nav inferior móvil */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FBF7F4] border-t border-[#F0E8E0] flex">
        <Link href="/dashboard"
          className="flex-1 flex flex-col items-center justify-center py-3 text-xs text-[#6B4F3A] hover:text-[#2D1F14] gap-1">
          <span className="text-lg">🏠</span>
          Inicio
        </Link>
        <Link href="/dashboard/agenda"
          className="flex-1 flex flex-col items-center justify-center py-3 text-xs text-[#6B4F3A] hover:text-[#2D1F14] gap-1">
          <span className="text-lg">📅</span>
          Agenda
        </Link>
        <Link href="/dashboard/pacientes/nuevo"
          className="flex-1 flex flex-col items-center justify-center py-3 text-xs text-[#6B4F3A] hover:text-[#2D1F14] gap-1">
          <span className="text-lg">➕</span>
          Nuevo paciente
        </Link>
      </nav>

    </div>
  )
}