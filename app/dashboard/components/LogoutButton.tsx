'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function handleLogout() {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (loading) return (
    <p className="text-xs text-gray-400 px-3 py-2">Cerrando sesión...</p>
  )

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-red-500 hover:text-red-700 cursor-pointer w-full text-left px-3 py-2 rounded-lg hover:bg-red-50"
    >
      Cerrar sesión
    </button>
  )
}