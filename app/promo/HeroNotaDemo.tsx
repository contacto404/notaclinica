'use client'
import { useEffect, useState } from 'react'

// Nota clínica de ejemplo (médico general). Ilustrativa, sin datos reales.
const NOTA = [
  { label: 'Motivo de consulta', text: 'Control de hipertensión arterial; refiere cefaleas ocasionales.' },
  { label: 'Evolución', text: 'Cifras tensionales en descenso respecto al control previo. Buena adherencia al tratamiento.' },
  { label: 'Diagnóstico', text: 'Hipertensión arterial esencial, controlada.' },
  { label: 'Plan', text: 'Mantener enalapril 10 mg/día. Control en 4 semanas con registro domiciliario de presión.' },
]

type Phase = 'rec' | 'gen' | 'done'

export default function HeroNotaDemo() {
  const [phase, setPhase] = useState<Phase>('rec')
  const [typed, setTyped] = useState<string[]>(NOTA.map(() => ''))
  const [active, setActive] = useState(0)

  useEffect(() => {
    // En mobile (o con reduce-motion) mostramos la nota completa y fija: la
    // animación cambia de alto al teclear y haría "saltar" la página en pantallas chicas.
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done'); setTyped(NOTA.map(n => n.text)); setActive(-1); return
    }
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number) => new Promise<void>(res => { const t = setTimeout(res, ms); timers.push(t) })

    async function run() {
      while (!cancelled) {
        setPhase('rec'); setTyped(NOTA.map(() => '')); setActive(0)
        await wait(2200); if (cancelled) return
        setPhase('gen')
        await wait(1100); if (cancelled) return
        setPhase('done')
        for (let f = 0; f < NOTA.length; f++) {
          setActive(f)
          const full = NOTA[f].text
          for (let i = 1; i <= full.length; i++) {
            if (cancelled) return
            setTyped(prev => { const n = [...prev]; n[f] = full.slice(0, i); return n })
            await wait(14)
          }
          await wait(220)
        }
        setActive(-1)
        await wait(3600)
      }
    }
    run()
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [])

  const statusLabel = phase === 'rec' ? 'Grabando sesión' : phase === 'gen' ? 'Generando resumen…' : 'Resumen listo'

  return (
    <div className="w-full max-w-[360px] mx-auto md:mx-0 md:ml-auto">
      {/* Cuerpo del teléfono */}
      <div className="rounded-[2.4rem] bg-[#0A0A0A] p-2.5 shadow-2xl ring-1 ring-white/10">
        <div className="rounded-[1.9rem] bg-[#F7F7F8] overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-2 text-[11px] text-[#0A0A0A]">
            <span className="font-semibold">9:41</span>
            <img src="/logo-v5.png" alt="NotaClínica" className="h-3.5 w-auto opacity-90" />
            <span className="font-semibold tracking-tight">5G</span>
          </div>

          {/* Estado */}
          <div className="flex items-center justify-between px-5 py-3 bg-white border-y border-[#F0F0F0]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={'w-2 h-2 rounded-full ' + (phase === 'done' ? 'bg-[#28c840]' : 'bg-[#ff5f57] animate-pulse')} />
              <span className="text-[13px] font-medium text-[#0A0A0A] truncate">{statusLabel}</span>
              {phase === 'rec' && (
                <div className="flex items-center gap-[3px] ml-1 h-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <span key={i} className="promo-wave-bar" style={{ height: 16, animationDelay: `${i * 0.08}s` }} />
                  ))}
                </div>
              )}
            </div>
            {phase === 'done' && (
              <span className="text-[10px] font-medium text-[#0A0A0A] bg-[#EFEFEF] rounded-full px-2 py-0.5 shrink-0">✨ con IA</span>
            )}
          </div>

          {/* Cuerpo: nota generada */}
          <div className="px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6B6B6B] mb-3 font-semibold">
              Resumen clínico · Consulta de control
            </p>
            <div className="flex flex-col gap-2.5">
              {NOTA.map((n, i) => (
                <div key={n.label} className="bg-white rounded-r-lg border-l-2 border-[#0A0A0A] px-3.5 py-2 min-h-[52px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <p className="text-[9px] uppercase tracking-[0.12em] text-[#A3A3A3] mb-0.5">{n.label}</p>
                  <p className="text-[12.5px] text-[#0A0A0A] leading-snug">
                    {typed[i]}
                    {active === i && <span className="promo-caret" />}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-[9.5px] text-[#9A9A9A] mt-3 text-center">Ejemplo ilustrativo · lo revisás y editás antes de guardar</p>
          </div>
        </div>
      </div>
    </div>
  )
}
