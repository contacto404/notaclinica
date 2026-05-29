'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DarDeBajaButton({ patientId, patientName }: {
  patientId: string
  patientName: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    await supabase.from('patients').delete().eq('id', patientId)
    router.push('/dashboard')
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="text-xs text-[#64748B] hover:text-red-500 transition-colors underline underline-offset-2">
        🗑 Dar de baja paciente
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#E2E8F0] shadow-xl">
            <h3 className="text-base font-bold text-[#0F172A] mb-2">¿Dar de baja a {patientName}?</h3>
            <p className="text-sm text-[#64748B] mb-6">Esta acción eliminará al paciente y todo su historial de sesiones. No se puede deshacer.</p>
            <div className="flex flex-col gap-2">
              <button onClick={handleDelete} disabled={loading}
                className="bg-red-500 text-white rounded-xl py-3 text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors">
                {loading ? 'Eliminando...' : 'Sí, dar de baja'}
              </button>
              <button onClick={() => setOpen(false)}
                className="text-sm text-[#64748B] hover:text-[#0F172A] py-2 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}