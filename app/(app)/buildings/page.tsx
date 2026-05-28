import { prisma } from '@/lib/db'
import Link from 'next/link'


export default async function BuildingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  const buildings = await prisma.building.findMany({
    where: q ? {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { ort: { contains: q, mode: 'insensitive' } },
        { customer: { name: { contains: q, mode: 'insensitive' } } },
      ]
    } : undefined,
    include: { customer: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Objektliste ({buildings.length})
          </h1>
        
        </div>

        <form className="mb-6">
          <input
            name="q"
            defaultValue={q}
            placeholder="Suche nach Objekt, Ort, Kunde..."
            className="w-full border rounded-lg px-4 py-2 bg-white shadow-sm"
          />
        </form>

        {buildings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {q ? `Keine Objekte gefunden für "${q}"` : 'Noch keine Objekte vorhanden.'}
          </div>
        ) : (
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Objekt</th>
                <th className="text-left p-4">Kunde</th>
                <th className="text-left p-4">Ort</th>
                <th className="text-left p-4">Bereich</th>
              </tr>
            </thead>
            <tbody>
              {buildings.map((b) => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{b.name}</div>
                    {b.objektNummer && <div className="text-xs text-gray-400">Obj. {b.objektNummer}</div>}
                  </td>
                  <td className="p-4">
                    <Link href={`/customers/${b.customerId}`} className="text-teal-600 hover:underline text-sm">
                      {b.customer.name}
                    </Link>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">{b.ort ?? '–'}</td>
                  <td className="p-4">
                    {b.bereich && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {b.bereich}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
     
    </div>
  )
}
