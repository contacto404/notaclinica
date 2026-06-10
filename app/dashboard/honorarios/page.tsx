import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HonorariosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const inicioMes = new Date()
  inicioMes.setDate(1)
  inicioMes.setHours(0, 0, 0, 0)

  const { data: payments } = await supabase
    .from('payments')
    .select('*, patients(full_name)')
    .eq('professional_id', user.id)
    .order('created_at', { ascending: false })

  const pagosMes = payments?.filter(p =>
    new Date(p.created_at) >= inicioMes
  ) ?? []

  const totalCobrado = pagosMes
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalPendiente = pagosMes
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-5 md:p-8">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6">
          <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-widest mb-0.5">Finanzas</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight">Honorarios</h1>
        </div>

        {/* Resumen del mes */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#E8F4E8] rounded-2xl p-3.5">
            <p className="text-[11px] text-[#64748B] mb-1.5">Cobrado este mes</p>
            <p className="text-2xl font-bold text-[#2D6A2D] leading-none">
              ${totalCobrado.toLocaleString('es-UY')}
            </p>
            <p className="text-[11px] text-[#64748B] mt-1.5">UYU</p>
          </div>
          <div className="bg-[#FFF7ED] rounded-2xl p-3.5">
            <p className="text-[11px] text-[#64748B] mb-1.5">Pendiente de cobro</p>
            <p className="text-2xl font-bold text-[#C2410C] leading-none">
              ${totalPendiente.toLocaleString('es-UY')}
            </p>
            <p className="text-[11px] text-[#64748B] mt-1.5">UYU</p>
          </div>
        </div>

        {/* Lista de pagos */}
        <div>
          <h2 className="text-[11px] font-semibold text-[#64748B] uppercase tracking-widest mb-3">Todos los cobros</h2>
          <div className="flex flex-col gap-1.5">
            {payments && payments.length > 0 ? payments.map((p: any) => (
              <div key={p.id} className="bg-white rounded-xl border border-[#E2E8F0] px-4 py-3 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${p.status === 'paid' ? 'bg-green-500' : 'bg-orange-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0F172A] truncate">{p.patients?.full_name}</p>
                  <p className="text-xs text-[#64748B] mt-0.5 truncate">
                    {new Date(p.created_at).toLocaleDateString('es-UY', {
                      timeZone: 'America/Montevideo',
                      day: '2-digit', month: 'long'
                    })}
                    {p.description && ` · ${p.description}`}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-[#0F172A] tabular-nums">${p.amount.toLocaleString('es-UY')}</p>
                  <p className={`text-xs font-medium ${p.status === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>
                    {p.status === 'paid' ? 'Pagado' : 'Pendiente'}
                  </p>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
                <p className="text-3xl mb-3">💳</p>
                <p className="text-sm font-semibold text-[#0F172A]">No hay cobros registrados</p>
                <p className="text-xs text-[#64748B] mt-1">Los cobros aparecerán acá cuando uses el botón "Cobrar sesión"</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
