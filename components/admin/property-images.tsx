"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface PropertyImage {
  id: string
  url: string
  storage_path: string
  sort_order: number
  is_cover: boolean
}

interface Props {
  propertyId: string
  initialImages: PropertyImage[]
}

export function PropertyImages({ propertyId, initialImages }: Props) {
  const [images, setImages] = useState<PropertyImage[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    setUploading(true)
    const supabase = createClient()

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} supera 10 MB`)
        continue
      }

      const ext = file.name.split(".").pop()
      const path = `${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: storageError } = await supabase.storage
        .from("property-images")
        .upload(path, file, { upsert: false })

      if (storageError) {
        toast.error(`Error subiendo ${file.name}: ${storageError.message}`)
        continue
      }

      const { data: urlData } = supabase.storage
        .from("property-images")
        .getPublicUrl(path)

      const isFirst = images.length === 0

      const { data: imgRow, error: dbError } = await supabase
        .from("property_images")
        .insert({
          property_id: propertyId,
          storage_path: path,
          url: urlData.publicUrl,
          sort_order: images.length,
          is_cover: isFirst,
        })
        .select("id, url, storage_path, sort_order, is_cover")
        .single()

      if (dbError) {
        toast.error(`Error guardando ${file.name}`)
        continue
      }

      setImages((prev) => [...prev, imgRow])
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ""
    toast.success("Fotos subidas correctamente")
  }

  async function handleSetCover(imageId: string) {
    const supabase = createClient()

    await supabase
      .from("property_images")
      .update({ is_cover: false })
      .eq("property_id", propertyId)

    await supabase
      .from("property_images")
      .update({ is_cover: true })
      .eq("id", imageId)

    setImages((prev) =>
      prev.map((img) => ({ ...img, is_cover: img.id === imageId }))
    )
    toast.success("Foto de portada actualizada")
  }

  async function handleDelete(imageId: string, storagePath: string) {
    const supabase = createClient()

    await supabase.storage.from("property-images").remove([storagePath])
    await supabase.from("property_images").delete().eq("id", imageId)

    setImages((prev) => prev.filter((img) => img.id !== imageId))
    toast.success("Foto eliminada")
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Fotografías</h2>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {uploading ? "Subiendo..." : "+ Agregar fotos"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {images.length === 0 ? (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-border rounded-xl p-10 text-center text-muted-foreground text-sm hover:border-primary/40 hover:bg-muted/30 transition-colors disabled:opacity-50"
        >
          <p className="text-2xl mb-2">📷</p>
          <p>Haz clic para subir fotos</p>
          <p className="text-xs mt-1">JPG, PNG, WEBP · máx. 10 MB por foto</p>
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden border border-border aspect-[4/3]">
              <Image
                src={img.url}
                alt="Foto de propiedad"
                fill
                className="object-cover"
                sizes="200px"
              />

              {/* Portada badge */}
              {img.is_cover && (
                <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 bg-[#0E3B2E] text-[#D4AF37] rounded uppercase tracking-wide">
                  Portada
                </span>
              )}

              {/* Acciones al hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.is_cover && (
                  <button
                    onClick={() => handleSetCover(img.id)}
                    className="px-2.5 py-1.5 bg-[#D4AF37] text-[#0E3B2E] text-[11px] font-semibold rounded-lg hover:bg-[#c49d2a] transition-colors"
                  >
                    Portada
                  </button>
                )}
                <button
                  onClick={() => handleDelete(img.id, img.storage_path)}
                  className="px-2.5 py-1.5 bg-red-600 text-white text-[11px] font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          {/* Botón agregar más */}
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-[4/3] border-2 border-dashed border-border rounded-xl flex items-center justify-center text-muted-foreground text-sm hover:border-primary/40 hover:bg-muted/30 transition-colors disabled:opacity-50"
          >
            <span className="text-2xl">+</span>
          </button>
        </div>
      )}
    </div>
  )
}
