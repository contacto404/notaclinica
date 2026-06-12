'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Toast from '../components/Toast'
import ThemeToggle from '@/app/components/ThemeToggle'

const ESPECIALIDADES = [
  { value: 'general', label: 'General / Otra' },
  { value: 'psicologia', label: 'Psicologia / Psiquiatria' },
  { value: 'clinica', label: 'Clinica medica' },
  { value: 'pediatria', label: 'Pediatria' },
  { value: 'ginecologia', label: 'Ginecologia / Obstetricia' },
  { value: 'traumatologia', label: 'Traumatologia / Ortopedia' },
  { value: 'dermatologia', label: 'Dermatologia' },
  { value: 'nutricion', label: 'Nutricion' },
  { value: 'kinesiologia', label: 'Kinesiologia / Fisioterapia' },
]

export default function CuentaPage() {
  const [sub, setSub] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [specialty, setSpecialty] = useState('general')
  const [savingSpecialty, setSavingSpecialty] = useState(false)
  const [noteFormat, setNoteFormat] = useState('standard')
  const [savingFormat, setSavingFormat] = useState(false)
  const [professionalName, setProfessionalName] = useState('')
  const [title, setTitle] = useState('')
  const [identification, setIdentification] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [signatureUrl, setSignatureUrl] = useState('')
  const [savingSignature, setSavingSignature] = useState(false)
  const [signatureError, setSignatureError] = useState('')
  const [toast, setToast] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // Redimensiona la imagen de firma a un PNG chico (data URL) antes de guardarla.
  function fileToSignatureDataUrl(file: File, maxW = 420): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const img = new window.Image()
        img.onload = () => {
          const scale = Math.min(1, maxW / img.width)
          const w = Math.round(img.width * scale)
          const h = Math.round(img.height * scale)
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          if (!ctx) return reject(new Error('No se pudo procesar la imagen'))
          ctx.drawImage(img, 0, 0, w, h)
          resolve(canvas.toDataURL('image/png'))
        }
        img.onerror = () => reject(new Error('Archivo de imagen inválido'))
        img.src = reader.result as string
      }
      reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
      reader.readAsDataURL(file)
    })
  }

  async function handleSignatureFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSignatureError('')
    if (!file.type.startsWith('image/')) {
      setSignatureError('Subí un archivo de imagen (PNG o JPG).')
      return
    }
    try {
      const dataUrl = await fileToSignatureDataUrl(file)
      setSignatureUrl(dataUrl)
    } catch (err: any) {
      setSignatureError(err.message || 'No se pudo procesar la imagen')
    }
  }

  async function handleSaveSignature() {
    setSavingSignature(true)
    await supabase.from('profiles').upsert({
      id: user?.id,
      signature_url: signatureUrl || null,
      full_name: user?.user_metadata?.full_name
    })
    setSavingSignature(false)
    setToast(signatureUrl ? 'Firma guardada' : 'Firma eliminada')
  }

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('specialty, professional_name, title, identification, full_name, note_format, signature_url')
        .eq('id', user?.id)
        .single()

      if (profile?.specialty) setSpecialty(profile.specialty)
      if (profile?.note_format) setNoteFormat(profile.note_format)
      if (profile?.professional_name) setProfessionalName(profile.professional_name)
      else if (profile?.full_name) setProfessionalName(profile.full_name)
      if (profile?.title) setTitle(profile.title)
      if (profile?.identification) setIdentification(profile.identification)
      if (profile?.signature_url) setSignatureUrl(profile.signature_url)

      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single()
      setSub(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSaveSpecialty() {
    setSavingSpecialty(true)
    await supabase.from('profiles').upsert({
      id: user?.id,
      specialty,
      full_name: user?.user_metadata?.full_name
    })
    setSavingSpecialty(false)
    setToast('Especialidad guardada')
  }

  async function handleSaveFormat() {
    setSavingFormat(true)
    await supabase.from('profiles').upsert({
      id: user?.id,
      note_format: noteFormat,
      full_name: user?.user_metadata?.full_name
    })
    setSavingFormat(false)
    setToast('Formato de nota guardado')
  }

  async function handleSaveProfile() {
    setSavingProfile(true)
    await supabase.from('profiles').upsert({
      id: user?.id,
      professional_name: professionalName || null,
      title: title || null,
      identification: identification || null,
      full_name: user?.user_metadata?.full_name
    })
    setSavingProfile(false)
    setToast('Datos del profesional guardados')
  }

  async function handleCancelar() {
    if (!confirm('Seguro que queres cancelar tu suscripcion? Perderas acceso al vencer el periodo actual.')) return
    setCancelling(true)
    await fetch('/api/cancel-subscription', { method: 'POST' })
    router.push('/suscripcion')
  }

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return <div className="p-6 text-[#64748B]">Cargando...</div>

  const vencimiento = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="p-6 max-w-lg">
      {toast && <Toast message={toast} onDone={() => setToast('')} />}

      <h1 className="text-2xl font-bold text-[#0F172A] mb-6">Mi cuenta</h1>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-4">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-4">Perfil</h2>
        <p className="text-[#0F172A] font-medium">{user?.email}</p>
      </div>

      {/* Apariencia */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-4">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-1">Apariencia</h2>
        <p className="text-xs text-[#64748B] mb-4">Eleg&iacute; el tema de la app. &laquo;Sistema&raquo; sigue la preferencia de tu dispositivo.</p>
        <ThemeToggle />
      </div>

      {/* Datos profesional */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-4">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-1">Datos del profesional</h2>
        <p className="text-xs text-[#64748B] mb-4">Aparecen al pie de cada PDF exportado.</p>
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#64748B] font-medium uppercase tracking-widest">Nombre profesional</label>
            <input
              type="text"
              value={professionalName}
              onChange={e => setProfessionalName(e.target.value)}
              placeholder="Dr. Bruno De Crescenzo"
              className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#64748B] font-medium uppercase tracking-widest">Titulo (opcional)</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Medico clinico, Psicologo, Terapeuta..."
              className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#64748B] font-medium uppercase tracking-widest">Numero de identificacion (opcional)</label>
            <input
              type="text"
              value={identification}
              onChange={e => setIdentification(e.target.value)}
              placeholder="Cedula, matricula, registro..."
              className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC]"
            />
          </div>
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={savingProfile}
          className="w-full bg-[#2563EB] text-white rounded-xl py-3 font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {savingProfile ? 'Guardando...' : 'Guardar datos profesionales'}
        </button>
      </div>

      {/* Firma */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-4">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-1">Firma</h2>
        <p className="text-xs text-[#64748B] mb-4">Subí una imagen de tu firma (PNG con fondo transparente queda mejor). Aparece en las recetas y PDFs exportados.</p>

        {signatureUrl ? (
          <div className="mb-4">
            <div className="border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] p-4 flex items-center justify-center">
              <img src={signatureUrl} alt="Firma" className="max-h-24 object-contain" />
            </div>
            <button
              onClick={() => { setSignatureUrl(''); }}
              className="text-xs text-red-600 hover:text-red-700 mt-2 cursor-pointer"
            >
              Quitar firma
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-[#CBD5E1] rounded-xl bg-[#F8FAFC] py-8 px-4 mb-4 cursor-pointer hover:border-[#2563EB] transition-colors">
            <span className="text-2xl">✍️</span>
            <span className="text-sm text-[#64748B]">Tocá para subir tu firma</span>
            <input type="file" accept="image/*" onChange={handleSignatureFile} className="hidden" />
          </label>
        )}

        {signatureError && <p className="text-xs text-red-500 mb-3">{signatureError}</p>}

        <button
          onClick={handleSaveSignature}
          disabled={savingSignature}
          className="w-full bg-[#2563EB] text-white rounded-xl py-3 font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {savingSignature ? 'Guardando...' : 'Guardar firma'}
        </button>
      </div>

      {/* Especialidad */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-4">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-1">Especialidad</h2>
        <p className="text-xs text-[#64748B] mb-3">La IA adapta los resumenes clinicos segun tu especialidad.</p>
        <select
          value={specialty}
          onChange={e => setSpecialty(e.target.value)}
          className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC] mb-4"
        >
          {ESPECIALIDADES.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
        <button
          onClick={handleSaveSpecialty}
          disabled={savingSpecialty}
          className="w-full bg-[#2563EB] text-white rounded-xl py-3 font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {savingSpecialty ? 'Guardando...' : 'Guardar especialidad'}
        </button>
      </div>

      {/* Formato de nota */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-4">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-1">Formato de nota</h2>
        <p className="text-xs text-[#64748B] mb-3">Cómo se estructuran los resúmenes clínicos. No afecta las notas ya creadas.</p>
        <select
          value={noteFormat}
          onChange={e => setNoteFormat(e.target.value)}
          className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC] mb-2"
        >
          <option value="standard">Estándar — Motivo, Observaciones, Plan, Próximos pasos</option>
          <option value="soap">SOAP — Subjetivo, Objetivo, Análisis, Plan</option>
        </select>
        <p className="text-[11px] text-[#94A3B8] mb-4">SOAP es el formato habitual en medicina y psiquiatría.</p>
        <button
          onClick={handleSaveFormat}
          disabled={savingFormat}
          className="w-full bg-[#2563EB] text-white rounded-xl py-3 font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {savingFormat ? 'Guardando...' : 'Guardar formato'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-4">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-4">Suscripcion</h2>
        {sub?.status === 'active' ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#0F172A]">Plan</span>
              <span className="text-[#2563EB] font-semibold">NotaClinica Pro</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#0F172A]">Estado</span>
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">Activa</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[#0F172A]">Vence</span>
              <span className="text-[#64748B]">{vencimiento}</span>
            </div>
            <button
              onClick={handleCancelar}
              disabled={cancelling}
              className="w-full border border-red-300 text-red-600 rounded-xl py-3 font-medium hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {cancelling ? 'Cancelando...' : 'Cancelar suscripcion'}
            </button>
          </>
        ) : (
          <>
            <p className="text-[#64748B] mb-4">No tenes una suscripcion activa.</p>
            <button
              data-hide-in-app
              onClick={() => router.push('/suscripcion')}
              className="w-full bg-[#2563EB] text-white rounded-xl py-3 font-medium hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              Suscribirme
            </button>
            <p data-show-in-app className="text-sm text-[#64748B] leading-relaxed">
              Activá o gestioná tu suscripción desde NotaClínica en el navegador. Acá podés seguir usando tu cuenta normalmente.
            </p>
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
        <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-4">Sesion</h2>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full border border-[#E2E8F0] text-[#475569] rounded-xl py-3 font-medium hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loggingOut ? 'Cerrando sesion...' : 'Cerrar sesion'}
        </button>
      </div>
    </div>
  )
}