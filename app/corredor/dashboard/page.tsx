import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Building2, Search, FileText, TrendingUp } from 'lucide-react'

export default async function CorredorDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { count: totalProps }, { data: recent }] = await Promise.all([
    supabase.from('agent_profiles').select('full_name, business_name').eq('user_id', user!.id).single(),
    supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('properties')
      .select('id, title, type, operation, price, currency, city, sector, slug, property_images(url, is_cover)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Corredor'

  return (
    <div className="space-y-8">
      {/* Saludo */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hola, {firstName} 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">Bienvenido a la Red de Corredores IUI</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0E3B2E]/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#0E3B2E]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalProps ?? 0}</p>
              <p className="text-xs text-gray-500">Propiedades disponibles</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Activo</p>
              <p className="text-xs text-gray-500">Estado de tu acceso</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">PDF</p>
            <p className="text-xs text-gray-500">Fichas descargables</p>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/corredor/propiedades"
          className="group bg-[#0E3B2E] rounded-xl p-6 flex items-center gap-4 hover:bg-[#1F5D3A] transition-colors"
        >
          <Search className="w-8 h-8 text-[#D4AF37]" />
          <div>
            <p className="text-white font-semibold">Ver inventario completo</p>
            <p className="text-white/60 text-sm">{totalProps ?? 0} propiedades disponibles</p>
          </div>
        </Link>
        <a
          href="https://wa.me/50499999999"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-border rounded-xl p-6 flex items-center gap-4 hover:border-[#0E3B2E]/30 transition-colors"
        >
          <span className="text-4xl">💬</span>
          <div>
            <p className="text-gray-900 font-semibold">Contactar a IUI</p>
            <p className="text-gray-500 text-sm">Soporte por WhatsApp</p>
          </div>
        </a>
      </div>

      {/* Propiedades recientes */}
      {recent && recent.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Últimas propiedades</h2>
            <Link href="/corredor/propiedades" className="text-sm text-[#0E3B2E] hover:underline">
              Ver todas →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recent.map((p) => {
              const images = p.property_images as Array<{ url: string; is_cover: boolean }> | null
              const cover  = images?.find(i => i.is_cover)?.url ?? images?.[0]?.url
              const href   = p.slug ? `/corredor/propiedades/${p.slug}` : `/corredor/propiedades/${p.id}`
              return (
                <Link key={p.id} href={href} className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-4xl text-gray-200">🏠</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-400 capitalize">{p.type} · {p.operation}</p>
                    <p className="text-sm font-medium text-gray-900 truncate mt-0.5">{p.title}</p>
                    <p className="text-sm font-bold text-[#0E3B2E] mt-1">
                      {p.currency === 'HNL' ? 'L' : '$'} {Number(p.price).toLocaleString('es-HN')}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
