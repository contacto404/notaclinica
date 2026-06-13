'use client'
import { useEffect } from 'react'

// Revela los elementos con [data-reveal] al entrar en viewport.
// Failsafe: si no hay JS o el usuario pidió reducir movimiento, el contenido
// se muestra normal (la regla CSS solo aplica con html.reveal-on).
export default function MotionProvider() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    root.classList.add('reveal-on')

    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )
    els.forEach((el) => io.observe(el))

    // Por las dudas: revelar todo después de unos segundos.
    const t = setTimeout(() => els.forEach((el) => el.classList.add('is-visible')), 2600)

    return () => {
      io.disconnect()
      clearTimeout(t)
    }
  }, [])

  return null
}
