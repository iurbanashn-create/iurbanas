"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const schema = z.object({
  name:    z.string().min(2, "Mínimo 2 caracteres").max(100),
  contact: z.string().min(5, "Ingresa un email o WhatsApp válido").max(200),
  message: z.string().min(10, "Mínimo 10 caracteres").max(2000),
})

type FormData = z.infer<typeof schema>

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle")

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus("ok")
      reset()
    } catch {
      setStatus("error")
    }
  }

  if (status === "ok") {
    return (
      <div className="border border-border rounded-2xl p-10 text-center space-y-3">
        <p className="text-2xl">✓</p>
        <p className="font-semibold">¡Mensaje enviado!</p>
        <p className="text-sm text-muted-foreground">Nos pondremos en contacto contigo pronto.</p>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs text-primary hover:underline mt-2"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Nombre</label>
        <input
          {...register("name")}
          type="text"
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Tu nombre"
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Email o WhatsApp</label>
        <input
          {...register("contact")}
          type="text"
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="tu@correo.com o +504..."
        />
        {errors.contact && <p className="text-xs text-destructive">{errors.contact.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Mensaje</label>
        <textarea
          {...register("message")}
          rows={5}
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y"
          placeholder="¿En qué podemos ayudarte?"
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>

      {status === "error" && (
        <p className="text-xs text-destructive text-center">
          Hubo un error al enviar. Intenta de nuevo o escríbenos por WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Enviando…" : "Enviar mensaje"}
      </button>

      <p className="text-xs text-muted-foreground text-center">
        También puedes escribirnos directamente por WhatsApp para una respuesta más rápida.
      </p>
    </form>
  )
}
