'use client'
import { useRef } from 'react'

// La foto del hero reacciona al mouse con un leve tilt 3D (parallax),
// además de la flotación CSS. En mobile (sin mouse) queda solo la flotación.
export default function HeroImage() {
  const ref = useRef<HTMLDivElement>(null)

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `rotateY(${px * 12}deg) rotateX(${-py * 12}deg) scale(1.02)`
  }

  function onLeave() {
    if (ref.current) ref.current.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)'
  }

  return (
    <div style={{ perspective: '1000px' }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={ref} style={{ transition: 'transform .3s ease-out', transformStyle: 'preserve-3d', willChange: 'transform' }}>
        <img
          src="/screenshots/consulta.jpg"
          alt="Profesional usando NotaClínica en el celular durante una consulta"
          className="promo-float w-[280px] sm:w-[340px] rounded-[1.75rem] shadow-2xl ring-1 ring-white/10"
        />
      </div>
    </div>
  )
}
