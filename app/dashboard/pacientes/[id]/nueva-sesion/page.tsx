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
        body: JSON.stringify({ transcription: text, patientName: patient?.full_name, diagnosis: patient?.diagnosis, patientId })
      })
      const summaryData = await summarizeRes.json()
      if (summaryData.error) throw new Error(summaryData.error)
      setSummary(summaryData)
      await supabase.from('summaries').insert({ session_id: session.id, ...summaryData })
      await supabase.from('sessions').update({ status: 'complete' }).eq('id', session.id)
      setStep('done')
    } catch (err: any) {
      setError(err.message)
      setStep('record')
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-5 md:p-8">
      <div className="max-w-xl mx-auto">

        <div className="mb-6">
          <a href={"/dashboard/pacientes/" + patientId} className="text-xs text-[#64748B] hover:text-[#0F172A] transition-colors font-medium">← Volver</a>
        </div>

        <div className="mb-6">
          <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1">Sesión</p>
          <h1 className="text-2xl font-bold text-[#0F172A]">Nueva sesión</h1>
        </div>

        {step === 'record' && (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4 py-6">
              {!recording ? (
                <button onClick={startRecording}
                  className="w-24 h-24 rounded-full bg-[#2563EB] text-4xl cursor-pointer text-white flex items-center justify-center hover:bg-[#1D4ED8] transition-colors shadow-lg">
                  🎙️
                </button>
              ) : (
                <button onClick={stopRecording}
                  className="w-24 h-24 rounded-full bg-red-500 cursor-pointer text-white font-bold text-sm tracking-wider flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg animate-pulse">
                  STOP
                </button>
              )}
              <p className="text-sm text-[#64748B]">
                {recording ? '🔴 Grabando... presioná STOP para detener' : 'Presioná para grabar'}
              </p>
              {audioBlob && !recording && (
                <p className="text-sm text-[#2D6A2D] font-medium bg-[#E8F4E8] px-4 py-2 rounded-full">✓ Audio listo para procesar</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <span className="text-xs text-[#64748B]">o subí un archivo</span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>

            <input type="file" accept="audio/*" onChange={handleFileUpload}
              className="text-sm text-[#475569] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#DBEAFE] file:text-[#1E40AF] hover:file:bg-[#BFDBFE]" />

            {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{error}</p>}

            <button onClick={processAudio} disabled={!audioBlob}
              className="bg-[#2563EB] disabled:bg-[#F0D8C8] disabled:text-[#C0A090] text-white rounded-xl py-3 text-sm font-semibold cursor-pointer disabled:cursor-not-allowed hover:bg-[#1D4ED8] transition-colors shadow-sm">
              ✨ Transcribir y generar resumen
            </button>
          </div>
        )}

        {(step === 'transcribing' || step === 'summarizing') && (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-12 flex flex-col items-center gap-5">
            <div className="w-10 h-10 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0F172A]">
                {step === 'transcribing' ? 'Transcribiendo audio...' : 'Generando resumen clínico...'}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                {step === 'transcribing' ? 'Usando Whisper de OpenAI' : 'Usando IA para analizar la consulta'}
              </p>
            </div>
          </div>
        )}

        {step === 'done' && summary && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6">
              <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">Resumen clínico</h2>
              <div className="flex flex-col gap-3">
                {([
                  ['Motivo de consulta', summary.chief_complaint],
                  ['Observaciones', summary.observations],
                  ['Plan de tratamiento', summary.plan],
                  ['Próximos pasos', summary.next_steps]
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="bg-[#F8FAFC] rounded-2xl p-4">
                    <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1.5">{label}</p>
                    <p className="text-sm text-[#0F172A] leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6">
              <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">Transcripción</h2>
              <p className="text-sm text-[#475569] leading-relaxed">{transcription}</p>
            </div>

            <a href={"/dashboard/pacientes/" + patientId}
              className="bg-[#2563EB] text-white rounded-xl py-3 text-sm font-semibold text-center hover:bg-[#1D4ED8] transition-colors shadow-sm block">
              ✓ Volver al paciente
            </a>
          </div>
        )}

      </div>
    </div>
  )
}