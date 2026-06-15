// Criterio único de "sesión documentada/completada".
// Históricamente convivieron dos estados ('summarized' y 'complete'),
// lo que generaba conteos distintos entre vistas. Centralizamos acá.
export const DONE_STATUSES = ['summarized', 'complete', 'signed'] as const

export function isSessionDone(s: { status?: string | null }): boolean {
  return !!s.status && (DONE_STATUSES as readonly string[]).includes(s.status)
}

// Capitaliza solo la primera letra (normaliza diagnósticos/objetivos al guardar).
export function capitalizar(texto: string): string {
  const t = texto.trim().replace(/\s+/g, ' ')
  if (!t) return ''
  return t.charAt(0).toUpperCase() + t.slice(1)
}

// Normaliza para comparar duplicados (sin tildes, minúscula, sin espacios extra).
export function normalizarComparacion(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
}
