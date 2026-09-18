import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { updateProperty, deleteProperty } from "@/lib/actions/properties"
import { PropertyForm } from "@/components/admin/property-form"
import { PropertyImages } from "@/components/admin/property-images"

export default async function EditarPropiedadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: property }, { data: images }] = await Promise.all([
    supabase.from("properties").select("*").eq("id", id).is("deleted_at", null).single(),
    supabase
      .from("property_images")
      .select("id, url, storage_path, sort_order, is_cover")
      .eq("property_id", id)
      .order("sort_order"),
  ])

  if (!property) notFound()

  const update = updateProperty.bind(null, id)

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/propiedades" className="text-muted-foreground hover:text-foreground text-sm">
            ← Propiedades
          </Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-xl font-semibold truncate max-w-xs">{property.title}</h1>
        </div>
        <Link
          href={`/admin/propiedades/${id}/marketing`}
          className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Generar marketing →
        </Link>
      </div>

      {/* Fotografías */}
      <div className="bg-background border border-border rounded-xl p-6 mb-4">
        <PropertyImages propertyId={id} initialImages={images ?? []} />
      </div>

      {/* Datos de la propiedad */}
      <div className="bg-background border border-border rounded-xl p-6">
        <PropertyForm action={update} defaultValues={property} submitLabel="Guardar cambios" />
      </div>

      {/* Zona de peligro */}
      <div className="mt-4 border border-destructive/30 rounded-xl p-4">
        <p className="text-sm font-medium text-destructive mb-1">Zona de peligro</p>
        <p className="text-xs text-muted-foreground mb-3">Eliminar la propiedad es irreversible.</p>
        <form
          action={async () => {
            "use server"
            await deleteProperty(id)
          }}
        >
          <button
            type="submit"
            className="px-4 py-2 bg-destructive text-destructive-foreground text-sm font-medium rounded-lg hover:bg-destructive/90 transition-colors"
          >
            Eliminar propiedad
          </button>
        </form>
      </div>
    </div>
  )
}
