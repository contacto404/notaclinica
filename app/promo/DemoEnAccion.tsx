'use client'
import { useEffect, useState } from 'react'

const TRANSCRIPT = [
  { who: 'Profesional', text: '¿Cómo venís durmiendo esta semana?' },
  { who: 'Paciente', text: 'Mejor, aunque todavía me cuesta arrancar el día.' },
  { who: 'Profesional', text: '¿Y los episodios de ansiedad?' },
  { who: 'Paciente', text: 'Bajaron bastante desde que ajustamos la medicación.' },
]

const RESUMEN = [
  { label: 'Motivo', text: 'Seguimiento de ansiedad e insomnio.' },
  { label: 'Evolución', text: 'Mejor descanso; ansiedad en baja con la medicación ajustada.' },
  { label: 'Plan', text: 'Mantener el esquema y reforzar higiene del sueño.' },
]

export default function DemoEnAccion() {
  const [status, setStatus] = useState('Grabando sesión')
  const [recording, setRecording] = useState(true)
  const [bubbles, setBubbles] = useState(0)
  const [typed, setTyped] = useState<string[]>(RESUMEN.map(() => ''))
  const [activeField, setActiveField] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRecording(false)
      setStatus('Resumen listo')
      setBubbles(TRANSCRIPT.length)
      setTyped(RESUMEN.map(r => r.text))
      setActiveField(-1)
      return
    }
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number) => new Promise<void>(res => { const t = setTimeout(res, ms); timers.push(t) })

    async function run() {
      while (!cancelled) {
        setRecording(true); setStatus('Grabando sesión'); setBubbles(0); setTyped(RESUMEN.map(() => '')); setActiveField(0)
        await wait(700)
        for (let b = 1; b <= TRANSCRIPT.length; b++) { if (cancelled) return; setBubbles(b); await wait(650) }
        await wait(400); if (cancelled) return
        setRecording(false); setStatus('Generando resumen…')
        await wait(900); if (cancelled) return
        setStatus('Resumen listo')
        for (let f = 0; f < RESUMEN.length; f++) {
          setActiveField(f)
          const full = RESUMEN[f].text
          for (let i = 1; i <= full.length; i++) {
            if (cancelled) return
            setTyped(prev => { const n = [...prev]; n[f] = full.slice(0, i); return n })
            await wait(16)
          }
          await wait(300)
        }
        setActiveField(-1)
        await wait(2800)
      }
    }
    run()
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [])

  return (
    <div role="img" aria-label="Demostración ilustrativa: una conversación de consulta se convierte en un resumen clínico con IA (motivo, evolución y plan)." className="rounded-[2rem] border border-[#EDEDED] bg-[#FAFAFA] p-4 sm:p-8">
      <div className="bg-white rounded-3xl border border-[#EDEDED] shadow-sm overflow-hidden">
        {/* Barra de ventana estilo macOS */}
        <div className="relative flex items-center px-4 py-2.5 border-b border-[#F0F0F0] bg-[#FCFCFC]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 text-xs text-[#9A9A9A] font-medium">NotaClínica — Sesión</span>
        </div>
        {/* Header — altura fija para que el cambio de estado no mueva la página */}
        <div className="flex items-center justify-between px-5 sm:px-7 h-[58px] border-b border-[#F0F0F0]">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#0A0A0A] animate-pulse shrink-0" />
            <span className="text-sm font-medium whitespace-nowrap">{status}</span>
            <div className="flex items-center gap-[3px] ml-1.5 h-5 shrink-0" style={{ visibility: recording ? 'visible' : 'hidden' }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="promo-wave-bar" style={{ animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
          </div>
          <span className="text-xs text-[#737373] whitespace-nowrap shrink-0 ml-2 hidden sm:inline">María G. · Psicología</span>
        </div>

        {/* Cuerpo */}
        <div className="grid md:grid-cols-2 gap-7 sm:gap-9 p-5 sm:p-7">
          {/* Conversación */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B6B6B] mb-4 font-semibold">Conversación</p>
            <div className="flex flex-col gap-3 min-h-[336px]">
              {TRANSCRIPT.map((t, i) => {
                const paciente = t.who === 'Paciente'
                return (
                  <div
                    key={i}
                    className={(paciente ? 'pl-6' : 'pr-6') + ' transition-all duration-500'}
                    style={{ opacity: i < bubbles ? 1 : 0, transform: i < bubbles ? 'none' : 'translateY(8px)' }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.12em] text-[#A3A3A3] mb-1">{t.who}</p>
                    <div className={'rounded-2xl px-4 py-2.5 text-sm leading-snug ' + (paciente ? 'bg-[#F5F5F5] text-[#0A0A0A]' : 'bg-[#0A0A0A] text-white')}>
                      {t.text}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Resumen con IA */}
          <div className="md:border-l md:border-[#F0F0F0] md:pl-9">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#6B6B6B] mb-4 font-semibold">Resumen con IA</p>
            <div className="flex flex-col gap-3">
              {RESUMEN.map((r, i) => (
                <div key={r.label} className="bg-[#FAFAFA] rounded-r-xl border-l-2 border-[#0A0A0A] px-4 py-2.5 h-[84px] overflow-hidden">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#A3A3A3] mb-1">{r.label}</p>
                  <p className="text-sm text-[#0A0A0A] leading-snug">
                    {typed[i]}
                    {activeField === i && <span className="promo-caret" />}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
