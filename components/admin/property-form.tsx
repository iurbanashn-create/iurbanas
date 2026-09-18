"use client"

import { useTransition } from "react"
import { toast } from "sonner"

const CITIES_HN = [
  "Tegucigalpa", "San Pedro Sula", "La Ceiba", "Choloma", "El Progreso",
  "Comayagua", "Juticalpa", "Santa Rosa de Copán", "Choluteca", "Puerto Cortés",
]

interface PropertyData {
  id?: string
  title?: string
  description?: string
  type?: string
  operation?: string
  price?: number
  currency?: string
  city?: string
  sector?: string
  address?: string
  bedrooms?: number | null
  bathrooms?: number | null
  area_m2?: number | null
  parking?: number | null
  status?: string
}

interface Props {
  action: (formData: FormData) => Promise<void>
  defaultValues?: PropertyData
  submitLabel?: string
}

export function PropertyForm({ action, defaultValues = {}, submitLabel = "Guardar" }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await action(formData)
        toast.success("Propiedad guardada")
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al guardar")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Título *</label>
        <input
          name="title"
          required
          defaultValue={defaultValues.title}
          placeholder="Ej: Casa en Residencial Los Pinos, Tegucigalpa"
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Tipo + Operación */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Tipo *</label>
          <select
            name="type"
            required
            defaultValue={defaultValues.type ?? "casa"}
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
            defaultValue={defaultValues.operation ?? "venta"}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>
      </div>

      {/* Precio + Moneda */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-1.5">
          <label className="text-sm font-medium">Precio *</label>
          <input
            name="price"
            type="number"
            required
            min={0}
            step={0.01}
            defaultValue={defaultValues.price}
            placeholder="0"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Moneda</label>
          <select
            name="currency"
            defaultValue={defaultValues.currency ?? "HNL"}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="HNL">Lps (HNL)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
      </div>

      {/* Ciudad + Sector */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Ciudad *</label>
          <select
            name="city"
            required
            defaultValue={defaultValues.city ?? ""}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="" disabled>Selecciona ciudad</option>
            {CITIES_HN.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Sector / Colonia</label>
          <input
            name="sector"
            defaultValue={defaultValues.sector ?? ""}
            placeholder="Ej: Residencial Los Pinos"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Dirección */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Dirección referencial</label>
        <input
          name="address"
          defaultValue={defaultValues.address ?? ""}
          placeholder="Ej: De la gasolinera Shell, 2 cuadras al norte"
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Detalles */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { name: "bedrooms", label: "Habitaciones", value: defaultValues.bedrooms },
          { name: "bathrooms", label: "Baños", value: defaultValues.bathrooms },
          { name: "area_m2", label: "Área (m²)", value: defaultValues.area_m2 },
          { name: "parking", label: "Parqueos", value: defaultValues.parking },
        ].map((f) => (
          <div key={f.name} className="space-y-1.5">
            <label className="text-sm font-medium">{f.label}</label>
            <input
              name={f.name}
              type="number"
              min={0}
              defaultValue={f.value ?? ""}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        ))}
      </div>

      {/* Descripción */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Descripción</label>
        <textarea
          name="description"
          rows={5}
          defaultValue={defaultValues.description ?? ""}
          placeholder="Descripción detallada de la propiedad..."
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
        />
      </div>

      {/* Estado */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Estado</label>
        <select
          name="status"
          defaultValue={defaultValues.status ?? "draft"}
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="draft">Borrador</option>
          <option value="pending_review">En revisión</option>
          <option value="active">Activa (publicar)</option>
          <option value="sold">Vendida</option>
          <option value="archived">Archivada</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Guardando..." : submitLabel}
      </button>
    </form>
  )
}
