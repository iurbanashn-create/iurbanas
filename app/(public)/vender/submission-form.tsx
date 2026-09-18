"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { submitProperty } from "@/lib/actions/submit-property"

const CITIES_HN = [
  "Tegucigalpa", "San Pedro Sula", "La Ceiba", "Choloma", "El Progreso",
  "Comayagua", "Juticalpa", "Santa Rosa de Copán", "Choluteca", "Puerto Cortés",
]

export function SubmissionForm() {
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await submitProperty(formData)
        setSubmitted(true)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al enviar")
      }
    })
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          ✓
        </div>
        <h2 className="text-xl font-semibold mb-2">¡Solicitud recibida!</h2>
        <p className="text-muted-foreground">
          Te contactaremos pronto para revisar tu propiedad y publicarla.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border-b border-border pb-4 mb-2">
        <p className="text-sm font-semibold">Tus datos de contacto</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Nombre completo *</label>
          <input
            name="contact_name"
            required
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Tu nombre"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Teléfono / WhatsApp *</label>
          <input
            name="contact_phone"
            required
            type="tel"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="+504 9999-9999"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Correo electrónico</label>
        <input
          name="contact_email"
          type="email"
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="tu@correo.com"
        />
      </div>

      <div className="border-b border-border pb-4 mt-6">
        <p className="text-sm font-semibold">Datos de la propiedad</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Tipo *</label>
          <select
            name="property_type"
            required
            defaultValue="casa"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="local_comercial">Local comercial</option>
            <option value="oficina">Oficina</option>
            <option value="terreno">Terreno</option>
            <option value="bodega">Bodega</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Operación *</label>
          <select
            name="operation"
            required
            defaultValue="venta"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-1.5">
          <label className="text-sm font-medium">Precio aproximado</label>
          <input
            name="price"
            type="number"
            min={0}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="0"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Moneda</label>
          <select
            name="currency"
            defaultValue="HNL"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="HNL">Lps</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Ciudad *</label>
          <select
            name="city"
            required
            defaultValue=""
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="" disabled>Selecciona</option>
            {CITIES_HN.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Sector / Colonia</label>
          <input
            name="sector"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Residencial Los Pinos"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Habitaciones</label>
          <input name="bedrooms" type="number" min={0} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Baños</label>
          <input name="bathrooms" type="number" min={0} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Área (m²)</label>
          <input name="area_m2" type="number" min={0} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Descripción / notas adicionales</label>
        <textarea
          name="description"
          rows={4}
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
          placeholder="Cuéntanos más sobre la propiedad..."
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Enviando..." : "Enviar solicitud"}
      </button>

      <p className="text-xs text-center text-muted-foreground">
        Tu información es confidencial y solo será usada para gestionar tu propiedad.
      </p>
    </form>
  )
}
