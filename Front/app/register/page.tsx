"use client"

import { RegisterForm } from "@/components/register-form"
import { GoogleOAuthProvider } from "@react-oauth/google"
import Link from "next/link"

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

export default function RegisterPage() {
  if (!GOOGLE_CLIENT_ID) {
    console.warn("Google Client ID not configured. Google login will not work.")
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-xl font-bold text-primary-foreground">AT</span>
              </div>
              <span className="text-xl font-bold tracking-tight sm:text-2xl">ATHLETETRACK</span>
            </Link>
            <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">Únete a la comunidad</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Crea tu cuenta y comienza a entrenar</p>
          </div>

          <RegisterForm />

          <p className="mt-4 text-center text-sm text-muted-foreground sm:mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}
