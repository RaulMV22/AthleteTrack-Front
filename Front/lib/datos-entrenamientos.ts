// Sistema de gestión de entrenamientos mock

export interface Ejercicio {
  id: number
  ejercicio: string
  series?: string
  repeticiones?: string
  peso?: string
  unidadPeso: "kg" | "km"
  tiempo?: string
}

export interface Entrenamiento {
  id: number
  usuarioId: string
  fecha: string
  ejercicios: Ejercicio[]
  notas?: string
  creadoEn: string
  actualizadoEn: string
}

// Datos de entrenamientos mock
export const ENTRENAMIENTOS_MOCK: Entrenamiento[] = [
  {
    id: 1,
    usuarioId: "2",
    fecha: "2025-01-06",
    ejercicios: [
      {
        id: 1,
        ejercicio: "Sentadillas",
        series: "4",
        repeticiones: "10",
        peso: "80",
        unidadPeso: "kg",
        tiempo: "45",
      },
      {
        id: 2,
        ejercicio: "Press de Banca",
        series: "3",
        repeticiones: "12",
        peso: "60",
        unidadPeso: "kg",
        tiempo: "30",
      },
    ],
    notas: "Buena sesión de fuerza, aumentar peso la próxima vez",
    creadoEn: "2025-01-06T10:00:00Z",
    actualizadoEn: "2025-01-06T11:30:00Z",
  },
  {
    id: 2,
    usuarioId: "2",
    fecha: "2025-01-05",
    ejercicios: [
      {
        id: 3,
        ejercicio: "Carrera",
        peso: "10",
        unidadPeso: "km",
        tiempo: "60",
      },
      {
        id: 4,
        ejercicio: "Dominadas",
        series: "5",
        repeticiones: "8",
        unidadPeso: "kg",
        tiempo: "20",
      },
    ],
    notas: "Ritmo constante, buen tiempo",
    creadoEn: "2025-01-05T09:00:00Z",
    actualizadoEn: "2025-01-05T10:30:00Z",
  },
  {
    id: 3,
    usuarioId: "2",
    fecha: "2025-01-07",
    ejercicios: [
      {
        id: 5,
        ejercicio: "Sentadillas",
        series: "3",
        repeticiones: "12",
        peso: "70",
        unidadPeso: "kg",
        tiempo: "30",
      },
      {
        id: 6,
        ejercicio: "Press militar",
        series: "2",
        repeticiones: "10",
        peso: "40",
        unidadPeso: "kg",
        tiempo: "20",
      },
    ],
    creadoEn: "2025-01-07T08:00:00Z",
    actualizadoEn: "2025-01-07T08:45:00Z",
  },
]

let siguienteEntrenamientoId = 4
let siguienteEjercicioId = 7

export function obtenerEntrenamientosPorUsuarioId(usuarioId: string): Entrenamiento[] {
  return ENTRENAMIENTOS_MOCK.filter((e) => e.usuarioId === usuarioId)
}

export function crearEntrenamiento(usuarioId: string, ejercicios: Ejercicio[], notas?: string): Entrenamiento {
  const nuevoEntrenamiento: Entrenamiento = {
    id: siguienteEntrenamientoId++,
    usuarioId,
    fecha: new Date().toISOString().split("T")[0],
    ejercicios,
    notas,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  }
  ENTRENAMIENTOS_MOCK.push(nuevoEntrenamiento)
  return nuevoEntrenamiento
}

export function actualizarEntrenamiento(id: number, datos: Partial<Entrenamiento>): Entrenamiento | null {
  const indice = ENTRENAMIENTOS_MOCK.findIndex((e) => e.id === id)
  if (indice === -1) return null

  ENTRENAMIENTOS_MOCK[indice] = {
    ...ENTRENAMIENTOS_MOCK[indice],
    ...datos,
    actualizadoEn: new Date().toISOString(),
  }
  return ENTRENAMIENTOS_MOCK[indice]
}

export function eliminarEntrenamiento(id: number): boolean {
  const indice = ENTRENAMIENTOS_MOCK.findIndex((e) => e.id === id)
  if (indice === -1) return false

  ENTRENAMIENTOS_MOCK.splice(indice, 1)
  return true
}
