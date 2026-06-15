'use client'
import { useState } from 'react'
import type { Patient, Appointment } from '@/types/db'

type Alerta = { patientId: string; patientName: string; tipo: string; detalle: string; nivel: 'alta' | 'media' }

export default function DashboardClient({ patients, sesionesEsteMes, pdfsExportados, turnosHoy, alertas = [], saludo, nombre, ultimaSesionPorPaciente = {}, proximoTurnoPorPaciente = {} }: {
  patients: Patient[]
  sesionesEsteMes: number
  pdfsExportados: number
  turnosHoy: Appointment[]
  alertas?: Alerta[]
  saludo: string
  nombre: string
  ultimaSesionPorPaciente?: Record<string, string>
  proximoTurnoPorPaciente?: Record<string, string>
}) {
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState<'reciente' | 'nombre' | 'ultima' | 'proximo' | 'diagnostico'>('reciente')

  const filtrados = [...patients]
    .filter(p => p.full_name?.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a: any, b: any) => {
      if (orden === 'nombre') return a.full_name.localeCompare(b.full_name)
      if (orden === 'diagnostico') return (a.diagnosis ?? '').localeCompare(b.diagnosis ?? '')
      if (orden === 'ultima') {
        // Más reciente primero; sin sesiones al final
        const ua = ultimaSesionPorPaciente[a.id] ?? ''
        const ub = ultimaSesionPorPaciente[b.id] ?? ''
        return ub.localeCompare(ua)
      }
      if (orden === 'proximo') {
        // Turno más próximo primero; sin turno al final
        const pa = proximoTurnoPorPaciente[a.id] ?? '9999'
        const pb = proximoTurnoPorPaciente[b.id] ?? '9999'
        return pa.localeCompare(pb)
      }
      return 0
    })

  const stats = [
    { label: 'Pacientes activos', value: patients.length, icon: '👥', tint: 'bg-[#F0F0F0] dark:bg-[#0A0A0A]/40', text: 'text-[#0A0A0A] dark:text-[#FFFFFF]' },
    { label: 'Sesiones este mes', value: sesionesEsteMes, icon: '🗓️', tint: 'bg-[#E8F4E8] dark:bg-[#14532D]/40', text: 'text-[#2D6A2D] dark:text-[#86EFAC]' },
    { label: 'PDFs exportados', value: pdfsExportados, icon: '📄', tint: 'bg-[#E8EEF8] dark:bg-[#262626]', text: 'text-[#2D3F6A] dark:text-[#D2D2D7]' },
  ]

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <p className="text-[11px] text-[#6E6E73] dark:text-[#A3A3A3] font-medium uppercase tracking-widest mb-0.5">{saludo}</p>
          <h1 className="text-xl font-bold text-[#0A0A0A] dark:text-white leading-tight">{nombre}</h1>
        </div>
        <a href="/dashboard/pacientes/nuevo"
          className="bg-[#0A0A0A] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#262626] transition-colors shadow-sm shrink-0 whitespace-nowrap">
          + Nuevo paciente
        </a>
      </div>

      {/* Alertas clínicas */}
      {alertas.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] border border-[#EDEDED] dark:border-[#262626] rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
            <p className="text-[11px] font-semibold text-[#B91C1C] dark:text-[#FCA5A5] uppercase tracking-widest">Alertas clínicas</p>
          </div>
          <div className="flex flex-col gap-1.5">
            {alertas.map((a, i) => (
              <a key={i} href={"/dashboard/pacientes/" + a.patientId}
                className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#F5F5F7] dark:hover:bg-[#0A0A0A] transition-colors">
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md shrink-0 ${a.nivel === 'alta' ? 'bg-[#FEE2E2] text-[#B91C1C] dark:bg-[#7F1D1D]/50 dark:text-[#FCA5A5]' : 'bg-[#FFF7ED] text-[#C2410C] dark:bg-[#7C2D12]/40 dark:text-[#FDBA74]'}`}>
                  {a.tipo}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0A0A0A] dark:text-white truncate">{a.patientName}</p>
                  <p className="text-xs text-[#6E6E73] dark:text-[#A3A3A3] truncate">{a.detalle}</p>
                </div>
                <span className="text-[#D2D2D7] dark:text-[#6E6E73] text-lg shrink-0">›</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Turnos hoy */}
      {turnosHoy.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1A] border border-[#EDEDED] dark:border-[#262626] rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
            <p className="text-[11px] font-semibold text-[#C2410C] dark:text-[#FDBA74] uppercase tracking-widest">Turnos de hoy</p>
          </div>
          <div className="flex flex-col gap-1.5">
            {turnosHoy.map((t) => (
              <a key={t.id} href={"/dashboard/pacientes/" + t.patient_id}
                className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#F5F5F7] dark:hover:bg-[#0A0A0A] transition-colors">
                <div className="bg-[#FFF7ED] dark:bg-[#7C2D12]/40 rounded-lg px-2.5 py-1 shrink-0">
                  <p className="text-sm font-bold text-[#C2410C] dark:text-[#FDBA74] tabular-nums">
                    {new Date(t.appointment_date).toLocaleTimeString('es-UY', {
                      timeZone: 'America/Montevideo',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0A0A0A] dark:text-white truncate">{t.patients?.full_name}</p>
                  {t.notes && <p className="text-xs text-[#6E6E73] dark:text-[#A3A3A3] truncate">{t.notes}</p>}
                </div>
                <span className="text-[#D2D2D7] dark:text-[#6E6E73] text-lg shrink-0">›</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#EDEDED] dark:border-[#262626] p-3.5">
            <span className={`w-7 h-7 rounded-lg ${stat.tint} flex items-center justify-center text-sm mb-2.5`}>{stat.icon}</span>
            <p className={`text-2xl font-bold leading-none ${stat.text}`}>{stat.value}</p>
            <p className="text-[11px] text-[#6E6E73] dark:text-[#A3A3A3] mt-1.5 leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Acceso a estadísticas */}
      <a href="/dashboard/estadisticas"
        className="flex items-center justify-between bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#EDEDED] dark:border-[#262626] px-4 py-3 mb-6 hover:border-[#0A0A0A] dark:hover:border-[#0A0A0A] transition-colors group">
        <span className="flex items-center gap-2 text-sm font-medium text-[#0A0A0A] dark:text-white">
          <span className="text-base">📊</span> Estadísticas del consultorio
        </span>
        <span className="text-[#A3A3A3] group-hover:text-[#0A0A0A] text-lg transition-colors">›</span>
      </a>

      {/* Búsqueda y orden */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-[11px] font-semibold text-[#6E6E73] dark:text-[#A3A3A3] uppercase tracking-widest shrink-0">Pacientes</h2>
        <div className="flex gap-2 flex-1 max-w-sm">
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar..."
            className="flex-1 min-w-0 border border-[#EDEDED] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#0A0A0A] dark:text-white outline-none focus:border-[#0A0A0A] bg-white dark:bg-[#1A1A1A] placeholder:text-[#A3A3A3]"
          />
          <select
            value={orden}
            onChange={e => setOrden(e.target.value as typeof orden)}
            className="border border-[#EDEDED] dark:border-[#262626] rounded-lg px-2.5 py-2 text-sm text-[#0A0A0A] dark:text-white outline-none focus:border-[#0A0A0A] bg-white dark:bg-[#1A1A1A] shrink-0"
          >
            <option value="reciente">Reciente</option>
            <option value="nombre">Nombre</option>
            <option value="ultima">Última sesión</option>
            <option value="proximo">Próximo turno</option>
            <option value="diagnostico">Diagnóstico</option>
          </select>
        </div>
      </div>

      {/* Pacientes */}
      <div className="flex flex-col gap-1.5">
        {filtrados.length > 0 ? filtrados.map((p: any) => (
          <a key={p.id} href={"/dashboard/pacientes/" + p.id}
            className="bg-white dark:bg-[#1A1A1A] rounded-xl px-3.5 py-3 flex items-center gap-3 hover:shadow-sm hover:border-[#D2D2D7] dark:hover:border-[#6E6E73] transition-all border border-[#EDEDED] dark:border-[#262626]">
            <div className="w-9 h-9 rounded-full bg-[#F0F0F0] dark:bg-[#0A0A0A]/40 flex items-center justify-center text-sm font-semibold text-[#0A0A0A] dark:text-[#FFFFFF] shrink-0 uppercase">
              {p.full_name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0A0A0A] dark:text-white truncate">{p.full_name}</p>
              <p className="text-xs text-[#6E6E73] dark:text-[#A3A3A3] truncate">{p.diagnosis ?? 'Sin diagnóstico'}</p>
            </div>
            <span className="text-[#D2D2D7] dark:text-[#6E6E73] text-lg shrink-0">›</span>
          </a>
        )) : (
          <div className="bg-white dark:bg-[#1A1A1A] border border-dashed border-[#EDEDED] dark:border-[#262626] rounded-2xl px-4 py-12 text-center">
            <p className="text-2xl mb-2">{busqueda ? '🔍' : '🌱'}</p>
            <p className="text-sm text-[#6E6E73] dark:text-[#A3A3A3]">{busqueda ? 'No se encontraron pacientes.' : 'Todavía no tenés pacientes.'}</p>
            {!busqueda && (
              <a href="/dashboard/pacientes/nuevo" className="text-sm text-[#0A0A0A] mt-1 inline-block hover:underline">
                + Agregar el primero
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
