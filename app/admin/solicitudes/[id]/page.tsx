import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { updateSubmissionStatus, approveAndCreateProperty } from "@/lib/actions/submissions"

const FIELD_LABELS: Record<string, string> = {
  contact_name: "Nombre",
  contact_email: "Email",
  contact_phone: "Teléfono",
  property_type: "Tipo de propiedad",
  operation: "Operación",
  price: "Precio solicitado",
  currency: "Moneda",
  city: "Ciudad",
  sector: "Sector",
  address: "Dirección",
  bedrooms: "Habitaciones",
  bathrooms: "Baños",
  area_m2: "Área (m²)",
  parking: "Parqueos",
  description: "Descripción",
}

export default async function SolicitudDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: sub } = await supabase
    .from("property_submissions")
    .select("*")
    .eq("id", id)
    .single()

  if (!sub) notFound()

  const isPending = sub.status === "pending" || sub.status === "reviewing"

  const approve = approveAndCreateProperty.bind(null, id)
  const reject = async () => {
    "use server"
    await updateSubmissionStatus(id, "rejected")
  }
  const setReviewing = async () => {
    "use server"
    await updateSubmissionStatus(id, "reviewing")
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/solicitudes" className="text-muted-foreground hover:text-foreground text-sm">
          ← Solicitudes
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-xl font-semibold">{sub.contact_name}</h1>
        <StatusBadge status={sub.status} />
      </div>

      {/* Datos de la solicitud */}
      <div className="bg-background border border-border rounded-xl divide-y divide-border">
        {Object.entries(FIELD_LABELS).map(([key, label]) => {
          const val = sub[key as keyof typeof sub]
          if (val === null || val === undefined || val === "") return null
          return (
            <div key={key} className="px-4 py-3 grid grid-cols-3 gap-4">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-sm text-foreground col-span-2 break-words">{String(val)}</span>
            </div>
          )
        })}
      </div>

      {/* Notas del admin */}
      {sub.admin_notes && (
        <div className="mt-4 bg-muted/30 border border-border rounded-xl p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Notas internas</p>
          <p className="text-sm">{sub.admin_notes}</p>
        </div>
      )}

      {/* Acciones */}
      {isPending && (
        <div className="mt-6 flex gap-3">
          <form action={approve}>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Aprobar y crear propiedad
            </button>
          </form>
          {sub.status === "pending" && (
            <form action={setReviewing}>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Marcar en revisión
              </button>
            </form>
          )}
          <form action={reject}>
            <button
              type="submit"
              className="px-4 py-2 border border-destructive text-destructive text-sm font-medium rounded-lg hover:bg-destructive/10 transition-colors"
            >
              Rechazar
            </button>
          </form>
        </div>
      )}

      {sub.property_id && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-800 font-medium">Propiedad creada desde esta solicitud</p>
          <Link
            href={`/admin/propiedades/${sub.property_id}`}
            className="text-sm text-green-700 hover:underline"
          >
            Ver propiedad →
          </Link>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    pending: { label: "Pendiente", class: "bg-yellow-100 text-yellow-800" },
    reviewing: { label: "En revisión", class: "bg-blue-100 text-blue-800" },
    approved: { label: "Aprobada", class: "bg-green-100 text-green-800" },
    rejected: { label: "Rechazada", class: "bg-red-100 text-red-800" },
  }
  const s = map[status] ?? { label: status, class: "bg-muted text-muted-foreground" }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.class}`}>
      {s.label}
    </span>
  )
}
