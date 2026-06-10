import { createClient as createAdmin } from '@supabase/supabase-js'

export default async function VerificarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // UUID válido? evita consultas con basura
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let receta: any = null
  let prof: any = null
  if (isUuid) {
    const { data } = await admin
      .from('prescriptions')
      .select('id, created_at, professional_id, patients(full_name)')
      .eq('id', id)
      .maybeSingle()
    receta = data
    if (receta?.professional_id) {
      const { data: p } = await admin
        .from('profiles')
        .select('professional_name, full_name, title, identification')
        .eq('id', receta.professional_id)
        .maybeSingle()
      prof = p
    }
  }

  const fecha = receta
    ? new Date(receta.created_at).toLocaleDateString('es-UY', { timeZone: 'America/Montevideo', day: '2-digit', month: 'long', year: 'numeric' })
    : null

  // Iniciales del paciente (privacidad: no se muestra el nombre completo)
  const nombrePaciente: string | undefined = receta?.patients?.full_name
  const iniciales = nombrePaciente
    ? nombrePaciente.split(' ').map((s: string) => s[0]).join('.').toUpperCase() + '.'
    : null

  const profNombre = prof?.professional_name || prof?.full_name || 'Profesional'

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-5">
      <div className="max-w-sm w-full">
        <p className="text-center font-bold text-[#0F172A] text-lg mb-4">NotaClínica</p>
        {receta ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#E8F4E8] flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
            <p className="text-base font-bold text-[#0F172A] mb-1">Documento auténtico</p>
            <p className="text-xs text-[#64748B] mb-5">Esta receta fue emitida desde NotaClínica.</p>
            <div className="text-left text-sm border-t border-[#E2E8F0] pt-4 space-y-2.5">
              <div>
                <p className="text-[11px] text-[#64748B] uppercase tracking-widest">Profesional</p>
                <p className="text-[#0F172A] font-medium">{profNombre}{prof?.title ? ` · ${prof.title}` : ''}</p>
                {prof?.identification && <p className="text-xs text-[#64748B]">ID: {prof.identification}</p>}
              </div>
              <div>
                <p className="text-[11px] text-[#64748B] uppercase tracking-widest">Paciente</p>
                <p className="text-[#0F172A] font-medium">{iniciales ?? '—'}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#64748B] uppercase tracking-widest">Fecha de emisión</p>
                <p className="text-[#0F172A] font-medium">{fecha}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFF7ED] flex items-center justify-center text-2xl mx-auto mb-4">⚠️</div>
            <p className="text-base font-bold text-[#0F172A] mb-1">No encontrado</p>
            <p className="text-xs text-[#64748B]">No existe un documento con este código. Puede haber sido escrito mal o no ser auténtico.</p>
          </div>
        )}
        <p className="text-center text-[11px] text-[#94A3B8] mt-4">Verificación de documentos · NotaClínica</p>
      </div>
    </div>
  )
}
