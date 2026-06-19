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
export function IconPhone({ className }: P) {
  return <svg className={className} {...base}><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M10 18.5h4" /></svg>
}
export function IconBuilding({ className }: P) {
  return <svg className={className} {...base}><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" /></svg>
}
export function IconVideo({ className }: P) {
  return <svg className={className} {...base}><rect x="3" y="6" width="13" height="12" rx="2.5" /><path d="M16 10l5-3v10l-5-3z" /></svg>
}
export function IconFileText({ className }: P) {
  return <svg className={className} {...base}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M8.5 13h7M8.5 16.5h7" /></svg>
}
export function IconClipboard({ className }: P) {
  return <svg className={className} {...base}><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" /><path d="M9 11h6M9 15h4" /></svg>
}
export function IconPill({ className }: P) {
  return <svg className={className} {...base}><rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(45 12 12)" /><path d="M8.5 8.5l7 7" /></svg>
}
export function IconActivity({ className }: P) {
  return <svg className={className} {...base}><path d="M3 12h4l2.5 7 5-14 2.5 7H21" /></svg>
}
export function IconDownload({ className }: P) {
  return <svg className={className} {...base}><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" /></svg>
}
export function IconCheck({ className }: P) {
  return <svg className={className} {...base}><path d="M5 12.5l4.5 4.5L19 7" /></svg>
}
export function IconAlert({ className }: P) {
  return <svg className={className} {...base}><path d="M12 3.5L22 20H2L12 3.5z" /><path d="M12 10v4M12 17v.01" /></svg>
}
export function IconEdit({ className }: P) {
  return <svg className={className} {...base}><path d="M4 20h4L19 9l-4-4L4 16v4z" /><path d="M14 6l4 4" /></svg>
}
export function IconTrash({ className }: P) {
  return <svg className={className} {...base}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /></svg>
}
export function IconSparkles({ className }: P) {
  return <svg className={className} {...base}><path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" /><path d="M18.5 15l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" /></svg>
}
export function IconReceipt({ className }: P) {
  return <svg className={className} {...base}><path d="M6 3h12v18l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3L6 21V3z" /><path d="M9 8h6M9 12h6" /></svg>
}
export function IconSend({ className }: P) {
  return <svg className={className} {...base}><path d="M21 4L3 11l6 2.5L21 4zM9 13.5V20l3.5-4.2" /></svg>
}
export function IconShield({ className }: P) {
  return <svg className={className} {...base}><path d="M12 3l8 3v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3z" /><path d="M9 12l2 2 4-4" /></svg>
}
export function IconClock({ className }: P) {
  return <svg className={className} {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
}
export function IconTarget({ className }: P) {
  return <svg className={className} {...base}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /></svg>
}
export function IconRefresh({ className }: P) {
  return <svg className={className} {...base}><path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4" /><path d="M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4" /></svg>
}
export function IconUsers({ className }: P) {
  return <svg className={className} {...base}><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19c0-3 2.5-4.6 5.5-4.6s5.5 1.6 5.5 4.6" /><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17 14.6c2.3.4 4 1.8 4 4.4" /></svg>
}
