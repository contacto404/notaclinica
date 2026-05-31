'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton({ minimal = false }: { minimal?: boolean }) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleLogout() {
    setLoading(true)
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (minimal) {
    return (
      <button
        onClick={handleLogout}
        className="text-xs text-[#475569]"
      >
        {loading ? '...' : 'Salir'}
      </button>
    )
  }

  if (loading) return (
    <p className="text-xs text-[#64748B] px-3 py-2">Cerrando sesión...</p>
  )

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-[#64748B] hover:text-[#0F172A] cursor-pointer w-full text-left px-3 py-2 rounded-lg hover:bg-[#E2E8F0]"
    >
      Cerrar sesión
    </button>
  )
}