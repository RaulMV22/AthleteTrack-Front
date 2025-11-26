"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { apiClient } from "@/lib/api-client"

export interface User {
  id: string
  email: string
  name: string
  username: string
  role: "ADMIN" | "USER"
  avatar?: string
  stats?: {
    totalWorkouts: number
    totalEvents: number
    totalDistance: number
    totalTime: number
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (
    email: string,
    password: string,
    name: string,
    username: string,
  ) => Promise<{ success: boolean; error?: string }>
  googleLogin: (idToken: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: { name?: string; email?: string; avatar?: string }) => Promise<{ success: boolean; error?: string }>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Solo verificar autenticación si hay un token guardado
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
        if (!token) {
          setIsLoading(false)
          return
        }

        const userData = await apiClient.getMe()
        setUser(userData)
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        // Si falla la verificación, limpiar el token inválido
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken')
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const { user: userData } = await apiClient.login(email, password)
      setUser(userData)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Error en login:', error)
      setIsLoading(false)
      return false
    }
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    username: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const { user: userData } = await apiClient.register(email, password, name, username)
      setUser(userData)
      setIsLoading(false)
      return { success: true }
    } catch (error: any) {
      setIsLoading(false)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    apiClient.clearToken()
    router.push("/")
  }

  const googleLogin = async (idToken: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const { user: userData } = await apiClient.googleLogin(idToken)
      setUser(userData)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Error en Google login:', error)
      setIsLoading(false)
      return false
    }
  }

  const updateProfile = async (data: { name?: string; email?: string; avatar?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const updatedUser = await apiClient.updateProfile(data)
      setUser(updatedUser)
      return { success: true }
    } catch (error: any) {
      console.error('Error actualizando perfil:', error)
      return { success: false, error: error.message || 'Error al actualizar el perfil' }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        googleLogin,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
