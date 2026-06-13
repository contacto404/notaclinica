'use client'
import { useEffect, useRef } from 'react'

// Foto del hero: tilt 3D suavizado (lerp con requestAnimationFrame, estilo Lithos)
// + Ken Burns (zoom-out al cargar) + flotación. Respeta reduce-motion.
export default function HeroImage() {
  const tiltRef = useRef<HTMLDivElement>(null)
  const target = useRef({ rx: 0, ry: 0 })
  const cur = useRef({ rx: 0, ry: 0 })
  const raf = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const loop = () => {
      cur.current.rx += (target.current.rx - cur.current.rx) * 0.1
      cur.current.ry += (target.current.ry - cur.current.ry) * 0.1
      const el = tiltRef.current
      if (el) el.style.transform = `rotateX(${cur.current.rx.toFixed(2)}deg) rotateY(${cur.current.ry.toFixed(2)}deg)`
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [])

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    target.current = { rx: -py * 12, ry: px * 12 }
  }
  function onLeave() {
    target.current = { rx: 0, ry: 0 }
  }

  return (
    <div style={{ perspective: '1000px' }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={tiltRef} style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
        <div className="promo-kenburns">
          <img
            src="/screenshots/consulta.jpg"
            alt="Profesional usando NotaClínica en el celular durante una consulta"
            className="promo-float w-[280px] sm:w-[340px] rounded-[1.75rem] shadow-2xl ring-1 ring-white/10"
          />
        </div>
      </div>
    </div>
  )
}
