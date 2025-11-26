"use client"

import type React from "react"

import { useState } from "react"
import { GoogleLogin } from "@react-oauth/google"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, googleLogin, isLoading } = useAuth()
  const router = useRouter()

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    setError("")
    const success = await googleLogin(credentialResponse.credential)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Error al iniciar sesión con Google")
    }
  }

  const handleGoogleLoginError = () => {
    setError("Error al iniciar sesión con Google")
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)

    if (success) {
      router.push("/dashboard")
    } else {
      setError("Email o contraseña incorrectos")
    }
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="space-y-1 p-4 sm:p-6">
        <CardTitle className="text-xl font-bold sm:text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription className="text-sm">Elige tu método de inicio de sesión preferido</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            text="signin"
            locale="es"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">O continúa con email</span>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 bg-secondary/50 text-base"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm">
                Contraseña
              </Label>
              <Button variant="link" className="h-auto p-0 text-xs text-primary" type="button">
                ¿Olvidaste tu contraseña?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 bg-secondary/50 text-base"
            />
          </div>

          <Button type="submit" className="h-11 w-full bg-primary text-base hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
