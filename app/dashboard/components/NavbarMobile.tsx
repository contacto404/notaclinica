'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavbarMobile() {
  const pathname = usePathname()

  const items = [
    { href: '/dashboard', label: 'Inicio', icon: '🏠' },
    { href: '/dashboard/agenda', label: 'Agenda', icon: '📅' },
    { href: '/dashboard/pacientes/nuevo', label: 'Nuevo', icon: '+' },
    { href: '/dashboard/cuenta', label: 'Cuenta', icon: '⚙️' },
  ]

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E2E8F0] flex justify-around items-center"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
        height: 'calc(max(env(safe-area-inset-bottom), 8px) + 56px)'
      }}
    >
      {items.map(item => {
        const active = pathname === item.href
        return (
          <Link key={item.href} href={item.href}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors"
          >
            <span className={`text-xl ${item.label === 'Nuevo' ? `w-8 h-8 flex items-center justify-center rounded-full text-base font-bold ${active ? 'bg-[#2563EB] text-white' : 'bg-[#EFF6FF] text-[#2563EB]'}` : ''}`}>
              {item.icon}
            </span>
            <span className={`text-xs font-medium ${active ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`}>
              {item.label}
            </span>
            {active && <span className="absolute bottom-0 w-8 h-0.5 bg-[#2563EB] rounded-full" />}
          </Link>
        )
      })}
    </nav>
  )
}