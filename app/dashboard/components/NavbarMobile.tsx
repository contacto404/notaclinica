'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconHome, IconCalendar, IconSearch, IconPlus, IconWallet, IconChart, IconUser } from './Icons'

export default function NavbarMobile() {
  const pathname = usePathname()

  const items = [
    { href: '/dashboard', label: 'Inicio', Icon: IconHome },
    { href: '/dashboard/agenda', label: 'Agenda', Icon: IconCalendar },
    { href: '/dashboard/buscar', label: 'Buscar', Icon: IconSearch },
    { href: '/dashboard/pacientes/nuevo', label: 'Nuevo', Icon: IconPlus, primary: true },
    { href: '/dashboard/honorarios', label: 'Honorarios', Icon: IconWallet },
    { href: '/dashboard/estadisticas', label: 'Estadísticas', Icon: IconChart },
    { href: '/dashboard/cuenta', label: 'Cuenta', Icon: IconUser },
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
        const Icon = item.Icon
        return (
          <Link key={item.href} href={item.href}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors relative min-w-0"
          >
            {item.primary ? (
              <span className={`w-7 h-7 flex items-center justify-center rounded-full ${active ? 'bg-[#0A0A0A] text-white' : 'bg-[#F5F5F7] text-[#0A0A0A]'}`}>
                <Icon className="w-4 h-4" />
              </span>
            ) : (
              <Icon className={`w-[22px] h-[22px] ${active ? 'text-[#0A0A0A]' : 'text-[#A3A3A3]'}`} />
            )}
            <span className={`text-[9px] font-medium truncate max-w-full px-0.5 ${active ? 'text-[#0A0A0A]' : 'text-[#A3A3A3]'}`}>
              {item.label}
            </span>
            {active && <span className="absolute bottom-0 w-8 h-0.5 bg-[#0A0A0A] rounded-full" />}
          </Link>
        )
      })}
    </nav>
  )
}