"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80)
  const suffix = Math.random().toString(36).slice(2, 7)
  return `${base}-${suffix}`
}

export async function updateSubmissionStatus(id: string, status: string, notes?: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from("property_submissions")
    .update({ status, admin_notes: notes ?? null })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/solicitudes")
  revalidatePath(`/admin/solicitudes/${id}`)
}

export async function approveAndCreateProperty(id: string) {
  const supabase = await createAdminClient()

  const { data: sub, error: subError } = await supabase
    .from("property_submissions")
    .select("*")
    .eq("id", id)
    .single()

  if (subError || !sub) throw new Error("Solicitud no encontrada")

  const title = sub.title ?? `${sub.property_type} en ${sub.city}`

  const { data: property, error: propError } = await supabase
    .from("properties")
    .insert({
      title,
      slug: generateSlug(title),
      description: sub.description,
      type: sub.property_type,
      operation: sub.operation,
      price: sub.price,
      currency: sub.currency ?? "HNL",
      city: sub.city,
      sector: sub.sector,
      address: sub.address,
      bedrooms: sub.bedrooms,
      bathrooms: sub.bathrooms,
      area_m2: sub.area_m2,
      status: "pending_review",
    })
    .select("id")
    .single()

  if (propError || !property) throw new Error("Error al crear propiedad")

  await supabase
    .from("property_submissions")
    .update({ status: "approved", property_id: property.id })
    .eq("id", id)

  revalidatePath("/admin/solicitudes")
  redirect(`/admin/propiedades/${property.id}`)
}
