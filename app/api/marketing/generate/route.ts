import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createAdminClient } from "@/lib/supabase/server"

const ASSET_TYPES = [
  "instagram_post",
  "facebook_post",
  "whatsapp_message",
  "blog_article",
  "video_script",
] as const

const PROMPTS: Record<typeof ASSET_TYPES[number], string> = {
  instagram_post: `Escribe un post atractivo para Instagram (máx. 300 caracteres) con emojis relevantes y 5 hashtags. Resalta los puntos más atractivos de la propiedad. Tono: aspiracional, cercano.`,
  facebook_post: `Escribe un post para Facebook (máx. 500 caracteres) más detallado que Instagram. Incluye los detalles clave (precio, ubicación, características). Llama a contactar para más información. Sin hashtags excesivos.`,
  whatsapp_message: `Escribe un mensaje de WhatsApp conciso y persuasivo (máx. 200 caracteres). Menciona el tipo, ubicación y precio. Termina con una llamada a la acción para agendar visita. Informal pero profesional.`,
  blog_article: `Escribe un artículo de blog de 3 párrafos (400-600 palabras) sobre esta propiedad para el sitio web de Inversiones Urbanas Inmobiliarias. Párrafo 1: presentación y ubicación. Párrafo 2: características y ventajas. Párrafo 3: oportunidad de inversión y llamada a la acción.`,
  video_script: `Escribe un guión de video corto (60-90 segundos de lectura) para presentar esta propiedad en redes sociales. Incluye: apertura llamativa (5 seg), presentación de ubicación (15 seg), características principales (30 seg), precio y cierre (10 seg). Usa [PAUSA] para indicar pausas dramáticas.`,
}

export async function POST(request: NextRequest) {
  try {
    const { propertyId } = await request.json()
    if (!propertyId) {
      return NextResponse.json({ error: "propertyId requerido" }, { status: 400 })
    }

    const supabase = await createAdminClient()

    const { data: property, error: propError } = await supabase
      .from("properties")
      .select("title, description, type, operation, price, currency, city, sector, bedrooms, bathrooms, area_m2")
      .eq("id", propertyId)
      .single()

    if (propError || !property) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY no configurada" }, { status: 503 })
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const propertyContext = `
Propiedad: ${property.title}
Tipo: ${property.type} en ${property.operation}
Precio: ${property.currency === "HNL" ? "L" : "$"} ${Number(property.price).toLocaleString("es-HN")}
Ciudad: ${property.city}${property.sector ? `, ${property.sector}` : ""}
${property.bedrooms ? `Habitaciones: ${property.bedrooms}` : ""}
${property.bathrooms ? `Baños: ${property.bathrooms}` : ""}
${property.area_m2 ? `Área: ${property.area_m2} m²` : ""}
${property.description ? `Descripción: ${property.description}` : ""}
Empresa: Inversiones Urbanas Inmobiliarias (IUI), Honduras
    `.trim()

    const generatedAssets: { property_id: string; type: string; asset_type: string; content: string }[] = []

    for (const assetType of ASSET_TYPES) {
      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Eres el equipo de marketing digital de Inversiones Urbanas Inmobiliarias (IUI), Honduras. Crea contenido de marketing en español para la siguiente propiedad.\n\n${propertyContext}\n\nTarea: ${PROMPTS[assetType]}`,
          },
        ],
      })

      const content = message.content[0].type === "text" ? message.content[0].text : ""
      generatedAssets.push({ property_id: propertyId, type: assetType, asset_type: assetType, content })
    }

    // Eliminar los anteriores y guardar los nuevos
    await supabase.from("marketing_assets").delete().eq("property_id", propertyId)
    const { error: insertError } = await supabase.from("marketing_assets").insert(generatedAssets)

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: generatedAssets.length })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
