'use client'
import { useEffect, useRef, useState } from 'react'

type Stat = { value: string; label: string }

// Separa un valor como "12 h", "<30 s", "+15 min", "100%" en
// prefijo (no numérico), número y sufijo (resto), para animar solo el número.
function parse(value: string) {
  const m = value.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/)
  if (!m) return { prefix: value, num: null as number | null, suffix: '', decimals: 0 }
  const numStr = m[2].replace(',', '.')
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
  return { prefix: m[1], num: parseFloat(numStr), suffix: m[3], decimals }
}

function StatValue({ value }: { value: string }) {
  const { prefix, num, suffix, decimals } = parse(value)
  const [display, setDisplay] = useState(num === null ? value : prefix + '0' + suffix)
  const ref = useRef<HTMLParagraphElement>(null)
  const done = useRef(false)

  useEffect(() => {
    if (num === null) { setDisplay(value); return }
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value); return
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting || done.current) return
        done.current = true
        const duration = 1100
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
          const current = num * eased
          setDisplay(prefix + current.toFixed(decimals) + suffix)
          if (t < 1) requestAnimationFrame(tick)
          else setDisplay(value)
        }
        requestAnimationFrame(tick)
      })
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [value, num, prefix, suffix, decimals])

  return (
    <p ref={ref} className="text-5xl md:text-6xl font-semibold tracking-[-0.03em] tabular-nums">
      {display}
    </p>
  )
}

export default function StatsCounter({ items }: { items: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      {items.map(s => (
        <div key={s.label}>
          <StatValue value={s.value} />
          <p className="text-[15px] text-[#6E6E73] mt-2 leading-snug">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
