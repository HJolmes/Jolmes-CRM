import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function DashboardPage() {
  const [
    kundenCount,
    objekteCount,
    ansprechpartnerCount,
    angeboteCount,
    beauftragtCount,
    offenCount,
    abgelehntCount,
    urCount,
    gsgCount,
    hwCount,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.building.count(),
    prisma.contactPerson.count(),
    prisma.offer.count(),
    prisma.offer.count({ where: { status: 'BEAUFTRAGT' } }),
    prisma.offer.count({ where: { status: 'OFFEN' } }),
    prisma.offer.count({ where: { status: 'ABGELEHNT' } }),
    prisma.offer.count({ where: { sparte: 'GEBAEUDEREINIGUNG' } }),
    prisma.offer.count({ where: { sparte: 'GLAS_SONDER_GARTEN' } }),
    prisma.offer.count({ where: { sparte: 'HANDWERK' } }),
  ])

  const cards = [
    { label: 'Kunden', value: kundenCount, href: '/customers', color: 'bg-teal-50 text-teal-700', border: 'border-teal-200' },
    { label: 'Objekte', value: objekteCount, href: '/buildings', color: 'bg-blue-50 text-blue-700', border: 'border-blue-200' },
    { label: 'Ansprechpartner', value: ansprechpartnerCount, href: '/contacts', color: 'bg-purple-50 text-purple-700', border: 'border-purple-200' },
    { label: 'Angebote gesamt', value: angeboteCount, href: '/offers', color: 'bg-orange-50 text-orange-700', border: 'border-orange-200' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Übersichtskarten */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {cards.map((card) => (
            <Link key={card.label} href={card.href}
              className={`${card.color} ${card.border} border rounded-lg p-6 hover:opacity-80 transition`}>
              <div className="text-3xl font-bold">{card.value.toLocaleString('de-DE')}</div>
              <div className="text-sm font-medium mt-1">{card.label}</div>
            </Link>
          ))}
        </div>

        {/* Angebote nach Status */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Angebote nach Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Offen</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">{offenCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Beauftragt</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">{beauftragtCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Abgelehnt</span>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">{abgelehntCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Angebote nach Sparte</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unterhaltsreinigung</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{urCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Glas/Sonder/Garten</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{gsgCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Handwerk</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{hwCount}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}