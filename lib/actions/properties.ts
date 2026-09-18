"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")   // quitar tildes
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80)
  const suffix = Math.random().toString(36).slice(2, 7)
  return `${base}-${suffix}`
}

export async function createProperty(formData: FormData) {
  const supabase = await createAdminClient()

  const title = formData.get("title") as string

  const payload = {
    title,
    slug: generateSlug(title),
    description: formData.get("description") as string,
    type: formData.get("type") as string,
    operation: formData.get("operation") as string,
    price: Number(formData.get("price")),
    currency: (formData.get("currency") as string) || "HNL",
    city: formData.get("city") as string,
    sector: formData.get("sector") as string,
    address: formData.get("address") as string,
    bedrooms: formData.get("bedrooms") ? Number(formData.get("bedrooms")) : null,
    bathrooms: formData.get("bathrooms") ? Number(formData.get("bathrooms")) : null,
    area_m2: formData.get("area_m2") ? Number(formData.get("area_m2")) : null,
    parking: formData.get("parking") ? Number(formData.get("parking")) : null,
    status: (formData.get("status") as string) || "draft",
  }

  const { data, error } = await supabase.from("properties").insert(payload).select("id").single()

  if (error) throw new Error(error.message)

  revalidatePath("/admin/propiedades")
  redirect(`/admin/propiedades/${data.id}`)
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createAdminClient()

  const payload = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    type: formData.get("type") as string,
    operation: formData.get("operation") as string,
    price: Number(formData.get("price")),
    currency: (formData.get("currency") as string) || "HNL",
    city: formData.get("city") as string,
    sector: formData.get("sector") as string,
    address: formData.get("address") as string,
    bedrooms: formData.get("bedrooms") ? Number(formData.get("bedrooms")) : null,
    bathrooms: formData.get("bathrooms") ? Number(formData.get("bathrooms")) : null,
    area_m2: formData.get("area_m2") ? Number(formData.get("area_m2")) : null,
    parking: formData.get("parking") ? Number(formData.get("parking")) : null,
    status: formData.get("status") as string,
  }

  const { error } = await supabase.from("properties").update(payload).eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/propiedades")
  revalidatePath(`/admin/propiedades/${id}`)
}

export async function deleteProperty(id: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from("properties")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/propiedades")
  redirect("/admin/propiedades")
}
