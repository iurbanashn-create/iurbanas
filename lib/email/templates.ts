const BASE_STYLE = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #1a1a1a;
  max-width: 560px;
  margin: 0 auto;
  padding: 32px 24px;
`

const HEADER = `
  <div style="text-align:center; margin-bottom:32px; padding-bottom:24px; border-bottom:2px solid #0E3B2E;">
    <p style="font-size:18px; font-weight:700; color:#0E3B2E; margin:0; letter-spacing:0.05em;">
      INVERSIONES URBANAS
    </p>
    <p style="font-size:11px; color:#D4AF37; margin:4px 0 0; letter-spacing:0.2em; text-transform:uppercase;">
      Inmobiliaria · Honduras
    </p>
  </div>
`

const FOOTER = `
  <div style="margin-top:40px; padding-top:20px; border-top:1px solid #e5e7eb; text-align:center;">
    <p style="font-size:11px; color:#9ca3af; margin:0;">
      © ${new Date().getFullYear()} Inversiones Urbanas Inmobiliarias · San Pedro Sula, Honduras
    </p>
    <p style="font-size:11px; color:#9ca3af; margin:4px 0 0;">
      <a href="https://iurbanas.com" style="color:#0E3B2E; text-decoration:none;">iurbanas.com</a>
    </p>
  </div>
`

export interface SubmissionData {
  contact_name: string
  contact_email?: string | null
  contact_phone?: string | null
  property_type: string
  operation: string
  city?: string | null
  sector?: string | null
  price?: number | null
  currency?: string | null
  bedrooms?: number | null
  bathrooms?: number | null
  area_m2?: number | null
  description?: string | null
}

export function propietarioConfirmacionEmail(data: SubmissionData): string {
  return `
    <div style="${BASE_STYLE}">
      ${HEADER}
      <h1 style="font-size:20px; font-weight:700; color:#0E3B2E; margin:0 0 8px;">
        ¡Recibimos tu solicitud!
      </h1>
      <p style="font-size:15px; color:#4b5563; margin:0 0 24px;">
        Hola <strong>${data.contact_name}</strong>, hemos recibido la información de tu propiedad.
        Un asesor de Inversiones Urbanas la revisará y te contactará en las próximas
        <strong style="color:#0E3B2E;">24 horas</strong>.
      </p>

      <div style="background:#f9fafb; border-radius:12px; padding:20px; margin-bottom:24px;">
        <p style="font-size:12px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.08em; margin:0 0 12px;">
          Resumen de tu solicitud
        </p>
        ${row('Tipo', `${capitalize(data.property_type)} · ${capitalize(data.operation)}`)}
        ${data.city ? row('Ciudad', data.city + (data.sector ? `, ${data.sector}` : '')) : ''}
        ${data.price ? row('Precio', `${data.currency === 'USD' ? '$' : 'L'} ${Number(data.price).toLocaleString('es-HN')}`) : ''}
        ${data.bedrooms ? row('Habitaciones', String(data.bedrooms)) : ''}
        ${data.area_m2 ? row('Área', `${data.area_m2} m²`) : ''}
      </div>

      <div style="background:#0E3B2E; border-radius:12px; padding:20px; margin-bottom:24px;">
        <p style="font-size:14px; font-weight:600; color:#D4AF37; margin:0 0 8px;">¿Qué sigue?</p>
        <ol style="font-size:13px; color:#d1fae5; margin:0; padding-left:18px; line-height:1.8;">
          <li>Te llamamos para validar la propiedad</li>
          <li>Firmamos autorización de venta</li>
          <li>Realizamos sesión fotográfica profesional</li>
          <li>Publicamos en iurbanas.com y redes sociales</li>
        </ol>
      </div>

      <p style="font-size:13px; color:#6b7280; margin:0;">
        Si tienes dudas, escríbenos a
        <a href="mailto:acalix@iurbanas.com" style="color:#0E3B2E; font-weight:600;">acalix@iurbanas.com</a>
        o contáctanos por WhatsApp.
      </p>
      ${FOOTER}
    </div>
  `
}

export function iuiAlertaNuevaSolicitudEmail(data: SubmissionData): string {
  return `
    <div style="${BASE_STYLE}">
      ${HEADER}
      <div style="background:#fef3c7; border:1px solid #f59e0b; border-radius:12px; padding:16px; margin-bottom:24px;">
        <p style="font-size:14px; font-weight:700; color:#92400e; margin:0;">
          🏠 Nueva solicitud de propiedad recibida
        </p>
      </div>

      <div style="background:#f9fafb; border-radius:12px; padding:20px; margin-bottom:24px;">
        <p style="font-size:12px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.08em; margin:0 0 12px;">
          Datos del propietario
        </p>
        ${row('Nombre', data.contact_name)}
        ${data.contact_phone ? row('Teléfono / WhatsApp', data.contact_phone) : ''}
        ${data.contact_email ? row('Email', data.contact_email) : ''}
      </div>

      <div style="background:#f9fafb; border-radius:12px; padding:20px; margin-bottom:24px;">
        <p style="font-size:12px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.08em; margin:0 0 12px;">
          Datos de la propiedad
        </p>
        ${row('Tipo', `${capitalize(data.property_type)} · ${capitalize(data.operation)}`)}
        ${data.city ? row('Ciudad', data.city + (data.sector ? `, ${data.sector}` : '')) : ''}
        ${data.price ? row('Precio', `${data.currency === 'USD' ? '$' : 'L'} ${Number(data.price).toLocaleString('es-HN')}`) : ''}
        ${data.bedrooms ? row('Habitaciones', String(data.bedrooms)) : ''}
        ${data.bathrooms ? row('Baños', String(data.bathrooms)) : ''}
        ${data.area_m2 ? row('Área', `${data.area_m2} m²`) : ''}
        ${data.description ? row('Descripción', data.description) : ''}
      </div>

      <a
        href="https://iurbanas.com/admin/solicitudes"
        style="display:inline-block; padding:12px 24px; background:#0E3B2E; color:#fff; font-size:14px; font-weight:600; border-radius:10px; text-decoration:none;"
      >
        Ver en el panel admin →
      </a>

      ${FOOTER}
    </div>
  `
}

function row(label: string, value: string): string {
  return `
    <div style="display:flex; padding:6px 0; border-bottom:1px solid #e5e7eb;">
      <span style="font-size:12px; color:#9ca3af; width:120px; flex-shrink:0;">${label}</span>
      <span style="font-size:13px; color:#111827; flex:1;">${value}</span>
    </div>
  `
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ') : s
}
