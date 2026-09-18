import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredProperties } = await supabase
    .from("properties")
    .select("id, title, type, operation, price, currency, city, sector, slug, bedrooms, bathrooms, area_m2")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0E3B2E] text-white relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "url('/logo-iui.jpeg')", backgroundSize: "600px", backgroundPosition: "right -100px top -50px", backgroundRepeat: "no-repeat" }}
        />

        <div className="relative max-w-5xl mx-auto px-4 py-24 text-center">
          <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.25em] mb-5">
            Inversiones Urbanas Inmobiliarias
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold mb-5 leading-tight">
            Encuentra tu propiedad ideal<br />
            <span className="text-[#D4AF37]">en Honduras</span>
          </h1>
          <p className="text-white/65 text-lg mb-10 max-w-xl mx-auto font-light">
            Casas, apartamentos y locales comerciales en las mejores ciudades. Asesoría personalizada y contenido de marketing incluido.
          </p>

          {/* Línea dorada */}
          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mb-10" />

          <div className="flex justify-center gap-4">
            <Link
              href="/propiedades"
              className="px-7 py-3 bg-[#D4AF37] text-[#0E3B2E] font-semibold rounded-lg hover:bg-[#c49d2a] transition-colors text-sm"
            >
              Ver propiedades
            </Link>
            <Link
              href="/vender"
              className="px-7 py-3 border border-[#D4AF37]/50 text-white font-medium rounded-lg hover:border-[#D4AF37] hover:bg-white/5 transition-colors text-sm"
            >
              Publicar propiedad
            </Link>
          </div>
        </div>
      </section>

      {/* Stats rápidos */}
      <section className="bg-[#071f17] text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-3 divide-x divide-[#D4AF37]/20">
          {[
            { num: "10+", label: "Años de experiencia" },
            { num: "500+", label: "Propiedades gestionadas" },
            { num: "1000+", label: "Clientes satisfechos" },
          ].map((s) => (
            <div key={s.label} className="text-center px-6">
              <p className="text-[#D4AF37] text-2xl font-semibold">{s.num}</p>
              <p className="text-white/50 text-xs mt-1 font-light tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Propiedades destacadas */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#0E3B2E] text-xs font-semibold uppercase tracking-widest mb-1">Portafolio</p>
            <h2 className="text-2xl font-semibold text-foreground">Propiedades disponibles</h2>
          </div>
          <Link href="/propiedades" className="text-sm text-[#0E3B2E] font-medium hover:text-[#D4AF37] transition-colors">
            Ver todas →
          </Link>
        </div>

        {featuredProperties && featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-2xl p-16 text-center text-muted-foreground">
            Próximamente propiedades disponibles.
          </div>
        )}
      </section>

      {/* CTA Vender */}
      <section className="bg-[#0E3B2E] text-white py-16 relative overflow-hidden">
        <div className="h-[3px] bg-[#D4AF37] absolute top-0 left-0 right-0" />
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">Para propietarios</p>
          <h2 className="text-2xl font-semibold mb-3">¿Quieres vender o alquilar tu propiedad?</h2>
          <p className="text-white/60 font-light mb-8 max-w-xl mx-auto">
            Publícala gratuitamente. Nuestro equipo la revisa, la publica y genera todo el contenido de marketing digital por ti.
          </p>
          <div className="w-12 h-[2px] bg-[#D4AF37] mx-auto mb-8" />
          <Link
            href="/vender"
            className="inline-block px-7 py-3 bg-[#D4AF37] text-[#0E3B2E] font-semibold rounded-lg hover:bg-[#c49d2a] transition-colors text-sm"
          >
            Publicar mi propiedad
          </Link>
        </div>
      </section>
    </>
  )
}

function PropertyCard({ property }: {
  property: {
    id: string
    title: string
    type: string
    operation: string
    price: number
    currency: string
    city: string | null
    sector: string | null
    slug: string | null
    bedrooms?: number | null
    bathrooms?: number | null
    area_m2?: number | null
  }
}) {
  const href = property.slug ? `/propiedades/${property.slug}` : `/propiedades/${property.id}`
  return (
    <Link href={href} className="group block bg-background border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-[#D4AF37]/40 transition-all">
      {/* Línea dorada superior al hacer hover */}
      <div className="h-[3px] bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="aspect-[4/3] bg-[#0E3B2E]/8 flex items-center justify-center relative">
        <div className="text-center opacity-30">
          <div className="text-5xl mb-2">🏠</div>
        </div>
        {/* Badge operación */}
        <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 bg-[#0E3B2E] text-[#D4AF37] rounded uppercase tracking-wide">
          {property.operation}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground capitalize mb-1.5 font-light">{property.type}</p>
        <h3 className="font-semibold text-foreground group-hover:text-[#0E3B2E] transition-colors line-clamp-2 mb-1 text-sm leading-snug">
          {property.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-3 font-light">
          {property.city}{property.sector ? `, ${property.sector}` : ""}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <p className="font-semibold text-[#0E3B2E]">
            {property.currency === "HNL" ? "L" : "$"} {Number(property.price).toLocaleString("es-HN")}
          </p>
          <div className="flex gap-3 text-xs text-muted-foreground font-light">
            {property.bedrooms && <span>{property.bedrooms} hab</span>}
            {property.bathrooms && <span>{property.bathrooms} baños</span>}
            {property.area_m2 && <span>{property.area_m2} m²</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
