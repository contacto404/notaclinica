'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-red-500 hover:text-red-700 cursor-pointer w-full text-left px-3 py-2 rounded-lg hover:bg-red-50"
    >
      Cerrar sesión
    </button>
  )
}