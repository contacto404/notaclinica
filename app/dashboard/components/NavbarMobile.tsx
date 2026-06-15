'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavbarMobile() {
  const pathname = usePathname()

  const items = [
    { href: '/dashboard', label: 'Inicio', icon: '🏠' },
    { href: '/dashboard/agenda', label: 'Agenda', icon: '📅' },
    { href: '/dashboard/buscar', label: 'Buscar', icon: '🔍' },
    { href: '/dashboard/pacientes/nuevo', label: 'Nuevo', icon: '+' },
    { href: '/dashboard/honorarios', label: 'Cobros', icon: '💳' },
    { href: '/dashboard/estadisticas', label: 'Stats', icon: '📊' },
    { href: '/dashboard/cuenta', label: 'Cuenta', icon: '⚙️' },
  ]

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#EDEDED] flex justify-around items-center"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
        height: 'calc(max(env(safe-area-inset-bottom), 8px) + 56px)'
      }}
    >
      {items.map(item => {
        const active = pathname === item.href
        return (
          <Link key={item.href} href={item.href}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors relative min-w-0"
          >
            <span className={`text-lg ${item.label === 'Nuevo' ? `w-7 h-7 flex items-center justify-center rounded-full text-base font-bold ${active ? 'bg-[#0A0A0A] text-white' : 'bg-[#F5F5F7] text-[#0A0A0A]'}` : ''}`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-medium ${active ? 'text-[#0A0A0A]' : 'text-[#A3A3A3]'}`}>
              {item.label}
            </span>
            {active && <span className="absolute bottom-0 w-8 h-0.5 bg-[#0A0A0A] rounded-full" />}
          </Link>
        )
      })}
    </nav>
  )
}