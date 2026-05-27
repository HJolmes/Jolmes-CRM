'use client'

export default function ScrollToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 bg-teal-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-teal-700 text-xl flex items-center justify-center"
    >
      ↑
    </button>
  )
}