'use client'
import { useState, useEffect } from 'react'

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={cerrar}
      />

      {/* Card */}
      <div className="relative bg-white rounded-2xl p-6 mx-6 max-w-sm w-full shadow-2xl">

        {/* Cerrar */}
        <button
          onClick={cerrar}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#475569] text-xl leading-none"
        >
          ×
        </button>

        {/* Paso indicator */}
        <div className="flex gap-1.5 mb-6">
          {pasos.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full flex-1 transition-colors ${
                i <= paso ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
              }`}
            />
          ))}
        </div>

        {/* Emoji */}
        <div className="text-4xl mb-4">
          {paso === 0 ? '🏥' : paso === 1 ? '👤' : '🎙️'}
        </div>

        {/* Contenido */}
        <h2 className="text-xl font-bold text-[#0F172A] mb-3">
          {actual.titulo}
        </h2>
        <p className="text-[#475569] text-sm leading-relaxed mb-8">
          {actual.descripcion}
        </p>

        {/* Botones */}
        <div className="flex gap-3">
          {paso > 0 && (
            <button
              onClick={() => setPaso(paso - 1)}
              className="flex-1 border border-[#E2E8F0] text-[#475569] py-3 rounded-xl text-sm font-medium hover:bg-[#F8FAFC] transition-colors"
            >
              Anterior
            </button>
          )}
          <button
            onClick={siguiente}
            className="flex-1 bg-[#2563EB] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition-colors"
          >
            {paso < pasos.length - 1 ? 'Siguiente →' : '¡Empezar!'}
          </button>
        </div>

        {/* Skip */}
        {paso < pasos.length - 1 && (
          <button
            onClick={cerrar}
            className="w-full text-center text-xs text-[#94A3B8] mt-4 hover:text-[#64748B]"
          >
            Saltar guía
          </button>
        )}
      </div>
    </div>
  )
}