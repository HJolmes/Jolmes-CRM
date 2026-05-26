'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'

export default function NewBuildingPage({
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

    const res = await fetch('/api/buildings', {
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Neues Objekt</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bezeichnung *</label>
            <input name="name" required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objektnummer</label>
              <input name="objektNummer" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
              <select name="kategorie" className="w-full border rounded-lg px-3 py-2">
                <option value="">–</option>
                <option value="a">a</option>
                <option value="b">b</option>
                <option value="c">c</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Straße</label>
              <input name="strasse" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ort</label>
              <input name="ort" className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bereich (Sparte)</label>
              <select name="bereich" className="w-full border rounded-lg px-3 py-2">
                <option value="">–</option>
                <option value="GEBAEUDEREINIGUNG">Gebäudereinigung</option>
                <option value="HANDWERK">Handwerk</option>
                <option value="GLAS_SONDER_GARTEN">Glas/Sonder/Garten</option>
                <option value="ENERGIE_PERSONAL">Energie/Personal</option>
                <option value="ALLGEMEIN">Allgemein</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verantwortlicher</label>
              <input name="verantwortlicher" className="w-full border rounded-lg px-3 py-2" />
            </div>
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