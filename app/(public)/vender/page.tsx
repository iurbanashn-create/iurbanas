import type { Metadata } from "next"
import { SubmissionForm } from "./submission-form"

export const metadata: Metadata = {
  title: "Publicar propiedad",
  description: "Registra tu propiedad con IUI Inmobiliaria. Te contactamos para revisarla y publicarla.",
}

export default function VenderPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Publica tu propiedad</h1>
        <p className="text-muted-foreground">
          Completa el formulario. Nuestro equipo revisará la información, se pondrá en contacto contigo
          y publicará la propiedad con contenido de marketing digital incluido.
        </p>
      </div>

      <div className="border border-border rounded-2xl p-8 bg-background">
        <SubmissionForm />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm">
        {[
          { step: "1", text: "Completas el formulario" },
          { step: "2", text: "Revisamos y te contactamos" },
          { step: "3", text: "Publicamos con marketing incluido" },
        ].map((s) => (
          <div key={s.step} className="border border-border rounded-xl p-4">
            <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-2">
              {s.step}
            </div>
            <p className="text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
