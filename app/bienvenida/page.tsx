'use client'
import { useRouter } from 'next/navigation'

export default function BienvenidaPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-5">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-[#0A0A0A] mb-3">¡Bienvenido a NotaClínica!</h1>
        <p className="text-[#6E6E73] mb-2">Tu cuenta está lista.</p>
        <div className="bg-[#F5F5F7] border border-[#E5E5E5] rounded-2xl p-6 mb-8 mt-6">
          <p className="text-[#262626] font-semibold text-lg mb-1">30 días gratis</p>
          <p className="text-[#0A0A0A] text-sm">Sin tarjeta de crédito · Luego $49/mes · Cancelá cuando quieras</p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-[#0A0A0A] text-white rounded-xl py-4 font-semibold text-base hover:bg-[#262626] transition-colors cursor-pointer"
        >
          Ir al dashboard →
        </button>
      </div>
    </div>
  )
}