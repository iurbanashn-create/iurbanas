import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

// Sirve los análisis estratégicos publicados desde el Gestor Lex
// Intelligence (sector Construcción e Inmobiliario). El HTML ya viene
// renderizado — este handler solo lo lee de disco y lo devuelve tal cual,
// mismo espíritu que /pulso-urbano-n01 y n02, pero sin necesitar una
// entrada nueva en next.config.ts por cada análisis nuevo.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Slug inválido" }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), "public", "analisis", `${slug}.html`)

  try {
    const html = await readFile(filePath, "utf8")
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  } catch {
    return NextResponse.json({ error: "Análisis no encontrado" }, { status: 404 })
  }
}
