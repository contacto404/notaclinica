'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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
  const supabase = createClient()
  const router = useRouter()

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  const minutes = ['00', '15', '30', '45']

  async function handleSave() {
    if (!date || !hour) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Construir fecha en timezone de Uruguay (America/Montevideo)
    const localDateStr = `${date}T${hour}:${minute}:00`
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Montevideo',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    })
    // Calcular offset Uruguay vs UTC
    const utcDate = new Date(localDateStr + '-03:00')
    const appointmentDate = utcDate

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
      <button
        onClick={() => setOpen(true)}
        className="bg-[#2563EB] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5">
        📅 {hasAppointment ? 'Reagendar' : 'Agendar'}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#E2E8F0] shadow-xl">
            <h3 className="text-base font-bold text-[#0F172A] mb-5">
              {hasAppointment ? 'Reagendar turno' : 'Agendar turno'} — {patientName}
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#64748B] font-medium uppercase tracking-widest">Fecha</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] bg-[#F8FAFC] w-full" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#64748B] font-medium uppercase tracking-widest">Hora</label>
                <div className="flex gap-2">
                  <select value={hour} onChange={e => setHour(e.target.value)}
                    className="flex-1 border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] bg-[#F8FAFC]">
                    {hours.map(h => <option key={h} value={h}>{h}hs</option>)}
                  </select>
                  <select value={minute} onChange={e => setMinute(e.target.value)}
                    className="flex-1 border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] bg-[#F8FAFC]">
                    {minutes.map(m => <option key={m} value={m}>{m}min</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#64748B] font-medium uppercase tracking-widest">Notas (opcional)</label>
                <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Ej: traer estudios"
                  className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] bg-[#F8FAFC]" />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <button onClick={handleSave} disabled={loading || !date}
                className="bg-[#2563EB] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors">
                {loading ? 'Guardando...' : hasAppointment ? 'Guardar nuevo turno' : 'Confirmar turno'}
              </button>

              {patientPhone && date && (
                <button onClick={handleWhatsApp}
                  className="bg-[#25D366] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#1DA851] transition-colors flex items-center justify-center gap-2">
                  💬 Enviar por WhatsApp
                </button>
              )}

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