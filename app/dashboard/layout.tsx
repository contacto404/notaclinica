import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar — solo desktop */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-52 bg-white border-r border-gray-200 flex-col justify-between z-20">
        <div>
          <div className="px-4 py-5 border-b border-gray-100">
            <span className="text-base font-medium text-gray-900">Nota<span className="text-blue-600">Clínica</span></span>
          </div>
          <nav className="flex flex-col gap-1 p-3">
            <a href="/dashboard" className="px-3 py-2 rounded-lg text-gray-600 text-sm hover:bg-gray-50">Dashboard</a>
            <a href="/dashboard/pacientes/nuevo" className="px-3 py-2 rounded-lg text-gray-600 text-sm hover:bg-gray-50">Nuevo paciente</a>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
          <form action="/api/logout" method="POST">
            <button type="submit" className="text-xs text-red-500 hover:text-red-700 cursor-pointer">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Header — solo móvil */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-20">
        <span className="text-base font-medium text-gray-900">Nota<span className="text-blue-600">Clínica</span></span>
      </header>

      {/* Contenido */}
      <main className="md:ml-52 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* Nav inferior — solo móvil */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-20">
        <a href="/dashboard" className="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs font-medium">Inicio</span>
        </a>
        <a href="/dashboard/pacientes/nuevo" className="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span className="text-xs font-medium">Nuevo paciente</span>
        </a>
      </nav>

    </div>
  )
}