import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PrintFichaButton } from './print-ficha-button'

export default async function CorredorPropiedadPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase  = await createClient()

  const [{ data: property }, ] = await Promise.all([
    supabase
      .from('properties')
      .select('*, property_images(id, url, is_cover, display_order)')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .eq('status', 'active')
      .single(),
  ])

  if (!property) notFound()

  const images = (property.property_images as Array<{ id: string; url: string; is_cover: boolean; display_order: number }> | null)
    ?.sort((a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0) || a.display_order - b.display_order) ?? []

  return (
    <div className="space-y-6 max-w-4xl" id="ficha-propiedad">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/corredor/propiedades" className="text-sm text-gray-400 hover:text-gray-600">
            ← Inventario
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{property.title}</h1>
          <p className="text-sm text-gray-500">
            {property.city}{property.sector ? `, ${property.sector}` : ''}
            {property.address ? ` · ${property.address}` : ''}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <PrintFichaButton />
        </div>
      </div>

      {/* Precio destacado */}
      <div className="bg-[#0E3B2E] rounded-xl px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-white/60 text-xs uppercase tracking-wide">Precio de {property.operation}</p>
          <p className="text-3xl font-bold text-white mt-0.5">
            {property.currency === 'HNL' ? 'L' : '$'} {Number(property.price).toLocaleString('es-HN')}
          </p>
        </div>
        <span className="px-4 py-1.5 bg-[#D4AF37] text-[#0E3B2E] text-sm font-bold rounded-lg capitalize">
          {property.operation}
        </span>
      </div>

      {/* Fotos */}
      {images.length > 0 && (
        <div>
          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[0].url} alt={property.title} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((img) => (
                <div key={img.id} className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Detalles */}
        <div className="md:col-span-2 space-y-6">
          {/* Características */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Características</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Tipo',         value: property.type?.replace('_', ' ') },
                { label: 'Operación',    value: property.operation },
                { label: 'Ciudad',       value: property.city },
                { label: 'Habitaciones', value: property.bedrooms ? `${property.bedrooms} hab.` : null },
                { label: 'Baños',        value: property.bathrooms ? `${property.bathrooms}` : null },
                { label: 'Área',         value: property.area_m2 ? `${property.area_m2} m²` : null },
                { label: 'Parqueos',     value: property.parking ? `${property.parking}` : null },
              ].filter(i => i.value).map(({ label, value }) => (
                <div key={label} className="text-center bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Descripción */}
          {property.description && (
            <div className="bg-white border border-border rounded-xl p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Descripción</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>
          )}
        </div>

        {/* Contacto IUI */}
        <div className="space-y-4">
          <div className="bg-[#0E3B2E] rounded-xl p-5 text-white">
            <p className="font-semibold mb-1">Contactar a IUI</p>
            <p className="text-white/60 text-xs mb-4">Para coordinar visitas o información adicional</p>
            <a
              href="https://wa.me/50499999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] text-white text-sm font-semibold rounded-lg hover:bg-[#20bd5a] transition-colors"
            >
              💬 WhatsApp
            </a>
            <a
              href="mailto:acalix@iurbanas.com"
              className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 border border-white/20 text-white/80 text-sm rounded-lg hover:bg-white/10 transition-colors"
            >
              ✉ Email
            </a>
          </div>

          <div className="bg-white border border-border rounded-xl p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Referencia</p>
            <p className="text-xs text-gray-400 font-mono break-all">{property.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
