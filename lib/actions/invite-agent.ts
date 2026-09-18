"use server"

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'
import { getResend, FROM_ADDRESS } from '@/lib/email/resend'

export async function inviteAgent(formData: FormData) {
  const registrationId = formData.get('registrationId') as string
  const email          = formData.get('email') as string
  const fullName       = formData.get('fullName') as string

  const supabase = await createAdminClient()

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: 'https://iurbanas.com/auth/confirm',
    data: { role: 'agent', full_name: fullName },
  })

  if (error) throw new Error(`Error al invitar: ${error.message}`)

  const userId = data.user.id

  await supabase.from('agent_profiles').upsert({
    user_id:    userId,
    full_name:  fullName,
    access:     true,
    invited_at: new Date().toISOString(),
  })

  await supabase
    .from('agent_registrations')
    .update({ status: 'invited', user_id: userId })
    .eq('id', registrationId)

  await getResend().emails.send({
    from:    FROM_ADDRESS,
    to:      email,
    subject: '🤝 Tu acceso a la Red de Corredores IUI está listo',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;">
        <div style="text-align:center;margin-bottom:28px;">
          <p style="font-size:18px;font-weight:700;color:#0E3B2E;margin:0;">INVERSIONES URBANAS</p>
          <p style="font-size:11px;color:#D4AF37;margin:4px 0 0;letter-spacing:0.2em;text-transform:uppercase;">Red de Corredores</p>
        </div>
        <h2 style="color:#0E3B2E;font-size:20px;margin-bottom:8px;">Bienvenido, ${fullName}!</h2>
        <p style="color:#4b5563;font-size:15px;margin-bottom:24px;">
          Tu solicitud fue aprobada. Ya tienes acceso al inventario exclusivo de Inversiones Urbanas.
        </p>
        <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="font-size:13px;font-weight:600;color:#374151;margin:0 0 12px;">Que puedes hacer ahora:</p>
          <ul style="font-size:13px;color:#6b7280;margin:0;padding-left:18px;line-height:2;">
            <li>Ver el inventario completo de propiedades activas</li>
            <li>Descargar fichas para compartir con tus clientes</li>
            <li>Contactar directamente al equipo IUI</li>
          </ul>
        </div>
        <a href="https://iurbanas.com/corredor/acceso" style="display:inline-block;padding:12px 24px;background:#0E3B2E;color:#fff;font-size:14px;font-weight:600;border-radius:10px;text-decoration:none;">
          Ingresar a la red
        </a>
        <p style="font-size:11px;color:#9ca3af;margin-top:32px;">iurbanas.com</p>
      </div>
    `,
  }).catch(() => {})

  revalidatePath('/admin/corredores')
}

export async function revokeAgent(formData: FormData) {
  const agentProfileId = formData.get('agentProfileId') as string
  const supabase = await createAdminClient()

  const { data: profile } = await supabase
    .from('agent_profiles')
    .select('access')
    .eq('id', agentProfileId)
    .single()

  await supabase
    .from('agent_profiles')
    .update({ access: !profile?.access })
    .eq('id', agentProfileId)

  revalidatePath('/admin/corredores')
}
