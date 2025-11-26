// Sistema de gestión de eventos mock

export interface Evento {
  id: number
  titulo: string
  fecha: string
  fechaMostrar: string
  ubicacion: string
  participantes: number
  maxParticipantes: number
  imagen: string
  categoria: string
  distancia: string
  dificultad: string
  descripcion?: string
  inscrito?: boolean
}

// Datos de eventos mock
export const EVENTOS_MOCK: Evento[] = [
  {
    id: 1,
    titulo: "Maratón Ciudad 2025",
    fecha: "2025-04-15",
    fechaMostrar: "15 ABR 2025",
    ubicacion: "Estadio Nacional",
    participantes: 2500,
    maxParticipantes: 3000,
    imagen: "/marathon-runners-city.jpg",
    categoria: "RUNNING",
    distancia: "42.2 km",
    dificultad: "Avanzado",
    descripcion: "Maratón oficial de la ciudad con recorrido por los principales monumentos",
    inscrito: false,
  },
  {
    id: 2,
    titulo: "CrossFit Challenge",
    fecha: "2025-05-08",
    fechaMostrar: "8 MAY 2025",
    ubicacion: "Centro Deportivo Elite",
    participantes: 850,
    maxParticipantes: 1000,
    imagen: "/crossfit-competition-athletes.jpg",
    categoria: "CROSSFIT",
    distancia: "N/A",
    dificultad: "Intermedio",
    descripcion: "Competición de CrossFit con múltiples categorías",
    inscrito: true,
  },
  {
    id: 3,
    titulo: "Triatlón Costa",
    fecha: "2025-06-02",
    fechaMostrar: "2 JUN 2025",
    ubicacion: "Playa del Sol",
    participantes: 1200,
    maxParticipantes: 1500,
    imagen: "/triathlon-swimming-ocean.jpg",
    categoria: "TRIATHLON",
    distancia: "Sprint",
    dificultad: "Avanzado",
    descripcion: "Triatlón sprint en la costa con natación, ciclismo y carrera",
    inscrito: false,
  },
  {
    id: 4,
    titulo: "5K Nocturna",
    fecha: "2025-04-22",
    fechaMostrar: "22 ABR 2025",
    ubicacion: "Parque Central",
    participantes: 1800,
    maxParticipantes: 2000,
    imagen: "/night-running-event.png",
    categoria: "RUNNING",
    distancia: "5 km",
    dificultad: "Principiante",
    descripcion: "Carrera nocturna de 5km por el parque central",
    inscrito: false,
  },
  {
    id: 5,
    titulo: "Ciclismo de Montaña",
    fecha: "2025-05-15",
    fechaMostrar: "15 MAY 2025",
    ubicacion: "Sierra Norte",
    participantes: 450,
    maxParticipantes: 500,
    imagen: "/mountain-biking-competition.jpg",
    categoria: "CYCLING",
    distancia: "60 km",
    dificultad: "Avanzado",
    descripcion: "Ruta de ciclismo de montaña por terreno técnico",
    inscrito: false,
  },
  {
    id: 6,
    titulo: "Natación Open Water",
    fecha: "2025-07-10",
    fechaMostrar: "10 JUL 2025",
    ubicacion: "Lago Azul",
    participantes: 320,
    maxParticipantes: 400,
    imagen: "/open-water-swimming.jpg",
    categoria: "SWIMMING",
    distancia: "2 km",
    dificultad: "Intermedio",
    descripcion: "Natación en aguas abiertas en el lago azul",
    inscrito: false,
  },
]

let siguienteId = 7

export function obtenerTodosEventos(): Evento[] {
  return [...EVENTOS_MOCK]
}

export function obtenerEventoPorId(id: number): Evento | undefined {
  return EVENTOS_MOCK.find((evento) => evento.id === id)
}

export function crearEvento(datosEvento: Omit<Evento, "id" | "participantes" | "inscrito">): Evento {
  const nuevoEvento: Evento = {
    ...datosEvento,
    id: siguienteId++,
    participantes: 0,
    inscrito: false,
  }
  EVENTOS_MOCK.push(nuevoEvento)
  return nuevoEvento
}

export function actualizarEvento(id: number, datosEvento: Partial<Evento>): Evento | null {
  const indice = EVENTOS_MOCK.findIndex((evento) => evento.id === id)
  if (indice === -1) return null

  EVENTOS_MOCK[indice] = { ...EVENTOS_MOCK[indice], ...datosEvento }
  return EVENTOS_MOCK[indice]
}

export function eliminarEvento(id: number): boolean {
  const indice = EVENTOS_MOCK.findIndex((evento) => evento.id === id)
  if (indice === -1) return false

  EVENTOS_MOCK.splice(indice, 1)
  return true
}
