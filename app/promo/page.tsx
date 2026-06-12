import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  metadataBase: new URL('https://notaclinica.vercel.app'),
  title: 'NotaClínica — Terminá la consulta con la nota clínica ya lista',
  description:
    'NotaClínica graba la consulta y la IA arma el resumen clínico en segundos. Ahorrá horas de papeleo y dedicáselas a tus pacientes. 30 días gratis, sin tarjeta.',
  alternates: { canonical: '/promo' },
  openGraph: {
    type: 'website',
    locale: 'es_UY',
    url: 'https://notaclinica.vercel.app/promo',
    siteName: 'NotaClínica',
    title: 'NotaClínica — Terminá la consulta con la nota clínica ya lista',
    description: 'Grabá la consulta y la IA hace el resto. 30 días gratis, sin tarjeta.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'NotaClínica' }],
  },
}

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

const ESPECIALIDADES = [
  'Psicología', 'Psiquiatría', 'Medicina clínica', 'Pediatría',
  'Nutrición', 'Ginecología', 'Dermatología', 'Kinesiología',
]

const CONFIANZA = [
  { title: 'Privado y cifrado', desc: 'La información viaja cifrada y cada profesional accede solo a sus pacientes (Ley 18.331).' },
  { title: '30 días gratis', desc: 'Sin tarjeta para empezar. Cancelás cuando quieras, sin penalidades.' },
  { title: 'Soporte directo', desc: 'Hablás directo con el equipo cuando lo necesitás, sin call centers ni demoras.' },
]

// Reemplazá por testimonios REALES de profesionales (con nombre, especialidad y, si querés, foto).
// La sección se muestra automáticamente cuando este arreglo tiene contenido.
const TESTIMONIOS: { quote: string; name: string; role: string }[] = []

const FAQS = [
  { q: '¿Puedo editar el resumen que genera la IA?', a: 'Sí. La IA arma el borrador y vos lo revisás y editás antes de guardarlo. El criterio clínico siempre es tuyo: es una asistente, no un reemplazo.' },
  { q: '¿Funciona sin conexión a internet?', a: 'Podés grabar la sesión sin conexión. La transcripción y el resumen con IA se generan en cuanto recuperás internet.' },
  { q: '¿Qué pasa con mis datos si cancelo?', a: 'Tus datos siguen siendo tuyos. Podés exportar el historial completo de cada paciente en PDF en cualquier momento, antes o después de cancelar.' },
  { q: '¿Para qué especialidades sirve?', a: 'Los resúmenes se adaptan a tu especialidad: psicología, psiquiatría, medicina clínica, pediatría, nutrición y más. Lo configurás en un clic.' },
  { q: '¿Mis datos y los de mis pacientes están seguros?', a: 'Sí. La información viaja cifrada y cada profesional accede únicamente a sus propios pacientes. Cumplimos con la Ley 18.331 de protección de datos.' },
  { q: '¿Necesito instalar algo?', a: 'No. Funciona desde el navegador y también se puede instalar como app en tu iPhone o Android.' },
]

const kicker = 'text-xs font-semibold uppercase tracking-[0.14em] text-[#6B6B6B] mb-3'

export default function PromoPage() {
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A]">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur">
        <div
          className="flex items-center justify-between gap-3 h-14"
          style={{
            paddingTop: 'var(--safe-top)',
            paddingLeft: 'max(env(safe-area-inset-left), 16px)',
            paddingRight: 'max(env(safe-area-inset-right), 16px)',
            minHeight: 'calc(var(--safe-top) + 56px)',
          }}
        >
          <span className="text-lg sm:text-xl font-light tracking-tight lowercase shrink-0">notaclinica</span>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/login" className="hidden sm:inline-flex text-sm font-medium text-[#0A0A0A] bg-[#F0F0F0] px-4 py-2 rounded-full hover:bg-[#E5E5E5] transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/login?tab=registro" className="text-[13px] sm:text-sm font-medium bg-[#0A0A0A] text-white px-3.5 sm:px-4 py-2 rounded-full hover:bg-[#262626] transition-colors whitespace-nowrap">
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — beneficio + captura real del producto */}
      <section className="px-3 sm:px-5" style={{ paddingTop: 'calc(var(--safe-top) + 56px + 12px)' }}>
        <div
          className="relative rounded-[2rem] overflow-hidden p-7 sm:p-14"
          style={{ background: 'radial-gradient(120% 90% at 78% 12%, #2b2b2b 0%, #141414 45%, #0a0a0a 100%)' }}
        >
          <div className="grid md:grid-cols-2 gap-10 md:gap-8 items-center">
            {/* Texto */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-medium px-3.5 py-1.5 rounded-full mb-7 backdrop-blur">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                30 días gratis · Sin tarjeta
              </div>
              <h1 className="text-[2.4rem] leading-[1.06] sm:text-5xl md:text-6xl font-medium tracking-tight text-white mb-6">
                Terminá la consulta con la nota clínica ya lista
              </h1>
              <p className="text-base sm:text-lg text-[#C8C8C8] max-w-md leading-relaxed mb-8">
                ¿Todavía escribís la historia clínica después de cada paciente? NotaClínica graba la sesión y la IA arma el resumen en segundos. Las horas de papeleo quedan para vos.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <Link href="/login?tab=registro"
                  className="inline-flex items-center justify-center gap-1.5 bg-white text-[#0A0A0A] pl-7 pr-6 py-4 rounded-full font-semibold text-base hover:bg-[#EDEDED] transition-colors shadow-lg">
                  Empezar 30 días gratis <span className="text-lg leading-none">›</span>
                </Link>
                <Link href="#como-funciona"
                  className="inline-flex items-center justify-center gap-1.5 text-white/90 border border-white/25 px-6 py-4 rounded-full font-medium text-base hover:bg-white/10 transition-colors">
                  Ver cómo funciona
                </Link>
              </div>
              <p className="text-[13px] text-[#9A9A9A] mt-5">Desde US$49/mes · Cancelás cuando quieras · Sin tarjeta para probar</p>
            </div>

            {/* Captura real del producto */}
            <div className="flex justify-center md:justify-end">
              <img
                src="/screenshots/app-estadisticas.png"
                alt="Pantalla de NotaClínica mostrando estadísticas y retención de pacientes"
                className="w-[230px] sm:w-[260px] rounded-[2rem] shadow-2xl ring-1 ring-white/15"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tira de confianza (honesta) */}
      <section className="px-5 pt-7">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-[#525252]">
          <span>🔒 Datos cifrados</span>
          <span className="text-[#D4D4D4]">·</span>
          <span>🩺 Todas las especialidades</span>
          <span className="text-[#D4D4D4]">·</span>
          <span>🎁 30 días gratis, sin tarjeta</span>
        </div>
      </section>

      {/* En acción: médico-paciente → resumen con IA */}
      <section className="px-3 sm:px-5 pt-20">
        <div className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className={kicker}>En acción</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-12 max-w-2xl">De la conversación al resumen clínico</h2>

          <div className="rounded-[2rem] border border-[#EDEDED] bg-[#FAFAFA] p-4 sm:p-8">
            <div className="bg-white rounded-3xl border border-[#EDEDED] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#F0F0F0]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#0A0A0A] animate-pulse" />
                  <span className="text-sm font-medium">Grabando sesión</span>
                </div>
                <span className="text-xs text-[#737373]">María G. · Psicología · 12:48</span>
              </div>

              <div className="grid md:grid-cols-2 gap-7 sm:gap-9 p-5 sm:p-7">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B6B6B] mb-4 font-semibold">Conversación</p>
                  <div className="flex flex-col gap-3">
                    {TRANSCRIPT.map((t, i) => {
                      const paciente = t.who === 'Paciente'
                      return (
                        <div key={i} className={paciente ? 'pl-6' : 'pr-6'}>
                          <p className="text-[10px] uppercase tracking-[0.12em] text-[#A3A3A3] mb-1">{t.who}</p>
                          <div className={
                            'rounded-2xl px-4 py-2.5 text-sm leading-snug ' +
                            (paciente ? 'bg-[#F5F5F5] text-[#0A0A0A]' : 'bg-[#0A0A0A] text-white')
                          }>
                            {t.text}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="md:border-l md:border-[#F0F0F0] md:pl-9">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B6B6B] mb-4 font-semibold">Resumen con IA</p>
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
      <section id="como-funciona" className="px-3 sm:px-5 pt-24 pb-4 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Cómo funciona</p>
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
          <p className={kicker}>Producto</p>
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

      {/* Adaptado a tu especialidad — tile oscuro */}
      <section className="px-3 sm:px-5 pt-24">
        <div
          className="rounded-[2rem] overflow-hidden px-7 sm:px-16 py-20 text-center"
          style={{ background: 'radial-gradient(110% 120% at 50% 0%, #232323 0%, #121212 50%, #0a0a0a 100%)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9A9A9A] mb-5">Se adapta a tu especialidad</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6 max-w-3xl mx-auto leading-tight">
            Seguí la evolución del paciente, no solo la nota
          </h2>
          <p className="text-[#C8C8C8] leading-relaxed max-w-xl mx-auto mb-9">
            Los resúmenes se redactan con la estructura propia de cada práctica. Y para salud mental sumás escalas PHQ-9 y GAD-7, lectura del progreso y plan de tratamiento por objetivos. Vos elegís el formato.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto">
            {ESPECIALIDADES.map(e => (
              <span key={e} className="text-sm text-[#D4D4D4] border border-white/15 rounded-full px-4 py-1.5">{e}</span>
            ))}
          </div>
          <Link href="/login?tab=registro"
            className="inline-flex items-center gap-1.5 mt-10 bg-white text-[#0A0A0A] pl-6 pr-5 py-3.5 rounded-full font-semibold hover:bg-[#EDEDED] transition-colors">
            Probarlo gratis <span className="text-lg leading-none">›</span>
          </Link>
        </div>
      </section>

      {/* Testimonios — se muestra solo cuando hay testimonios reales cargados */}
      {TESTIMONIOS.length > 0 && (
        <section className="px-3 sm:px-5 pt-24">
          <div className="max-w-5xl mx-auto px-2 sm:px-4">
            <p className={kicker}>Lo que dicen</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-14 max-w-2xl">Profesionales que ya lo usan</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {TESTIMONIOS.map((t, i) => (
                <div key={i} className="bg-[#FAFAFA] rounded-3xl border border-[#EDEDED] p-7">
                  <p className="text-base text-[#0A0A0A] leading-relaxed mb-5">“{t.quote}”</p>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-sm text-[#737373]">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Confianza */}
      <section className="px-3 sm:px-5 pt-24">
        <div className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Sin riesgo</p>
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

      {/* FAQ */}
      <section className="px-3 sm:px-5 pt-24">
        <div className="max-w-3xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Preguntas frecuentes</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-12 max-w-2xl">Antes de empezar</h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((f, i) => (
              <details key={i} className="group bg-[#FAFAFA] border border-[#EDEDED] rounded-2xl px-5 py-4">
                <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-[15px]">
                  {f.q}
                  <span className="text-[#A3A3A3] transition-transform group-open:rotate-45 text-xl leading-none ml-3">+</span>
                </summary>
                <p className="text-sm text-[#525252] leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Descargá la app */}
      <section className="px-3 sm:px-5 pt-24">
        <div className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Descargá la app</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6 max-w-2xl">Usala donde estés</h2>
          <p className="text-[#525252] leading-relaxed max-w-xl mb-10">
            Funciona desde el navegador y se instala como app en tu celular. En iPhone: <span className="text-[#0A0A0A]">Compartir → Agregar a inicio</span>. En Android: <span className="text-[#0A0A0A]">Instalar app</span>.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href="/login?tab=registro"
              className="inline-flex items-center justify-center gap-1.5 bg-[#0A0A0A] text-white px-7 py-3.5 rounded-full font-semibold text-base hover:bg-[#262626] transition-colors">
              Usar gratis ahora <span className="text-lg leading-none">›</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="relative flex items-center gap-3 border border-[#E5E5E5] rounded-2xl px-5 py-2.5 opacity-80 select-none">
                <svg viewBox="0 0 384 512" className="w-6 h-6 fill-[#0A0A0A] shrink-0" aria-hidden="true">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
                <div className="text-left leading-tight">
                  <p className="text-[10px] text-[#737373]">Próximamente en</p>
                  <p className="text-sm font-semibold text-[#0A0A0A]">App Store</p>
                </div>
              </div>

              <div className="relative flex items-center gap-3 border border-[#E5E5E5] rounded-2xl px-5 py-2.5 opacity-80 select-none">
                <svg viewBox="0 0 512 512" className="w-5 h-5 fill-[#0A0A0A] shrink-0" aria-hidden="true">
                  <path d="M47 32C37 37 31 47 31 60v392c0 13 6 23 16 28l228-224L47 32zm262 196 57-56-238-138c-9-5-18-6-26-3l207 197zm0 56L101 481c8 3 17 2 26-3l238-138-56-56zm65-65 75-44c20-12 20-39 0-51l-75-43-62 61 62 61z"/>
                </svg>
                <div className="text-left leading-tight">
                  <p className="text-[10px] text-[#737373]">Próximamente en</p>
                  <p className="text-sm font-semibold text-[#0A0A0A]">Google Play</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-3 sm:px-5 pt-24 pb-5">
        <div
          className="rounded-[2rem] overflow-hidden px-7 sm:px-16 py-20 text-center"
          style={{ background: 'radial-gradient(110% 120% at 50% 100%, #242424 0%, #121212 55%, #0a0a0a 100%)' }}
        >
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-5">Recuperá tus horas. Empezá hoy.</h2>
          <p className="text-[#C8C8C8] mb-9 max-w-md mx-auto">Probá NotaClínica 30 días gratis, sin límite de consultas y sin tarjeta. Cancelás cuando quieras.</p>
          <Link href="/login?tab=registro"
            className="inline-flex items-center gap-1.5 bg-white text-[#0A0A0A] pl-7 pr-6 py-4 rounded-full font-semibold hover:bg-[#EDEDED] transition-colors shadow-lg">
            Empezar ahora <span className="text-lg leading-none">›</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-[#EDEDED] mt-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div>
            <span className="text-lg font-light tracking-tight lowercase">notaclinica</span>
            <p className="text-sm text-[#737373] mt-2 max-w-xs leading-relaxed">Documentación clínica con IA para profesionales de la salud.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0A0A0A] mb-3">Producto</p>
              <ul className="space-y-2 text-sm text-[#737373]">
                <li><Link href="/" className="hover:text-[#0A0A0A] transition-colors">Inicio</Link></li>
                <li><Link href="/login?tab=registro" className="hover:text-[#0A0A0A] transition-colors">Empezar gratis</Link></li>
                <li><Link href="/login" className="hover:text-[#0A0A0A] transition-colors">Iniciar sesión</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0A0A0A] mb-3">Contacto</p>
              <ul className="space-y-2 text-sm text-[#737373]">
                <li><a href="mailto:contacto@vibraco.com.uy" className="hover:text-[#0A0A0A] transition-colors">contacto@vibraco.com.uy</a></li>
                <li><a href="https://wa.me/598" target="_blank" rel="noopener noreferrer" className="hover:text-[#0A0A0A] transition-colors">WhatsApp</a></li>
                <li><Link href="/privacidad" className="hover:text-[#0A0A0A] transition-colors">Privacidad</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="max-w-5xl mx-auto text-xs text-[#A3A3A3] mt-10">© 2026 NotaClínica · Sortiplan SA · Montevideo, Uruguay</p>
      </footer>

    </div>
  )
}
