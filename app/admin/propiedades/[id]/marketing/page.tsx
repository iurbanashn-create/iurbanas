import { notFound } from "next/navigation"
import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/server"
import { GenerateMarketingButton } from "./generate-button"
import { CopyButton } from "./copy-button"

export default async function MarketingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createAdminClient()

  const [{ data: property }, { data: assets }] = await Promise.all([
    supabase.from("properties").select("id, title, status").eq("id", id).single(),
    supabase
      .from("marketing_assets")
      .select("id, asset_type, content, created_at")
      .eq("property_id", id)
      .order("created_at", { ascending: false }),
  ])

  if (!property) notFound()

  const ASSET_LABELS: Record<string, string> = {
    instagram_post: "Instagram",
    facebook_post: "Facebook",
    whatsapp_message: "WhatsApp",
    blog_article: "Artículo de blog",
    video_script: "Script de video",
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/admin/propiedades/${id}`} className="text-muted-foreground hover:text-foreground text-sm">
          ← {property.title}
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-xl font-semibold">Marketing digital</h1>
      </div>

      <GenerateMarketingButton propertyId={id} />

      {assets && assets.length > 0 ? (
        <div className="mt-6 space-y-4">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-background border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {ASSET_LABELS[asset.asset_type] ?? asset.asset_type}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {new Date(asset.created_at).toLocaleDateString("es-HN")}
                  </span>
                  <CopyButton text={asset.content} />
                </div>
              </div>
              <div className="p-4">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                  {asset.content}
                </pre>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground text-sm">
          No hay insumos generados aún. Haz clic en &quot;Generar&quot; para crear el contenido de marketing.
        </div>
      )}
    </div>
  )
}
