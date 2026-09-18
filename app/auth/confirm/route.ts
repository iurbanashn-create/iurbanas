import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const token_hash = searchParams.get('token_hash')
  const type       = searchParams.get('type') as 'invite' | 'magiclink' | 'recovery' | null
  const next       = searchParams.get('next') ?? '/corredor/dashboard'

  if (token_hash && type) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type })

    if (!error && data.user) {
      const role = data.user.user_metadata?.role ?? 'admin'
      const redirectTo = role === 'agent' ? '/corredor/dashboard' : '/admin'
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  return NextResponse.redirect(`${origin}/corredor/acceso?error=link_invalido`)
}
