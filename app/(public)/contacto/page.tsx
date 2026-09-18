import type { Metadata } from "next"
import { ContactForm } from "./contact-form"

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contáctanos para cualquier consulta sobre propiedades en Honduras.",
}

export default function ContactoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-2 gap-12">
      <div>
        <h1 className="text-3xl font-bold mb-4">Contáctanos</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Estamos disponibles para resolver tus dudas sobre compra, venta o alquiler de propiedades en Honduras.
        </p>

        <div className="space-y-5">
          {[
            { label: "WhatsApp", value: "+504 9970-6554", href: "https://wa.me/50499706554" },
            { label: "Email", value: "info@iurbanas.com", href: "mailto:info@iurbanas.com" },
            { label: "Ubicación", value: "Tegucigalpa, Honduras", href: null },
          ].map((c) => (
            <div key={c.label}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">{c.label}</p>
              {c.href ? (
                <a href={c.href} className="text-sm font-medium text-primary hover:underline">{c.value}</a>
              ) : (
                <p className="text-sm font-medium">{c.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <ContactForm />
      </div>
    </div>
  )
}
