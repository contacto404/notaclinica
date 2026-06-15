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
        className="text-xs text-[#6E6E73]"
      >
        {loading ? '...' : 'Salir'}
      </button>
    )
  }

  if (loading) return (
    <p className="text-xs text-[#6E6E73] px-3 py-2">Cerrando sesión...</p>
  )

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-[#6E6E73] hover:text-[#0A0A0A] cursor-pointer w-full text-left px-3 py-2 rounded-lg hover:bg-[#EDEDED]"
    >
      Cerrar sesión
    </button>
  )
}