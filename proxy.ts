import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  const isAdminRoute    = path.startsWith('/admin')
  const isCorredorRoute = path.startsWith('/corredor') && !path.startsWith('/corredor/acceso') && !path.startsWith('/corredor/sin-acceso')
  const isLoginRoute    = path === '/login'
  const isAccesoRoute   = path === '/corredor/acceso'

  // Rutas protegidas sin sesión → redirigir a login
  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }
  if (isCorredorRoute && !user) {
    return NextResponse.redirect(new URL('/corredor/acceso', request.nextUrl))
  }

  // Usuario autenticado en login/acceso → redirigir según rol
  if (user && (isLoginRoute || isAccesoRoute)) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? 'admin'
    if (role === 'agent') return NextResponse.redirect(new URL('/corredor/dashboard', request.nextUrl))
    return NextResponse.redirect(new URL('/admin', request.nextUrl))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
