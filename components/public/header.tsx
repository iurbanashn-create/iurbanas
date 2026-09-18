import Link from "next/link"
import Image from "next/image"

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[#0E3B2E] shadow-lg">
      {/* Línea dorada superior */}
      <div className="h-[3px] bg-[#D4AF37]" />

      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-iui.jpeg"
            alt="Inversiones Urbanas Inmobiliarias"
            width={40}
            height={40}
            className="rounded-sm object-cover"
            priority
          />
          <div className="leading-none">
            <p className="text-white font-semibold text-sm tracking-wide">INVERSIONES URBANAS</p>
            <p className="text-[#D4AF37] font-light text-[11px] tracking-[0.18em] uppercase">Inmobiliaria</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {[
            { href: "/propiedades",         label: "Propiedades" },
            { href: "/red-de-corredores",   label: "Red de Corredores" },
            { href: "/nosotros",            label: "Nosotros" },
            { href: "/contacto",            label: "Contacto" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm font-medium text-white/75 hover:text-white transition-colors rounded-lg hover:bg-white/8"
            >
              {l.label}
            </Link>
          ))}

          <Link
            href="/vender"
            className="ml-2 px-4 py-2 bg-[#D4AF37] text-[#0E3B2E] text-sm font-semibold rounded-lg hover:bg-[#c49d2a] transition-colors"
          >
            Publicar propiedad
          </Link>
        </nav>
      </div>
    </header>
  )
}
