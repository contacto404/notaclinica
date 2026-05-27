import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const response = NextResponse.redirect(new URL('/login', request.url))

  // Borrar todas las cookies de Supabase
  const cookies = request.headers.get('cookie') || ''
  cookies.split(';').forEach(cookie => {
    const name = cookie.split('=')[0].trim()
    if (name.includes('sb-') || name.includes('supabase')) {
      response.cookies.delete(name)
    }
  })

  return response
}