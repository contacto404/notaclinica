import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NotaClínica',
  description: 'Transcripción y resumen clínico con IA para profesionales de salud mental',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}