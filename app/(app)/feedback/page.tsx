'use client'

import { useEffect, useState } from 'react'

type FeedbackStatus = 'OFFEN' | 'IN_ARBEIT' | 'ERLEDIGT' | 'VERWORFEN'

interface FeedbackItem {
  id: string
  type: string
  text: string
  status: FeedbackStatus
  createdAt: string
}

const TYPE_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  bug:       { label: 'Bug',      emoji: '🐛', color: 'bg-red-100 text-red-700 border-red-200' },
  wunsch:    { label: 'Wunsch',   emoji: '💡', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  sonstiges: { label: 'Sonstiges',emoji: '💬', color: 'bg-blue-100 text-blue-700 border-blue-200' },
}

const STATUS_CONFIG: Record<FeedbackStatus, { label: string; color: string; dot: string }> = {
  OFFEN:     { label: 'Offen',      color: 'bg-slate-100 text-slate-600',   dot: 'bg-slate-400' },
  IN_ARBEIT: { label: 'In Arbeit',  color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500' },
  ERLEDIGT:  { label: 'Erledigt',   color: 'bg-green-100 text-green-700',   dot: 'bg-green-500' },
  VERWORFEN: { label: 'Verworfen',  color: 'bg-red-100 text-red-600',       dot: 'bg-red-400' },
}

const TABS: { key: FeedbackStatus | 'ALLE'; label: string }[] = [
  { key: 'ALLE',      label: 'Alle' },
  { key: 'OFFEN',     label: 'Offen' },
  { key: 'IN_ARBEIT', label: 'In Arbeit' },
  { key: 'ERLEDIGT',  label: 'Erledigt' },
  { key: 'VERWORFEN', label: 'Verworfen' },
]

export default function FeedbackPage() {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<FeedbackStatus | 'ALLE'>('ALLE')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/feedback')
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false) })
  }, [])

  async function updateStatus(id: string, status: FeedbackStatus) {
    setUpdating(id)
    await fetch(`/api/feedback/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    setUpdating(null)
  }

  async function deleteItem(id: string) {
  if (!confirm('Feedback wirklich löschen?')) return
  await fetch(`/api/feedback/${id}`, { method: 'DELETE' })
  setItems(prev => prev.filter(i => i.id !== id))
}

  const filtered = activeTab === 'ALLE' ? items : items.filter(i => i.status === activeTab)
  const counts = TABS.reduce((acc, t) => {
    acc[t.key] = t.key === 'ALLE' ? items.length : items.filter(i => i.status === t.key).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
        <p className="text-gray-500 mt-1">Wünsche und Bug-Meldungen aus dem Team.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key ? 'bg-teal-100 text-teal-700' : 'bg-gray-200 text-gray-500'
            }`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Lädt...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
          Keine Einträge in dieser Auswahl.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => {
            const typeInfo = TYPE_LABELS[item.type] ?? { label: item.type, emoji: '📝', color: 'bg-gray-100 text-gray-600 border-gray-200' }
            const statusInfo = STATUS_CONFIG[item.status]
            return (
              <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${typeInfo.color}`}>
                        {typeInfo.emoji} {typeInfo.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString('de-DE', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">{item.text}</p>
                  </div>

                 {/* Status Dropdown + Löschen */}
<div className="shrink-0 flex items-center gap-2">
  <select
    value={item.status}
    disabled={updating === item.id}
    onChange={e => updateStatus(item.id, e.target.value as FeedbackStatus)}
    className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer appearance-none text-center ${statusInfo.color} disabled:opacity-50`}
  >
    {Object.entries(STATUS_CONFIG).map(([key, val]) => (
      <option key={key} value={key}>{val.label}</option>
    ))}
  </select>
  <button
    onClick={() => deleteItem(item.id)}
    className="text-gray-300 hover:text-red-500 transition-colors text-xl leading-none"
    title="Löschen"
  >
    ×
  </button>
</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}