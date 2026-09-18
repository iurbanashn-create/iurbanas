import Link from 'next/link'

export default function SinAccesoPage() {
  return (
    <div className="min-h-screen bg-[#0E3B2E] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-white text-xl font-semibold mb-2">Acceso pendiente</h1>
        <p className="text-white/60 text-sm mb-6">
          Tu solicitud está siendo revisada. Te notificaremos por correo cuando tu acceso esté activo.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-[#D4AF37] text-[#0E3B2E] text-sm font-semibold rounded-lg hover:bg-[#c49d2a] transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
