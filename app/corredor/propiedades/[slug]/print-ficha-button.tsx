"use client"

export function PrintFichaButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
    >
      📄 Descargar ficha
    </button>
  )
}
