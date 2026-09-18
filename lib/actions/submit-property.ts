"use server"

import { createClient } from "@/lib/supabase/server"
import { getResend, FROM_ADDRESS, INTERNAL_EMAIL } from "@/lib/email/resend"
import { propietarioConfirmacionEmail, iuiAlertaNuevaSolicitudEmail, type SubmissionData } from "@/lib/email/templates"

export async function submitProperty(formData: FormData) {
  const supabase = await createClient()

  const payload: SubmissionData & { status: string } = {
    contact_name:  formData.get("contact_name") as string,
    contact_email: formData.get("contact_email") as string || null,
    contact_phone: formData.get("contact_phone") as string || null,
    property_type: formData.get("property_type") as string,
    operation:     formData.get("operation") as string,
    price:         formData.get("price") ? Number(formData.get("price")) : null,
    currency:      (formData.get("currency") as string) || "HNL",
    city:          formData.get("city") as string || null,
    sector:        formData.get("sector") as string || null,
    bedrooms:      formData.get("bedrooms") ? Number(formData.get("bedrooms")) : null,
    bathrooms:     formData.get("bathrooms") ? Number(formData.get("bathrooms")) : null,
    area_m2:       formData.get("area_m2") ? Number(formData.get("area_m2")) : null,
    description:   formData.get("description") as string || null,
    status:        "pending",
  }

  const { error } = await supabase.from("property_submissions").insert(payload)
  if (error) throw new Error("No se pudo enviar la solicitud. Inténtalo de nuevo.")

  // Enviar emails en paralelo — no bloqueamos si fallan
  const emailPromises: Promise<unknown>[] = [
    getResend().emails.send({
      from:    FROM_ADDRESS,
      to:      INTERNAL_EMAIL,
      subject: `🏠 Nueva solicitud: ${payload.property_type} en ${payload.city ?? 'Honduras'} — ${payload.contact_name}`,
      html:    iuiAlertaNuevaSolicitudEmail(payload),
    }),
  ]

  if (payload.contact_email) {
    emailPromises.push(
      getResend().emails.send({
        from:    FROM_ADDRESS,
        to:      payload.contact_email,
        subject: '✓ Recibimos tu propiedad — Inversiones Urbanas',
        html:    propietarioConfirmacionEmail(payload),
      })
    )
  }

  await Promise.allSettled(emailPromises)

  return { success: true }
}
