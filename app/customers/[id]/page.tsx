import { prisma } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      contacts: true,
      buildings: true,
    },
  })

  if (!customer) notFound()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/customers" className="text-teal-600 text-sm hover:underline">
              ← Kundenliste
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{customer.name}</h1>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            customer.status === 'BESTANDSKUNDE'
              ? 'bg-green-100 text-green-800'
              : customer.status === 'NEUKUNDE'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {customer.status}
          </span>
        </div>

        {/* Stammdaten */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Stammdaten</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Adresse</div>
              <div className="font-medium">
                {customer.strasse ?? '–'}<br />
                {customer.plz} {customer.ort}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Kontakt</div>
              <div className="font-medium">
                {customer.telefon && <div>📞 {customer.telefon}</div>}
                {customer.email && <div>✉️ {customer.email}</div>}
                {!customer.telefon && !customer.email && '–'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Branche</div>
              <div className="font-medium">{customer.branche ?? '–'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Entscheider</div>
              <div className="font-medium">{customer.entscheider ?? '–'}</div>
            </div>
          </div>
        </div>

        {/* Ansprechpartner */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Ansprechpartner ({customer.contacts.length})</h2>
            <Link
              href={`/customers/${customer.id}/contacts/new`}
              className="bg-teal-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-teal-700"
            >
              + Hinzufügen
            </Link>
          </div>
          {customer.contacts.length === 0 ? (
            <div className="text-gray-400 text-sm">Noch keine Ansprechpartner</div>
          ) : (
            <div className="space-y-3">
              {customer.contacts.map((c) => (
                <div key={c.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {c.anrede === 'HERR' ? 'Herr' : c.anrede === 'FRAU' ? 'Frau' : ''} {c.vorname} {c.nachname}
                    </div>
                    <div className="text-sm text-gray-500">{c.rolle ?? ''}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {c.email && <div>{c.email}</div>}
                    {c.telefon && <div>{c.telefon}</div>}
                  </div>
                  {c.isHauptansprechpartner && (
                    <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">Haupt</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Objekte */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Objekte ({customer.buildings.length})</h2>
            <Link
              href={`/customers/${customer.id}/buildings/new`}
              className="bg-teal-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-teal-700"
            >
              + Hinzufügen
            </Link>
          </div>
          {customer.buildings.length === 0 ? (
            <div className="text-gray-400 text-sm">Noch keine Objekte</div>
          ) : (
            <div className="space-y-2">
              {customer.buildings.map((b) => (
                <div key={b.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{b.name}</div>
                    <div className="text-sm text-gray-500">{b.strasse} {b.ort}</div>
                  </div>
                  {b.bereich && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{b.bereich}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}