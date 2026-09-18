import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  pending: { label: "Pendiente", class: "bg-yellow-100 text-yellow-800" },
  reviewing: { label: "En revisión", class: "bg-blue-100 text-blue-800" },
  approved: { label: "Aprobada", class: "bg-green-100 text-green-800" },
  rejected: { label: "Rechazada", class: "bg-red-100 text-red-800" },
}

export default async function SolicitudesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("property_submissions")
    .select("id, contact_name, contact_email, contact_phone, property_type, operation, city, status, created_at")
    .order("created_at", { ascending: false })

  if (status) query = query.eq("status", status)

  const { data: submissions } = await query

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Solicitudes de propietarios</h1>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { value: "", label: "Todas" },
          { value: "pending", label: "Pendientes" },
          { value: "reviewing", label: "En revisión" },
          { value: "approved", label: "Aprobadas" },
          { value: "rejected", label: "Rechazadas" },
        ].map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/solicitudes?status=${f.value}` : "/admin/solicitudes"}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              (status ?? "") === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-foreground"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        {submissions && submissions.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Contacto</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Propiedad</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Ciudad</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Fecha</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => {
                const st = STATUS_LABELS[s.status] ?? STATUS_LABELS.pending
                return (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{s.contact_name}</p>
                      <p className="text-xs text-muted-foreground">{s.contact_email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">
                      {s.property_type} · {s.operation}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.city ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(s.created_at).toLocaleDateString("es-HN")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${st.class}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/solicitudes/${s.id}`}
                        className="text-xs text-primary hover:underline"
                      >
                        Revisar
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="px-4 py-12 text-center text-muted-foreground text-sm">
            No hay solicitudes{status ? ` con estado "${STATUS_LABELS[status]?.label}"` : ""} aún.
          </div>
        )}
      </div>
    </div>
  )
}
