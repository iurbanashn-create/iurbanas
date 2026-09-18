import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const TYPES = ['', 'casa', 'apartamento', 'local_comercial', 'oficina', 'terreno', 'bodega']
const CITIES = ['', 'San Pedro Sula', 'Tegucigalpa', 'La Ceiba', 'Choloma', 'El Progreso', 'Comayagua']

export default async function CorredorPropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; operation?: string; city?: string; q?: string }>
}) {
  const { type, operation, city, q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('properties')
    .select('id, title, type, operation, price, currency, city, sector, slug, bedrooms, bathrooms, area_m2, property_images(url, is_cover, display_order)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (type)      query = query.eq('type', type)
  if (operation) query = query.eq('operation', operation)
  if (city)      query = query.eq('city', city)
  if (q)         query = query.ilike('title', `%${q}%`)

  const { data: properties } = await query

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventario IUI</h1>
        <p className="text-sm text-gray-500 mt-0.5">{properties?.length ?? 0} propiedades disponibles</p>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-border rounded-xl p-4 flex flex-wrap gap-3">
        <input
          type="text"
          defaultValue={q}
          placeholder="Buscar por título..."
          className="flex-1 min-w-[160px] px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = (e.target as HTMLInputElement).value
              const params = new URLSearchParams({ ...(type && { type }), ...(operation && { operation }), ...(city && { city }), ...(val && { q: val }) })
              window.location.href = `/corredor/propiedades?${params}`
            }
          }}
        />
        {[
          { name: 'operation', value: operation, options: [['', 'Operación'], ['venta', 'Venta'], ['alquiler', 'Alquiler']] },
          { name: 'type',      value: type,      options: TYPES.map(t => [t, t ? t.replace('_', ' ') : 'Tipo']) },
          { name: 'city',      value: city,      options: CITIES.map(c => [c, c || 'Ciudad']) },
        ].map(({ name, value, options }) => (
          <select
            key={name}
            defaultValue={value ?? ''}
            onChange={(e) => {
              const params = new URLSearchParams({
                ...(type      && name !== 'type'      && { type }),
                ...(operation && name !== 'operation' && { operation }),
                ...(city      && name !== 'city'      && { city }),
                ...(q         && { q }),
                ...(e.target.value && { [name]: e.target.value }),
              })
              window.location.href = `/corredor/propiedades?${params}`
            }}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none capitalize"
          >
            {options.map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        ))}
        {(type || operation || city || q) && (
          <Link href="/corredor/propiedades" className="px-3 py-2 text-xs text-gray-500 border border-border rounded-lg hover:bg-gray-50">
            Limpiar ×
          </Link>
        )}
      </div>

      {/* Grid */}
      {!properties || properties.length === 0 ? (
        <div className="border border-dashed border-border rounded-2xl p-16 text-center text-gray-400 text-sm">
          No hay propiedades con esos filtros.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((p) => {
            const images = p.property_images as Array<{ url: string; is_cover: boolean; display_order: number }> | null
            const cover  = images?.find(i => i.is_cover) ?? images?.sort((a, b) => a.display_order - b.display_order)[0]
            const href   = p.slug ? `/corredor/propiedades/${p.slug}` : `/corredor/propiedades/${p.id}`
            return (
              <Link
                key={p.id}
                href={href}
                className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover.url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-5xl text-gray-200">🏠</div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#0E3B2E] text-white text-[10px] font-semibold rounded-md capitalize">
                    {p.operation}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 capitalize mb-1">{p.type}{p.city ? ` · ${p.city}` : ''}{p.sector ? `, ${p.sector}` : ''}</p>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-[#0E3B2E] transition-colors">
                    {p.title}
                  </h3>
                  <p className="font-bold text-[#0E3B2E]">
                    {p.currency === 'HNL' ? 'L' : '$'} {Number(p.price).toLocaleString('es-HN')}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-400">
                    {p.bedrooms && <span>{p.bedrooms} hab</span>}
                    {p.bathrooms && <span>{p.bathrooms} baños</span>}
                    {p.area_m2 && <span>{p.area_m2} m²</span>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
