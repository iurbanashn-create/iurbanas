import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  draft: { label: "Borrador", class: "bg-muted text-muted-foreground" },
  pending_review: { label: "En revisión", class: "bg-yellow-100 text-yellow-800" },
  active: { label: "Activa", class: "bg-green-100 text-green-800" },
  sold: { label: "Vendida", class: "bg-blue-100 text-blue-800" },
  archived: { label: "Archivada", class: "bg-muted text-muted-foreground" },
}

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("properties")
    .select("id, title, type, operation, status, city, price, currency, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })

  if (status) query = query.eq("status", status)

  const { data: properties } = await query

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Propiedades</h1>
        <Link
          href="/admin/propiedades/nueva"
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Nueva propiedad
        </Link>
      </div>

      {/* Filtros de estado */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { value: "", label: "Todas" },
          { value: "draft", label: "Borradores" },
          { value: "pending_review", label: "En revisión" },
          { value: "active", label: "Activas" },
          { value: "sold", label: "Vendidas" },
        ].map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/propiedades?status=${f.value}` : "/admin/propiedades"}
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
        {properties && properties.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Propiedad</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Tipo</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Ciudad</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Precio</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => {
                const s = STATUS_LABELS[p.status] ?? STATUS_LABELS.draft
                return (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{p.title}</td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{p.type} · {p.operation}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.city ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {p.currency === "HNL" ? "L" : "$"} {Number(p.price).toLocaleString("es-HN")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.class}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/propiedades/${p.id}`}
                        className="text-xs text-primary hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="px-4 py-12 text-center text-muted-foreground text-sm">
            No hay propiedades{status ? ` con estado "${STATUS_LABELS[status]?.label}"` : ""}.
            {!status && (
              <span>
                {" "}<Link href="/admin/propiedades/nueva" className="text-primary hover:underline">Crea la primera</Link>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
