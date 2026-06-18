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

  const fmtFecha = (d: Date) => d.toLocaleDateString('es-UY', {
    timeZone: 'America/Montevideo',
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  })
  const hoyStr = fmtFecha(new Date())

  const grouped: Record<string, any[]> = {}
  appointments?.forEach(a => {
    const date = fmtFecha(new Date(a.appointment_date))
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(a)
  })

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-5 md:p-8">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] text-[#6E6E73] font-medium uppercase tracking-widest mb-0.5">Calendario</p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] tracking-tight">Agenda</h1>
          </div>
          <WaitlistButton />
        </div>

        {Object.keys(grouped).length > 0 ? (
          <div className="flex flex-col gap-5 mb-6">
            {Object.entries(grouped).map(([date, turns]) => {
              const esHoy = date === hoyStr
              return (
              <div key={date}>
                <div className="flex items-center gap-2 mb-2.5">
                  <p className={"text-[11px] font-semibold uppercase tracking-widest capitalize " + (esHoy ? 'text-[#0A0A0A]' : 'text-[#6E6E73]')}>{date}</p>
                  {esHoy && <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-[#0A0A0A] text-white">Hoy</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  {turns.map((a: any) => (
                    <a key={a.id} href={"/dashboard/pacientes/" + a.patient_id}
                      className="bg-white rounded-xl border border-[#EDEDED] px-4 py-3 flex items-center gap-3 hover:shadow-sm hover:border-[#D2D2D7] dark:hover:border-[#6E6E73] transition-all">
                      <div className="bg-[#F0F0F0] rounded-lg px-2.5 py-1.5 text-center shrink-0">
                        <p className="text-base font-bold text-[#0A0A0A] tabular-nums leading-none">
                          {new Date(a.appointment_date).toLocaleTimeString('es-UY', {
                            timeZone: 'America/Montevideo',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[#0A0A0A] truncate">{a.patients?.full_name}</p>
                          {a.status === 'cancelled_by_patient' && (
                            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-[#FEE2E2] text-[#B91C1C] shrink-0">Canceló</span>
                          )}
                          {a.status === 'reschedule_requested' && (
                            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 shrink-0">⚠ Pide reprogramar</span>
                          )}
                        </div>
                        <p className="text-xs text-[#6E6E73] mt-0.5 truncate">{a.patients?.diagnosis ?? 'Sin diagnóstico'}{a.notes ? ` · ${a.notes}` : ''}</p>
                      </div>
                      <span className="text-[#D2D2D7] dark:text-[#6E6E73] text-lg shrink-0">›</span>
                    </a>
                  ))}
                </div>
              </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#EDEDED] p-12 text-center mb-6">
            <p className="text-3xl mb-3">📅</p>
            <p className="text-sm font-semibold text-[#0A0A0A]">No hay turnos próximos</p>
            <p className="text-xs text-[#6E6E73] mt-1">Los turnos que agendes aparecerán acá</p>
          </div>
        )}

        {/* Lista de espera */}
        {waitlist && waitlist.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-widest mb-2.5">Lista de espera</p>
            <div className="flex flex-col gap-1.5">
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
