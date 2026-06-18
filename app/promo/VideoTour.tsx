'use client'
import { useEffect, useRef } from 'react'

// React no siempre aplica el atributo `muted`, y sin muted el navegador
// bloquea el autoplay. Lo forzamos por ref y disparamos play().
export default function VideoTour() {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }, [])
  return (
    <video
      ref={ref}
      src="/video-notaclinica.mp4"
      poster="/video-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label="Recorrido del producto NotaClínica: login, panel, estadísticas, pacientes, grabar y resumen clínico."
      className="w-full h-auto block"
    />
  )
}
