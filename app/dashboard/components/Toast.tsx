'use client'
import { useEffect, useState } from 'react'

export default function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] bg-[#0F172A] text-white text-sm px-5 py-3 rounded-2xl shadow-lg animate-fade-in">
      ✓ {message}
    </div>
  )
}