'use client'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'

export default function NuevaSesionPage() {
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcription, setTranscription] = useState('')
  const [summary, setSummary] = useState<any>(null)
  const [step, setStep] = useState<'record' | 'transcribing' | 'summarizing' | 'done'>('record')
  const [error, setError] = useState('')
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const supabase = createClient()
  const router = useRouter()
  const params = useParams()
  const patientId = params.id as string

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const media = new MediaRecorder(stream)
    mediaRef.current = media
    chunksRef.current = []
    media.ondataavailable = e => chunksRef.current.push(e.data)
    media.onstop = () => setAudioBlob(new Blob(chunksRef.current, { type: 'audio/webm' }))
    media.start()
    setRecording(true)
  }

  function stopRecording() {
    mediaRef.current?.stop()
    setRecording(false)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setAudioBlob(file)
  }

  async function processAudio() {
    if (!audioBlob) return
    setStep('transcribing')
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: patient } = await supabase.from('patients').select('full_name, diagnosis').eq('id', patientId).single()
      const { data: session } = await supabase.from('sessions').insert({ patient_id: patientId, status: 'pending' }).select().single()
      const formData = new FormData()
      formData.append('audio', audioBlob, 'audio.webm')
      const transcribeRes = await fetch('/api/transcribe', { method: 'POST', body: formData })
      const transcribeData = await transcribeRes.json()
      if (transcribeData.error) throw new Error(transcribeData.error)
      const text = transcribeData.text
      setTranscription(text)
      await supabase.from('transcriptions').insert({ session_id: session.id, content: text })
      await supabase.from('sessions').update({ status: 'transcribed' }).eq('id', session.id)
      setStep('summarizing')
      const summarizeRes = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription: text, patientName: patient?.full_name, diagnosis: patient?.diagnosis })
      })
      const summaryData = await summarizeRes.json()
      if (summaryData.error) throw new Error(summaryData.error)
      setSummary(summaryData)
      await supabase.from('summaries').insert({ session_id: session.id, ...summaryData })
      await supabase.from('sessions').update({ status: 'summarized' }).eq('id', session.id)
      setStep('done')
    } catch (err: any) {
      setError(err.message)
      setStep('record')
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#F9FAFB',display:'flex'}}>
      <div style={{width:'208px',background:'white',borderRight:'1px solid #E5E7EB',minHeight:'100vh',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'20px 16px',borderBottom:'1px solid #F3F4F6'}}>
          <span style={{fontSize:'16px',fontWeight:'500',color:'#111827'}}>Nota<span style={{color:'#2563EB'}}>Clínica</span></span>
        </div>
        <nav style={{display:'flex',flexDirection:'column',gap:'4px',padding:'12px'}}>
          <a href="/dashboard" style={{padding:'8px 12px',borderRadius:'8px',color:'#4B5563',fontSize:'14px',textDecoration:'none'}}>Dashboard</a>
        </nav>
      </div>
      <div style={{flex:1,padding:'28px',maxWidth:'600px'}}>
        <a href={"/dashboard/pacientes/" + patientId} style={{fontSize:'14px',color:'#6B7280',textDecoration:'none'}}>← Volver</a>
        <h1 style={{fontSize:'20px',fontWeight:'500',color:'#111827',marginTop:'16px',marginBottom:'24px'}}>Nueva sesión</h1>

        {step === 'record' && (
          <div style={{background:'white',border:'1px solid #E5E7EB',borderRadius:'16px',padding:'24px',display:'flex',flexDirection:'column',gap:'24px'}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'16px',padding:'24px 0'}}>
              {!recording ? (
                <button onClick={startRecording} style={{width:'80px',height:'80px',borderRadius:'50%',background:'#2563EB',border:'none',fontSize:'28px',cursor:'pointer',color:'white'}}>
                  🎙️
                </button>
              ) : (
                <button onClick={stopRecording} style={{width:'80px',height:'80px',borderRadius:'50%',background:'#DC2626',border:'none',fontSize:'20px',cursor:'pointer',color:'white',fontWeight:'bold',letterSpacing:'1px'}}>
                  STOP
                </button>
              )}
              <p style={{fontSize:'14px',color:'#6B7280',margin:0}}>
                {recording ? '🔴 Grabando... presioná STOP para detener' : 'Presioná para grabar'}
              </p>
              {audioBlob && !recording && (
                <p style={{fontSize:'14px',color:'#16A34A',fontWeight:'500',margin:0}}>✓ Audio listo para procesar</p>
              )}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{flex:1,height:'1px',background:'#E5E7EB'}} />
              <span style={{fontSize:'12px',color:'#9CA3AF'}}>o subí un archivo</span>
              <div style={{flex:1,height:'1px',background:'#E5E7EB'}} />
            </div>
            <input type="file" accept="audio/*" onChange={handleFileUpload} style={{fontSize:'14px',color:'#4B5563'}} />
            {error && <p style={{fontSize:'14px',color:'#DC2626',margin:0}}>{error}</p>}
            <button
              onClick={processAudio}
              disabled={!audioBlob}
              style={{background: audioBlob ? '#2563EB' : '#BFDBFE',color:'white',border:'none',borderRadius:'8px',padding:'12px',fontSize:'14px',fontWeight:'500',cursor: audioBlob ? 'pointer' : 'not-allowed'}}
            >
              ✨ Transcribir y generar resumen
            </button>
          </div>
        )}

        {(step === 'transcribing' || step === 'summarizing') && (
          <div style={{background:'white',border:'1px solid #E5E7EB',borderRadius:'16px',padding:'40px',display:'flex',flexDirection:'column',alignItems:'center',gap:'16px'}}>
            <p style={{fontSize:'14px',fontWeight:'500',color:'#111827'}}>
              {step === 'transcribing' ? 'Transcribiendo con Whisper...' : 'Generando resumen con Claude...'}
            </p>
          </div>
        )}

        {step === 'done' && summary && (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div style={{background:'white',border:'1px solid #E5E7EB',borderRadius:'16px',padding:'24px'}}>
              <h2 style={{fontSize:'14px',fontWeight:'500',color:'#111827',marginBottom:'16px'}}>📋 Resumen clínico</h2>
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                {[['Motivo de consulta', summary.chief_complaint],['Observaciones', summary.observations],['Plan terapéutico', summary.plan],['Próximos pasos', summary.next_steps]].map(([label, value]) => (
                  <div key={label} style={{background:'#F9FAFB',borderRadius:'8px',padding:'12px'}}>
                    <p style={{fontSize:'12px',color:'#6B7280',margin:'0 0 4px 0'}}>{label}</p>
                    <p style={{fontSize:'14px',color:'#111827',margin:0}}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:'white',border:'1px solid #E5E7EB',borderRadius:'16px',padding:'24px'}}>
              <h2 style={{fontSize:'14px',fontWeight:'500',color:'#111827',marginBottom:'12px'}}>📝 Transcripción</h2>
              <p style={{fontSize:'14px',color:'#374151',lineHeight:'1.6',margin:0}}>{transcription}</p>
            </div>
            <a href={"/dashboard/pacientes/" + patientId} style={{background:'#2563EB',color:'white',borderRadius:'8px',padding:'12px',fontSize:'14px',fontWeight:'500',textAlign:'center',textDecoration:'none',display:'block'}}>
              ✓ Volver al paciente
            </a>
          </div>
        )}
      </div>
    </div>
  )
}