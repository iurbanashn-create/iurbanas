import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce a Inversiones Urbanas Inmobiliarias, tu aliado inmobiliario en Honduras.",
}

export default function NosotrosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">Inversiones Urbanas Inmobiliarias</h1>
      <p className="text-muted-foreground text-lg leading-relaxed mb-8">
        Somos una empresa hondureña con experiencia en el mercado inmobiliario. Conectamos a compradores,
        vendedores y arrendatarios con las mejores propiedades en Honduras.
      </p>

      <div className="grid grid-cols-2 gap-6 mb-12">
        {[
          { num: "10+", label: "Años de experiencia" },
          { num: "500+", label: "Propiedades gestionadas" },
          { num: "1000+", label: "Clientes satisfechos" },
          { num: "5+", label: "Ciudades con presencia" },
        ].map((s) => (
          <div key={s.label} className="border border-border rounded-2xl p-6 text-center">
            <p className="text-3xl font-bold text-primary mb-1">{s.num}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-3">¿Por qué elegirnos?</h2>
      <ul className="space-y-3 mb-10">
        {[
          "Propiedades verificadas y revisadas por nuestro equipo",
          "Asesoría personalizada en todo el proceso",
          "Contenido de marketing digital incluido para vendedores",
          "Presencia en las principales ciudades de Honduras",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3 text-muted-foreground">
            <span className="text-primary mt-0.5">✓</span>
            {item}
          </li>
        ))}
      </ul>

      <Link
        href="/contacto"
        className="inline-block px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
      >
        Contáctanos
      </Link>
    </div>
  )
}
