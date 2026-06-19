'use client'
import { useState, useEffect } from 'react'
import { IconUser, IconMic, IconActivity } from './Icons'

const pasos = [
  {
    titulo: '¡Bienvenido a NotaClínica! 👋',
    descripcion: 'Tu asistente de IA para documentar consultas médicas. En menos de 30 segundos tenés el resumen clínico listo.',
    posicion: 'center',
  },
  {
    titulo: 'Agregá tu primer paciente',
    descripcion: 'Tocá "+ Nuevo paciente" para crear el perfil. Podés agregar nombre, diagnóstico y toda la información clínica relevante.',
    posicion: 'top',
  },
  {
    titulo: 'Grabá una sesión',
    descripcion: 'Entrá al perfil del paciente y tocá "Nueva sesión". Grabá el audio de la consulta y la IA genera el resumen automáticamente.',
    posicion: 'center',
  },
]

export default function OnboardingGuide() {
  const [paso, setPaso] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const visto = localStorage.getItem('onboarding_completado')
    if (!visto) setVisible(true)
  }, [])

  function cerrar() {
    localStorage.setItem('onboarding_completado', 'true')
    setVisible(false)
  }

  function siguiente() {
    if (paso < pasos.length - 1) {
      setPaso(paso + 1)
    } else {
      cerrar()
    }
  }

  if (!visible) return null

  const actual = pasos[paso]

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-0">
      {/* Overlay suave: deja ver el dashboard detrás (guía, no bloqueo) */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={cerrar}
      />

      {/* Card */}
      <div className="relative bg-white rounded-2xl p-6 mx-auto sm:mx-6 max-w-sm w-full shadow-2xl mb-[max(env(safe-area-inset-bottom),16px)] sm:mb-0">

        {/* Cerrar */}
        <button
          onClick={cerrar}
          className="absolute top-4 right-4 text-[#A3A3A3] hover:text-[#6E6E73] text-xl leading-none"
        >
          ×
        </button>

        {/* Paso indicator */}
        <div className="flex gap-1.5 mb-6">
          {pasos.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full flex-1 transition-colors ${
                i <= paso ? 'bg-[#0A0A0A]' : 'bg-[#EDEDED]'
              }`}
            />
          ))}
        </div>

        {/* Ícono del paso */}
        <div className="mb-4 flex justify-center text-[#0A0A0A]">
          {paso === 0 ? <IconActivity className="w-10 h-10" /> : paso === 1 ? <IconUser className="w-10 h-10" /> : <IconMic className="w-10 h-10" />}
        </div>

        {/* Contenido */}
        <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">
          {actual.titulo}
        </h2>
        <p className="text-[#6E6E73] text-sm leading-relaxed mb-8">
          {actual.descripcion}
        </p>

        {/* Botones */}
        <div className="flex gap-3">
          {paso > 0 && (
            <button
              onClick={() => setPaso(paso - 1)}
              className="flex-1 border border-[#EDEDED] text-[#6E6E73] py-3 rounded-xl text-sm font-medium hover:bg-[#F5F5F7] transition-colors"
            >
              Anterior
            </button>
          )}
          <button
            onClick={siguiente}
            className="flex-1 bg-[#0A0A0A] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#262626] transition-colors"
          >
            {paso < pasos.length - 1 ? 'Siguiente →' : '¡Empezar!'}
          </button>
        </div>

        {/* Skip */}
        {paso < pasos.length - 1 && (
          <button
            onClick={cerrar}
            className="w-full text-center text-xs text-[#A3A3A3] mt-4 hover:text-[#6E6E73]"
          >
            Saltar guía
          </button>
        )}
      </div>
    </div>
  )
}