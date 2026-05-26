'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'

export default function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customer, setCustomer] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then(r => r.json())
      .then(setCustomer)
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const data = Object.fromEntries(form.entries())

    const res = await fetch(`/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) router.push(`/customers/${id}`)
    setLoading(false)
  }

  if (!customer) return <div className="p-8">Laden...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Kunde bearbeiten</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" required defaultValue={customer.name} className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">KdNr Gebäudereinigung</label>
              <input name="kdNrGebaeudereinigung" defaultValue={customer.kdNrGebaeudereinigung ?? ''} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">KdNr Handwerk</label>
              <input name="kdNrHandwerk" defaultValue={customer.kdNrHandwerk ?? ''} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">KdNr Energie</label>
              <input name="kdNrEnergie" defaultValue={customer.kdNrEnergie ?? ''} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interessentennummer</label>
              <input name="interessentennummer" defaultValue={customer.interessentennummer ?? ''} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branche</label>
              <input name="branche" defaultValue={customer.branche ?? ''} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Straße</label>
              <input name="strasse" defaultValue={customer.strasse ?? ''} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PLZ</label>
              <input name="plz" defaultValue={customer.plz ?? ''} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ort</label>
              <input name="ort" defaultValue={customer.ort ?? ''} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input name="telefon" defaultValue={customer.telefon ?? ''} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" defaultValue={customer.email ?? ''} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fax</label>
              <input name="fax" defaultValue={customer.fax ?? ''} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Web</label>
              <input name="web" defaultValue={customer.web ?? ''} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entscheider</label>
              <input name="entscheider" defaultValue={customer.entscheider ?? ''} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" defaultValue={customer.status ?? ''} className="w-full border rounded-lg px-3 py-2">
              <option value="">–</option>
              <option value="AKTIV">Aktiv</option>
              <option value="INAKTIV">Inaktiv</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50">
              {loading ? 'Speichern...' : 'Speichern'}
            </button>
            <button type="button" onClick={() => router.back()}
              className="border px-6 py-2 rounded-lg hover:bg-gray-50">
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}