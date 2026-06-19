'use client'
import { useEffect } from 'react'
import { IconCheck } from './Icons'

export default function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-[#0A0A0A] text-white text-sm px-5 py-3 rounded-2xl shadow-lg whitespace-nowrap flex items-center gap-2">
      <IconCheck className="w-4 h-4" /> {message}
    </div>
  )
}