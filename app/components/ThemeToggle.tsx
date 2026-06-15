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
    <div className="grid grid-cols-3 gap-2 p-1 bg-[#F5F5F7] rounded-xl border border-[#EDEDED]">
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
                ? 'bg-[#0A0A0A] text-white'
                : 'text-[#6E6E73] hover:bg-[#EDEDED]')
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
