import { Resend } from 'resend'

export const FROM_ADDRESS = 'Inversiones Urbanas <notificaciones@iurbanas.com>'
export const INTERNAL_EMAIL = 'acalix@iurbanas.com'

let _client: Resend | null = null
export function getResend(): Resend {
  if (!_client) _client = new Resend(process.env.RESEND_API_KEY)
  return _client
}
