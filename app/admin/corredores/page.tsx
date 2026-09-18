import { createClient } from '@/lib/supabase/server'
import { inviteAgent, revokeAgent } from '@/lib/actions/invite-agent'

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  pending:  { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-700' },
  invited:  { label: 'Invitado',  class: 'bg-blue-100 text-blue-700' },
  active:   { label: 'Activo',    class: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rechazado', class: 'bg-red-100 text-red-700' },
}

export default async function AdminCorredoresPage() {
  const supabase = await createClient()

  const [{ data: registrations }, { data: activeAgents }] = await Promise.all([
    supabase
      .from('agent_registrations')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('agent_profiles')
      .select('id, full_name, phone, business_name, access, invited_at, users(email)')
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Red de Corredores</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gestiona solicitudes y accesos activos</p>
      </div>

      {/* Solicitudes pendientes */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Solicitudes de acceso
          {registrations?.filter(r => r.status === 'pending').length ? (
            <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
              {registrations.filter(r => r.status === 'pending').length} nuevas
            </span>
          ) : null}
        </h2>

        {!registrations || registrations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
            Sin solicitudes aún.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Corredor</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Contacto</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Ciudad</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Fecha</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registrations.map((r) => {
                  const st = STATUS_MAP[r.status] ?? STATUS_MAP.pending
                  return (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{r.full_name}</p>
                        {r.business_name && <p className="text-xs text-gray-400">{r.business_name}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-600">{r.email}</p>
                        <p className="text-xs text-gray-400">{r.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{r.city ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(r.created_at).toLocaleDateString('es-HN')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${st.class}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {r.status === 'pending' && (
                          <form action={inviteAgent}>
                            <input type="hidden" name="registrationId" value={r.id} />
                            <input type="hidden" name="email"          value={r.email} />
                            <input type="hidden" name="fullName"       value={r.full_name} />
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-[#0E3B2E] text-white text-xs font-semibold rounded-lg hover:bg-[#1F5D3A] transition-colors"
                            >
                              Invitar →
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Corredores activos */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Corredores con acceso</h2>

        {!activeAgents || activeAgents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
            Sin corredores activos aún.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Corredor</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Teléfono</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Invitado</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Acceso</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeAgents.map((a) => {
                  const userRecord = Array.isArray(a.users) ? a.users[0] : a.users
                  return (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{a.full_name}</p>
                        {a.business_name && <p className="text-xs text-gray-400">{a.business_name}</p>}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{(userRecord as { email?: string } | null)?.email ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{a.phone ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {a.invited_at ? new Date(a.invited_at).toLocaleDateString('es-HN') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${a.access ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {a.access ? 'Activo' : 'Suspendido'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <form action={revokeAgent}>
                          <input type="hidden" name="agentProfileId" value={a.id} />
                          <button
                            type="submit"
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                              a.access
                                ? 'border-red-200 text-red-600 hover:bg-red-50'
                                : 'border-green-200 text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {a.access ? 'Suspender' : 'Reactivar'}
                          </button>
                        </form>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
