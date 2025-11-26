"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  obtenerEntrenamientosPorUsuarioId,
  crearEntrenamiento as crearEntrenamientoMock,
  actualizarEntrenamiento as actualizarEntrenamientoMock,
  eliminarEntrenamiento as eliminarEntrenamientoMock,
  type Entrenamiento,
  type Ejercicio,
} from "@/lib/datos-entrenamientos"
import { useAutenticacion } from "./contexto-autenticacion"

interface ContextoEntrenamientosType {
  entrenamientos: Entrenamiento[]
  crearEntrenamiento: (ejercicios: Ejercicio[], notas?: string) => Entrenamiento
  actualizarEntrenamiento: (id: number, datos: Partial<Entrenamiento>) => void
  eliminarEntrenamiento: (id: number) => void
  actualizarEntrenamientos: () => void
}

const ContextoEntrenamientos = createContext<ContextoEntrenamientosType | undefined>(undefined)

export function ProveedorEntrenamientos({ children }: { children: ReactNode }) {
  const { usuario } = useAutenticacion()
  const [entrenamientos, setEntrenamientos] = useState<Entrenamiento[]>([])

  const actualizarEntrenamientos = () => {
    if (usuario) {
      const entrenamientosUsuario = obtenerEntrenamientosPorUsuarioId(usuario.id)
      setEntrenamientos(entrenamientosUsuario)
    }
  }

  useEffect(() => {
    actualizarEntrenamientos()
  }, [usuario])

  const crearEntrenamiento = (ejercicios: Ejercicio[], notas?: string): Entrenamiento => {
    if (!usuario) throw new Error("Usuario no autenticado")
    const nuevoEntrenamiento = crearEntrenamientoMock(usuario.id, ejercicios, notas)
    actualizarEntrenamientos()
    return nuevoEntrenamiento
  }

  const actualizarEntrenamiento = (id: number, datos: Partial<Entrenamiento>) => {
    actualizarEntrenamientoMock(id, datos)
    actualizarEntrenamientos()
  }

  const eliminarEntrenamiento = (id: number) => {
    eliminarEntrenamientoMock(id)
    actualizarEntrenamientos()
  }

  return (
    <ContextoEntrenamientos.Provider
      value={{
        entrenamientos,
        crearEntrenamiento,
        actualizarEntrenamiento,
        eliminarEntrenamiento,
        actualizarEntrenamientos,
      }}
    >
      {children}
    </ContextoEntrenamientos.Provider>
  )
}

export function useEntrenamientos() {
  const contexto = useContext(ContextoEntrenamientos)
  if (contexto === undefined) {
    throw new Error("useEntrenamientos debe usarse dentro de un ProveedorEntrenamientos")
  }
  return contexto
}
