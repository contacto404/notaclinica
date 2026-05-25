import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function SesionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: session } = await supabase
    .from('sessions')
    .select('*, patients(*), transcriptions(*), summaries(*)')
    .eq('id', id)
    .single()

  if (!session) redirect('/dashboard')

  const patient = session.patients
  const summary = session.summaries
  const transcription = session.transcriptions

  return (
    <div style={{minHeight:'100vh',background:'#F9FAFB',display:'flex'}}>
      <div style={{width:'208px',background:'white',borderRight:'1px solid #E5E7EB',minHeight:'100vh',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'20px 16px',borderBottom:'1px solid #F3F4F6'}}>
          <span style={{fontSize:'16px',fontWeight:'500',color:'#111827'}}>Nota<span style={{color:'#2563EB'}}>Clínica</span></span>
        </div>
        <nav style={{display:'flex',flexDirection:'column',gap:'4px',padding:'12px'}}>
          <a href="/dashboard" style={{padding:'8px 12px',borderRadius:'8px',color:'#4B5563',fontSize:'14px',textDecoration:'none'}}>Dashboard</a>
          <a href={"/dashboard/pacientes/" + patient?.id} style={{padding:'8px 12px',borderRadius:'8px',color:'#4B5563',fontSize:'14px',textDecoration:'none'}}>← Volver al paciente</a>
        </nav>
      </div>
      <div style={{flex:1,padding:'28px',maxWidth:'700px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'24px'}}>
          <div>
            <h1 style={{fontSize:'20px',fontWeight:'500',color:'#111827',margin:0}}>{patient?.full_name}</h1>
            <p style={{fontSize:'14px',color:'#6B7280',margin:'4px 0 0 0'}}>
              {new Date(session.session_date).toLocaleDateString('es-AR', { day:'2-digit', month:'long', year:'numeric' })}
            </p>
          </div>
          <a href={"/api/export-pdf?sessionId=" + id} target="_blank" style={{background:'#2563EB',color:'white',padding:'8px 16px',borderRadius:'8px',fontSize:'13px',fontWeight:'500',textDecoration:'none'}}>
            ⬇ Exportar PDF
          </a>
        </div>
        {summary && (
          <div style={{background:'white',border:'1px solid #E5E7EB',borderRadius:'16px',padding:'24px',marginBottom:'16px'}}>
            <h2 style={{fontSize:'14px',fontWeight:'500',color:'#111827',marginBottom:'16px'}}>📋 Resumen clínico</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {[['Motivo de consulta', summary.chief_complaint],['Observaciones', summary.observations],['Plan terapéutico', summary.plan],['Próximos pasos', summary.next_steps]].map(([label, value]) => (
                <div key={label} style={{background:'#F9FAFB',borderRadius:'8px',padding:'12px'}}>
                  <p style={{fontSize:'12px',color:'#6B7280',margin:'0 0 4px 0'}}>{label}</p>
                  <p style={{fontSize:'14px',color:'#111827',margin:0,lineHeight:'1.6'}}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {transcription && (
          <div style={{background:'white',border:'1px solid #E5E7EB',borderRadius:'16px',padding:'24px'}}>
            <h2 style={{fontSize:'14px',fontWeight:'500',color:'#111827',marginBottom:'12px'}}>📝 Transcripción</h2>
            <p style={{fontSize:'14px',color:'#374151',lineHeight:'1.7',margin:0,borderLeft:'3px solid #2563EB',paddingLeft:'16px'}}>
              {transcription.content}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
