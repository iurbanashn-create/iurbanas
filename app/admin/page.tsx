import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalActive },
    { count: totalPending },
    { count: totalSolicitudes },
    { data: recentProperties },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "pending_review"),
    supabase.from("property_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("properties").select("id, title, status, city, price, currency, created_at").order("created_at", { ascending: false }).limit(5),
  ])

  const stats = [
    { label: "Propiedades activas", value: totalActive ?? 0, href: "/admin/propiedades?status=active", color: "bg-green-50 text-green-700" },
    { label: "En revisión", value: totalPending ?? 0, href: "/admin/propiedades?status=pending_review", color: "bg-yellow-50 text-yellow-700" },
    { label: "Solicitudes nuevas", value: totalSolicitudes ?? 0, href: "/admin/solicitudes", color: "bg-blue-50 text-blue-700" },
  ]

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <Link
          href="/admin/propiedades/nueva"
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Nueva propiedad
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="block">
            <div className={`rounded-xl p-4 ${s.color} hover:opacity-80 transition-opacity`}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm font-medium mt-1">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Últimas propiedades */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Últimas propiedades
        </h2>
        <div className="bg-background border border-border rounded-xl overflow-hidden">
          {recentProperties && recentProperties.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Propiedad</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Ciudad</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Precio</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentProperties.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/propiedades/${p.id}`} className="font-medium text-foreground hover:underline">
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.city ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {p.currency === "HNL" ? "L" : "$"}{" "}
                      {Number(p.price).toLocaleString("es-HN")}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              No hay propiedades aún.{" "}
              <Link href="/admin/propiedades/nueva" className="text-primary hover:underline">
                Crea la primera
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    draft: { label: "Borrador", class: "bg-muted text-muted-foreground" },
    pending_review: { label: "En revisión", class: "bg-yellow-100 text-yellow-800" },
    active: { label: "Activa", class: "bg-green-100 text-green-800" },
    sold: { label: "Vendida", class: "bg-blue-100 text-blue-800" },
    archived: { label: "Archivada", class: "bg-muted text-muted-foreground" },
  }
  const s = map[status] ?? { label: status, class: "bg-muted text-muted-foreground" }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.class}`}>
      {s.label}
    </span>
  )
}
