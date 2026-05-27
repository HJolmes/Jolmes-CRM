'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'

const links = [
  { href: '/customers', label: '👤 Kunden' },
  { href: '/buildings', label: '🏢 Objekte' },
  { href: '/contacts', label: '🧑‍💼 Ansprechpartner' },
  { href: '/offers', label: '📋 Angebote' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold text-teal-600">Jolmes CRM</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname.startsWith(link.href)
                ? 'bg-teal-50 text-teal-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <LogoutButton />
      </div>
    </aside>
  )
}