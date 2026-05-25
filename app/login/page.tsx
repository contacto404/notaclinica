'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')

  const supabase = createClient()
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Credenciales incorrectas.') } 
    else { router.push('/dashboard'); router.refresh() }
    setLoading(false)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    })
    if (error) { setError(error.message) } else { setMode('login') }
    setLoading(false)
  }

  async function handleMagicLink() {
    if (!email) { setError('Ingresá tu email primero.'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) { setError(error.message) } else { setMagicSent(true) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#185FA5]">NotaClínica</h1>
          <p className="text-sm text-gray-500 mt-1">Transcripción clínica con IA</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            {mode === 'login' ? 'Accedé a tu cuenta profesional' : 'Registrate gratis'}
          </p>

          {magicSent ? (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
              Revisá tu email para ingresar.
            </div>
          ) : (
            <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-4">
              {mode === 'register' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500">Nombre completo</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Dra. María García" required
                    className="border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#185FA5] w-full" />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500">Correo electrónico</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required
                  className="border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#185FA5] w-full" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500">Contraseña</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                  className="border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#185FA5] w-full" />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button type="submit" disabled={loading}
                className="bg-[#185FA5] text-white rounded-xl py-3 text-sm font-medium disabled:opacity-60 w-full">
                {loading ? 'Cargando...' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
              </button>
            </form>
          )}

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">o</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button onClick={handleMagicLink} disabled={loading}
            className="border border-gray-200 rounded-xl py-3 text-sm text-gray-700 w-full flex items-center justify-center gap-2">
            ✉ Ingresar con magic link
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            {mode === 'login' ? '¿No tenés cuenta? ' : '¿Ya tenés cuenta? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
              className="text-[#185FA5] hover:underline">
              {mode === 'login' ? 'Registrarte gratis' : 'Iniciar sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
