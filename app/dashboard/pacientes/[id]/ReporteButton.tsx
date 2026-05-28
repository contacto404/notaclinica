'use client'
import { useState } from 'react'

export default function ReporteButton({
  patientId, patientName, patientPhone, nextAppointment, sessionId
}: {
  patientId: string
  patientName: string
  patientPhone?: string
  nextAppointment?: any
  sessionId?: string
}) {
  const [open, setOpen] = useState(false)
  const [diagnosis, setDiagnosis] = useState('')
  const [instructions, setInstructions] = useState('')
  const [medications, setMedications] = useState([{ name: '', dose: '', frequency: '', notes: '' }])
  const [loading, setLoading] = useState(false)
  const [reportUrl, setReportUrl] = useState('')

  function addMed() {
    setMedications(prev => [...prev, { name: '', dose: '', frequency: '', notes: '' }])
  }

  function removeMed(i: number) {
    setMedications(prev => prev.filter((_, idx) => idx !== i))
  }

  function updateMed(i: number, field: string, value: string) {
    setMedications(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m))
  }

  async function handleGenerate() {
    setLoading(true)
    const res = await fetch('/api/reporte-paciente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId,
        sessionId: sessionId || null,
        diagnosis,
        medications: medications.filter(m => m.name),
        instructions,
        nextAppointment: nextAppointment?.appointment_date || null,
      })
    })
    const data = await res.json()
    if (data.reportId) {
      const url = `${window.location.origin}/api/reporte-paciente?reportId=${data.reportId}`
      setReportUrl(url)
    }
    setLoading(false)
  }

  function handleWhatsApp() {
    if (!patientPhone || !reportUrl) return
    const phone = patientPhone.replace(/\D/g, '')
    const aptDate = nextAppointment
      ? new Date(nextAppointment.appointment_date).toLocaleDateString('es-AR', {
          weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
        }) + ' a las ' + new Date(nextAppointment.appointment_date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
      : ''
    const message = `Hola ${patientName}! Te comparto tu resumen médico de hoy.${aptDate ? `\n\nTu próxima consulta es el ${aptDate}.` : ''}\n\nResumen médico: ${reportUrl}`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  function handleClose() {
    setOpen(false)
    setReportUrl('')
    setDiagnosis('')
    setInstructions('')
    setMedications([{ name: '', dose: '', frequency: '', notes: '' }])
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="border border-[#E0D0C0] text-[#6B4F3A] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#FBF7F4] flex items-center gap-2 transition-colors">
        📋 Resumen médico
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-[#F0E8E0] shadow-xl my-4">

            {!reportUrl ? (
              <>
                <h3 className="text-base font-bold text-[#2D1F14] mb-5">Resumen médico — {patientName}</h3>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#A08070] font-medium uppercase tracking-widest">Diagnóstico</label>
                    <textarea value={diagnosis} onChange={e => setDiagnosis(e.target.value)} rows={2}
                      placeholder="Ej: Hipertensión arterial"
                      className="border border-[#F0E8E0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E8602C] bg-[#FBF7F4] resize-none" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-[#A08070] font-medium uppercase tracking-widest">Medicamentos</label>
                      <button onClick={addMed} className="text-xs text-[#E8602C] font-medium hover:underline">+ Agregar</button>
                    </div>
                    {medications.map((m, i) => (
                      <div key={i} className="bg-[#FBF7F4] rounded-xl p-3 flex flex-col gap-2">
                        <div className="flex gap-2">
                          <input value={m.name} onChange={e => updateMed(i, 'name', e.target.value)}
                            placeholder="Nombre del medicamento"
                            className="flex-1 border border-[#F0E8E0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8602C] bg-white" />
                          <button onClick={() => removeMed(i)} className="text-[#A08070] hover:text-red-500 text-lg px-1">×</button>
                        </div>
                        <div className="flex gap-2">
                          <input value={m.dose} onChange={e => updateMed(i, 'dose', e.target.value)}
                            placeholder="Dosis (ej: 10mg)"
                            className="flex-1 border border-[#F0E8E0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8602C] bg-white" />
                          <input value={m.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)}
                            placeholder="Frecuencia (ej: 1 vez/día)"
                            className="flex-1 border border-[#F0E8E0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8602C] bg-white" />
                        </div>
                        <input value={m.notes} onChange={e => updateMed(i, 'notes', e.target.value)}
                          placeholder="Notas (ej: tomar con comida)"
                          className="border border-[#F0E8E0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8602C] bg-white" />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#A08070] font-medium uppercase tracking-widest">Indicaciones generales</label>
                    <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={3}
                      placeholder="Ej: Evitar alcohol, descansar 8 horas..."
                      className="border border-[#F0E8E0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#E8602C] bg-[#FBF7F4] resize-none" />
                  </div>

                  {nextAppointment && (
                    <div className="bg-[#FDE8C8] rounded-xl p-3 text-sm text-[#8B4513]">
                      📅 Próxima consulta: <strong>{new Date(nextAppointment.appointment_date).toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long' })}</strong>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 mt-6">
                  <button onClick={handleGenerate} disabled={loading}
                    className="bg-[#E8602C] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#D04F1E] disabled:opacity-50 transition-colors">
                    {loading ? 'Generando...' : '📋 Generar resumen'}
                  </button>
                  <button onClick={handleClose}
                    className="text-sm text-[#A08070] hover:text-[#2D1F14] py-2 transition-colors">
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-[#2D1F14] mb-2">✅ Resumen generado</h3>
                <p className="text-xs text-[#A08070] mb-5">Ahora podés enviarlo al paciente o verlo en el navegador.</p>

                <div className="flex flex-col gap-2">
                  {patientPhone && (
                    <button onClick={handleWhatsApp}
                      className="bg-[#25D366] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#1DA851] transition-colors flex items-center justify-center gap-2">
                      💬 Enviar por WhatsApp a {patientName}
                    </button>
                  )}
                  <a href={reportUrl} target="_blank"
                    className="border border-[#F0E8E0] text-[#6B4F3A] rounded-xl py-3 text-sm font-medium hover:bg-[#FBF7F4] transition-colors flex items-center justify-center gap-2">
                    👁 Ver resumen
                  </a>
                  <button onClick={handleClose}
                    className="text-sm text-[#A08070] hover:text-[#2D1F14] py-2 transition-colors">
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}