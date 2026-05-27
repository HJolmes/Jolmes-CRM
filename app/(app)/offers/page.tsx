import { prisma } from '@/lib/db'
import Link from 'next/link'
import ScrollToTop from '@/app/components/ScrollToTop'
import { auth } from '@/auth'

export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sparte?: string }>
}) {
  const { q, sparte } = await searchParams
  const session = await auth()
  const userRole = (session?.user as any)?.role
  const userSparte = (session?.user as any)?.sparte

  // Mitarbeiter sehen nur ihre Sparte
  const sparteFilter = userRole === 'ADMIN'
    ? (sparte || undefined)
    : (userSparte || undefined)

  const offers = await prisma.offer.findMany({
    where: {
      AND: [
        q ? {
          OR: [
            { customer: { name: { contains: q, mode: 'insensitive' } } },
            { angebotsNummer: { contains: q, mode: 'insensitive' } },
          ]
        } : {},
        sparteFilter ? { sparte: sparteFilter as any } : {},
      ]
    },
    include: { customer: true, building: true },
    orderBy: { createdAt: 'desc' },
  })

  const sparten = [
    { value: '', label: 'Alle' },
    { value: 'GEBAEUDEREINIGUNG', label: 'Unterhaltsreinigung' },
    { value: 'GLAS_SONDER_GARTEN', label: 'Glas/Sonder/Garten' },
    { value: 'HANDWERK', label: 'Handwerk' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Angebote ({offers.length})
          </h1>
          <Link
            href="/offers/new"
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
          >
            + Neues Angebot
          </Link>
        </div>

        {/* Filter nur für ADMIN */}
        {userRole === 'ADMIN' && (
          <form className="mb-6 flex gap-3">
            <input
              name="q"
              defaultValue={q}
              placeholder="Suche nach Kunde, Angebot..."
              className="flex-1 border rounded-lg px-4 py-2 bg-white shadow-sm"
            />
            <select
              name="sparte"
              defaultValue={sparte}
              className="border rounded-lg px-4 py-2 bg-white shadow-sm"
            >
              {sparten.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">
              Suchen
            </button>
          </form>
        )}

        {/* Suche für Mitarbeiter ohne Sparten-Filter */}
        {userRole !== 'ADMIN' && (
          <form className="mb-6">
            <input
              name="q"
              defaultValue={q}
              placeholder="Suche nach Kunde, Angebot..."
              className="w-full border rounded-lg px-4 py-2 bg-white shadow-sm"
            />
          </form>
        )}

        {offers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {q ? `Keine Angebote gefunden für "${q}"` : 'Noch keine Angebote vorhanden.'}
          </div>
        ) : (
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Kunde</th>
                <th className="text-left p-4">Sparte</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Summe</th>
                <th className="text-left p-4">Datum</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((o) => (
                <tr key={o.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <Link href={`/customers/${o.customerId}`} className="text-teal-600 hover:underline text-sm font-medium">
                      {o.customer.name}
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {o.sparte}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      o.status === 'BEAUFTRAGT'
                        ? 'bg-green-100 text-green-800'
                        : o.status === 'ABGELEHNT'
                        ? 'bg-red-100 text-red-800'
                        : o.status === 'ENTSCHEIDUNG_OFFEN'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {o.auftragsSumme
                      ? `${o.auftragsSumme.toLocaleString('de-DE')} €`
                      : o.angebotsSumme
                      ? `${o.angebotsSumme.toLocaleString('de-DE')} €`
                      : '–'}
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {o.angebotsDatum
                      ? new Date(o.angebotsDatum).toLocaleDateString('de-DE')
                      : '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ScrollToTop />
    </div>
  )
}