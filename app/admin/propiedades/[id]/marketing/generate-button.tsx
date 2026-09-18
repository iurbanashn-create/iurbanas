"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function GenerateMarketingButton({ propertyId }: { propertyId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleGenerate() {
    setLoading(true)
    try {
      const res = await fetch(`/api/marketing/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? "Error al generar")
      }
      toast.success("Insumos generados correctamente")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
    >
      {loading ? "Generando con IA..." : "✨ Generar insumos de marketing"}
    </button>
  )
}
