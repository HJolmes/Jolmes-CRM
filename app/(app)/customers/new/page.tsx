'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCustomerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const data = Object.fromEntries(form.entries())

    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      router.push('/customers')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Neuer Kunde</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">

          {/* Stammdaten */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Stammdaten</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input name="name" required className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>

          {/* Kundennummern */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Kundennummern</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">KD-Nr. Gebäudereinigung</label>
                <input name="kdNrGebaeudereinigung" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">KD-Nr. Handwerk</label>
                <input name="kdNrHandwerk" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">KD-Nr. Energie</label>
                <input name="kdNrEnergie" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interessentennummer</label>
                <input name="interessentennummer" className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Adresse</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Straße</label>
                <input name="strasse" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PLZ</label>
                  <input name="plz" className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ort</label>
                  <input name="ort" className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Kontakt */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Kontakt</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input name="telefon" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fax</label>
                <input name="fax" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Web</label>
                <input name="web" className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>
          </div>

          {/* Sonstiges */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Sonstiges</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branche</label>
                <input name="branche" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" className="w-full border rounded-lg px-3 py-2">
                  <option value="">– bitte wählen –</option>
                  <option value="AKTIV">Aktiv</option>
                  <option value="INAKTIV">Inaktiv</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entscheider</label>
                <input name="entscheider" className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notizen</label>
              <textarea name="notes" rows={3} className="w-full border rounded-lg px-3 py-2 resize-none" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
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