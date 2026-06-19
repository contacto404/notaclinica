'use client'
import { useState } from 'react'
import { summaryFields } from '@/lib/noteFormat'
import { IconCheck, IconClipboard } from '../../components/Icons'

type Props = {
  patientName: string
  sessionDate: string
  summary: any
}

export default function CopiarNotaButton({ patientName, sessionDate, summary }: Props) {
  const [copiado, setCopiado] = useState(false)

  function construir() {
    const fecha = new Date(sessionDate).toLocaleDateString('es-UY', {
      timeZone: 'America/Montevideo', day: '2-digit', month: 'long', year: 'numeric',
    })
    const lines: string[] = [
      `RESUMEN DE SESIÓN — ${patientName}`,
      `Fecha: ${fecha}`,
      '',
    ]
    summaryFields(summary.format).forEach(({ key, label }) => {
      const val = (summary[key] ?? '').toString().trim()
      if (val) { lines.push(label.toUpperCase()); lines.push(val); lines.push('') }
    })
    lines.push('— Documentado con NotaClínica')
    return lines.join('\n')
  }

  async function copiar() {
    const texto = construir()
    try {
      await navigator.clipboard.writeText(texto)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = texto
      ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.focus(); ta.select()
      try { document.execCommand('copy') } catch {}
      ta.remove()
    }
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <button
      onClick={copiar}
      className="border border-[#EDEDED] text-[#6E6E73] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#F5F5F7] flex items-center gap-2 transition-colors cursor-pointer"
      title="Copiar el resumen para pegarlo en la historia clínica de tu clínica"
    >
      {copiado ? <><IconCheck className="w-4 h-4" /> Copiado</> : <><IconClipboard className="w-4 h-4" /> Copiar nota</>}
    </button>
  )
}
