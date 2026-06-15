'use client'
import { useState } from 'react'

type User = {
  id: string
  email: string
  creado: string
  status: string
  vence: string
  patientCount: number
  sessionCount: number
  lastSession: string
}

type Stats = {
  total: number
  activas: number
  canceladas: number
  nuevosEsteSemana: number
  nuevosEsteMes: number
  mrr: number
}

export default function AdminClient({ data, stats }: { data: User[], stats: Stats }) {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [localData, setLocalData] = useState(data)

  const filtered = localData.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  async function handleAction(userId: string, action: 'activate' | 'cancel', days?: number) {
    setLoading(userId + action)
    await fetch('/api/admin/subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, action, days }),
    })
    setLocalData(prev => prev.map(u => {
      if (u.id !== userId) return u
      if (action === 'activate') {
        const d = days || 30
        const vence = new Date(Date.now() + d * 24 * 60 * 60 * 1000)
        return { ...u, status: 'Activa', vence: vence.toLocaleDateString('es-UY') }
      }
      return { ...u, status: 'Cancelada' }
    }))
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#0A0A0A]">Panel de Admin</h1>
          <a href="/dashboard" className="text-sm text-[#0A0A0A] hover:underline">← Volver</a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total usuarios', value: stats.total, color: 'text-[#0A0A0A]' },
            { label: 'Suscripciones activas', value: stats.activas, color: 'text-[#0A0A0A]' },
            { label: 'Canceladas', value: stats.canceladas, color: 'text-red-600' },
            { label: 'Nuevos esta semana', value: stats.nuevosEsteSemana, color: 'text-[#0A0A0A]' },
            { label: 'Nuevos este mes', value: stats.nuevosEsteMes, color: 'text-[#0A0A0A]' },
            { label: 'MRR estimado', value: `$${stats.mrr} USD`, color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#EDEDED] p-4">
              <p className="text-xs text-[#6E6E73] mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-sm px-4 py-2 border border-[#EDEDED] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#EDEDED] overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EDEDED]">
                {['Email', 'Registrado', 'Estado', 'Vence', 'Pacientes', 'Sesiones', 'Última sesión', 'Acciones'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-[#6E6E73] px-4 py-4 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-[#F5F5F7] hover:bg-[#F5F5F7]">
                  <td className="px-4 py-3 text-sm text-[#0A0A0A]">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-[#6E6E73] whitespace-nowrap">{u.creado}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                      u.status === 'Activa' ? 'bg-green-100 text-green-700' :
                      u.status === 'Cancelada' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6E6E73] whitespace-nowrap">{u.vence}</td>
                  <td className="px-4 py-3 text-sm text-center text-[#6E6E73]">{u.patientCount}</td>
                  <td className="px-4 py-3 text-sm text-center text-[#6E6E73]">{u.sessionCount}</td>
                  <td className="px-4 py-3 text-sm text-[#6E6E73] whitespace-nowrap">{u.lastSession}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {u.status !== 'Activa' && (
                        <button
                          onClick={() => handleAction(u.id, 'activate', 30)}
                          disabled={loading === u.id + 'activate'}
                          className="text-xs bg-[#0A0A0A] text-white px-3 py-1 rounded-lg hover:bg-[#262626] disabled:opacity-50 whitespace-nowrap cursor-pointer"
                        >
                          {loading === u.id + 'activate' ? '...' : '+ 30 días'}
                        </button>
                      )}
                      {u.status === 'Activa' && (
                        <>
                          <button
                            onClick={() => handleAction(u.id, 'activate', 30)}
                            disabled={loading === u.id + 'activate'}
                            className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 disabled:opacity-50 whitespace-nowrap cursor-pointer"
                          >
                            {loading === u.id + 'activate' ? '...' : '+ 30 días'}
                          </button>
                          <button
                            onClick={() => handleAction(u.id, 'cancel')}
                            disabled={loading === u.id + 'cancel'}
                            className="text-xs border border-red-300 text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 disabled:opacity-50 whitespace-nowrap cursor-pointer"
                          >
                            {loading === u.id + 'cancel' ? '...' : 'Cancelar'}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
