'use client'
import { useRouter } from 'next/navigation'

export default function BienvenidaPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-5">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-[#0F172A] mb-3">¡Bienvenido a NotaClínica!</h1>
        <p className="text-[#64748B] mb-2">Tu cuenta está lista.</p>
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-6 mb-8 mt-6">
          <p className="text-[#1D4ED8] font-semibold text-lg mb-1">14 días gratis</p>
          <p className="text-[#3B82F6] text-sm">Sin tarjeta de crédito · Luego $49/mes · Cancelá cuando quieras</p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-[#2563EB] text-white rounded-xl py-4 font-semibold text-base hover:bg-[#1D4ED8] transition-colors cursor-pointer"
        >
          Ir al dashboard →
        </button>
      </div>
    </div>
  )
}