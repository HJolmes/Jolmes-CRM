import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Kundenliste</h1>
          <Link
            href="/customers/new"
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
          >
            + Neuer Kunde
          </Link>
        </div>

        {customers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Noch keine Kunden vorhanden.
          </div>
        ) : (
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Ort</th>
                <th className="text-left p-4">Telefon</th>
                <th className="text-left p-4">Status</th>
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
                  <td className="p-4 text-gray-600">{c.ort ?? '–'}</td>
                  <td className="p-4 text-gray-600">{c.telefon ?? '–'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.status === 'BESTANDSKUNDE' 
                        ? 'bg-green-100 text-green-800' 
                        : c.status === 'NEUKUNDE'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {c.status}
                    </span>
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
