import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { IconSearch } from '../components/Icons'
import { avatarColor } from '@/lib/avatar'

// Recorta un fragmento alrededor de la coincidencia
function excerpt(text: string | null, q: string): string | null {
  if (!text) return null
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return null
  const start = Math.max(0, idx - 40)
  const end = Math.min(text.length, idx + q.length + 60)
  return (start > 0 ? '… ' : '') + text.slice(start, end).trim() + (end < text.length ? ' …' : '')
}

export default async function BuscarPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: rawQ } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Limpiar el término (evita romper la sintaxis de los filtros)
  const q = (rawQ ?? '').replace(/[,%()*]/g, ' ').trim()
  const hasQuery = q.length >= 2

  let patients: any[] = []
  let notas: any[] = []

  if (hasQuery) {
    const like = `*${q}*`
    const [{ data: pData }, { data: sData }] = await Promise.all([
      supabase.from('patients')
        .select('id, full_name, diagnosis, medication, notes')
        .eq('professional_id', user.id)
        .or(`full_name.ilike.${like},diagnosis.ilike.${like},medication.ilike.${like},notes.ilike.${like}`)
        .limit(30),
      supabase.from('summaries')
        .select('chief_complaint, observations, plan, next_steps, sessions!inner(id, patient_id, session_date, professional_id, patients(full_name))')
        .eq('sessions.professional_id', user.id)
        .or(`chief_complaint.ilike.${like},observations.ilike.${like},plan.ilike.${like},next_steps.ilike.${like}`)
        .limit(30),
    ])
    patients = pData ?? []
    notas = sData ?? []
  }

  const totalResultados = patients.length + notas.length

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-5 md:p-8">
      <div className="max-w-2xl mx-auto">

        <div className="mb-5">
          <p className="text-[11px] text-[#6E6E73] font-medium uppercase tracking-widest mb-0.5">Búsqueda</p>
          <h1 className="text-2xl font-bold text-[#0A0A0A]">Buscar en todo</h1>
        </div>

        <form method="get" className="mb-6">
          <input
            type="text"
            name="q"
            defaultValue={rawQ ?? ''}
            autoFocus
            placeholder="Nombre, diagnóstico, medicación o texto de una sesión…"
            className="w-full border border-[#EDEDED] rounded-xl px-4 py-3 text-sm text-[#0A0A0A] outline-none focus:border-[#0A0A0A] bg-white"
          />
        </form>

        {!hasQuery ? (
          <div className="bg-white rounded-2xl border border-[#EDEDED] p-10 text-center">
            <IconSearch className="w-7 h-7 mx-auto mb-2 text-[#A3A3A3]" />
            <p className="text-sm text-[#6E6E73]">Escribí al menos 2 caracteres para buscar en pacientes y notas de sesión.</p>
          </div>
        ) : totalResultados === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EDEDED] p-10 text-center">
            <p className="text-2xl mb-2">🫥</p>
            <p className="text-sm font-semibold text-[#0A0A0A]">Sin resultados para “{q}”</p>
            <p className="text-xs text-[#6E6E73] mt-1">Probá con otro término.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">

            {patients.length > 0 && (
              <div>
                <h2 className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-widest mb-2.5">Pacientes ({patients.length})</h2>
                <div className="flex flex-col gap-1.5">
                  {patients.map(p => (
                    <a key={p.id} href={"/dashboard/pacientes/" + p.id}
                      className="bg-white rounded-xl border border-[#EDEDED] px-3.5 py-3 flex items-center gap-3 hover:shadow-sm hover:border-[#D2D2D7] dark:hover:border-[#6E6E73] transition-all">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 uppercase" style={{ backgroundColor: avatarColor(p.full_name)[0], color: avatarColor(p.full_name)[1] }}>
                        {p.full_name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0A0A0A] truncate">{p.full_name}</p>
                        <p className="text-xs text-[#6E6E73] truncate">
                          {[p.diagnosis, p.medication].filter(Boolean).join(' · ') || 'Sin diagnóstico'}
                        </p>
                      </div>
                      <span className="text-[#D2D2D7] dark:text-[#6E6E73] text-lg shrink-0">›</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {notas.length > 0 && (
              <div>
                <h2 className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-widest mb-2.5">En notas de sesión ({notas.length})</h2>
                <div className="flex flex-col gap-1.5">
                  {notas.map((n: any, i: number) => {
                    const ses = n.sessions
                    const frag =
                      excerpt(n.chief_complaint, q) || excerpt(n.observations, q) ||
                      excerpt(n.plan, q) || excerpt(n.next_steps, q)
                    return (
                      <a key={i} href={"/dashboard/sesiones/" + ses?.id}
                        className="bg-white rounded-xl border border-[#EDEDED] px-4 py-3 block hover:shadow-sm hover:border-[#D2D2D7] dark:hover:border-[#6E6E73] transition-all">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-[#0A0A0A] truncate">{ses?.patients?.full_name}</p>
                          <p className="text-[11px] text-[#A3A3A3] shrink-0">
                            {ses?.session_date ? new Date(ses.session_date).toLocaleDateString('es-UY', { timeZone: 'America/Montevideo', day: '2-digit', month: 'short', year: '2-digit' }) : ''}
                          </p>
                        </div>
                        {frag && <p className="text-xs text-[#6E6E73] line-clamp-2">{frag}</p>}
                      </a>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
