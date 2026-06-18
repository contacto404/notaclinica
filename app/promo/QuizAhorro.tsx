'use client'
import { useState } from 'react'
import Link from 'next/link'

const OPC = {
  pac: [6, 10, 15, 20],
  min: [3, 5, 8, 12],
  dias: [3, 4, 5, 6],
}

function Fila({ label, opciones, valor, set, unidad }: { label: string; opciones: number[]; valor: number; set: (n: number) => void; unidad: string }) {
  return (
    <div className="mb-6">
      <p className="text-sm text-[#C8C8C8] mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {opciones.map(o => (
          <button
            key={o}
            onClick={() => set(o)}
            className={'rounded-full px-4 py-2 text-sm font-medium border transition-colors ' +
              (valor === o
                ? 'bg-white text-[#0A0A0A] border-white'
                : 'bg-transparent text-white border-white/25 hover:border-white/60')}
          >
            {o}{o === opciones[opciones.length - 1] ? '+' : ''} {unidad}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function QuizAhorro() {
  const [pac, setPac] = useState(12)
  const [min, setMin] = useState(6)
  const [dias, setDias] = useState(5)

  const minSemana = pac * min * dias
  const horas = Math.round((minSemana / 60) * 10) / 10

  return (
    <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
      <div>
        <Fila label="¿Cuántos pacientes atendés por día?" opciones={OPC.pac} valor={pac} set={setPac} unidad="" />
        <Fila label="¿Cuántos minutos te lleva documentar cada consulta?" opciones={OPC.min} valor={min} set={setMin} unidad="min" />
        <Fila label="¿Cuántos días por semana atendés?" opciones={OPC.dias} valor={dias} set={setDias} unidad="días" />
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9A9A9A] mb-4">Hoy dedicás aproximadamente</p>
        <p className="text-6xl md:text-7xl font-semibold tracking-[-0.03em] text-white tabular-nums">{horas} <span className="text-2xl font-normal text-[#9A9A9A]">h / semana</span></p>
        <p className="text-[15px] text-[#C8C8C8] leading-relaxed mt-5 max-w-xs mx-auto">
          a escribir notas. NotaClínica arma la nota por vos para que recuperes buena parte de ese tiempo.
        </p>
        <Link href="/login?tab=registro"
          className="inline-flex items-center justify-center gap-1.5 bg-white text-[#0A0A0A] px-7 py-3.5 rounded-full font-semibold mt-7 hover:bg-[#EDEDED] transition-colors">
          Empezar 30 días gratis <span className="text-lg leading-none">›</span>
        </Link>
        <p className="text-[11px] text-[#737373] mt-4">Estimación según los datos que ingresás.</p>
      </div>
    </div>
  )
}
