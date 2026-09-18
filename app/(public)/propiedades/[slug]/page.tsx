import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("properties")
    .select("title, description, city")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .eq("status", "active")
    .single()

  if (!data) return { title: "Propiedad no encontrada" }
  return {
    title: data.title,
    description: data.description ?? `${data.title} en ${data.city}`,
  }
}

export default async function PropiedadDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from("properties")
    .select("*, property_images(id, url, is_cover, sort_order)")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .eq("status", "active")
    .single()

  if (!property) notFound()

  const images = (property.property_images ?? []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  )
  const coverImage = images.find((i: { is_cover: boolean }) => i.is_cover) ?? images[0]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Galería */}
      <div className="aspect-[16/7] bg-muted rounded-2xl overflow-hidden mb-8 flex items-center justify-center">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImage.url} alt={property.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl text-muted-foreground/30">🏠</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Info principal */}
        <div className="col-span-2">
          <div className="flex gap-2 mb-3">
            <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full capitalize">
              {property.operation}
            </span>
            <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full capitalize">
              {property.type}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
          <p className="text-muted-foreground mb-6">
            {property.city}{property.sector ? `, ${property.sector}` : ""}{property.address ? ` — ${property.address}` : ""}
          </p>

          {/* Specs */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[
              { label: "Habitaciones", value: property.bedrooms },
              { label: "Baños", value: property.bathrooms },
              { label: "Área (m²)", value: property.area_m2 },
              { label: "Parqueos", value: property.parking },
            ].filter((s) => s.value).map((s) => (
              <div key={s.label} className="border border-border rounded-xl p-3 text-center">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {property.description && (
            <div>
              <h2 className="font-semibold mb-3">Descripción</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar precio + contacto */}
        <div className="space-y-4">
          <div className="border border-border rounded-2xl p-5">
            <p className="text-2xl font-bold mb-1">
              {property.currency === "HNL" ? "L" : "$"} {Number(property.price).toLocaleString("es-HN")}
            </p>
            <p className="text-sm text-muted-foreground mb-4 capitalize">{property.type} en {property.operation}</p>
            <a
              href="https://wa.me/50499706554"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors mb-2"
            >
              Contactar por WhatsApp
            </a>
            <a
              href="/contacto"
              className="w-full block text-center px-4 py-2.5 border border-border text-sm font-medium rounded-xl hover:bg-muted transition-colors"
            >
              Solicitar más información
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
