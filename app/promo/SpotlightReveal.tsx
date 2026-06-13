'use client'
import { useEffect, useRef } from 'react'

const R = 190 // radio del spotlight

// Base = nota escrita a mano. Reveal (bajo el spotlight que sigue el cursor) =
// resumen estructurado con IA. En táctil, el spotlight se mueve solo.
export default function SpotlightReveal() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const reveal = useRef<HTMLDivElement>(null)
  const target = useRef({ x: -9999, y: -9999 })
  const pos = useRef({ x: -9999, y: -9999 })
  const last = useRef({ x: -1, y: -1 })
  const raf = useRef<number | undefined>(undefined)
  const auto = useRef(false)

  useEffect(() => {
    const c = canvas.current, w = wrap.current, rv = reveal.current
    if (!c || !w || !rv) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const r = w.getBoundingClientRect()
      c.width = Math.max(1, Math.round(r.width))
      c.height = Math.max(1, Math.round(r.height))
      last.current = { x: -1, y: -1 }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(w)

    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      // Sin animación: mostrar el resumen completo (sin máscara).
      rv.style.maskImage = 'none'
      ;(rv.style as React.CSSProperties as any).webkitMaskImage = 'none'
      return () => ro.disconnect()
    }

    auto.current = !fine // táctil → spotlight automático
    const start = performance.now()

    const draw = (cx: number, cy: number) => {
      ctx.clearRect(0, 0, c.width, c.height)
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(0.6, 'rgba(255,255,255,0.75)')
      g.addColorStop(0.75, 'rgba(255,255,255,0.4)')
      g.addColorStop(0.88, 'rgba(255,255,255,0.12)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fill()
      const url = c.toDataURL()
      rv.style.maskImage = `url(${url})`
      ;(rv.style as any).webkitMaskImage = `url(${url})`
      rv.style.maskSize = '100% 100%'
      ;(rv.style as any).webkitMaskSize = '100% 100%'
      rv.style.maskRepeat = 'no-repeat'
      ;(rv.style as any).webkitMaskRepeat = 'no-repeat'
    }

    const loop = (now: number) => {
      if (auto.current) {
        const r = w.getBoundingClientRect()
        const k = (now - start) / 3000
        target.current.x = r.width * (0.5 + 0.32 * Math.sin(k * Math.PI * 2))
        target.current.y = r.height * (0.5 + 0.2 * Math.cos(k * Math.PI * 2 * 0.8))
      }
      pos.current.x += (target.current.x - pos.current.x) * 0.12
      pos.current.y += (target.current.y - pos.current.y) * 0.12
      if (Math.abs(pos.current.x - last.current.x) > 0.4 || Math.abs(pos.current.y - last.current.y) > 0.4) {
        draw(pos.current.x, pos.current.y)
        last.current = { x: pos.current.x, y: pos.current.y }
      }
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)

    return () => {
      ro.disconnect()
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (auto.current) return
    const r = e.currentTarget.getBoundingClientRect()
    target.current = { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  function onLeave() {
    if (auto.current) return
    target.current = { x: -9999, y: -9999 }
  }

  const Campo = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="bg-[#FAFAFA] rounded-r-xl border-l-2 border-[#0A0A0A] px-4 py-2.5">
      <p className="text-[10px] uppercase tracking-[0.12em] text-[#A3A3A3] mb-1">{label}</p>
      <p className="text-sm text-[#0A0A0A] leading-snug">{children}</p>
    </div>
  )

  return (
    <div
      ref={wrap}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative overflow-hidden rounded-3xl border border-[#EDEDED] select-none cursor-crosshair min-h-[420px] sm:min-h-[460px]"
    >
      {/* Base: nota escrita a mano */}
      <div className="absolute inset-0 p-6 sm:p-9" style={{ background: '#FBF8F1' }}>
        <span className="inline-block text-[11px] uppercase tracking-[0.14em] text-[#9A8F7A] mb-4">Escrito a mano</span>
        <div className="text-[#5b5343] leading-relaxed" style={{ fontFamily: "'Caveat', cursive", fontSize: '26px' }}>
          <p className="mb-2" style={{ transform: 'rotate(-1deg)' }}>Pac. — duerme mal hace ~2 meses, post ruptura.</p>
          <p className="mb-2" style={{ transform: 'rotate(0.4deg)' }}>toma clonazepam 2mg noche?? ver dosis c/ psiq.</p>
          <p className="mb-2" style={{ transform: 'rotate(-0.6deg)' }}>ansiedad generalizada (dx previo). duelo.</p>
          <p className="mb-2" style={{ transform: 'rotate(0.7deg)' }}>higiene sueño + tecnicas no farmaco.</p>
          <p style={{ transform: 'rotate(-0.3deg)' }}>control en 1-2 sem. registro sueño.</p>
        </div>
      </div>

      {/* Reveal: resumen con IA (enmascarado por el spotlight) */}
      <div ref={reveal} className="absolute inset-0 z-20 p-6 sm:p-9 bg-white">
        <span className="inline-block text-[11px] uppercase tracking-[0.14em] text-[#6B6B6B] mb-4 font-semibold">Con NotaClínica</span>
        <div className="flex flex-col gap-3 max-w-md">
          <Campo label="Motivo">Insomnio de ~2 meses tras ruptura de pareja, con ansiedad generalizada previa.</Campo>
          <Campo label="Evolución">En tratamiento con clonazepam 2 mg nocturno; pendiente revisar dosis con psiquiatría.</Campo>
          <Campo label="Plan">Higiene del sueño y técnicas no farmacológicas. Control en 1–2 semanas con registro de sueño.</Campo>
        </div>
      </div>

      {/* Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <span className="text-[11px] text-[#737373] bg-white/85 backdrop-blur px-3 py-1.5 rounded-full border border-[#EDEDED]">
          Pasá el cursor por la nota ✨
        </span>
      </div>

      <canvas ref={canvas} className="hidden" />
    </div>
  )
}
