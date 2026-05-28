'use client'

import { useState } from 'react'

export default function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [type, setType] = useState('bug')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!text.trim()) return
    setLoading(true)
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, type }),
    })
    setSent(true)
    setLoading(false)
    setTimeout(() => {
      setSent(false)
      setText('')
      setOpen(false)
    }, 2000)
  }

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 bg-teal-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-teal-700 flex items-center gap-2 text-sm font-medium z-50"
      >
        💬 Feedback
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Feedback senden</h2>

            {sent ? (
              <div className="text-center py-8 text-green-600 font-medium">
                ✅ Danke für dein Feedback!
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-4">
                  {[
                    { value: 'bug', label: '🐛 Bug' },
                    { value: 'wunsch', label: '💡 Wunsch' },
                    { value: 'sonstiges', label: '💬 Sonstiges' },
                  ].map(t => (
                    <button
                      key={t.value}
                      onClick={() => setType(t.value)}
                      className={`px-3 py-1 rounded-full text-sm border transition ${
                        type === t.value
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Was möchtest du melden?"
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none mb-4"
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !text.trim()}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50"
                  >
                    {loading ? 'Senden...' : 'Senden'}
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Abbrechen
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}