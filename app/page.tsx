import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  metadataBase: new URL('https://notaclinica.vercel.app'),
  title: 'NotaClínica — Resúmenes clínicos con IA para médicos',
  description:
    'Grabá la consulta y obtené el resumen clínico en segundos. NotaClínica usa IA para que los médicos se enfoquen en sus pacientes, no en el papeleo. 30 días gratis, sin tarjeta.',
  keywords: [
    'historia clínica digital', 'resumen clínico IA', 'software médico',
    'transcripción de consultas', 'historia clínica electrónica', 'médicos Uruguay',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_UY',
    url: 'https://notaclinica.vercel.app',
    siteName: 'NotaClínica',
    title: 'NotaClínica — Resúmenes clínicos con IA para médicos',
    description:
      'Grabá la consulta y obtené el resumen clínico en segundos. 30 días gratis, sin tarjeta de crédito.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NotaClínica — Resúmenes clínicos con IA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NotaClínica — Resúmenes clínicos con IA para médicos',
    description:
      'Grabá la consulta y obtené el resumen clínico en segundos. 30 días gratis, sin tarjeta.',
    images: ['/og-image.png'],
  },
}

const ESPECIALIDADES = [
  'Psicología', 'Medicina clínica', 'Pediatría', 'Ginecología',
  'Traumatología', 'Dermatología', 'Nutrición', 'Kinesiología',
]

const PASOS = [
  { num: '1', title: 'Grabá la consulta', desc: 'Apretás un botón y grabás el audio directamente desde tu celular, incluso sin internet.' },
  { num: '2', title: 'La IA transcribe y resume', desc: 'En segundos tenés la transcripción completa y un resumen clínico estructurado por especialidad.' },
  { num: '3', title: 'Enviá y archivá', desc: 'Exportás el PDF firmado, lo enviás por WhatsApp o lo guardás en el historial del paciente.' },
]

const FEATURES = [
  { icon: '🎙️', title: 'Grabación de audio', desc: 'Grabá desde el celular. Funciona durante la consulta sin interrumpir el vínculo con el paciente.' },
  { icon: '🧠', title: 'Resúmenes con IA', desc: 'Motivo, evolución, diagnóstico y plan, redactados según tu especialidad en un clic.' },
  { icon: '📋', title: 'Historial clínico', desc: 'Repasá el contexto de las últimas sesiones con un briefing automático antes de cada consulta.' },
  { icon: '📄', title: 'Exportar PDF', desc: 'Documentos clínicos profesionales con tu firma, listos en segundos.' },
  { icon: '💬', title: 'Envío por WhatsApp', desc: 'Compartí indicaciones y resúmenes con el paciente sin salir de la app.' },
  { icon: '📅', title: 'Agenda integrada', desc: 'Turnos con recordatorio automático por email 24 horas antes y lista de espera.' },
]

const FAQS = [
  { q: '¿Mis datos y los de mis pacientes están seguros?', a: 'Sí. La información viaja cifrada y se almacena de forma privada. Cada profesional solo accede a sus propios pacientes.' },
  { q: '¿Necesito instalar algo?', a: 'No. Funciona desde el navegador y también podés instalarla como app en tu iPhone o Android.' },
  { q: '¿Para qué especialidades sirve?', a: 'Los resúmenes se adaptan a psicología, medicina clínica, pediatría, ginecología, traumatología, dermatología, nutrición y kinesiología.' },
  { q: '¿Qué pasa cuando termina la prueba gratis?', a: 'Tenés 30 días gratis sin tarjeta. Al terminar, decidís si seguir por $49 USD al mes. Cancelás cuando quieras.' },
  { q: '¿La IA reemplaza mi criterio clínico?', a: 'No. Es una asistente: te ahorra el papeleo y ordena la información, pero el resumen siempre queda bajo tu revisión y edición.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur border-b border-[#E2E8F0] dark:border-[#1E293B]">
        <div
          className="px-4 flex items-center justify-between h-14"
          style={{ paddingTop: 'var(--safe-top)', paddingLeft: 'max(env(safe-area-inset-left), 16px)', paddingRight: 'max(env(safe-area-inset-right), 16px)', minHeight: 'calc(var(--safe-top) + 56px)' }}
        >
          <span className="text-xl font-light tracking-tight lowercase">notaclinica</span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/login?tab=registro" className="text-sm font-medium bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors">
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{ paddingTop: 'calc(var(--safe-top) + 56px + 56px)', paddingLeft: 'max(env(safe-area-inset-left), 24px)', paddingRight: 'max(env(safe-area-inset-right), 24px)' }}
        className="pb-16 text-center max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#93C5FD] text-sm font-medium px-4 py-1.5 rounded-full mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#93C5FD]" />
          30 días gratis · Sin tarjeta de crédito
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
          Tu consulta, documentada<br />
          <span className="text-[#2563EB]">en segundos</span>
        </h1>
        <p className="text-lg md:text-xl text-[#64748B] dark:text-[#94A3B8] mb-10 max-w-xl mx-auto leading-relaxed">
          NotaClínica graba la consulta y genera el resumen clínico con IA. Vos te enfocás en el paciente, nosotros nos ocupamos del papeleo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login?tab=registro"
            className="bg-[#2563EB] text-white px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-[#1D4ED8] transition-colors shadow-sm">
            Empezar 30 días gratis →
          </Link>
          <Link href="#como-funciona"
            className="border border-[#E2E8F0] dark:border-[#334155] text-[#475569] dark:text-[#CBD5E1] px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-colors">
            Ver cómo funciona
          </Link>
        </div>
        <p className="text-xs text-[#94A3B8] mt-6">Hecho en Uruguay · Para médicos de todas las especialidades</p>
      </section>

      {/* Mockup de la app */}
      <section className="px-6 pb-20">
        <div className="max-w-sm mx-auto">
          <div className="rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#1E293B] p-3 shadow-xl">
            <div className="rounded-[2rem] bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] overflow-hidden">
              {/* barra superior simulada */}
              <div className="px-5 pt-5 pb-3 border-b border-[#F1F5F9] dark:border-[#1E293B]">
                <p className="text-[10px] uppercase tracking-widest text-[#94A3B8]">Resumen de sesión</p>
                <p className="text-sm font-semibold mt-0.5">María G. · Psicología</p>
              </div>
              {/* contenido simulado */}
              <div className="px-5 py-4 space-y-3 text-left">
                <div>
                  <p className="text-[11px] font-semibold text-[#2563EB] mb-1">Motivo de consulta</p>
                  <div className="space-y-1.5">
                    <div className="h-2 rounded-full bg-[#E2E8F0] dark:bg-[#334155] w-full" />
                    <div className="h-2 rounded-full bg-[#E2E8F0] dark:bg-[#334155] w-4/5" />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#2563EB] mb-1">Evolución</p>
                  <div className="space-y-1.5">
                    <div className="h-2 rounded-full bg-[#E2E8F0] dark:bg-[#334155] w-full" />
                    <div className="h-2 rounded-full bg-[#E2E8F0] dark:bg-[#334155] w-11/12" />
                    <div className="h-2 rounded-full bg-[#E2E8F0] dark:bg-[#334155] w-3/4" />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#2563EB] mb-1">Plan terapéutico</p>
                  <div className="space-y-1.5">
                    <div className="h-2 rounded-full bg-[#E2E8F0] dark:bg-[#334155] w-5/6" />
                    <div className="h-2 rounded-full bg-[#E2E8F0] dark:bg-[#334155] w-2/3" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="flex-1 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white text-[11px] font-medium">PDF</div>
                  <div className="flex-1 h-8 rounded-lg bg-[#E8F4E8] dark:bg-[#14532D] text-[#2D6A2D] dark:text-[#86EFAC] flex items-center justify-center text-[11px] font-medium">WhatsApp</div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-[#94A3B8] mt-4">Vista real del resumen generado tras una consulta</p>
        </div>
      </section>

      {/* Stats / confianza */}
      <section className="py-12 bg-[#F8FAFC] dark:bg-[#0B1220] border-y border-[#E2E8F0] dark:border-[#1E293B]">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          {[
            { value: '30 min', label: 'ahorrados por consulta' },
            { value: '< 30 s', label: 'para el resumen clínico' },
            { value: '100%', label: 'privado y seguro' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl md:text-3xl font-bold text-[#2563EB] mb-1">{s.value}</p>
              <p className="text-xs md:text-sm text-[#64748B] dark:text-[#94A3B8]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-20 px-6 max-w-4xl mx-auto scroll-mt-24">
        <h2 className="text-3xl font-bold text-center mb-3 tracking-tight">Así de simple</h2>
        <p className="text-[#64748B] dark:text-[#94A3B8] text-center mb-14">Tres pasos para documentar una consulta completa</p>
        <div className="grid md:grid-cols-3 gap-10">
          {PASOS.map(s => (
            <div key={s.num} className="text-center">
              <div className="w-11 h-11 bg-[#2563EB] text-white rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-5">
                {s.num}
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Especialidades */}
      <section className="py-16 px-6 bg-[#F8FAFC] dark:bg-[#0B1220] border-y border-[#E2E8F0] dark:border-[#1E293B]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3 tracking-tight">Adaptado a tu especialidad</h2>
          <p className="text-[#64748B] dark:text-[#94A3B8] mb-8 text-sm">Los resúmenes se redactan con la estructura propia de cada práctica.</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {ESPECIALIDADES.map(e => (
              <span key={e} className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-sm text-[#475569] dark:text-[#CBD5E1] px-4 py-2 rounded-full">
                {e}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14 tracking-tight">Todo lo que necesitás</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-6 flex gap-4">
                <span className="text-2xl shrink-0">{f.icon}</span>
                <div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">Preguntas frecuentes</h2>
        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <details key={i} className="group bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl px-5 py-4">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-sm">
                {f.q}
                <span className="text-[#94A3B8] transition-transform group-open:rotate-45 text-lg leading-none ml-3">+</span>
              </summary>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Precio */}
      <section className="py-20 px-6 max-w-lg mx-auto text-center">
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Un precio simple</h2>
        <p className="text-[#64748B] dark:text-[#94A3B8] mb-10">Sin sorpresas. Cancelás cuando quieras.</p>
        <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-[#E2E8F0] dark:border-[#334155] p-8 text-left">
          <p className="text-center text-5xl font-bold mb-1">$49<span className="text-xl font-normal text-[#64748B] dark:text-[#94A3B8]"> USD/mes</span></p>
          <p className="text-center text-[#2563EB] font-medium mb-8">30 días gratis para empezar</p>
          {[
            'Pacientes ilimitados',
            'Transcripción automática',
            'Resúmenes con IA por especialidad',
            'Exportar PDF con tu firma',
            'Agenda y recordatorios',
            'Soporte incluido',
          ].map(f => (
            <p key={f} className="text-sm mb-3 flex items-center gap-2">
              <span className="text-[#2563EB]">✓</span> {f}
            </p>
          ))}
          <Link href="/login?tab=registro"
            className="block w-full text-center bg-[#2563EB] text-white py-4 rounded-xl font-semibold mt-6 hover:bg-[#1D4ED8] transition-colors">
            Empezar 30 días gratis →
          </Link>
          <p className="text-center text-xs text-[#94A3B8] mt-4">Sin tarjeta de crédito · Cancelás cuando quieras</p>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto bg-[#0A0A0A] rounded-3xl px-8 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">Dedicá tu tiempo a tus pacientes</h2>
          <p className="text-[#DBEAFE] mb-8 max-w-md mx-auto">Probá NotaClínica 30 días gratis. Sin tarjeta, sin compromiso.</p>
          <Link href="/login?tab=registro"
            className="inline-block bg-white text-[#2563EB] px-8 py-3.5 rounded-xl font-semibold hover:bg-[#F8FAFC] transition-colors">
            Empezar ahora →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] px-6 py-14 mt-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <span className="text-lg font-light tracking-tight lowercase text-white">notaclinica</span>
              <p className="text-xs text-[#999999] mt-3 leading-relaxed max-w-[220px]">Documentación clínica con IA para profesionales de la salud.</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white mb-3">Producto</p>
              <ul className="space-y-2.5 text-sm text-[#999999]">
                <li><Link href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</Link></li>
                <li><Link href="/login?tab=registro" className="hover:text-white transition-colors">Empezar gratis</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Iniciar sesión</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white mb-3">Empresa</p>
              <ul className="space-y-2.5 text-sm text-[#999999]">
                <li>Sortiplan SA</li>
                <li><a href="mailto:contacto@vibraco.com.uy" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white mb-3">Legal</p>
              <ul className="space-y-2.5 text-sm text-[#999999]">
                <li><Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#222222] pt-6">
            <p className="text-xs text-[#666666]">© 2026 NotaClínica · Sortiplan SA · Montevideo, Uruguay</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
