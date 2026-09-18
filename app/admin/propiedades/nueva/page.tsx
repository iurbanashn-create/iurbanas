import Link from "next/link"
import { createProperty } from "@/lib/actions/properties"
import { PropertyForm } from "@/components/admin/property-form"

export default function NuevaPropiedadPage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/propiedades" className="text-muted-foreground hover:text-foreground text-sm">
          ← Propiedades
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-xl font-semibold">Nueva propiedad</h1>
      </div>

      <div className="bg-background border border-border rounded-xl p-6">
        <PropertyForm action={createProperty} submitLabel="Crear propiedad" />
      </div>
    </div>
  )
}
