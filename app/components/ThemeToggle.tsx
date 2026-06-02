'use client'

import { useTheme, type Theme } from './ThemeProvider'

const OPTIONS: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: 'Claro', icon: '☀️' },
  { value: 'dark', label: 'Oscuro', icon: '🌙' },
  { value: 'system', label: 'Sistema', icon: '💻' },
]

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="grid grid-cols-3 gap-2 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
      {OPTIONS.map(opt => {
        const active = theme === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            aria-pressed={active}
            className={
              'flex flex-col items-center justify-center gap-1 rounded-lg py-2.5 text-xs font-medium transition-colors cursor-pointer ' +
              (active
                ? 'bg-[#2563EB] text-white'
                : 'text-[#475569] hover:bg-[#E2E8F0]')
            }
          >
            <span className="text-base leading-none">{opt.icon}</span>
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
