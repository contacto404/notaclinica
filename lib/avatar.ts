// Color determinístico para el avatar de cada paciente (a partir del nombre).
// Devuelve [fondo, texto]. Colores fijos (no se invierten en modo oscuro) para
// que cada paciente se distinga de un vistazo en listas largas.
const PALETTE: [string, string][] = [
  ['#E8EEF8', '#2D3F6A'], // azul
  ['#E8F4E8', '#2D6A2D'], // verde
  ['#EDE9FE', '#6D28D9'], // violeta
  ['#FFF1E8', '#C2410C'], // naranja
  ['#FCE7F3', '#9D174D'], // rosa
  ['#E0F2FE', '#0369A1'], // celeste
  ['#FEF3C7', '#92400E'], // ámbar
  ['#E2F5F0', '#0F6E56'], // teal
]

export function avatarColor(name?: string | null): [string, string] {
  const s = name ?? ''
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return PALETTE[h % PALETTE.length]
}
