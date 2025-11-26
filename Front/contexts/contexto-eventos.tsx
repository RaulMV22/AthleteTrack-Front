"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { obtenerTodosEventos, actualizarEvento, type Evento } from "@/lib/datos-eventos"
import { useAutenticacion } from "./contexto-autenticacion"

interface InscripcionEvento {
  usuarioId: string
  eventoId: number
  inscritoEn: string
}

// Almacenamiento de inscripciones mock
const INSCRIPCIONES_MOCK: InscripcionEvento[] = [
  {
    usuarioId: "2",
    eventoId: 2,
    inscritoEn: "2025-01-01T10:00:00Z",
  },
]

interface ContextoEventosType {
  eventos: Evento[]
  inscripcionesUsuario: number[]
  inscribirseEvento: (eventoId: number) => void
  desinscribirseEvento: (eventoId: number) => void
  estaInscrito: (eventoId: number) => boolean
  actualizarEventos: () => void
}

const ContextoEventos = createContext<ContextoEventosType | undefined>(undefined)

export function ProveedorEventos({ children }: { children: ReactNode }) {
  const { usuario } = useAutenticacion()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [inscripcionesUsuario, setInscripcionesUsuario] = useState<number[]>([])

  const actualizarEventos = () => {
    const todosEventos = obtenerTodosEventos()
    setEventos(todosEventos)

    if (usuario) {
      const inscripciones = INSCRIPCIONES_MOCK.filter((i) => i.usuarioId === usuario.id).map((i) => i.eventoId)
      setInscripcionesUsuario(inscripciones)
    }
  }

  useEffect(() => {
    actualizarEventos()
  }, [usuario])

  const inscribirseEvento = (eventoId: number) => {
    if (!usuario) return

    // Agregar inscripción
    INSCRIPCIONES_MOCK.push({
      usuarioId: usuario.id,
      eventoId,
      inscritoEn: new Date().toISOString(),
    })

    // Incrementar contador de participantes
    const evento = eventos.find((e) => e.id === eventoId)
    if (evento) {
      actualizarEvento(eventoId, { participantes: evento.participantes + 1 })
    }

    actualizarEventos()
  }

  const desinscribirseEvento = (eventoId: number) => {
    if (!usuario) return

    // Eliminar inscripción
    const indice = INSCRIPCIONES_MOCK.findIndex((i) => i.usuarioId === usuario.id && i.eventoId === eventoId)
    if (indice !== -1) {
      INSCRIPCIONES_MOCK.splice(indice, 1)
    }

    // Decrementar contador de participantes
    const evento = eventos.find((e) => e.id === eventoId)
    if (evento && evento.participantes > 0) {
      actualizarEvento(eventoId, { participantes: evento.participantes - 1 })
    }

    actualizarEventos()
  }

  const estaInscrito = (eventoId: number): boolean => {
    return inscripcionesUsuario.includes(eventoId)
  }

  return (
    <ContextoEventos.Provider
      value={{
        eventos,
        inscripcionesUsuario,
        inscribirseEvento,
        desinscribirseEvento,
        estaInscrito,
        actualizarEventos,
      }}
    >
      {children}
    </ContextoEventos.Provider>
  )
}

export function useEventos() {
  const contexto = useContext(ContextoEventos)
  if (contexto === undefined) {
    throw new Error("useEventos debe usarse dentro de un ProveedorEventos")
  }
  return contexto
}
