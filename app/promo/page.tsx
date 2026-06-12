import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  metadataBase: new URL('https://notaclinica.vercel.app'),
  title: 'NotaClínica — La consulta documentada con IA, en segundos',
  description:
    'Grabá la consulta y la IA arma el resumen clínico, las escalas, la receta y el seguimiento del paciente. Probalo 30 días gratis, sin tarjeta.',
  alternates: { canonical: '/promo' },
  openGraph: {
    type: 'website',
    locale: 'es_UY',
    url: 'https://notaclinica.vercel.app/promo',
    siteName: 'NotaClínica',
    title: 'NotaClínica — La consulta documentada con IA, en segundos',
    description: 'Grabá la consulta y la IA hace el resto. 30 días gratis, sin tarjeta.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NotaClínica' }],
  },
}

const HERO_TAGS = ['Resúmenes con IA', 'Escalas y evolución', 'Recetas con QR', 'Portal del paciente']

const TRANSCRIPT = [
  { who: 'Profesional', text: '¿Cómo venís durmiendo esta semana?' },
  { who: 'Paciente', text: 'Mejor, aunque todavía me cuesta arrancar el día.' },
  { who: 'Profesional', text: '¿Y los episodios de ansiedad?' },
  { who: 'Paciente', text: 'Bajaron bastante desde que ajustamos la medicación.' },
]

const RESUMEN = [
  { label: 'Motivo', text: 'Seguimiento de ansiedad e insomnio.' },
  { label: 'Evolución', text: 'Mejora del sueño; episodios de ansiedad en disminución con la medicación ajustada.' },
  { label: 'Plan', text: 'Mantener el esquema actual y reforzar técnicas de higiene del sueño.' },
]

const PASOS = [
  { num: '01', title: 'Grabá la consulta', desc: 'Un botón desde el celular. Funciona durante la sesión, sin interrumpir al paciente.' },
  { num: '02', title: 'La IA documenta', desc: 'Transcripción completa y resumen clínico estructurado según tu especialidad, en segundos.' },
  { num: '03', title: 'Enviá y archivá', desc: 'PDF firmado, receta con QR o envío por WhatsApp. Todo queda en el historial del paciente.' },
]

const FEATURES = [
  { title: 'Resúmenes con IA', desc: 'Motivo, evolución, diagnóstico y plan redactados según tu especialidad, en un clic.' },
  { title: 'Escalas y evolución', desc: 'PHQ-9, GAD-7 y lectura de progreso en el tiempo. El paciente puede completarlas desde su portal.' },
  { title: 'Plan de tratamiento', desc: 'Objetivos terapéuticos seguidos sesión a sesión, con su progreso a la vista.' },
  { title: 'Recetas y PDF con firma', desc: 'Documentos profesionales con tu firma y un QR para verificar su autenticidad.' },
  { title: 'Portal del paciente', desc: 'Pre-consulta, check-ins y cuestionarios antes de la sesión. Llegás con contexto.' },
  { title: 'Agenda y honorarios', desc: 'Turnos con recordatorio automático, lista de espera y control de cobros.' },
]

const CONFIANZA = [
  { title: 'Privado y cifrado', desc: 'La información viaja cifrada y cada profesional accede solo a sus pacientes (Ley 18.331).' },
  { title: '30 días gratis', desc: 'Sin tarjeta para empezar. Cancelás cuando quieras, sin penalidades.' },
  { title: 'Hecho en Uruguay', desc: 'Pensado para la práctica clínica local, con soporte directo en tu idioma.' },
]

export default function PromoPage() {
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A]">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur">
        <div
          className="px-4 sm:px-6 flex items-center justify-between h-14"
          style={{ paddingTop: 'var(--safe-top)', minHeight: 'calc(var(--safe-top) + 56px)' }}
        >
          <span className="text-xl font-light tracking-tight lowercase">notaclinica</span>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-medium text-[#0A0A0A] bg-[#F0F0F0] px-4 py-2 rounded-full hover:bg-[#E5E5E5] transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/login?tab=registro" className="text-sm font-medium bg-[#0A0A0A] text-white px-4 py-2 rounded-full hover:bg-[#262626] transition-colors">
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — gran tile redondeado oscuro con titular superpuesto */}
      <section className="px-3 sm:px-5" style={{ paddingTop: 'calc(var(--safe-top) + 56px + 12px)' }}>
        <div
          className="relative rounded-[2rem] overflow-hidden min-h-[82vh] flex flex-col justify-end p-7 sm:p-14"
          style={{ background: 'radial-gradient(120% 90% at 75% 10%, #2b2b2b 0%, #141414 45%, #0a0a0a 100%)' }}
        >
          {/* Lista de capacidades (estilo Runway), centro-derecha en desktop */}
          <div className="hidden md:flex flex-col gap-2.5 absolute right-14 top-1/2 -translate-y-1/2 text-right">
            {HERO_TAGS.map(t => (
              <span key={t} className="text-[13px] uppercase tracking-[0.12em] text-[#9A9A9A]">{t}</span>
            ))}
          </div>

          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-medium px-3.5 py-1.5 rounded-full mb-7 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              30 días gratis · Sin tarjeta
            </div>
            <h1 className="text-[2.6rem] leading-[1.05] sm:text-6xl md:text-7xl font-medium tracking-tight text-white mb-7">
              La consulta,<br />documentada por IA
            </h1>
            <p className="text-base sm:text-lg text-[#C8C8C8] max-w-md leading-relaxed mb-8">
              Grabá la sesión y NotaClínica arma el resumen clínico, las escalas, la receta y el seguimiento del paciente.
            </p>
            <Link href="/login?tab=registro"
              className="inline-flex items-center gap-1.5 bg-white text-[#0A0A0A] pl-6 pr-5 py-3.5 rounded-full font-semibold text-base hover:bg-[#EDEDED] transition-colors">
              Empezar gratis <span className="text-lg leading-none">›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* En acción: médico-paciente → resumen con IA */}
      <section className="px-3 sm:px-5 pt-24">
        <div className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#A3A3A3] mb-3">En acción</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-12 max-w-2xl">De la conversación al resumen clínico</h2>

          <div className="rounded-[2rem] border border-[#EDEDED] bg-[#FAFAFA] p-4 sm:p-8">
            <div className="bg-white rounded-3xl border border-[#EDEDED] shadow-sm overflow-hidden">
              {/* Barra superior de la sesión */}
              <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#F0F0F0]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#0A0A0A] animate-pulse" />
                  <span className="text-sm font-medium">Grabando sesión</span>
                </div>
                <span className="text-xs text-[#737373]">María G. · Psicología · 12:48</span>
              </div>

              {/* Cuerpo: conversación + resumen */}
              <div className="grid md:grid-cols-2 gap-7 sm:gap-9 p-5 sm:p-7">
                {/* Conversación médico-paciente */}
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#A3A3A3] mb-4">Conversación</p>
                  <div className="flex flex-col gap-3">
                    {TRANSCRIPT.map((t, i) => {
                      const paciente = t.who === 'Paciente'
                      return (
                        <div key={i} className={paciente ? 'pl-6' : 'pr-6'}>
                          <p className="text-[10px] uppercase tracking-[0.12em] text-[#A3A3A3] mb-1">{t.who}</p>
                          <div className={
                            'rounded-2xl px-4 py-2.5 text-sm leading-snug ' +
                            (paciente
                              ? 'bg-[#F5F5F5] text-[#0A0A0A]'
                              : 'bg-[#0A0A0A] text-white')
                          }>
                            {t.text}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Resumen con IA */}
                <div className="md:border-l md:border-[#F0F0F0] md:pl-9">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#A3A3A3] mb-4">Resumen con IA</p>
                  <div className="flex flex-col gap-3">
                    {RESUMEN.map(r => (
                      <div key={r.label} className="bg-[#FAFAFA] rounded-r-xl border-l-2 border-[#0A0A0A] px-4 py-2.5">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-[#A3A3A3] mb-1">{r.label}</p>
                        <p className="text-sm text-[#0A0A0A] leading-snug">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-[#A3A3A3] mt-4">Vista ilustrativa: la sesión se graba y la IA arma el resumen en segundos.</p>
        </div>
      </section>

      {/* En 3 pasos */}
      <section className="px-3 sm:px-5 pt-24 pb-4">
        <div className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#A3A3A3] mb-3">Cómo funciona</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-14 max-w-2xl">De la charla a la historia clínica</h2>
          <div className="grid md:grid-cols-3 gap-x-10 gap-y-10">
            {PASOS.map(s => (
              <div key={s.num}>
                <p className="text-sm text-[#A3A3A3] mb-3 tabular-nums">{s.num}</p>
                <div className="h-px bg-[#E5E5E5] mb-5" />
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-3 sm:px-5 pt-24">
        <div className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#A3A3A3] mb-3">Producto</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-14 max-w-2xl">Una sola app para toda la consulta</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-[#FAFAFA] rounded-3xl border border-[#EDEDED] p-7 hover:border-[#D4D4D4] transition-colors">
                <h3 className="text-base font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Foco salud mental — tile oscuro full-bleed */}
      <section className="px-3 sm:px-5 pt-24">
        <div
          className="rounded-[2rem] overflow-hidden px-7 sm:px-16 py-20 text-center"
          style={{ background: 'radial-gradient(110% 120% at 50% 0%, #232323 0%, #121212 50%, #0a0a0a 100%)' }}
        >
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#8A8A8A] mb-5">Ideal para salud mental</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6 max-w-3xl mx-auto leading-tight">
            Seguí la evolución del paciente, no solo la nota
          </h2>
          <p className="text-[#C8C8C8] leading-relaxed max-w-xl mx-auto">
            Escalas PHQ-9 y GAD-7 que el paciente completa desde su portal, lectura automática del progreso, plan de tratamiento por objetivos y pre-consulta antes de cada sesión. La historia clínica deja de ser un archivo: se vuelve seguimiento.
          </p>
          <Link href="/login?tab=registro"
            className="inline-flex items-center gap-1.5 mt-10 bg-white text-[#0A0A0A] pl-6 pr-5 py-3.5 rounded-full font-semibold hover:bg-[#EDEDED] transition-colors">
            Probarlo gratis <span className="text-lg leading-none">›</span>
          </Link>
        </div>
      </section>

      {/* Confianza */}
      <section className="px-3 sm:px-5 pt-24">
        <div className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#A3A3A3] mb-3">Sin riesgo</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-14 max-w-2xl">Probalo sin ningún compromiso</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {CONFIANZA.map(t => (
              <div key={t.title} className="border-t border-[#E5E5E5] pt-5">
                <h3 className="text-base font-semibold mb-2">{t.title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-3 sm:px-5 pt-24 pb-5">
        <div
          className="rounded-[2rem] overflow-hidden px-7 sm:px-16 py-20 text-center"
          style={{ background: 'radial-gradient(110% 120% at 50% 100%, #242424 0%, #121212 55%, #0a0a0a 100%)' }}
        >
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-5">Dedicá tu tiempo a tus pacientes</h2>
          <p className="text-[#C8C8C8] mb-9 max-w-md mx-auto">Probá NotaClínica 30 días gratis. Sin tarjeta, sin compromiso.</p>
          <Link href="/login?tab=registro"
            className="inline-flex items-center gap-1.5 bg-white text-[#0A0A0A] pl-7 pr-6 py-4 rounded-full font-semibold hover:bg-[#EDEDED] transition-colors">
            Empezar ahora <span className="text-lg leading-none">›</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg font-light tracking-tight lowercase">notaclinica</span>
          <div className="flex items-center gap-5 text-sm text-[#737373]">
            <Link href="/" className="hover:text-[#0A0A0A] transition-colors">Inicio</Link>
            <Link href="/login" className="hover:text-[#0A0A0A] transition-colors">Iniciar sesión</Link>
            <Link href="/privacidad" className="hover:text-[#0A0A0A] transition-colors">Privacidad</Link>
          </div>
          <p className="text-xs text-[#A3A3A3]">© 2026 Sortiplan SA · Montevideo</p>
        </div>
      </footer>

    </div>
  )
}
