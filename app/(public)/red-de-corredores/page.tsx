"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { registerAgent } from "@/lib/actions/register-agent"

export default function RedDeCorredoresPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await registerAgent(formData)
        setSubmitted(true)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al enviar")
      }
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">

      {/* Hero */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 bg-[#0E3B2E]/10 text-[#0E3B2E] text-xs font-semibold rounded-full uppercase tracking-widest mb-4">
          Red Inmobiliaria IUI
        </span>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Accede al inventario exclusivo<br />
          <span className="text-[#0E3B2E]">de Inversiones Urbanas</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Únete a la red de corredores afiliados. Accede a propiedades verificadas,
          fichas descargables y material para cerrar más negocios.
        </p>
      </div>

      {/* Beneficios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          {
            icon: "🏠",
            title: "Inventario exclusivo",
            desc: "Propiedades verificadas por IUI, con fotos profesionales y documentación lista.",
          },
          {
            icon: "📄",
            title: "Fichas descargables",
            desc: "Descarga fichas completas para compartir con tus clientes por WhatsApp o email.",
          },
          {
            icon: "🤝",
            title: "Sin conflictos",
            desc: "Registra tus prospectos y protege tus clientes activos dentro de la red.",
          },
        ].map((b) => (
          <div key={b.title} className="bg-white border border-border rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">{b.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{b.title}</h3>
            <p className="text-sm text-gray-500">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Formulario */}
      <div className="max-w-xl mx-auto">
        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                ✓
              </div>
              <h2 className="text-xl font-semibold mb-2">¡Solicitud recibida!</h2>
              <p className="text-gray-500 text-sm">
                Revisaremos tu información y te enviaremos acceso a la red en las próximas 24 horas.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Unirse a la red</h2>
              <p className="text-sm text-gray-400 mb-6">Acceso gratuito durante el período de lanzamiento.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500">Nombre completo *</label>
                    <input
                      name="full_name" required
                      className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500">Teléfono / WhatsApp *</label>
                    <input
                      name="phone" required type="tel"
                      className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                      placeholder="+504 9999-9999"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Correo electrónico *</label>
                  <input
                    name="email" required type="email"
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                    placeholder="tu@correo.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500">Inmobiliaria / empresa</label>
                    <input
                      name="business_name"
                      className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                      placeholder="Opcional"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500">Ciudad</label>
                    <select
                      name="city"
                      className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                    >
                      <option value="">Selecciona</option>
                      {["San Pedro Sula", "Tegucigalpa", "La Ceiba", "Choloma", "El Progreso", "Comayagua"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">¿Cómo te enteraste de IUI?</label>
                  <textarea
                    name="message" rows={3}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 resize-none"
                    placeholder="Cuéntanos un poco sobre ti..."
                  />
                </div>

                <button
                  type="submit" disabled={isPending}
                  className="w-full py-3 bg-[#0E3B2E] text-white text-sm font-semibold rounded-xl hover:bg-[#1F5D3A] disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Enviando..." : "Solicitar acceso"}
                </button>

                <p className="text-xs text-center text-gray-400">
                  Te enviaremos un enlace de acceso por correo electrónico.
                </p>
              </form>
            </>
          )}
        </div>

        {/* Already a member */}
        <p className="text-center text-sm text-gray-400 mt-4">
          ¿Ya tienes acceso?{" "}
          <a href="/corredor/dashboard" className="text-[#0E3B2E] font-medium hover:underline">
            Ingresa aquí
          </a>
        </p>
      </div>
    </div>
  )
}
