"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { autenticarUsuario, registrarUsuario, type Usuario } from "@/lib/datos-autenticacion"

interface ContextoAutenticacionType {
  usuario: Usuario | null
  iniciarSesion: (email: string, password: string) => Promise<{ exito: boolean; error?: string }>
  cerrarSesion: () => void
  registrarse: (
    email: string,
    password: string,
    nombre: string,
    nombreUsuario: string,
  ) => Promise<{ exito: boolean; error?: string }>
  estaAutenticado: boolean
}

const ContextoAutenticacion = createContext<ContextoAutenticacionType | undefined>(undefined)

export function ProveedorAutenticacion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [estaAutenticado, setEstaAutenticado] = useState(false)

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario")
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado))
      setEstaAutenticado(true)
    }
  }, [])

  const iniciarSesion = async (email: string, password: string) => {
    const usuarioAutenticado = autenticarUsuario(email, password)
    if (usuarioAutenticado) {
      setUsuario(usuarioAutenticado)
      setEstaAutenticado(true)
      localStorage.setItem("usuario", JSON.stringify(usuarioAutenticado))
      return { exito: true }
    }
    return { exito: false, error: "Credenciales inválidas" }
  }

  const cerrarSesion = () => {
    setUsuario(null)
    setEstaAutenticado(false)
    localStorage.removeItem("usuario")
  }

  const registrarse = async (email: string, password: string, nombre: string, nombreUsuario: string) => {
    const resultado = registrarUsuario(email, password, nombre, nombreUsuario)
    if (resultado.exito && resultado.usuario) {
      setUsuario(resultado.usuario)
      setEstaAutenticado(true)
      localStorage.setItem("usuario", JSON.stringify(resultado.usuario))
      return { exito: true }
    }
    return { exito: false, error: resultado.error }
  }

  return (
    <ContextoAutenticacion.Provider value={{ usuario, iniciarSesion, cerrarSesion, registrarse, estaAutenticado }}>
      {children}
    </ContextoAutenticacion.Provider>
  )
}

export function useAutenticacion() {
  const contexto = useContext(ContextoAutenticacion)
  if (contexto === undefined) {
    throw new Error("useAutenticacion debe usarse dentro de un ProveedorAutenticacion")
  }
  return contexto
}
