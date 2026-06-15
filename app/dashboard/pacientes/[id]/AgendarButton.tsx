'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Toast from '../../components/Toast'

export default function AgendarButton({
  patientId, patientName, patientPhone, hasAppointment, currentAppointment, lastSessionId
}: {
  patientId: string
  patientName: string
  patientPhone?: string
  hasAppointment: boolean
  currentAppointment?: any
  lastSessionId?: string
}) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState('')
  const [hour, setHour] = useState('08')
  const [minute, setMinute] = useState('00')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  const minutes = ['00', '15', '30', '45']

  async function handleSave() {
    if (!date || !hour) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const appointmentDate = new Date(`${date}T${hour}:${minute}:00-03:00`)

    if (hasAppointment && currentAppointment) {
      await supabase.from('appointments').update({
        appointment_date: appointmentDate.toISOString(),
        notes: notes || null,
      }).eq('id', currentAppointment.id)
    } else {
      await supabase.from('appointments').insert({
        patient_id: patientId,
        professional_id: user.id,
        appointment_date: appointmentDate.toISOString(),
        notes: notes || null,
      })
    }

    setOpen(false)
    setLoading(false)
    setToast(true)
    router.refresh()
  }

  function handleWhatsApp() {
    if (!patientPhone) return
    const phone = patientPhone.replace(/\D/g, '')
    const dateFormatted = date && hour
      ? new Date(`${date}T${hour}:${minute}:00-03:00`).toLocaleDateString('es-UY', {
          timeZone: 'America/Montevideo',
          weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
        }) + ` a las ${hour}:${minute}`
      : ''
    const pdfLink = lastSessionId
      ? `${window.location.origin}/api/export-pdf?sessionId=${lastSessionId}`
      : ''
    const message = `Hola ${patientName}! Te confirmo tu próxima consulta: ${dateFormatted}.${pdfLink ? `\n\nResumen de tu última sesión: ${pdfLink}` : ''}`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <>
      {toast && <Toast message="Turno guardado" onDone={() => setToast(false)} />}

      <button
        onClick={() => setOpen(true)}
        className="bg-[#0A0A0A] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#262626] transition-colors flex items-center gap-1.5">
        📅 {hasAppointment ? 'Reagendar' : 'Agendar'}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm border border-[#EDEDED] shadow-xl">
            <h3 className="text-base font-bold text-[#0A0A0A] mb-5">
              {hasAppointment ? 'Reagendar turno' : 'Agendar turno'} — {patientName}
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest">Fecha</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="border border-[#EDEDED] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] bg-[#F5F5F7] w-full" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest">Hora</label>
                <div className="flex gap-2">
                  <select value={hour} onChange={e => setHour(e.target.value)}
                    className="flex-1 border border-[#EDEDED] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] bg-[#F5F5F7]">
                    {hours.map(h => <option key={h} value={h}>{h}hs</option>)}
                  </select>
                  <select value={minute} onChange={e => setMinute(e.target.value)}
                    className="flex-1 border border-[#EDEDED] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] bg-[#F5F5F7]">
                    {minutes.map(m => <option key={m} value={m}>{m}min</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest">Notas (opcional)</label>
                <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Ej: traer estudios"
                  className="border border-[#EDEDED] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A0A0A] bg-[#F5F5F7]" />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <button onClick={handleSave} disabled={loading || !date}
                className="bg-[#0A0A0A] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#262626] disabled:opacity-50 transition-colors">
                {loading ? 'Guardando...' : hasAppointment ? 'Guardar nuevo turno' : 'Confirmar turno'}
              </button>

              {patientPhone && date && (
                <button onClick={handleWhatsApp}
                  className="bg-[#25D366] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#1DA851] transition-colors flex items-center justify-center gap-2">
                  💬 Enviar por WhatsApp
                </button>
              )}

              <button onClick={() => setOpen(false)}
                className="text-sm text-[#6E6E73] hover:text-[#0A0A0A] py-2 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}