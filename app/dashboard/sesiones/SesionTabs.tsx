'use client'
import { useState } from 'react'

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
    { key: 'transcripcion', label: 'Transcripción' },
  ] as const

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-[#F0E8E0] rounded-2xl p-1 mb-4">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-colors cursor-pointer ${
              tab === t.key
                ? 'bg-[#E8602C] text-white shadow-sm'
                : 'text-[#A08070] hover:text-[#2D1F14]'
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
            <div className="bg-white rounded-3xl border border-[#F0E8E0] p-6">
              <h2 className="text-xs font-semibold text-[#A08070] uppercase tracking-widest mb-4">Resumen clínico</h2>
              <div className="flex flex-col gap-3">
                {([
                  ['Motivo de consulta', summary.chief_complaint],
                  ['Observaciones', summary.observations],
                  ['Plan de tratamiento', summary.plan],
                  ['Próximos pasos', summary.next_steps]
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="bg-[#FBF7F4] rounded-2xl p-4">
                    <p className="text-xs text-[#A08070] font-medium uppercase tracking-widest mb-1.5">{label}</p>
                    <p className="text-sm text-[#2D1F14] leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report && (
            <div className="bg-white rounded-3xl border border-[#F0E8E0] p-6">
              <h2 className="text-xs font-semibold text-[#A08070] uppercase tracking-widest mb-4">Resumen médico</h2>
              <div className="flex flex-col gap-3">
                {report.diagnosis && (
                  <div className="bg-[#FBF7F4] rounded-2xl p-4">
                    <p className="text-xs text-[#A08070] font-medium uppercase tracking-widest mb-1.5">Diagnóstico</p>
                    <p className="text-sm text-[#2D1F14] leading-relaxed">{report.diagnosis}</p>
                  </div>
                )}
                {report.medications && report.medications.length > 0 && (
                  <div className="bg-[#FBF7F4] rounded-2xl p-4">
                    <p className="text-xs text-[#A08070] font-medium uppercase tracking-widest mb-2">Medicamentos</p>
                    <div className="flex flex-col gap-2">
                      {report.medications.map((m: any, i: number) => (
                        <div key={i} className="bg-white rounded-xl p-3">
                          <p className="text-sm font-semibold text-[#2D1F14]">{m.name}</p>
                          <p className="text-xs text-[#A08070] mt-0.5">
                            {m.dose && `${m.dose}`}{m.frequency && ` · ${m.frequency}`}
                          </p>
                          {m.notes && <p className="text-xs text-[#A08070] mt-0.5">{m.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {report.instructions && (
                  <div className="bg-[#FBF7F4] rounded-2xl p-4">
                    <p className="text-xs text-[#A08070] font-medium uppercase tracking-widest mb-1.5">Indicaciones</p>
                    <p className="text-sm text-[#2D1F14] leading-relaxed">{report.instructions}</p>
                  </div>
                )}
                <div className="flex justify-end">
                  <a href={`/api/reporte-paciente?reportId=${report.id}`} target="_blank"
                    className="text-xs text-[#E8602C] hover:underline font-medium">
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
        <div className="bg-white rounded-3xl border border-[#F0E8E0] p-6">
          <h2 className="text-xs font-semibold text-[#A08070] uppercase tracking-widest mb-4">Transcripción</h2>
          {transcription ? (
            <p className="text-sm text-[#6B4F3A] leading-relaxed border-l-2 border-[#E8602C] pl-4">
              {transcription.content}
            </p>
          ) : (
            <p className="text-sm text-[#A08070]">No hay transcripción disponible.</p>
          )}
        </div>
      )}
    </div>
  )
}