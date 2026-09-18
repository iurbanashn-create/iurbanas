"use client"

import { useRouter, useSearchParams } from "next/navigation"

const CITIES = [
  "Tegucigalpa", "San Pedro Sula", "La Ceiba", "Choloma",
  "Comayagua", "Juticalpa", "Santa Rosa de Copán", "Choluteca",
]

export function PropertyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const operation = searchParams.get("operation") ?? ""
  const type = searchParams.get("type") ?? ""
  const city = searchParams.get("city") ?? ""

  function navigate(overrides: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    router.push(`/propiedades${params.size ? `?${params}` : ""}`)
  }

  const hasFilters = operation || type || city

  return (
    <div className="flex flex-wrap gap-3 mb-8 p-4 bg-muted/30 rounded-xl border border-border">
      <select
        className="px-3 py-2 text-sm border border-border rounded-lg bg-background"
        value={operation}
        onChange={(e) => navigate({ operation: e.target.value })}
      >
        <option value="">Operación (todas)</option>
        <option value="venta">Venta</option>
        <option value="alquiler">Alquiler</option>
      </select>
      <select
        className="px-3 py-2 text-sm border border-border rounded-lg bg-background"
        value={type}
        onChange={(e) => navigate({ type: e.target.value })}
      >
        <option value="">Tipo (todos)</option>
        <option value="casa">Casa</option>
        <option value="apartamento">Apartamento</option>
        <option value="terreno">Terreno</option>
        <option value="local_comercial">Local comercial</option>
        <option value="oficina">Oficina</option>
      </select>
      <select
        className="px-3 py-2 text-sm border border-border rounded-lg bg-background"
        value={city}
        onChange={(e) => navigate({ city: e.target.value })}
      >
        <option value="">Ciudad (todas)</option>
        {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      {hasFilters && (
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => router.push("/propiedades")}
            className="px-3 py-2 text-xs border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  )
}
