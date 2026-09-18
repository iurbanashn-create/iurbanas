"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.error('[login]', error.message, error.status)
      setError("Credenciales incorrectas. Verifica tu email y contraseña.")
      setLoading(false)
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0E3B2E] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-3">
            <Image
              src="/logo-iui.jpeg"
              alt="IUI Inmobiliaria"
              width={64}
              height={64}
              className="rounded-md object-cover"
            />
          </div>
          <h1 className="text-white font-semibold tracking-wide text-lg">INVERSIONES URBANAS</h1>
          <p className="text-[#D4AF37] font-light text-xs tracking-[0.2em] uppercase mt-0.5">Inmobiliaria · Admin</p>
        </div>

        {/* Línea dorada */}
        <div className="w-12 h-[2px] bg-[#D4AF37] mx-auto mb-8" />

        {/* Card */}
        <div className="bg-white rounded-xl p-6 shadow-2xl">
          <h2 className="text-xs font-semibold text-[#0E3B2E] mb-5 text-center tracking-[0.15em] uppercase">
            Acceso Administrativo
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 bg-gray-50"
                placeholder="admin@iurbanas.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 bg-gray-50"
                placeholder="••••••••"
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
              className="w-full py-2.5 bg-[#0E3B2E] text-white text-sm font-semibold rounded-lg hover:bg-[#1F5D3A] disabled:opacity-50 transition-colors mt-1"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © {new Date().getFullYear()} Inversiones Urbanas Inmobiliarias
        </p>
      </div>
    </div>
  )
}
