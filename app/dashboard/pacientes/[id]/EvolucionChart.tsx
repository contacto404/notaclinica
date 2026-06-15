'use client'
import { useMemo } from 'react'
import { isSessionDone } from '@/lib/sessionStatus'

export default function EvolucionChart({ sessions }: { sessions: any[] }) {
  const completadas = sessions.filter(isSessionDone)

  // Sesiones por mes
  const porMes = useMemo(() => {
    const map: Record<string, number> = {}
    completadas.forEach(s => {
      const fecha = new Date(s.session_date)
      const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
      map[key] = (map[key] || 0) + 1
    })
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, count]) => {
        const [year, month] = key.split('-')
        const fecha = new Date(parseInt(year), parseInt(month) - 1)
        return {
          mes: fecha.toLocaleDateString('es-UY', { month: 'short', year: '2-digit' }),
          sesiones: count
        }
      })
  }, [completadas])

  // Frecuencia promedio
  const frecuenciaPromedio = useMemo(() => {
    if (completadas.length < 2) return null
    const sorted = [...completadas].sort((a, b) =>
      new Date(a.session_date).getTime() - new Date(b.session_date).getTime()
    )
    let totalDias = 0
    for (let i = 1; i < sorted.length; i++) {
      const diff = new Date(sorted[i].session_date).getTime() - new Date(sorted[i - 1].session_date).getTime()
      totalDias += diff / (1000 * 60 * 60 * 24)
    }
    return Math.round(totalDias / (sorted.length - 1))
  }, [completadas])

  // Ultima sesion hace cuantos dias
  const diasDesdeUltima = useMemo(() => {
    if (completadas.length === 0) return null
    const sorted = [...completadas].sort((a, b) =>
      new Date(b.session_date).getTime() - new Date(a.session_date).getTime()
    )
    const diff = Date.now() - new Date(sorted[0].session_date).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }, [completadas])

  if (completadas.length === 0) return null

  const maxSesiones = Math.max(...porMes.map(m => m.sesiones), 1)

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 border border-[#EDEDED]">
      <h2 className="text-xs font-semibold text-[#6E6E73] uppercase tracking-widest mb-5">📈 Evolución</h2>

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#F0F0F0] rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-[#0A0A0A]">{completadas.length}</p>
          <p className="text-xs text-[#6E6E73] mt-0.5">Sesiones totales</p>
        </div>
        <div className="bg-[#E8F4E8] rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-[#2D6A2D]">
            {frecuenciaPromedio ? `${frecuenciaPromedio}d` : '-'}
          </p>
          <p className="text-xs text-[#6E6E73] mt-0.5">Frecuencia promedio</p>
        </div>
        <div className={`rounded-2xl p-3 text-center ${diasDesdeUltima && diasDesdeUltima > 30 ? 'bg-[#FFF7ED]' : 'bg-[#E8EEF8]'}`}>
          <p className={`text-2xl font-bold ${diasDesdeUltima && diasDesdeUltima > 30 ? 'text-[#C2410C]' : 'text-[#2D3F6A]'}`}>
            {diasDesdeUltima !== null ? `${diasDesdeUltima}d` : '-'}
          </p>
          <p className="text-xs text-[#6E6E73] mt-0.5">Desde última sesión</p>
        </div>
      </div>

      {/* Grafico de barras */}
      {porMes.length > 1 && (
        <div>
          <p className="text-xs text-[#6E6E73] font-medium mb-3">Sesiones por mes</p>
          <div className="flex items-end gap-2 h-24">
            {porMes.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-xs font-semibold text-[#0A0A0A]">{m.sesiones}</p>
                <div
                  className="w-full bg-[#0A0A0A] rounded-t-lg transition-all"
                  style={{ height: `${(m.sesiones / maxSesiones) * 64}px`, minHeight: '8px' }}
                />
                <p className="text-xs text-[#A3A3A3] text-center leading-tight">{m.mes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerta si hace mucho que no viene */}
      {diasDesdeUltima !== null && diasDesdeUltima > 30 && (
        <div className="mt-4 bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl px-4 py-3">
          <p className="text-xs text-[#C2410C] font-medium">
            ⚠️ Hace {diasDesdeUltima} días que {' '}
            {diasDesdeUltima > 60 ? 'no tiene consultas' : 'no viene a consulta'}
          </p>
        </div>
      )}
    </div>
  )
}