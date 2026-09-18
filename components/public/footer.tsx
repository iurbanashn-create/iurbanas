import Link from "next/link"
import Image from "next/image"

export function PublicFooter() {
  return (
    <footer className="bg-[#0E3B2E] mt-16">
      {/* Línea dorada superior */}
      <div className="h-[3px] bg-[#D4AF37]" />

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-3 gap-8">
        {/* Marca */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logo-iui.jpeg"
              alt="IUI"
              width={44}
              height={44}
              className="rounded-sm object-cover"
            />
            <div className="leading-none">
              <p className="text-white font-semibold text-sm tracking-wide">INVERSIONES URBANAS</p>
              <p className="text-[#D4AF37] font-light text-[11px] tracking-[0.18em] uppercase">Inmobiliaria</p>
            </div>
          </div>
          <p className="text-white/55 text-sm leading-relaxed">
            Las mejores propiedades en Honduras. Compromiso, transparencia y resultados.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-4">Navegación</p>
          <ul className="space-y-2.5">
            {[
              { href: "/propiedades", label: "Propiedades" },
              { href: "/vender", label: "Vende tu propiedad" },
              { href: "/nosotros", label: "Nosotros" },
              { href: "/contacto", label: "Contacto" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/65 hover:text-white hover:text-[#D4AF37] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-4">Contacto</p>
          <ul className="space-y-2.5 text-sm text-white/65">
            <li>Honduras</li>
            <li>Tegucigalpa, MDC</li>
            <li>
              <a href="mailto:info@iurbanas.com" className="hover:text-[#D4AF37] transition-colors">
                info@iurbanas.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#D4AF37]/15">
        <p className="text-center text-xs text-white/35 py-4">
          © {new Date().getFullYear()} Inversiones Urbanas Inmobiliarias. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
