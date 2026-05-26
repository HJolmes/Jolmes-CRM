import { prisma } from '@/lib/db'
import Link from 'next/link'
import ScrollToTop from '@/app/components/ScrollToTop'
export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  
  const customers = await prisma.customer.findMany({
    where: q ? {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { ort: { contains: q, mode: 'insensitive' } },
        { kdNrGebaeudereinigung: { contains: q, mode: 'insensitive' } },
        { kdNrHandwerk: { contains: q, mode: 'insensitive' } },
      ]
    } : undefined,
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Kundenliste ({customers.length})
          </h1>
          <Link
            href="/customers/new"
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
          >
            + Neuer Kunde
          </Link>
        </div>

        {/* Suchfeld */}
        <form className="mb-6">
          <input
            name="q"
            defaultValue={q}
            placeholder="Suche nach Name, Ort, Kundennummer..."
            className="w-full border rounded-lg px-4 py-2 bg-white shadow-sm"
          />
        </form>

        {customers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {q ? `Keine Kunden gefunden für "${q}"` : 'Noch keine Kunden vorhanden.'}
          </div>
        ) : (
          <table className="w-full bg-white rounded-lg shadow">
           <thead>
  <tr className="border-b">
    <th className="text-left p-4">Name</th>
    <th className="text-left p-4">KdNr</th>
    <th className="text-left p-4">Ort</th>
    <th className="text-left p-4">Telefon</th>
    <th className="text-left p-4">Aktionen</th>
  </tr>
</thead>
           <tbody>
  {customers.map((c) => (
    <tr key={c.id} className="border-b hover:bg-gray-50">
      <td className="p-4">
        <Link href={`/customers/${c.id}`} className="text-teal-600 hover:underline font-medium">
          {c.name}
        </Link>
      </td>
      <td className="p-4 text-gray-600 text-sm">
        {c.kdNrGebaeudereinigung && <div>GR: {c.kdNrGebaeudereinigung}</div>}
        {c.kdNrHandwerk && <div>HW: {c.kdNrHandwerk}</div>}
        {c.interessentennummer && <div>Int: {c.interessentennummer}</div>}
        {!c.kdNrGebaeudereinigung && !c.kdNrHandwerk && !c.interessentennummer && '–'}
      </td>
      <td className="p-4 text-gray-600">{c.ort ?? '–'}</td>
      <td className="p-4 text-gray-600">{c.telefon ?? '–'}</td>
      <td className="p-4">
  <Link
    href={`/customers/${c.id}/edit`}
    className="text-teal-600 hover:underline text-sm"
  >
    Bearbeiten
  </Link>
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