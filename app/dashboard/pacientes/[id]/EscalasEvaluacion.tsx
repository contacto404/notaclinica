'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Toast from '../../components/Toast'
import { SCALES, SCALE_LIST, OPTIONS, type ScaleId, type ScaleDef } from './scales'

function todayLocal() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Montevideo' })
}
function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-UY', { day: '2-digit', month: 'short', year: '2-digit' })
}
function formatShort(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-UY', { day: '2-digit', month: 'short' })
}

export default function EscalasEvaluacion({ patientId, assessments }: { patientId: string; assessments: any[] }) {
  const [openScale, setOpenScale] = useState<ScaleId | null>(null)
  const [toast, setToast] = useState('')
  const router = useRouter()

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 border border-[#E2E8F0]">
      {toast && <Toast message={toast} onDone={() => setToast('')} />}
      <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-5">📋 Escalas de evaluación</h2>

      <div className="flex flex-col gap-7">
        {SCALE_LIST.map(scale => (
          <ScaleBlock
            key={scale.id}
            scale={scale}
            history={assessments.filter(a => a.scale === scale.id)}
            onNew={() => setOpenScale(scale.id)}
          />
        ))}
      </div>

      {openScale && (
        <AssessmentModal
          scale={SCALES[openScale]}
          patientId={patientId}
          onClose={() => setOpenScale(null)}
          onSaved={() => { setOpenScale(null); setToast('Evaluación guardada'); router.refresh() }}
        />
      )}
    </div>
  )
}

function ScaleBlock({ scale, history, onNew }: { scale: ScaleDef; history: any[]; onNew: () => void }) {
  const asc = [...history].sort((a, b) => String(a.assessed_at).localeCompare(String(b.assessed_at)))
  const latest = asc[asc.length - 1]
  const first = asc[0]
  const latestSev = latest ? scale.severity(latest.score) : null
  const chart = asc.slice(-8)
  // Progreso clínico: en PHQ-9/GAD-7 un puntaje menor es mejor.
  const delta = asc.length >= 2 ? latest.score - first.score : 0
  const progreso = delta < 0
    ? { arrow: '↓', color: '#16A34A', text: `Bajó ${Math.abs(delta)} ${Math.abs(delta) === 1 ? 'punto' : 'puntos'} desde el inicio — mejora` }
    : delta > 0
      ? { arrow: '↑', color: '#DC2626', text: `Subió ${delta} ${delta === 1 ? 'punto' : 'puntos'} desde el inicio — a seguir de cerca` }
      : { arrow: '→', color: '#64748B', text: 'Sin cambios desde la primera evaluación' }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-[#0F172A]">
          {scale.name} <span className="font-normal text-[#64748B]">· {scale.topic}</span>
        </p>
        <button
          onClick={onNew}
          className="text-xs bg-[#2563EB] text-white px-3 py-1.5 rounded-lg font-medium hover:bg-[#1D4ED8] transition-colors cursor-pointer shrink-0"
        >
          + Nueva evaluación
        </button>
      </div>

      {latest ? (
        <>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-[#0F172A]">{latest.score}</span>
              <span className="text-sm text-[#64748B]">/ {scale.max}</span>
            </div>
            <span className={'text-xs font-medium px-2.5 py-1 rounded-full ' + latestSev!.pill}>{latestSev!.label}</span>
            <span className="text-xs text-[#94A3B8] ml-auto">{formatDate(latest.assessed_at)}</span>
          </div>

          {asc.length >= 2 && (
            <div className="flex items-center gap-2 mb-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2.5">
              <span className="text-lg font-bold leading-none" style={{ color: progreso.color }}>{progreso.arrow}</span>
              <p className="text-xs text-[#475569] flex-1">{progreso.text}</p>
              <span className="text-xs font-semibold text-[#94A3B8] shrink-0">{first.score} → {latest.score}</span>
            </div>
          )}

          {chart.length > 1 && (
            <div className="mb-4">
              <p className="text-xs text-[#64748B] font-medium mb-3">Evolución del puntaje</p>
              <div className="flex items-end gap-2 h-24">
                {chart.map((a, i) => {
                  const sev = scale.severity(a.score)
                  return (
                    <div key={a.id ?? i} className="flex-1 flex flex-col items-center gap-1">
                      <p className="text-xs font-semibold" style={{ color: sev.bar }}>{a.score}</p>
                      <div
                        className="w-full rounded-t-lg transition-all"
                        style={{ height: `${(a.score / scale.max) * 64}px`, minHeight: '4px', backgroundColor: sev.bar }}
                      />
                      <p className="text-xs text-[#94A3B8] text-center leading-tight">{formatShort(a.assessed_at)}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            {[...asc].reverse().map((a, i) => {
              const sev = scale.severity(a.score)
              return (
                <div key={a.id ?? i} className="py-2 flex items-center gap-3 text-sm border-b border-[#E2E8F0] last:border-b-0">
                  <span className="text-[#64748B] w-24 shrink-0">{formatDate(a.assessed_at)}</span>
                  <span className="font-semibold text-[#0F172A]">
                    {a.score}<span className="text-[#94A3B8] font-normal">/{scale.max}</span>
                  </span>
                  {a.source === 'patient' && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#4338CA]">paciente</span>
                  )}
                  <span className={'text-xs font-medium px-2 py-0.5 rounded-full ml-auto ' + sev.pill}>{sev.label}</span>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <p className="text-sm text-[#64748B]">Sin evaluaciones registradas.</p>
      )}
    </div>
  )
}

function AssessmentModal({
  scale, patientId, onClose, onSaved,
}: {
  scale: ScaleDef
  patientId: string
  onClose: () => void
  onSaved: () => void
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(scale.questions.length).fill(null))
  const [date, setDate] = useState(todayLocal())
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const answered = answers.every(a => a !== null)
  const score = answers.reduce<number>((sum, a) => sum + (a ?? 0), 0)
  const sev = scale.severity(score)

  async function handleSave() {
    if (!answered || saving) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }
    const { error } = await supabase.from('scale_assessments').insert({
      patient_id: patientId,
      professional_id: user.id,
      scale: scale.id,
      answers,
      score,
      severity: sev.key,
      assessed_at: date,
    })
    setSaving(false)
    if (error) { alert('No se pudo guardar: ' + error.message); return }
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white px-6 pt-6 pb-3 border-b border-[#E2E8F0] flex items-start justify-between gap-3 z-10">
          <div>
            <p className="text-base font-bold text-[#0F172A]">{scale.name} · {scale.topic}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{scale.intro}</p>
          </div>
          <button onClick={onClose} className="text-[#64748B] text-xl leading-none px-1 cursor-pointer shrink-0">✕</button>
        </div>

        <div className="px-6 py-4 flex flex-col gap-5">
          {scale.questions.map((q, qi) => (
            <div key={qi}>
              <p className="text-sm text-[#0F172A] mb-2">
                <span className="text-[#94A3B8] font-medium">{qi + 1}.</span> {q}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {OPTIONS.map(opt => {
                  const active = answers[qi] === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAnswers(prev => prev.map((a, i) => (i === qi ? opt.value : a)))}
                      className={
                        'text-left text-xs rounded-xl px-3 py-2 border transition-colors cursor-pointer ' +
                        (active
                          ? 'bg-[#2563EB] text-white border-[#2563EB]'
                          : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#E2E8F0]')
                      }
                    >
                      <span className={'font-bold mr-1 ' + (active ? 'text-white' : 'text-[#94A3B8]')}>{opt.value}</span>
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#64748B] font-medium uppercase tracking-widest">Fecha de la evaluación</label>
            <input
              type="date"
              value={date}
              max={todayLocal()}
              onChange={e => setDate(e.target.value)}
              className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] bg-[#F8FAFC]"
            />
          </div>
        </div>

        <div
          className="sticky bottom-0 bg-white px-6 py-4 border-t border-[#E2E8F0] mt-auto"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#64748B]">Puntaje</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#0F172A]">
                {score}<span className="text-sm text-[#94A3B8] font-normal">/{scale.max}</span>
              </span>
              {answered && <span className={'text-xs font-medium px-2.5 py-1 rounded-full ' + sev.pill}>{sev.label}</span>}
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={!answered || saving}
            className="w-full bg-[#2563EB] text-white rounded-xl py-3 font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Guardando...' : answered ? 'Guardar evaluación' : `Responder las ${scale.questions.length} preguntas`}
          </button>
        </div>
      </div>
    </div>
  )
}
