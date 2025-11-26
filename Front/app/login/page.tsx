"use client"

import { LoginForm } from "@/components/login-form"
import { GoogleOAuthProvider } from "@react-oauth/google"
import Link from "next/link"

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

export default function LoginPage() {
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
            <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">Inicia Sesión</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Accede a tu cuenta para continuar tu entrenamiento
            </p>
          </div>

          <LoginForm />

          <p className="mt-4 text-center text-sm text-muted-foreground sm:mt-6">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}
