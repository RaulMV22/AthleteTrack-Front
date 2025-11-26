import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { PageTransition } from "@/components/page-transition"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { WorkoutsProvider } from "@/contexts/workouts-context"
import { EventsProvider } from "@/contexts/events-context"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <WorkoutsProvider>
            <EventsProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <PageTransition>{children}</PageTransition>
              </Suspense>
            </EventsProvider>
          </WorkoutsProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
