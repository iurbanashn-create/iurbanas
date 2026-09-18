"use server"

import { createClient } from "@/lib/supabase/server"
import { getResend, FROM_ADDRESS, INTERNAL_EMAIL } from "@/lib/email/resend"

export async function registerAgent(formData: FormData) {
  const supabase = await createClient()

  const payload = {
    full_name:     formData.get("full_name") as string,
    email:         formData.get("email") as string,
    phone:         formData.get("phone") as string,
    business_name: formData.get("business_name") as string || null,
    city:          formData.get("city") as string || null,
    message:       formData.get("message") as string || null,
  }

  const { error } = await supabase.from("agent_registrations").insert(payload)
  if (error) throw new Error("No se pudo enviar la solicitud. Inténtalo de nuevo.")

  // Alerta interna
  await getResend().emails.send({
    from:    FROM_ADDRESS,
    to:      INTERNAL_EMAIL,
    subject: `🤝 Nuevo corredor solicitó acceso: ${payload.full_name}`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px 24px;">
        <h2 style="color:#0E3B2E;margin-bottom:16px;">Nuevo corredor en la red</h2>
        <table style="width:100%;font-size:14px;border-collapse:collapse;">
          <tr><td style="color:#6b7280;padding:6px 0;width:120px;">Nombre</td><td><strong>${payload.full_name}</strong></td></tr>
          <tr><td style="color:#6b7280;padding:6px 0;">Email</td><td>${payload.email}</td></tr>
          <tr><td style="color:#6b7280;padding:6px 0;">Teléfono</td><td>${payload.phone}</td></tr>
          ${payload.business_name ? `<tr><td style="color:#6b7280;padding:6px 0;">Empresa</td><td>${payload.business_name}</td></tr>` : ''}
          ${payload.city ? `<tr><td style="color:#6b7280;padding:6px 0;">Ciudad</td><td>${payload.city}</td></tr>` : ''}
          ${payload.message ? `<tr><td style="color:#6b7280;padding:6px 0;vertical-align:top;">Mensaje</td><td>${payload.message}</td></tr>` : ''}
        </table>
        <a href="https://iurbanas.com/admin/corredores" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#0E3B2E;color:#fff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
          Revisar en el admin →
        </a>
      </div>
    `,
  }).catch(() => {})

  return { success: true }
}
