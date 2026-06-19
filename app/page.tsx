import type { Metadata } from 'next'
import Link from 'next/link'
import EspecialidadesDemo from './promo/EspecialidadesDemo'
import MotionProvider from './promo/MotionProvider'
import DemoEnAccion from './promo/DemoEnAccion'
import StatsCounter from './promo/StatsCounter'
import HeroNotaDemo from './promo/HeroNotaDemo'
import QuizAhorro from './promo/QuizAhorro'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.notaclinica.app'),
  title: 'NotaClínica — Terminá la consulta con la nota clínica ya lista',
  description:
    'NotaClínica graba la consulta y la IA arma el resumen clínico en segundos. Ahorrá horas de papeleo y dedicáselas a tus pacientes. 30 días gratis, sin tarjeta.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_UY',
    url: 'https://www.notaclinica.app',
    siteName: 'NotaClínica',
    title: 'NotaClínica — Terminá la consulta con la nota clínica ya lista',
    description: 'Grabá la consulta y la IA hace el resto. 30 días gratis, sin tarjeta.',
    images: [{ url: '/og-promo-v3.png', width: 1200, height: 630, alt: 'NotaClínica — Terminá la consulta con la nota clínica ya lista' }],
  },
}

const PASOS = [
  { num: '01', title: 'Grabá la consulta', desc: 'Un botón desde el celular. Funciona durante la sesión, sin interrumpir al paciente.' },
  { num: '02', title: 'La IA arma el resumen', desc: 'Transcripción completa y resumen clínico estructurado según tu especialidad, en segundos.' },
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
  { q: 'Si el audio no se guarda, ¿puedo corregir la transcripción?', a: 'Sí. La transcripción y el resumen quedan guardados y los podés editar las veces que quieras. El audio se usa solo para transcribir en el momento y no se almacena, así que la edición es sobre el texto, no sobre el audio.' },
  { q: '¿Qué pasa con mis datos si cancelo?', a: 'Tus datos siguen siendo tuyos. Podés exportar el historial completo de cada paciente en PDF en cualquier momento, antes o después de cancelar.' },
  { q: '¿Para qué especialidades sirve?', a: 'Los resúmenes se adaptan a tu especialidad: psicología, psiquiatría, medicina clínica, pediatría, nutrición y más. Lo configurás en un clic.' },
  { q: '¿Mis datos y los de mis pacientes están seguros?', a: 'Sí. La información viaja cifrada y cada profesional accede únicamente a sus propios pacientes. Cumplimos con la Ley 18.331 de protección de datos.' },
  { q: '¿Necesito instalar algo?', a: 'No. Funciona desde el navegador y también se puede instalar como app en tu iPhone o Android.' },
  { q: '¿Cuánto tarda en generar el resumen?', a: 'Segundos. Apenas termina la transcripción, la IA devuelve el resumen clínico estructurado, listo para que lo revises.' },
  { q: '¿En qué idioma funciona la transcripción?', a: 'Está optimizada para español, incluido el de Uruguay y la región. Transcribe la consulta y redacta el resumen en español.' },
  { q: '¿Cumple con las normativas de datos de salud?', a: 'La información viaja cifrada y cada profesional accede solo a sus propios pacientes. Cumplimos con la Ley 18.331 de protección de datos de Uruguay. Para requisitos específicos de otros países, escribinos y lo vemos.' },
]

const CASOS = [
  { title: 'En el consultorio', img: '/casos/consultorio.jpg' },
  { title: 'Por telemedicina', img: '/casos/telemedicina.jpg' },
  { title: 'A domicilio', img: '/casos/domicilio.jpg' },
]

const SEGURIDAD = [
  'Cifrado en tránsito (TLS) y en reposo (AES-256).',
  'Cada profesional accede únicamente a sus propios pacientes.',
  'El audio se usa solo para transcribir: no se almacena.',
  'No usamos tus datos para entrenar modelos de IA.',
  'Cumplimos la Ley 18.331 (Uruguay) y 25.326 (Argentina) de protección de datos.',
  'Infraestructura con certificación SOC 2 (Supabase, OpenAI, Anthropic).',
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
      url: 'https://www.notaclinica.app',
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/[0.06]">
        <div
          className="flex items-center justify-between gap-3 h-16"
          style={{
            paddingTop: 'var(--safe-top)',
            paddingLeft: 'max(env(safe-area-inset-left), 16px)',
            paddingRight: 'max(env(safe-area-inset-right), 16px)',
            minHeight: 'calc(var(--safe-top) + 64px)',
          }}
        >
          <img src="/logo-v5.png" alt="NotaClínica" className="h-10 sm:h-11 w-auto shrink-0" />
          <nav aria-label="Secciones" className="hidden lg:flex items-center gap-7 text-sm text-[#6E6E73]">
            <a href="#como-funciona" className="hover:text-[#0A0A0A] transition-colors">Cómo funciona</a>
            <a href="#producto" className="hover:text-[#0A0A0A] transition-colors">Producto</a>
            <a href="#precio" className="hover:text-[#0A0A0A] transition-colors">Precio</a>
            <a href="#faq" className="hover:text-[#0A0A0A] transition-colors">Preguntas</a>
          </nav>
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
      <section className="px-3 sm:px-5" style={{ paddingTop: 'calc(var(--safe-top) + 64px + 12px)' }}>
        <div
          className="relative rounded-[2rem] overflow-hidden px-5 py-7 sm:p-14"
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
                Terminá la consulta con la nota clínica <span className="text-white">ya lista</span>
              </h1>
              <p data-reveal className="text-base sm:text-lg text-[#C8C8C8] max-w-md leading-relaxed mb-8" style={{ transitionDelay: '0.2s' }}>
                ¿Todavía escribís las notas después de cada paciente? NotaClínica graba la sesión y la IA arma el resumen en segundos. <span className="text-white font-medium">Volvés a estar presente con tu paciente, no con la pantalla.</span>
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

            {/* El resultado primero: la nota clínica generada por IA */}
            <div data-reveal className="flex justify-center md:justify-end" style={{ transitionDelay: '0.22s' }}>
              <HeroNotaDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Franja de confianza — señales reales (sin testimonios ni números inventados) */}
      <section className="px-3 sm:px-5 pt-10">
        <div data-reveal className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {[
            { t: 'Resumen en segundos', icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> },
            { t: 'Datos cifrados y privados', icon: <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z M9.5 12l1.8 1.8L15 10" /> },
            { t: 'Todas las especialidades médicas', icon: <path d="M3 5v6a4 4 0 008 0V5 M7 5V3 M7 5v0 M11 15a5 5 0 0010 0v-1 M16 18v1a2 2 0 11-4 0" /> },
          ].map(item => (
            <span key={item.t} className="inline-flex items-center gap-2 bg-[#F5F5F7] text-[#0A0A0A] rounded-full px-4 py-2 text-[13px] font-medium">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#6E6E73]">{item.icon}</svg>
              {item.t}
            </span>
          ))}
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

      {/* El problema */}
      <section className="px-3 sm:px-5 pt-28 md:pt-32">
        <div data-reveal className="max-w-3xl mx-auto px-2 sm:px-4">
          <p className={kicker}>El problema</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] mb-6 max-w-2xl">Terminás la consulta y todavía te falta lo peor: escribir.</h2>
          <p className="text-lg text-[#6E6E73] leading-relaxed max-w-xl">
            Notas a mano o en sistemas distintos, recetas, turnos. Cada paciente te roba minutos de papeleo —y de atención. NotaClínica se encarga de la documentación para que vuelvas a enfocarte en quien tenés enfrente.
          </p>
        </div>
      </section>

      {/* En acción: médico-paciente → resumen con IA */}
      <section className="px-3 sm:px-5 pt-20">
        <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className={kicker}>En acción</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] mb-12 max-w-2xl">De la conversación al resumen clínico</h2>

          <DemoEnAccion />
          <p className="text-center text-xs text-[#A3A3A3] mt-4">Vista ilustrativa: la sesión se graba y la IA arma el resumen en segundos.</p>
        </div>
      </section>

      {/* Números — estimaciones honestas */}
      <section className="px-3 sm:px-5 pt-28 md:pt-32">
        <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className={kicker}>El impacto</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] mb-12 max-w-2xl">Menos pantalla, más paciente</h2>
          <StatsCounter items={STATS} />
          <p className="text-[11px] text-[#A3A3A3] mt-8">Estimaciones según uso típico. Tu experiencia puede variar.</p>
        </div>
      </section>

      {/* En 3 pasos */}
      <section id="como-funciona" className="px-3 sm:px-5 pt-28 md:pt-32 pb-4 scroll-mt-20">
        <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Cómo funciona</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] mb-14 max-w-2xl">De la charla a la nota clínica</h2>
          <div className="grid md:grid-cols-3 gap-x-10 gap-y-10">
            {PASOS.map(s => (
              <div key={s.num}>
                <p className="text-5xl md:text-6xl font-semibold text-[#E5E5EA] mb-3 tabular-nums tracking-[-0.03em] leading-none">{s.num}</p>
                <div className="h-px bg-[#D2D2D7] mb-5" />
                <h3 className="text-xl font-semibold mb-2 tracking-[-0.01em]">{s.title}</h3>
                <p className="text-[15px] text-[#6E6E73] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* La app por dentro — franja oscura con capturas reales en movimiento */}
      <section className="mt-28 md:mt-32 bg-[#0A0A0A] py-20 overflow-hidden">
        <div data-reveal className="max-w-5xl mx-auto px-5 mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9A9A9A] mb-3">La app por dentro</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] text-white max-w-2xl">Todo en un solo lugar</h2>
          <p className="text-[#9A9A9A] leading-relaxed max-w-xl mt-5">Del panel del día a la nota con diagnóstico. Capturas reales de la app.</p>
        </div>
        <div
          className="relative"
          style={{
            WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
            maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
          }}
        >
          <div className="app-marquee">
            {[
              { img: '/app/app-inicio.jpg', label: 'Tu panel del día' },
              { img: '/app/app-estadisticas.jpg', label: 'Estadísticas' },
              { img: '/app/app-pacientes.jpg', label: 'Tus pacientes' },
              { img: '/app/app-ficha.jpg', label: 'Ficha del paciente' },
              { img: '/app/app-grabar.jpg', label: 'Grabás la consulta' },
              { img: '/app/app-resumen.jpg', label: 'Resumen y diagnóstico' },
              { img: '/app/app-inicio.jpg', label: 'Tu panel del día' },
              { img: '/app/app-estadisticas.jpg', label: 'Estadísticas' },
              { img: '/app/app-pacientes.jpg', label: 'Tus pacientes' },
              { img: '/app/app-ficha.jpg', label: 'Ficha del paciente' },
              { img: '/app/app-grabar.jpg', label: 'Grabás la consulta' },
              { img: '/app/app-resumen.jpg', label: 'Resumen y diagnóstico' },
            ].map((s, i) => (
              <figure key={i} className="shrink-0 w-[208px] mr-6">
                <img src={s.img} alt={s.label} className="w-full h-auto rounded-[1.7rem] border border-white/10 shadow-2xl" />
                <figcaption className="text-center text-[13px] text-[#9A9A9A] mt-3">{s.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="producto" className="px-3 sm:px-5 pt-28 md:pt-32 scroll-mt-20">
        <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Producto</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] mb-14 max-w-2xl">Una sola app para toda la consulta</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-[#F5F5F7] rounded-[18px] border border-[#EDEDED] p-7 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
                <h3 className="text-xl font-semibold mb-2 tracking-[-0.01em]">{f.title}</h3>
                <p className="text-[15px] text-[#6E6E73] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quién es */}
      <section className="px-3 sm:px-5 pt-28 md:pt-32">
        <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Para quién es</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] mb-14 max-w-2xl">Pensado para tu práctica</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { t: 'Médicos clínicos y especialistas', d: 'Resúmenes con la estructura de tu especialidad, recetas y PDF con tu firma.' },
              { t: 'Salud mental', d: 'Psicología y psiquiatría: escalas PHQ-9 y GAD-7, evolución y plan de tratamiento por objetivos.' },
              { t: 'Consultorios y clínicas', d: 'Varios profesionales, agenda y honorarios en un solo lugar. Plan a medida.' },
            ].map(p => (
              <div key={p.t} className="bg-[#F5F5F7] rounded-[18px] border border-[#EDEDED] p-7">
                <h3 className="text-xl font-semibold mb-2 tracking-[-0.01em]">{p.t}</h3>
                <p className="text-[15px] text-[#6E6E73] leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Casos de uso — funciona en cualquier contexto */}
      <section className="px-3 sm:px-5 pt-28 md:pt-32">
        <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Donde sea</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] mb-14 max-w-2xl">Funciona en cualquier contexto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CASOS.map(c => (
              <div key={c.title} className="group relative rounded-3xl overflow-hidden aspect-[3/4] bg-[#0A0A0A]">
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.35) 45%, transparent 72%)' }} />
                <h3 className="absolute bottom-6 left-6 right-6 text-xl font-medium text-white">{c.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memoria clínica: el historial que se construye solo */}
      <section className="px-3 sm:px-5 pt-28 md:pt-32">
        <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Memoria clínica</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] mb-3 max-w-2xl">La historia del paciente se escribe sola</h2>
          <p className="text-[#6E6E73] leading-relaxed max-w-xl mb-14">Cada sesión suma al historial. No empezás de cero en ninguna consulta.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { t: 'Resúmenes con contexto', d: 'La IA redacta cada resumen teniendo en cuenta las sesiones anteriores del paciente, no solo la de hoy.' },
              { t: 'Briefing antes de entrar', d: 'Llegás a la consulta con el diagnóstico, la última nota y las sesiones previas a la vista.' },
              { t: 'Evolución en el tiempo', d: 'Escalas, progreso y plan de tratamiento que se siguen sesión a sesión.' },
            ].map(c => (
              <div key={c.t} className="bg-[#F5F5F7] rounded-[18px] border border-[#EDEDED] p-7">
                <h3 className="text-xl font-semibold mb-2 tracking-[-0.01em]">{c.t}</h3>
                <p className="text-[15px] text-[#6E6E73] leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
          <p className="text-[13px] text-[#A3A3A3] mt-6">Todo el historial viaja cifrado y solo vos accedés a tus pacientes.</p>
        </div>
      </section>

      {/* Adaptado a tu especialidad — tile oscuro */}
      <section className="px-3 sm:px-5 pt-28 md:pt-32">
        <div
          data-reveal
          className="rounded-[2rem] overflow-hidden px-7 sm:px-16 py-20 text-center"
          style={{ background: 'radial-gradient(110% 120% at 50% 0%, #232323 0%, #121212 50%, #0a0a0a 100%)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9A9A9A] mb-5">Se adapta a tu especialidad</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] text-white mb-6 max-w-3xl mx-auto leading-tight">
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
      <section className="px-3 sm:px-5 pt-28 md:pt-32">
        <div data-reveal className="max-w-3xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Un ejemplo por especialidad</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] mb-3 max-w-2xl">Tocá tu especialidad y mirá el resumen</h2>
          <p className="text-[#6E6E73] leading-relaxed max-w-xl mb-10">El mismo motor, adaptado a la estructura de cada práctica clínica.</p>
          <EspecialidadesDemo />
        </div>
      </section>

      {/* Testimonios — se muestra solo cuando hay testimonios reales cargados */}
      {TESTIMONIOS.length > 0 && (
        <section className="px-3 sm:px-5 pt-28 md:pt-32">
          <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
            <p className={kicker}>Lo que dicen</p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] mb-14 max-w-2xl">Profesionales que ya lo usan</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {TESTIMONIOS.map((t, i) => (
                <div key={i} className="bg-[#F5F5F7] rounded-3xl border border-[#EDEDED] p-7">
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
      <section className="px-3 sm:px-5 pt-28 md:pt-32">
        <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Sin riesgo</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] mb-14 max-w-2xl">Probalo sin ningún compromiso</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {CONFIANZA.map(t => (
              <div key={t.title} className="border-t border-[#D2D2D7] pt-5">
                <h3 className="text-base font-semibold mb-2">{t.title}</h3>
                <p className="text-sm text-[#6E6E73] leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seguridad y confianza */}
      <section className="px-3 sm:px-5 pt-28 md:pt-32">
        <div
          data-reveal
          className="relative rounded-[2rem] overflow-hidden px-7 sm:px-14 py-16 md:py-20"
          style={{ background: 'radial-gradient(120% 100% at 82% 18%, #242424 0%, #131313 50%, #0a0a0a 100%)' }}
        >
          <div className="relative z-10 grid md:grid-cols-[2.4fr_1fr] gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9A9A9A] mb-5">Seguridad</p>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-white mb-9 leading-tight">
                Un socio seguro en el que confiar
              </h2>
              <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-5">
                {SEGURIDAD.map(s => (
                  <li key={s} className="flex items-start gap-3">
                    <span className="text-white mt-0.5 shrink-0">✓</span>
                    <span className="text-sm sm:text-base text-[#EDEDED] leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login?tab=registro"
                className="inline-flex items-center gap-1.5 bg-white text-[#0A0A0A] pl-6 pr-5 py-3.5 rounded-full font-semibold mt-9 hover:bg-[#EDEDED] transition-colors">
                Empezar 30 días gratis <span className="text-lg leading-none">›</span>
              </Link>
            </div>

            {/* Visual: candado con ondas */}
            <div className="hidden md:flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-48 h-48" aria-hidden="true">
                <circle cx="100" cy="100" r="92" fill="none" stroke="#fff" strokeOpacity="0.05" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#fff" strokeOpacity="0.09" />
                <circle cx="100" cy="100" r="48" fill="none" stroke="#fff" strokeOpacity="0.14" />
                <rect x="70" y="92" width="60" height="48" rx="12" fill="#1c1c1c" stroke="#fff" strokeOpacity="0.35" />
                <path d="M82 92 v-12 a18 18 0 0 1 36 0 v12" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="6" />
                <circle cx="100" cy="112" r="6" fill="#fff" />
                <rect x="97" y="113" width="6" height="15" rx="3" fill="#fff" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz: calculá tu ahorro */}
      <section className="px-3 sm:px-5 pt-28 md:pt-32">
        <div
          data-reveal
          className="rounded-[2rem] overflow-hidden px-7 sm:px-14 py-16 md:py-20"
          style={{ background: 'radial-gradient(120% 100% at 20% 12%, #242424 0%, #131313 50%, #0a0a0a 100%)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9A9A9A] mb-5">Calculá tu ahorro</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-white mb-10 max-w-2xl leading-tight">¿Cuánto tiempo perdés en papeleo?</h2>
          <QuizAhorro />
        </div>
      </section>

      {/* Precio */}
      <section id="precio" className="px-3 sm:px-5 pt-28 md:pt-32 scroll-mt-20">
        <div data-reveal className="max-w-4xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Precio</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] mb-3 max-w-2xl">Un plan simple, sin sorpresas</h2>
          <p className="text-[#6E6E73] leading-relaxed max-w-xl mb-10">Probás 30 días gratis, sin tarjeta. Si te sirve, seguís con un plan simple y sin sorpresas. Cancelás cuando quieras.</p>

          <div className="grid md:grid-cols-[1.3fr_1fr] gap-4">
            {/* Plan individual */}
            <div className="bg-[#0A0A0A] text-white rounded-3xl p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9A9A9A] mb-4">NotaClínica Pro</p>
              <p className="text-6xl font-semibold tracking-[-0.03em]">US$49<span className="text-lg text-[#9A9A9A] font-normal align-middle"> /mes</span></p>
              <p className="text-sm text-white/90 mt-2">Menos de US$2 por día de trabajo.</p>
              <p className="text-sm text-[#C8C8C8] mt-1 mb-7">Precio en dólares (USD). 30 días gratis para empezar, sin tarjeta.</p>
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
            <div className="border border-[#D2D2D7] rounded-3xl p-8 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B6B6B] mb-4">Clínicas y equipos</p>
              <h3 className="text-xl font-semibold mb-2">¿Varios profesionales?</h3>
              <p className="text-sm text-[#6E6E73] leading-relaxed mb-5">Armamos un plan a medida para tu clínica o consultorio. Escribinos y lo vemos juntos.</p>
              <ul className="flex flex-col gap-2.5 mb-6">
                {['Un perfil para cada profesional', 'Métricas del equipo consolidadas', 'Precio y facturación a medida'].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#0A0A0A]">
                    <span className="text-[#0A0A0A] mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="mailto:sortiplansa@gmail.com"
                className="mt-auto inline-flex items-center justify-center gap-1.5 border border-[#0A0A0A] text-[#0A0A0A] w-full py-3.5 rounded-full font-semibold hover:bg-[#F5F5F7] transition-colors">
                Hablar con nosotros
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-3 sm:px-5 pt-28 md:pt-32 scroll-mt-20">
        <div data-reveal className="max-w-3xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Preguntas frecuentes</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] mb-12 max-w-2xl">Antes de empezar</h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((f, i) => (
              <details key={i} open={i < 2} className="group bg-[#F5F5F7] border border-[#EDEDED] rounded-2xl px-5 py-4">
                <summary className="flex items-center justify-between cursor-pointer list-none font-medium text-[15px]">
                  {f.q}
                  <span className="text-[#A3A3A3] transition-transform duration-200 ease-out group-open:rotate-45 text-xl leading-none ml-3">+</span>
                </summary>
                <p className="text-sm text-[#6E6E73] leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Descargá la app */}
      <section className="px-3 sm:px-5 pt-28 md:pt-32">
        <div data-reveal className="max-w-5xl mx-auto px-2 sm:px-4">
          <p className={kicker}>Instalá la app</p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] mb-6 max-w-2xl">Usala donde estés</h2>
          <p className="text-[#6E6E73] leading-relaxed max-w-xl mb-10">
            Funciona desde el navegador y se instala como app en tu celular. En iPhone: <span className="text-[#0A0A0A]">Compartir → Agregar a inicio</span>. En Android: <span className="text-[#0A0A0A]">Instalar app</span>.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href="/login?tab=registro"
              className="inline-flex items-center justify-center gap-1.5 bg-[#0A0A0A] text-white px-7 py-3.5 rounded-full font-semibold text-base hover:bg-[#262626] transition-colors">
              Usar gratis ahora <span className="text-lg leading-none">›</span>
            </Link>

            <p className="text-[13px] text-[#9A9A9A] self-center">Las apps para App Store y Google Play están en camino.</p>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-3 sm:px-5 pt-28 md:pt-32 pb-5">
        <div
          data-reveal
          className="rounded-[2rem] overflow-hidden px-7 sm:px-16 py-20 text-center"
          style={{ background: 'radial-gradient(110% 120% at 50% 100%, #242424 0%, #121212 55%, #0a0a0a 100%)' }}
        >
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] text-white mb-5">Recuperá tus horas. Empezá hoy.</h2>
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
            <img src="/logo-v5.png" alt="NotaClínica" className="h-9 w-auto" />
            <p className="text-base font-medium text-[#0A0A0A] mt-3">De la voz a la nota, en segundos.</p>
            <p className="text-sm text-[#737373] mt-1.5 max-w-xs leading-relaxed">Documentación clínica con IA para profesionales de la salud.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0A0A0A] mb-3">Producto</p>
              <ul className="space-y-2 text-sm text-[#737373]">
                <li><Link href="#como-funciona" className="hover:text-[#0A0A0A] transition-colors">Cómo funciona</Link></li>
                <li><Link href="#precio" className="hover:text-[#0A0A0A] transition-colors">Precio</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0A0A0A] mb-3">Acceso</p>
              <ul className="space-y-2 text-sm text-[#737373]">
                <li><Link href="/login?tab=registro" className="hover:text-[#0A0A0A] transition-colors">Empezar gratis</Link></li>
                <li><Link href="/login" className="hover:text-[#0A0A0A] transition-colors">Iniciar sesión</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0A0A0A] mb-3">Contacto y legal</p>
              <ul className="space-y-2 text-sm text-[#737373]">
                <li><a href="mailto:sortiplansa@gmail.com" className="hover:text-[#0A0A0A] transition-colors">Contactar</a></li>
                <li><Link href="/privacidad" className="hover:text-[#0A0A0A] transition-colors">Privacidad</Link></li>
                <li><Link href="/terminos" className="hover:text-[#0A0A0A] transition-colors">Términos</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="max-w-5xl mx-auto text-xs text-[#A3A3A3] mt-10">© 2026 NotaClínica · Sortiplan SA</p>
      </footer>

    </div>
  )
}
