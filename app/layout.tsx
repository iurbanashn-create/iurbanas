import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Inversiones Urbanas Inmobiliarias — Honduras",
    template: "%s | IUI Inmobiliaria",
  },
  description:
    "Las mejores propiedades en Honduras. Casas, apartamentos, terrenos y más en San Pedro Sula, Tegucigalpa y toda la región.",
  keywords: ["inmobiliaria", "honduras", "propiedades", "casas", "apartamentos", "san pedro sula"],
  openGraph: {
    type: "website",
    locale: "es_HN",
    siteName: "Inversiones Urbanas Inmobiliarias",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster richColors />
      </body>
    </html>
  )
}
