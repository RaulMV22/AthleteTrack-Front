"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { GoogleLogin } from "@react-oauth/google"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { register, googleLogin } = useAuth()
  const router = useRouter()

  // Debounced validation function
  const checkUsernameAvailability = useCallback(async (value: string) => {
    if (!value || value.length < 3) {
      return
    }

    setIsCheckingUsername(true)
    try {
      const response = await apiClient.checkUsernameAvailability(value)
      if (!response.available) {
        setUsernameError("Este nombre de usuario ya está en uso")
      } else {
        setUsernameError("")
      }
    } catch (error) {
      console.error("Error checking username:", error)
      // Don't show error to user, just log it
    } finally {
      setIsCheckingUsername(false)
    }
  }, [])

  // Debounce effect
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (username && username.length >= 3) {
        checkUsernameAvailability(username)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timerId)
  }, [username, checkUsernameAvailability])

  const validateUsernameFormat = (value: string) => {
    // Remove @ if user types it
    const cleanValue = value.replace(/^@/, "")

    // Only allow alphanumeric and underscore
    const validFormat = /^[a-zA-Z0-9_]*$/.test(cleanValue)

    if (!validFormat) {
      setUsernameError("Solo letras, números y guiones bajos")
      return false
    }

    if (cleanValue.length > 0 && cleanValue.length < 3) {
      setUsernameError("Mínimo 3 caracteres")
      return false
    }

    if (cleanValue.length > 20) {
      setUsernameError("Máximo 20 caracteres")
      return false
    }

    // Clear format errors - server will check availability
    setUsernameError("")
    return true
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^@/, "")
    setUsername(value)
    // Only validate format, not availability
    validateUsernameFormat(value)
  }

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    setError("")
    setIsLoading(true)
    const success = await googleLogin(credentialResponse.credential)
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Error al registrarse con Google")
      setIsLoading(false)
    }
  }

  const handleGoogleLoginError = () => {
    setError("Error al registrarse con Google")
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    if (!acceptTerms) {
      alert("Debes aceptar los términos y condiciones")
      return
    }

    if (!validateUsernameFormat(username)) {
      return
    }

    setIsLoading(true)

    const result = await register(email, password, name, username)

    if (result.success) {
      router.push("/dashboard")
    } else {
      alert(result.error || "Error al crear la cuenta")
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="space-y-1 p-4 sm:p-6">
        <CardTitle className="text-xl font-bold sm:text-2xl">Crear Cuenta</CardTitle>
        <CardDescription className="text-sm">Elige tu método de registro preferido</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            text="signup_with"
            locale="es"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">O regístrate con email</span>
          </div>
        </div>

        <form onSubmit={handleEmailRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">
              Nombre completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-11 bg-secondary/50 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm">
              Nombre de usuario
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <Input
                id="username"
                type="text"
                placeholder="maria123"
                value={username}
                onChange={handleUsernameChange}
                required
                className={`h-11 bg-secondary/50 pl-7 text-base ${usernameError ? "border-red-500" : ""}`}
              />
            </div>
            {usernameError && <p className="text-xs text-red-500">{usernameError}</p>}
            {isCheckingUsername && <p className="text-xs text-muted-foreground">Verificando disponibilidad...</p>}
            {!usernameError && !isCheckingUsername && username && username.length >= 3 && <p className="text-xs text-green-500">Nombre de usuario disponible</p>}
          </div>

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
            <Label htmlFor="password" className="text-sm">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="h-11 bg-secondary/50 text-base"
            />
            <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm">
              Confirmar contraseña
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="h-11 bg-secondary/50 text-base"
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              className="mt-1"
            />
            <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
              Acepto los{" "}
              <Button variant="link" className="h-auto p-0 text-sm text-primary" type="button">
                términos y condiciones
              </Button>{" "}
              y la{" "}
              <Button variant="link" className="h-auto p-0 text-sm text-primary" type="button">
                política de privacidad
              </Button>
            </Label>
          </div>

          <Button type="submit" className="h-11 w-full bg-primary text-base hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
