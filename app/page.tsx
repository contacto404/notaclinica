cat > app/page.tsx << 'ENDOFFILE'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav style={{ paddingTop: 'env(safe-area-inset-top)' }} className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-[#E2E8F0] px-6 flex items-center justify-between h-16">
        <span className="font-bold text-[#0F172A] text-xl">NotaClínica</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">
            Iniciar sesión
          </Link>
          <Link href="/login?tab=registro" className="text-sm bg-[#2563EB] text-white px-4 py-2 rounded-xl hover:bg-[#1D4ED8] transition-colors">
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-[#EFF6FF] text-[#2563EB] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          30 días gratis · Sin tarjeta de crédito
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] mb-6 leading-tight">
          La consulta más organizada<br />
          <span className="text-[#2563EB]">de tu carrera</span>
        </h1>
        <p className="text-xl text-[#64748B] mb-10 max-w-2xl mx-auto leading-relaxed">
          IA para médicos que quieren enfocarse en sus pacientes, no en el papeleo. Grabá la consulta, obtené el resumen clínico en segundos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login?tab=registro"
            className="bg-[#2563EB] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#1D4ED8] transition-colors">
            Empezar 30 días gratis →
          </Link>
          <Link href="#como-funciona"
            className="border border-[#E2E8F0] text-[#475569] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#F8FAFC] transition-colors">
            Ver cómo funciona
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#F8FAFC] border-y border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '30 min', label: 'ahorrados por consulta' },
            { value: '< 30s', label: 'para el resumen clínico' },
            { value: '100%', label: 'privado y seguro' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-[#2563EB] mb-1">{s.value}</p>
              <p className="text-sm text-[#64748B]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-[#0F172A] text-center mb-4">Así de simple</h2>
        <p className="text-[#64748B] text-center mb-12">Tres pasos para documentar una consulta completa</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { num: '1', title: 'Grabá la consulta', desc: 'Apretás un botón y grabás el audio de la consulta directamente desde tu celular.' },
            { num: '2', title: 'La IA transcribe y resume', desc: 'En segundos tenés la transcripción completa y un resumen clínico estructurado.' },
            { num: '3', title: 'Enviá y archivá', desc: 'Exportá el PDF, enviá por WhatsApp o guardá en el historial del paciente.' },
          ].map(s => (
            <div key={s.num} className="text-center">
              <div className="w-12 h-12 bg-[#2563EB] text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {s.num}
              </div>
              <h3 className="font-semibold text-[#0F172A] mb-2">{s.title}</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-[#F8FAFC] border-y border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0F172A] text-center mb-12">Todo lo que necesitás</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🎙️', title: 'Grabación de audio', desc: 'Grabá desde el celular, funciona sin internet.' },
              { icon: '🧠', title: 'Resúmenes con IA', desc: 'Diagnóstico, plan terapéutico y notas en un clic.' },
              { icon: '📋', title: 'Historial clínico', desc: 'Accedé al contexto de las últimas sesiones antes de cada consulta.' },
              { icon: '📄', title: 'Exportar PDF', desc: 'Generá documentos clínicos profesionales al instante.' },
              { icon: '💬', title: 'Envío por WhatsApp', desc: 'Compartí el resumen directamente con el paciente.' },
              { icon: '📅', title: 'Agenda integrada', desc: 'Turnos con recordatorio automático por email 24hs antes.' },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 flex gap-4">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <h3 className="font-semibold text-[#0F172A] mb-1">{f.title}</h3>
                  <p className="text-sm text-[#64748B]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Precio */}
      <section className="py-20 px-6 max-w-lg mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Un precio simple</h2>
        <p className="text-[#64748B] mb-10">Sin sorpresas. Cancelá cuando quieras.</p>
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-8">
          <p className="text-5xl font-bold text-[#0F172A] mb-1">$49 USD<span className="text-xl font-normal text-[#64748B]">/mes</span></p>
          <p className="text-[#2563EB] font-medium mb-8">30 días gratis para empezar</p>
          {[
            'Pacientes ilimitados',
            'Transcripción automática',
            'Resúmenes con IA',
            'Exportar PDF',
            'Agenda y recordatorios',
            'Soporte incluido',
          ].map(f => (
            <p key={f} className="text-sm text-[#0F172A] text-left mb-3">✓ {f}</p>
          ))}
          <Link href="/login?tab=registro"
            className="block w-full bg-[#2563EB] text-white py-4 rounded-xl font-semibold mt-6 hover:bg-[#1D4ED8] transition-colors">
            Empezar 30 días gratis →
          </Link>
          <p className="text-xs text-[#64748B] mt-4">Sin tarjeta de crédito · Cancelá cuando quieras</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] py-8 px-6 text-center">
        <p className="text-sm text-[#64748B]">© 2026 NotaClínica · Sortiplan SA · Uruguay</p>
      </footer>

    </div>
  )
}
ENDOFFILE