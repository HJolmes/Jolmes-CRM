'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'

export default function NewContactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const data = Object.fromEntries(form.entries())

    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, customerId: id }),
    })

    if (res.ok) router.push(`/customers/${id}`)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Neuer Ansprechpartner</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anrede</label>
              <select name="anrede" className="w-full border rounded-lg px-3 py-2">
                <option value="">–</option>
                <option value="HERR">Herr</option>
                <option value="FRAU">Frau</option>
                <option value="DIVERS">Divers</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vorname</label>
              <input name="vorname" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nachname *</label>
              <input name="nachname" required className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input name="telefon" className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rolle/Funktion</label>
              <input name="rolle" className="w-full border rounded-lg px-3 py-2" placeholder="z.B. Bezirksleiter" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Firma</label>
              <input name="firma" className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isHauptansprechpartner" value="true" id="haupt" className="rounded" />
            <label htmlFor="haupt" className="text-sm text-gray-700">Hauptansprechpartner</label>
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