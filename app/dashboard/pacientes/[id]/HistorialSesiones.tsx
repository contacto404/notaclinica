'use client'
import { useState } from 'react'
import { isSessionDone } from '@/lib/sessionStatus'

type Filtro = 'todas' | 'completas' | 'pendientes'

export default function HistorialSesiones({ sessions, patientId }: { sessions: any[]; patientId: string }) {
  const [filtro, setFiltro] = useState<Filtro>('todas')

  const filtradas = sessions.filter(s => {
    if (filtro === 'completas') return isSessionDone(s)
    if (filtro === 'pendientes') return !isSessionDone(s)
    return true
  })

  const tabs: { key: Filtro; label: string }[] = [
    { key: 'todas', label: 'Todas' },
    { key: 'completas', label: 'Completas' },
    { key: 'pendientes', label: 'Pendientes' },
  ]

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EDEDED]">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-xs font-semibold text-[#6E6E73] uppercase tracking-widest">Historial de sesiones</h2>
        {sessions.length > 0 && (
          <div className="flex gap-1 bg-[#F5F5F7] border border-[#EDEDED] rounded-xl p-0.5">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setFiltro(t.key)}
                className={'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ' +
                  (filtro === t.key ? 'bg-[#0A0A0A] text-white' : 'text-[#6E6E73] hover:text-[#0A0A0A]')}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtradas.length > 0 ? (
        <div className="flex flex-col divide-y divide-[#EDEDED]">
          {filtradas.map((s: any) => {
            const done = isSessionDone(s)
            return (
              <a key={s.id} href={"/dashboard/sesiones/" + s.id} className="py-4 flex items-center gap-3 -mx-2 px-2 rounded-xl hover:bg-[#F5F5F7] transition-colors">
                <div className={"w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 " + (done ? 'bg-[#E8F4E8] text-[#2D6A2D]' : s.status === 'transcribed' ? 'bg-[#FFF7ED] text-[#C2410C]' : 'bg-[#F0F0F0] text-[#0A0A0A]')}>
                  {done ? '✓' : '⏳'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0A0A0A]">
                    {new Date(s.session_date).toLocaleDateString('es-UY', {
                      timeZone: 'America/Montevideo',
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-[#6E6E73] mt-0.5">
                    {s.status === 'pending' && 'Pendiente de transcripción'}
                    {s.status === 'transcribed' && 'Transcripta'}
                    {done && 'Sesión completa'}
                  </p>
                </div>
                {s.status === 'transcribed' && (
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md shrink-0 bg-[#FFF7ED] text-[#C2410C]">
                    Resumen pendiente
                  </span>
                )}
                <span className="text-[#D2D2D7] text-lg shrink-0">›</span>
              </a>
            )
          })}
        </div>
      ) : sessions.length > 0 ? (
        <p className="text-sm text-[#6E6E73] text-center py-8">No hay sesiones {filtro === 'completas' ? 'completas' : 'pendientes'}.</p>
      ) : (
        <div className="text-center py-10">
          <p className="text-2xl mb-2">📋</p>
          <p className="text-sm text-[#6E6E73]">No hay sesiones todavía.</p>
          <a href={"/dashboard/pacientes/" + patientId + "/nueva-sesion"} className="text-sm text-[#0A0A0A] mt-1 inline-block hover:underline">
            + Iniciar primera sesión
          </a>
        </div>
      )}
    </div>
  )
}
