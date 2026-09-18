import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { z } from "zod"

const schema = z.object({
  name:    z.string().min(2).max(100),
  contact: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { error } = await supabase.from("contact_messages").insert(parsed.data)

  if (error) {
    console.error("[contact] insert error:", error)
    return NextResponse.json({ error: "Error al enviar mensaje." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
