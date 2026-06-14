'use client'
import { useState } from 'react'
import { summaryFields } from '@/lib/noteFormat'

type Props = {
  summary: any
  transcription: any
  report: any
  sessionId: string
}

export default function SesionTabs({ summary, transcription, report, sessionId }: Props) {
  const [tab, setTab] = useState<'resumen' | 'transcripcion'>('resumen')

  const tabs = [
    { key: 'resumen', label: 'Resumen' },
    { key: 'transcripcion', label: 'Conversación' },
  ] as const

  const dialogue: { speaker: 'profesional' | 'paciente'; text: string }[] =
    Array.isArray(transcription?.dialogue) ? transcription.dialogue : []

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 bg-[#FAFAFA] border border-[#EDEDED] rounded-2xl p-1 mb-4">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-colors cursor-pointer ${
              tab === t.key
                ? 'bg-[#0A0A0A] text-white shadow-sm'
                : 'text-[#737373] hover:text-[#0A0A0A]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Resumen */}
      {tab === 'resumen' && (
        <div className="flex flex-col gap-4">
          {summary && (
            <div className="bg-white rounded-3xl border border-[#EDEDED] p-6">
              <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">Resumen clínico</h2>
              <div className="flex flex-col gap-3">
                {summaryFields(summary.format).map(({ key, label }) => (
                  <div key={key} className="bg-[#F8FAFC] rounded-r-xl border-l-2 border-[#0A0A0A] dark:border-white p-4">
                    <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1.5">{label}</p>
                    <p className="text-sm text-[#0F172A] leading-relaxed">{summary[key]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report && (
            <div className="bg-white rounded-3xl border border-[#EDEDED] p-6">
              <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">Resumen médico</h2>
              <div className="flex flex-col gap-3">
                {report.diagnosis && (
                  <div className="bg-[#FAFAFA] rounded-r-xl border-l-2 border-[#0A0A0A] dark:border-white p-4">
                    <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1.5">Diagnóstico</p>
                    <p className="text-sm text-[#0F172A] leading-relaxed">{report.diagnosis}</p>
                  </div>
                )}
                {report.medications && report.medications.length > 0 && (
                  <div className="bg-[#FAFAFA] rounded-r-xl border-l-2 border-[#0A0A0A] dark:border-white p-4">
                    <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-2">Medicamentos</p>
                    <div className="flex flex-col gap-2">
                      {report.medications.map((m: any, i: number) => (
                        <div key={i} className="bg-white rounded-xl p-3">
                          <p className="text-sm font-semibold text-[#0F172A]">{m.name}</p>
                          <p className="text-xs text-[#64748B] mt-0.5">
                            {m.dose && `${m.dose}`}{m.frequency && ` · ${m.frequency}`}
                          </p>
                          {m.notes && <p className="text-xs text-[#64748B] mt-0.5">{m.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {report.instructions && (
                  <div className="bg-[#FAFAFA] rounded-r-xl border-l-2 border-[#0A0A0A] dark:border-white p-4">
                    <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1.5">Indicaciones</p>
                    <p className="text-sm text-[#0F172A] leading-relaxed">{report.instructions}</p>
                  </div>
                )}
                <div className="flex justify-end">
                  <a href={`/api/reporte-paciente?reportId=${report.id}`} target="_blank"
                    className="text-xs text-[#2563EB] hover:underline font-medium">
                    Ver PDF →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Transcripción */}
      {tab === 'transcripcion' && (
        <div className="bg-white rounded-3xl border border-[#EDEDED] p-6">
          <h2 className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">Conversación</h2>
          {dialogue.length > 0 ? (
            <>
              <div className="flex flex-col gap-3">
                {dialogue.map((t, i) => {
                  const paciente = t.speaker === 'paciente'
                  return (
                    <div key={i} className={paciente ? 'pl-6' : 'pr-6'}>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-[#A3A3A3] mb-1">
                        {paciente ? 'Paciente' : 'Profesional'}
                      </p>
                      <div className={'rounded-2xl px-4 py-2.5 text-sm leading-snug ' + (paciente ? 'bg-[#F5F5F5] text-[#0A0A0A]' : 'bg-[#0A0A0A] text-white')}>
                        {t.text}
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-[#94A3B8] mt-4">Conversación reconstruida automáticamente con IA · revisá antes de usar.</p>
            </>
          ) : transcription ? (
            <>
              <p className="text-sm text-[#475569] leading-relaxed border-l-2 border-[#0A0A0A] pl-4 whitespace-pre-line">
                {transcription.content}
              </p>
              <p className="text-xs text-[#94A3B8] mt-4">Transcripción automática de la sesión · revisá antes de usar.</p>
            </>
          ) : (
            <p className="text-sm text-[#64748B]">No hay transcripción disponible.</p>
          )}
        </div>
      )}
    </div>
  )
}