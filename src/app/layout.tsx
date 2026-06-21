import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "LATENT OS — The Self-Driving Startup",
  description: "AI-native operating system for startups. Built on Notion. Powered by AI.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  )
}
