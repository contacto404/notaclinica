'use client'
import { useEffect } from 'react'

// Revela los elementos con [data-reveal] al entrar en viewport.
// Failsafe: si no hay JS o el usuario pidió reducir movimiento, el contenido
// se muestra normal (la regla CSS solo aplica con html.reveal-on).
export default function MotionProvider() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    // Fallback: navegadores muy viejos sin IntersectionObserver → mostrar todo.
    if (!('IntersectionObserver' in window)) return

    const root = document.documentElement
    root.classList.add('reveal-on')

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    els.forEach((el) => io.observe(el))

    // Red de seguridad: si el observer no dispara (p. ej. dentro de un webview),
    // revelar todo igual tras 1.2s para no dejar nunca la página en blanco.
    const failsafe = setTimeout(() => {
      els.forEach((el) => el.classList.add('is-visible'))
    }, 1200)

    return () => { io.disconnect(); clearTimeout(failsafe) }
  }, [])

  return null
}
