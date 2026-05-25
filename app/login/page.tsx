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
    if (error) {
      setError('Credenciales incorrectas.')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl flex rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex-1 bg-[#0C447C] p-10 flex-col justify-center gap-8 hidden md:flex">
          <div>
            <h1 className="text-2xl font-medium text-white">NotaClínica</h1>
            <p className="text-[#85B7EB] text-sm mt-2 leading-relaxed">Transcripción y resumen clínico con IA para profesionales de salud mental</p>
          </div>
          <div className="flex flex-col gap-3">
            {['Grabá o subí el audio de la consulta','Transcripción automática con Whisper','Resumen clínico generado por IA','Exportá el historial en PDF'].map(f => (
              <div key={f} className="flex items-center gap-3 text-[#B5D4F4] text-sm">
                <span className="text-[#5DCAA5]">✓</span> {f}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-[360px] p-10 bg-white flex flex-col justify-center gap-5 flex-shrink-0">
          <div>
            <h2 className="text-xl font-medium text-gray-900">{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
            <p className="text-sm text-gray-500 mt-1">{mode === 'login' ? 'Accedé a tu cuenta profesional' : 'Registrate gratis'}</p>
          </div>
          {magicSent ? (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">Revisá tu email para ingresar.</div>
          ) : (
            <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-4">
              {mode === 'register' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500">Nombre completo</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Dra. María García" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#185FA5]" />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500">Correo electrónico</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#185FA5]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500">Contraseña</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#185FA5]" />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button type="submit" disabled={loading} className="bg-[#185FA5] text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-60 hover:bg-[#0C447C]">
                {loading ? 'Cargando...' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
              </button>
            </form>
          )}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">o</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <button onClick={handleMagicLink} disabled={loading} className="border border-gray-200 rounded-lg py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
            ✉ Ingresar con magic link
          </button>
          <p className="text-center text-xs text-gray-500">
            {mode === 'login' ? '¿No tenés cuenta? ' : '¿Ya tenés cuenta? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }} className="text-[#185FA5] hover:underline">
              {mode === 'login' ? 'Registrarte gratis' : 'Iniciar sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
