"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-3 py-2 text-xs text-white/50 hover:text-white hover:bg-white/8 rounded-lg transition-colors font-light"
    >
      Cerrar sesión
    </button>
  )
}
