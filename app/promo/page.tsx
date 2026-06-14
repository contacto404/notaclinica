import type { Metadata } from 'next'
import Link from 'next/link'
import EspecialidadesDemo from './EspecialidadesDemo'
import MotionProvider from './MotionProvider'
import DemoEnAccion from './DemoEnAccion'

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
    images: [{ url: '/og-promo.png', width: 1200, height: 630, alt: 'NotaClínica — Terminá la consulta con la nota clínica ya lista' }],
  },
}

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
  { title: 'Te acompañamos uno a uno', desc: 'Te ayudamos a configurarlo y a documentar tu primera sesión. Soporte directo, sin call centers.' },
]

const STATS = [
  { value: '12 h', label: 'menos de papeleo por semana' },
  { value: '<30 s', label: 'para el resumen clínico' },
  { value: '+15 min', label: 'ahorrados por paciente' },
  { value: '100%', label: 'bajo tu revisión y edición' },
]

// Marquee de especialidades (placeholder hasta tener logos de clientes reales)
const ESPECIALIDADES_MARQUEE = [
  'Psicología', 'Psiquiatría', 'Medicina clínica', 'Pediatría', 'Ginecología',
  'Traumatología', 'Dermatología', 'Nutrición', 'Kinesiología', 'Cardiología',
  'Neurología', 'Fonoaudiología',
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
  { q: '¿Cuánto tarda en generar el resumen?', a: 'Segundos. Apenas termina la transcripción, la IA devuelve el resumen clínico estructurado, listo para que lo revises.' },
  { q: '¿En qué idioma funciona la transcripción?', a: 'Está optimizada para español, incluido el de Uruguay y la región. Transcribe la consulta y redacta el resumen en español.' },
  { q: '¿Cumple con las normativas de datos de salud?', a: 'La información viaja cifrada y cada profesional accede solo a sus propios pacientes. Cumplimos con la Ley 18.331 de protección de datos de Uruguay. Para requisitos específicos de otros países, escribinos y lo vemos.' },
]

const kicker = 'text-xs font-semibold uppercase tracking-[0.14em] text-[#6B6B6B] mb-3'

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'NotaClínica',
      applicationCategory: 'MedicalApplication',
      operatingSystem: 'Web, iOS, Android',
      description: 'NotaClínica graba la consulta y la IA arma el resumen clínico en segundos. Documentación clínica con IA para profesionales de la salud.',
      url: 'https://notaclinica.vercel.app/promo',
      offers: {
        '@type': 'Offer',
        price: '49',
        priceCurrency: 'USD',
        description: '30 días gratis, sin tarjeta. Luego US$49/mes.',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
}

export default function PromoPage() {
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <MotionProvider />

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
          {/* Glow animado de fondo */}
          <div className="promo-glow pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(42% 46% at 66% 18%, rgba(255,255,255,0.18), transparent 70%)' }} />

          <div className="relative z-10 grid md:grid-cols-2 gap-10 md:gap-8 items-center">
            {/* Texto */}
            <div className="max-w-xl">
              <div data-reveal className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-medium px-3.5 py-1.5 rounded-full mb-7 backdrop-blur" style={{ transitionDelay: '0.05s' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                30 días gratis · Sin tarjeta
              </div>
              <h1 data-reveal className="text-[2.4rem] leading-[1.06] sm:text-5xl md:text-6xl font-medium tracking-tight text-white mb-6" style={{ transitionDelay: '0.12s' }}>
                Terminá la consulta con la nota clínica <span className="promo-shiny">ya lista</span>
              </h1>
              <p data-reveal className="text-base sm:text-lg text-[#C8C8C8] max-w-md leading-relaxed mb-8" style={{ transitionDelay: '0.2s' }}>
                ¿Todavía escribís la historia clínica después de cada paciente? NotaClínica graba la sesión y la IA arma el resumen en segundos. Volvés a estar presente con tu paciente, no con la pantalla.
              </p>
              <div data-reveal className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4" style={{ transitionDelay: '0.28s' }}>
                <Link href="/login?tab=registro"
                  className="inline-flex items-center justify-center gap-1.5 bg-white text-[#0A0A0A] pl-7 pr-6 py-4 rounded-full font-semibold text-base hover:bg-[#EDEDED] transition-colors shadow-lg">
                  Empezar 30 días gratis <span className="text-lg leading-none">›</span>
                </Link>
                <Link href="#como-funciona"
                  className="inline-flex items-center justify-center gap-1.5 text-white/90 border border-white/25 px-6 py-4 rounded-full font-medium text-base hover:bg-white/10 transition-colors">
                  Ver cómo funciona
                </Link>
              </div>
              <p data-reveal className="text-[13px] text-[#9A9A9A] mt-5" style={{ transitionDelay: '0.34s' }}>Cancelás cuando quieras, sin compromiso</p>
            </div>

            {/* El producto en uso real */}
            <div data-reveal className="flex justify-center md:justify-end" style={{ transitionDelay: '0.22s' }}>
              <img
                src="/screenshots/consulta.jpg"
                alt="Profesional usando NotaClínica en el celular durante una consulta"
                className="promo-float w-[280px] sm:w-[340px] rounded-[1.75rem] shadow-2xl ring-1 ring-white/10"
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
          <span>⏱️ Resumen en segundos</span>
        </div>
      </section>

      {/* Marquee de especialidades (cambiar por logos de clientes cuando los haya) */}
      <section className="pt-14 overflow-hidden">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#6B6B6B] mb-7">Para profesionales de todas las especialidades</p>
        <div
          className="relative"
          style={{
            WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
            maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
          }}
        >
          <div className="promo-marquee">
            {[...ESPECIALIDADES_MARQUEE, ...ESPECIALIDADES_MARQUEE].map((e, i) => (
              <span key={i} className="text-lg sm:text-2xl font-medium text-[#0A0A0A] mr-12 whitespace-nowrap">{e}</span>
            ))}
          </div>
        </div>
      </section>

      {/* En acción: médico-paciente → resumen con IA */}
      <section className="px-3 sm:px-5 pt-20">
        <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className={kicker}>En acción</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-12 max-w-2xl">De la conversación al resumen clínico</h2>

          <DemoEnAccion />
          <p className="text-center text-xs text-[#A3A3A3] mt-4">Vista ilustrativa: la sesión se graba y la IA arma el resumen en segundos.</p>
        </div>
      </section>

      {/* Números — estimaciones honestas */}
      <section className="px-3 sm:px-5 pt-24">
        <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className={kicker}>El impacto</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-12 max-w-2xl">Menos pantalla, más paciente</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-9">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-4xl md:text-5xl font-medium tracking-tight">{s.value}</p>
                <p className="text-sm text-[#525252] mt-2 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#A3A3A3] mt-8">Estimaciones según uso típico. Tu experiencia puede variar.</p>
        </div>
      </section>

      {/* En 3 pasos */}
      <section id="como-funciona" className="px-3 sm:px-5 pt-24 pb-4 scroll-mt-20">
        <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
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
        <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
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
          data-reveal
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
          <Link href="/login?tab=registro"
            className="inline-flex items-center gap-1.5 bg-white text-[#0A0A0A] pl-6 pr-5 py-3.5 rounded-full font-semibold hover:bg-[#EDEDED] transition-colors">
            Probarlo gratis <span className="text-lg leading-none">›</span>
          </Link>
        </div>
      </section>

      {/* Ejemplo interactivo por especialidad */}
      <section className="px-3 sm:px-5 pt-24">
        <div data-reveal className="max-w-3xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Un ejemplo por especialidad</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-3 max-w-2xl">Tocá tu especialidad y mirá el resumen</h2>
          <p className="text-[#525252] leading-relaxed max-w-xl mb-10">El mismo motor, adaptado a la estructura de cada práctica clínica.</p>
          <EspecialidadesDemo />
        </div>
      </section>

      {/* Testimonios — se muestra solo cuando hay testimonios reales cargados */}
      {TESTIMONIOS.length > 0 && (
        <section className="px-3 sm:px-5 pt-24">
          <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
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
        <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
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

      {/* Precio */}
      <section id="precio" className="px-3 sm:px-5 pt-24 scroll-mt-20">
        <div data-reveal className="max-w-4xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Precio</p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-3 max-w-2xl">Un plan simple, sin sorpresas</h2>
          <p className="text-[#525252] leading-relaxed max-w-xl mb-10">Probás 30 días gratis, sin tarjeta. Si te sirve, seguís por un precio menor al de una consulta. Cancelás cuando quieras.</p>

          <div className="grid md:grid-cols-[1.3fr_1fr] gap-4">
            {/* Plan individual */}
            <div className="bg-[#0A0A0A] text-white rounded-3xl p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9A9A9A] mb-4">NotaClínica Pro</p>
              <p className="text-5xl font-medium tracking-tight">US$49<span className="text-lg text-[#9A9A9A] font-normal"> /mes</span></p>
              <p className="text-sm text-[#C8C8C8] mt-2 mb-7">El equivalente a una consulta. 30 días gratis para empezar.</p>
              <ul className="flex flex-col gap-2.5 mb-8">
                {['Pacientes y sesiones ilimitados', 'Transcripción y resúmenes con IA', 'Escalas, evolución y plan de tratamiento', 'Recetas y PDF con tu firma', 'Agenda, portal del paciente y honorarios', 'Soporte directo'].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#EDEDED]">
                    <span className="text-white mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login?tab=registro"
                className="inline-flex items-center justify-center gap-1.5 bg-white text-[#0A0A0A] w-full py-3.5 rounded-full font-semibold hover:bg-[#EDEDED] transition-colors">
                Empezar 30 días gratis <span className="text-lg leading-none">›</span>
              </Link>
            </div>

            {/* Clínicas */}
            <div className="border border-[#E5E5E5] rounded-3xl p-8 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B6B6B] mb-4">Clínicas y equipos</p>
              <h3 className="text-xl font-semibold mb-2">¿Varios profesionales?</h3>
              <p className="text-sm text-[#525252] leading-relaxed mb-6">Armamos un plan a medida para tu clínica o consultorio con varios profesionales. Escribinos y lo vemos juntos.</p>
              <a href="mailto:sortiplansa@gmail.com"
                className="mt-auto inline-flex items-center justify-center gap-1.5 border border-[#0A0A0A] text-[#0A0A0A] w-full py-3.5 rounded-full font-semibold hover:bg-[#FAFAFA] transition-colors">
                Hablar con nosotros
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-3 sm:px-5 pt-24">
        <div data-reveal className="max-w-3xl mx-auto px-2 sm:px-4">
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
        <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
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
          data-reveal
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
                <li><a href="mailto:sortiplansa@gmail.com" className="hover:text-[#0A0A0A] transition-colors">sortiplansa@gmail.com</a></li>
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
