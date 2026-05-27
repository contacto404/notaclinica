import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  const response = NextResponse.redirect(new URL('/login', request.url))
  
  // Limpiar cookies de sesión
  response.cookies.delete('sb-access-token')
  response.cookies.delete('sb-refresh-token')
  
  return response
}