'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export type Theme = 'light' | 'dark' | 'system'
type Resolved = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  resolved: Resolved
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'theme'
const THEME_COLOR: Record<Resolved, string> = {
  light: '#2563EB',
  dark: '#0F172A',
}

function systemPrefersDark() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
}

function resolve(theme: Theme): Resolved {
  if (theme === 'system') return systemPrefersDark() ? 'dark' : 'light'
  return theme
}

/** Apply the resolved theme to the DOM (data-theme + theme-color meta). */
function applyTheme(resolved: Resolved) {
  const root = document.documentElement
  root.dataset.theme = resolved
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', THEME_COLOR[resolved])
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolved, setResolved] = useState<Resolved>('light')
  const pathname = usePathname()
  // La landing ("/") siempre se muestra en claro; el modo oscuro es solo para la app.
  const forceLight = pathname === '/'

  // Sync React state with what the no-FOUC inline script already applied.
  useEffect(() => {
    let stored: Theme = 'system'
    try {
      stored = (localStorage.getItem(STORAGE_KEY) as Theme) || 'system'
    } catch {}
    const r = resolve(stored)
    setThemeState(stored)
    setResolved(r)
    applyTheme(forceLight ? 'light' : r)
  }, [forceLight])

  // Force light on the landing; restore the user's theme elsewhere (handles
  // client-side navigation between landing and app).
  useEffect(() => {
    applyTheme(forceLight ? 'light' : resolve(theme))
  }, [forceLight, theme])

  // When following the system, react to OS-level changes live.
  useEffect(() => {
    if (theme !== 'system' || forceLight) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const r: Resolved = mq.matches ? 'dark' : 'light'
      setResolved(r)
      applyTheme(r)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
    const r = resolve(next)
    setThemeState(next)
    setResolved(r)
    applyTheme(r)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}
