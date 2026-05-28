'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const links = [
  { href: '/dashboard',   label: '📊 Dashboard' },
  { href: '/customers',   label: '👤 Kunden' },
  { href: '/buildings',   label: '🏢 Objekte' },
  { href: '/contacts',    label: '🧑‍💼 Ansprechpartner' },
  { href: '/offers',      label: '📋 Angebote' },
  { href: '/feedback',    label: '💬 Feedback' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 h-screen sticky top-0 bg-white border-r flex flex-col pb-16">
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
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          🚪 Abmelden
        </button>
      </div>
    </aside>
  )
}