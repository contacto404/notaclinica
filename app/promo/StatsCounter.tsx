type Stat = { value: string; label: string }

// Valores fijos: mostramos siempre el dato final, sin animación de conteo
// (un número que fluctúa mientras se lee genera desconfianza).
export default function StatsCounter({ items }: { items: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      {items.map(s => (
        <div key={s.label}>
          <p className="text-5xl md:text-6xl font-semibold tracking-[-0.03em] tabular-nums">{s.value}</p>
          <p className="text-[15px] text-[#6E6E73] mt-2 leading-snug">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
