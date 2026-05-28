import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NotaClínica',
  description: 'IA para médicos que quieren enfocarse en sus pacientes, no en el papeleo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}