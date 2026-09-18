"use client"

import { useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useSearchParams } from "next/navigation"

export default function CorredorAccesoPage() {
  const [email, setEmail]     = useState("")
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const searchParams          = useSearchParams()
  const linkError             = searchParams.get("error")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        shouldCreateUser: false,
      },
    })

    if (error) {
      setError("No encontramos ese correo en la red. Verifica o solicita acceso.")
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0E3B2E] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/logo-iui.jpeg" alt="IUI" width={64} height={64} className="rounded-md object-cover mx-auto mb-3" />
          <h1 className="text-white font-semibold tracking-wide text-lg">INVERSIONES URBANAS</h1>
          <p className="text-[#D4AF37] font-light text-xs tracking-[0.2em] uppercase mt-0.5">Red de Corredores</p>
        </div>

        <div className="w-12 h-[2px] bg-[#D4AF37] mx-auto mb-8" />

        <div className="bg-white rounded-xl p-6 shadow-2xl">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📧</div>
              <h2 className="font-semibold text-gray-900 mb-2">Revisa tu correo</h2>
              <p className="text-sm text-gray-500">
                Enviamos un enlace de acceso a <strong>{email}</strong>. Haz clic en él para ingresar.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xs font-semibold text-[#0E3B2E] mb-5 text-center tracking-[0.15em] uppercase">
                Acceso Corredores
              </h2>

              {linkError && (
                <p className="text-red-600 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                  El enlace expiró o no es válido. Solicita uno nuevo.
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 bg-gray-50"
                    placeholder="tu@correo.com"
                  />
                </div>

                {error && (
                  <p className="text-red-600 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#0E3B2E] text-white text-sm font-semibold rounded-lg hover:bg-[#1F5D3A] disabled:opacity-50 transition-colors"
                >
                  {loading ? "Enviando..." : "Enviar enlace de acceso"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          ¿No tienes acceso?{" "}
          <a href="/red-de-corredores" className="text-[#D4AF37] hover:underline">Únete a la red</a>
        </p>
      </div>
    </div>
  )
}
