'use client'

export default function WhatsAppButton({
  phone,
  patientName,
  sessionDate,
  summary,
  nextAppointment,
}: {
  phone?: string
  patientName: string
  sessionDate: string
  summary: {
    chief_complaint: string | null
    observations: string | null
    plan: string | null
    next_steps: string | null
  }
  nextAppointment?: string | null
}) {
  function handleClick() {
    const fecha = new Date(sessionDate).toLocaleDateString('es-AR', {
      day: '2-digit', month: 'long', year: 'numeric'
    })

    const proxima = nextAppointment
      ? new Date(nextAppointment).toLocaleDateString('es-AR', {
          weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
        }) + ' a las ' + new Date(nextAppointment).toLocaleTimeString('es-AR', {
          hour: '2-digit', minute: '2-digit'
        })
      : null

    const lines = [
      `Hola ${patientName} 👋`,
      `Te comparto el resumen de nuestra sesión del ${fecha}:`,
      '',
    ]

    if (summary.chief_complaint)
      lines.push(`*Motivo de consulta*\n${summary.chief_complaint}`, '')
    if (summary.observations)
      lines.push(`*Observaciones*\n${summary.observations}`, '')
    if (summary.plan)
      lines.push(`*Plan de tratamiento*\n${summary.plan}`, '')
    if (summary.next_steps)
      lines.push(`*Próximos pasos*\n${summary.next_steps}`, '')
    if (proxima)
      lines.push(`📅 *Próxima consulta:* ${proxima}`)

    const message = lines.join('\n')
    const cleaned = phone?.replace(/\D/g, '') ?? ''
    window.open(`https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`, '_blank')
  }

  if (!phone) return null

  return (
    <button
      onClick={handleClick}
      className="bg-[#25D366] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1DA851] transition-colors shadow-sm shrink-0"
    >
      💬 WhatsApp
    </button>
  )
}