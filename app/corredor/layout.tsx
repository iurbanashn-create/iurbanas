import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/admin/logout-button'

export default async function CorredorLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/corredor/acceso')

  const { data: profile } = await supabase
    .from('users')
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'agent') redirect('/login')

  const { data: agentProfile } = await supabase
    .from('agent_profiles')
    .select('full_name, access')
    .eq('user_id', user.id)
    .single()

  if (!agentProfile?.access) {
    redirect('/corredor/sin-acceso')
  }

  return (
    <div className="min-h-screen flex bg-[#f7f7f5]">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0E3B2E] flex flex-col flex-shrink-0">
        <div className="px-4 py-4 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2.5">
            <Image src="/logo-iui.jpeg" alt="IUI" width={32} height={32} className="rounded-sm object-cover" />
            <div className="leading-none">
              <p className="text-white font-semibold text-xs tracking-wide">INVERSIONES</p>
              <p className="text-[#D4AF37] font-light text-[10px] tracking-widest">URBANAS</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 pt-4">
          <p className="text-[#D4AF37]/50 text-[9px] font-semibold uppercase tracking-widest px-3 mb-2">Red IUI</p>
          <NavLink href="/corredor/dashboard">Dashboard</NavLink>
          <NavLink href="/corredor/propiedades">Propiedades</NavLink>
        </nav>

        <div className="p-3 border-t border-[#D4AF37]/20">
          <p className="text-[10px] text-white/60 truncate px-3 mb-0.5">
            {agentProfile?.full_name ?? profile.email}
          </p>
          <p className="text-[10px] text-white/30 truncate px-3 mb-1.5">Corredor afiliado</p>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">{children}</div>
      </main>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/8 rounded-lg transition-colors font-light"
    >
      {children}
    </Link>
  )
}
