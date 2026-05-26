import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Jolmes CRM
        </h1>
        <p className="text-gray-500 mb-8">Kundenverwaltung</p>
        <Link 
          href="/customers"
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700"
        >
          Zur Kundenliste →
        </Link>
      </div>
    </main>
  )
}