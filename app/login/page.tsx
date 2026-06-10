'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')

  const supabase = createClient()
  const router = useRouter()

  // Abrir en modo registro si se llega desde la landing (?tab=registro)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('tab') === 'registro') setMode('register')
  }, [])

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
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (error) { setError(error.message) } else { await fetch('/api/trial', { method: 'POST' }); router.push('/bienvenida') }
    setLoading(false)
  }

  const inputClass = "border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC]"

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl flex rounded-3xl overflow-hidden shadow-lg border border-[#E2E8F0]">

        {/* Panel izquierdo */}
        <div className="flex-1 bg-[#2563EB] p-10 flex-col justify-between gap-8 hidden md:flex">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">NotaClínica</h1>
            <p className="text-[#DBEAFE] text-sm mt-2 leading-relaxed">La consulta más organizada de tu carrera</p>
            <p className="text-[#BFDBFE] text-xs mt-1 leading-relaxed">IA para médicos que quieren enfocarse en <strong className="text-white">sus pacientes</strong>, no en el papeleo</p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              ['Ahorrá hasta ', '30 minutos', ' por consulta'],
              ['El historial de tus pacientes, ', 'donde estés', ''],
              ['Resúmenes clínicos generados ', 'en segundos', ''],
              ['Enviá indicaciones y turnos ', 'por WhatsApp', ''],
              ['Importá historiales de ', 'cualquier sistema', ''],
            ].map(([pre, bold, post]) => (
              <div key={bold} className="flex items-center gap-3 text-[#DBEAFE] text-sm">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-xs shrink-0">✓</span>
                <span>{pre}<strong className="text-white">{bold}</strong>{post}</span>
              </div>
            ))}
          </div>
          <p className="text-[#BFDBFE] text-xs">Para médicos de todas las especialidades</p>
        </div>

        {/* Panel derecho */}
        <div className="w-full md:w-[380px] p-10 bg-white flex flex-col justify-center gap-5 flex-shrink-0">
          <div>
            <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-widest mb-0.5">
              {mode === 'login' ? 'Bienvenido' : 'Crear cuenta'}
            </p>
            <h2 className="text-2xl font-bold text-[#0F172A]">
              {mode === 'login' ? 'Iniciá sesión' : 'Registrate gratis'}
            </h2>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-4">
            {mode === 'register' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#64748B] font-medium">Nombre completo</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Dr. Juan García" required className={inputClass} />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#64748B] font-medium">Correo electrónico</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" required className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#64748B] font-medium">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required minLength={6} className={inputClass} />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={loading}
              className="bg-[#2563EB] text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-60 hover:bg-[#1D4ED8] transition-colors shadow-sm">
              {loading ? 'Cargando...' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-xs text-[#64748B]">
            {mode === 'login' ? '¿No tenés cuenta? ' : '¿Ya tenés cuenta? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
              className="text-[#2563EB] hover:underline font-medium">
              {mode === 'login' ? 'Registrate gratis' : 'Iniciar sesión'}
            </button>
          </p>

          <p className="text-center text-xs text-[#64748B]">
            Al registrarte aceptás nuestra{' '}
            <a href="/privacidad" target="_blank" className="text-[#2563EB] hover:underline font-medium">
              Política de Privacidad
            </a>
          </p>

        </div>
      </div>
    </div>
  )
}
