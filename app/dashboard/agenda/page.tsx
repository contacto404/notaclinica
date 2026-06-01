import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WaitlistButton from './WaitlistButton'
import WaitlistItem from './WaitlistItem'

export default async function AgendaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, patients(*)')
    .eq('professional_id', user.id)
    .gte('appointment_date', new Date().toISOString())
    .order('appointment_date', { ascending: true })

  const { data: waitlist } = await supabase
    .from('waitlist')
    .select('*')
    .eq('professional_id', user.id)
    .order('created_at', { ascending: true })

  const grouped: Record<string, any[]> = {}
  appointments?.forEach(a => {
    const date = new Date(a.appointment_date).toLocaleDateString('es-UY', {
      timeZone: 'America/Montevideo',
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    })
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(a)
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-5 md:p-8">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1">Calendario</p>
            <h1 className="text-2xl font-bold text-[#0F172A]">Agenda</h1>
          </div>
          <WaitlistButton />
        </div>

        {Object.keys(grouped).length > 0 ? (
          <div className="flex flex-col gap-6 mb-8">
            {Object.entries(grouped).map(([date, turns]) => (
              <div key={date}>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3 capitalize">{date}</p>
                <div className="flex flex-col gap-2">
                  {turns.map((a: any) => (
                    <a key={a.id} href={"/dashboard/pacientes/" + a.patient_id}
                      className="bg-white rounded-2xl border border-[#E2E8F0] px-5 py-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="bg-[#DBEAFE] rounded-xl px-3 py-2 text-center shrink-0">
                        <p className="text-lg font-bold text-[#2563EB]">
                          {new Date(a.appointment_date).toLocaleTimeString('es-UY', {
                            timeZone: 'America/Montevideo',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0F172A]">{a.patients?.full_name}</p>
                        <p className="text-xs text-[#64748B] mt-0.5">{a.patients?.diagnosis ?? 'Sin diagnostico'}{a.notes ? ` · ${a.notes}` : ''}</p>
                      </div>
                      <span className="text-[#D0B8A8] text-lg shrink-0">›</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-12 text-center mb-8">
            <p className="text-3xl mb-3">📅</p>
            <p className="text-sm font-semibold text-[#0F172A]">No hay turnos proximos</p>
            <p className="text-xs text-[#64748B] mt-1">Los turnos que agendes apareceran aca</p>
          </div>
        )}

        {/* Lista de espera */}
        {waitlist && waitlist.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">Lista de espera</p>
            <div className="flex flex-col gap-2">
              {waitlist.map((w: any) => (
                <WaitlistItem key={w.id} item={w} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}