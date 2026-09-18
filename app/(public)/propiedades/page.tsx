import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PropertyFilters } from "./property-filters"

export const metadata = {
  title: "Propiedades en Honduras",
  description: "Casas, apartamentos, terrenos y locales en venta y alquiler en Honduras.",
}

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; operation?: string; city?: string }>
}) {
  const { type, operation, city } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("properties")
    .select("id, title, type, operation, price, currency, city, sector, slug, bedrooms, bathrooms, area_m2, property_images(url, is_cover, display_order)")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (type) query = query.eq("type", type)
  if (operation) query = query.eq("operation", operation)
  if (city) query = query.eq("city", city)

  const { data: properties } = await query

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const merged = { type, operation, city, ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v) })
    const str = params.toString()
    return `/propiedades${str ? `?${str}` : ""}`
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Propiedades en Honduras</h1>

      <PropertyFilters />

      {/* Filtros rápidos de operación */}
      <div className="flex gap-2 mb-6">
        {[
          { value: "", label: "Todo" },
          { value: "venta", label: "Venta" },
          { value: "alquiler", label: "Alquiler" },
        ].map((f) => (
          <Link
            key={f.value}
            href={buildHref({ operation: f.value || undefined })}
            className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
              (operation ?? "") === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border text-muted-foreground hover:border-foreground"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {properties && properties.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">{properties.length} propiedad{properties.length !== 1 ? "es" : ""} encontrada{properties.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => {
              const href = p.slug ? `/propiedades/${p.slug}` : `/propiedades/${p.id}`
              const images = p.property_images as Array<{ url: string; is_cover: boolean; display_order: number }> | null
              const cover = images?.find(img => img.is_cover) ?? images?.sort((a, b) => a.display_order - b.display_order)[0]
              return (
                <Link
                  key={p.id}
                  href={href}
                  className="group block border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-background"
                >
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {cover ? (
                      <Image
                        src={cover.url}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-5xl text-muted-foreground/30">🏠</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize">{p.operation}</span>
                      <span className="text-xs text-muted-foreground capitalize">{p.type}</span>
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1 text-sm">
                      {p.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">{p.city}{p.sector ? `, ${p.sector}` : ""}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold">{p.currency === "HNL" ? "L" : "$"} {Number(p.price).toLocaleString("es-HN")}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        {p.bedrooms && <span>{p.bedrooms} hab</span>}
                        {p.bathrooms && <span>{p.bathrooms} baños</span>}
                        {p.area_m2 && <span>{p.area_m2} m²</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      ) : (
        <div className="border border-dashed border-border rounded-2xl p-16 text-center text-muted-foreground">
          No hay propiedades disponibles con esos filtros.
          <br />
          <Link href="/propiedades" className="text-primary hover:underline text-sm mt-2 inline-block">
            Ver todas
          </Link>
        </div>
      )}
    </div>
  )
}
