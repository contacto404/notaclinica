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
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function handleSave() {
    if (!date || !time) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const appointmentDate = new Date(`${date}T${time}`)

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
    const dateFormatted = date && time
      ? new Date(`${date}T${time}`).toLocaleDateString('es-AR', {
          weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
        }) + ' a las ' + time
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
        className="bg-[#25D366] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#1DA851] transition-colors flex items-center gap-1.5">
        📅 {hasAppointment ? 'Reagendar' : 'Agendar'}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#F0E8E0] shadow-xl">
            <h3 className="text-base font-bold text-[#2D1F14] mb-5">
              {hasAppointment ? 'Reagendar turno' : 'Agendar turno'} — {patientName}
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A08070] font-medium uppercase tracking-widest">Fecha</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="border border-[#F0E8E0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E8602C] bg-[#FBF7F4]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A08070] font-medium uppercase tracking-widest">Hora</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)}
                  className="border border-[#F0E8E0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E8602C] bg-[#FBF7F4]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#A08070] font-medium uppercase tracking-widest">Notas (opcional)</label>
                <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Ej: traer estudios"
                  className="border border-[#F0E8E0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E8602C] bg-[#FBF7F4]" />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <button onClick={handleSave} disabled={loading || !date || !time}
                className="bg-[#E8602C] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#D04F1E] disabled:opacity-50 transition-colors">
                {loading ? 'Guardando...' : hasAppointment ? 'Guardar nuevo turno' : 'Confirmar turno'}
              </button>

              {patientPhone && date && time && (
                <button onClick={handleWhatsApp}
                  className="bg-[#25D366] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#1DA851] transition-colors flex items-center justify-center gap-2">
                  💬 Enviar por WhatsApp
                </button>
              )}

              <button onClick={() => setOpen(false)}
                className="text-sm text-[#A08070] hover:text-[#2D1F14] py-2 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}