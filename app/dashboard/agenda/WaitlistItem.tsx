'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function WaitlistItem({ item }: { item: any }) {
  const [removing, setRemoving] = useState(false)
  const supabase = createClient()

  async function handleRemove() {
    if (!confirm('Eliminar de la lista de espera?')) return
    setRemoving(true)
    await supabase.from('waitlist').delete().eq('id', item.id)
    window.location.reload()
  }

  const fecha = new Date(item.created_at).toLocaleDateString('es-UY', {
    timeZone: 'America/Montevideo',
    day: '2-digit', month: 'short'
  })

  const waLink = item.phone
    ? `https://wa.me/${item.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${item.full_name}! Te avisamos que tenemos un turno disponible. Contactanos para coordinar.`)}`
    : null

  return (
    <div className="bg-white rounded-2xl border border-[#EDEDED] px-4 py-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-[#FFF7ED] flex items-center justify-center text-sm shrink-0">
        ⏳
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#0A0A0A] truncate">{item.full_name}</p>
        <p className="text-xs text-[#6E6E73] mt-0.5">
          {item.reason && `${item.reason} · `}Desde {fecha}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {waLink && (
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#1DA851] transition-colors">
            💬
          </a>
        )}
        <button
          onClick={handleRemove}
          disabled={removing}
          className="text-[#A3A3A3] hover:text-red-500 transition-colors text-lg leading-none px-1"
        >
          ×
        </button>
      </div>
    </div>
  )
}