'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Goal = {
  id: string
  title: string
  status: string
  created_at: string
  achieved_at: string | null
}

export default function PlanTratamiento({ patientId, goals }: { patientId: string; goals: Goal[] }) {
  const [title, setTitle] = useState('')
  const [adding, setAdding] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const activos = goals.filter(g => g.status !== 'achieved')
  const logrados = goals.filter(g => g.status === 'achieved')

  async function agregar() {
    const clean = title.trim()
    if (!clean || adding) return
    setAdding(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setAdding(false); return }
    const { error } = await supabase.from('treatment_goals').insert({
      patient_id: patientId,
      professional_id: user.id,
      title: clean,
      status: 'active',
    })
    setAdding(false)
    if (!error) { setTitle(''); router.refresh() }
  }

  async function toggle(g: Goal) {
    setBusyId(g.id)
    const achieved = g.status === 'achieved'
    await supabase.from('treatment_goals').update({
      status: achieved ? 'active' : 'achieved',
      achieved_at: achieved ? null : new Date().toISOString(),
    }).eq('id', g.id)
    setBusyId(null)
    router.refresh()
  }

  async function eliminar(g: Goal) {
    if (!confirm('¿Eliminar este objetivo?')) return
    setBusyId(g.id)
    await supabase.from('treatment_goals').delete().eq('id', g.id)
    setBusyId(null)
    router.refresh()
  }

  function GoalRow({ g }: { g: Goal }) {
    const achieved = g.status === 'achieved'
    return (
      <div className="py-2.5 flex items-center gap-3 border-b border-[#E2E8F0] last:border-b-0">
        <button
          onClick={() => toggle(g)}
          disabled={busyId === g.id}
          className={
            'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ' +
            (achieved ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white' : 'border-[#CBD5E1] hover:border-[#0A0A0A]')
          }
          aria-label={achieved ? 'Marcar como activo' : 'Marcar como logrado'}
        >
          {achieved && <span className="text-[11px] leading-none">✓</span>}
        </button>
        <p className={'text-sm flex-1 ' + (achieved ? 'text-[#94A3B8] line-through' : 'text-[#0F172A]')}>{g.title}</p>
        <button
          onClick={() => eliminar(g)}
          disabled={busyId === g.id}
          className="text-[#CBD5E1] hover:text-red-500 text-sm shrink-0 cursor-pointer transition-colors"
          aria-label="Eliminar"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 border border-[#E2E8F0]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">🎯 Plan de tratamiento</h2>
        {goals.length > 0 && (
          <span className="text-xs text-[#94A3B8]">{logrados.length}/{goals.length} logrados</span>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') agregar() }}
          placeholder="Nuevo objetivo terapéutico…"
          className="flex-1 border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC]"
        />
        <button
          onClick={agregar}
          disabled={!title.trim() || adding}
          className="bg-[#2563EB] text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 cursor-pointer shrink-0"
        >
          {adding ? '…' : 'Agregar'}
        </button>
      </div>

      {goals.length > 0 ? (
        <div>
          {activos.map(g => <GoalRow key={g.id} g={g} />)}
          {logrados.length > 0 && activos.length > 0 && (
            <p className="text-[11px] text-[#94A3B8] uppercase tracking-widest mt-4 mb-1">Logrados</p>
          )}
          {logrados.map(g => <GoalRow key={g.id} g={g} />)}
        </div>
      ) : (
        <p className="text-sm text-[#64748B]">Sumá los objetivos del tratamiento para seguir el progreso sesión a sesión.</p>
      )}
    </div>
  )
}
