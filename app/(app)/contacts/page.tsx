import { prisma } from '@/lib/db'
import Link from 'next/link'


export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  const contacts = await prisma.contactPerson.findMany({
    where: q ? {
      OR: [
        { nachname: { contains: q, mode: 'insensitive' } },
        { vorname: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { customer: { name: { contains: q, mode: 'insensitive' } } },
      ]
    } : undefined,
    include: { customer: true },
    orderBy: { nachname: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Ansprechpartner ({contacts.length})
          </h1>
        </div>

        <form className="mb-6">
          <input
            name="q"
            defaultValue={q}
            placeholder="Suche nach Name, Email, Kunde..."
            className="w-full border rounded-lg px-4 py-2 bg-white shadow-sm"
          />
        </form>

        {contacts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {q ? `Keine Ansprechpartner gefunden für "${q}"` : 'Noch keine Ansprechpartner.'}
          </div>
        ) : (
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Rolle</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Telefon</th>
                <th className="text-left p-4">Kunde</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">
                      {c.anrede === 'HERR' ? 'Herr' : c.anrede === 'FRAU' ? 'Frau' : ''} {c.vorname} {c.nachname}
                    </div>
                    {c.isHauptansprechpartner && (
                      <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">Haupt</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-600 text-sm">{c.rolle ?? '–'}</td>
                  <td className="p-4 text-gray-600 text-sm">{c.email ?? '–'}</td>
                  <td className="p-4 text-gray-600 text-sm">{c.telefon ?? '–'}</td>
                 <td className="p-4">
  {c.customer ? (
    <Link href={`/customers/${c.customerId}`} className="text-teal-600 hover:underline text-sm">
      {c.customer.name}
    </Link>
  ) : (
    <span className="text-gray-400 text-sm">–</span>
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