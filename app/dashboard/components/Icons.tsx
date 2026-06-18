// Íconos vectoriales propios para la navegación (consistentes en todos los
// sistemas y tematizables). Stroke = currentColor.
type P = { className?: string }
const base = {
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
}

export function IconHome({ className }: P) {
  return <svg className={className} {...base}><path d="M3 11l9-7 9 7" /><path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" /></svg>
}
export function IconCalendar({ className }: P) {
  return <svg className={className} {...base}><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9h18M8 3v3M16 3v3" /></svg>
}
export function IconSearch({ className }: P) {
  return <svg className={className} {...base}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
}
export function IconPlus({ className }: P) {
  return <svg className={className} {...base}><path d="M12 5v14M5 12h14" /></svg>
}
export function IconWallet({ className }: P) {
  return <svg className={className} {...base}><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18" /><circle cx="16.5" cy="14" r="1.2" fill="currentColor" stroke="none" /></svg>
}
export function IconChart({ className }: P) {
  return <svg className={className} {...base}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
}
export function IconUser({ className }: P) {
  return <svg className={className} {...base}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" /></svg>
}
export function IconMic({ className }: P) {
  return <svg className={className} {...base}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
}
