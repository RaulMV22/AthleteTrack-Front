// Mock events management system

export interface Event {
  id: number
  title: string
  date: string
  dateDisplay: string
  location: string
  participants: number
  maxParticipants: number
  image: string
  category: string
  distance: string
  difficulty: string
  description?: string
  registered?: boolean
}

// Mock events data
export const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: "Maratón Ciudad 2025",
    date: "2025-04-15",
    dateDisplay: "15 ABR 2025",
    location: "Estadio Nacional",
    participants: 2500,
    maxParticipants: 3000,
    image: "/marathon-runners-city.jpg",
    category: "RUNNING",
    distance: "42.2 km",
    difficulty: "Avanzado",
    description: "Maratón oficial de la ciudad con recorrido por los principales monumentos",
    registered: false,
  },
  {
    id: 2,
    title: "CrossFit Challenge",
    date: "2025-05-08",
    dateDisplay: "8 MAY 2025",
    location: "Centro Deportivo Elite",
    participants: 850,
    maxParticipants: 1000,
    image: "/crossfit-competition-athletes.jpg",
    category: "CROSSFIT",
    distance: "N/A",
    difficulty: "Intermedio",
    description: "Competición de CrossFit con múltiples categorías",
    registered: true,
  },
  {
    id: 3,
    title: "Triatlón Costa",
    date: "2025-06-02",
    dateDisplay: "2 JUN 2025",
    location: "Playa del Sol",
    participants: 1200,
    maxParticipants: 1500,
    image: "/triathlon-swimming-ocean.jpg",
    category: "TRIATHLON",
    distance: "Sprint",
    difficulty: "Avanzado",
    description: "Triatlón sprint en la costa con natación, ciclismo y carrera",
    registered: false,
  },
  {
    id: 4,
    title: "5K Nocturna",
    date: "2025-04-22",
    dateDisplay: "22 ABR 2025",
    location: "Parque Central",
    participants: 1800,
    maxParticipants: 2000,
    image: "/night-running-event.png",
    category: "RUNNING",
    distance: "5 km",
    difficulty: "Principiante",
    description: "Carrera nocturna de 5km por el parque central",
    registered: false,
  },
  {
    id: 5,
    title: "Ciclismo de Montaña",
    date: "2025-05-15",
    dateDisplay: "15 MAY 2025",
    location: "Sierra Norte",
    participants: 450,
    maxParticipants: 500,
    image: "/mountain-biking-competition.jpg",
    category: "CYCLING",
    distance: "60 km",
    difficulty: "Avanzado",
    description: "Ruta de ciclismo de montaña por terreno técnico",
    registered: false,
  },
  {
    id: 6,
    title: "Natación Open Water",
    date: "2025-07-10",
    dateDisplay: "10 JUL 2025",
    location: "Lago Azul",
    participants: 320,
    maxParticipants: 400,
    image: "/open-water-swimming.jpg",
    category: "SWIMMING",
    distance: "2 km",
    difficulty: "Intermedio",
    description: "Natación en aguas abiertas en el lago azul",
    registered: false,
  },
]

let nextId = 7

export function getAllEvents(): Event[] {
  return [...MOCK_EVENTS]
}

export function getEventById(id: number): Event | undefined {
  return MOCK_EVENTS.find((event) => event.id === id)
}

export function createEvent(eventData: Omit<Event, "id" | "participants" | "registered">): Event {
  const newEvent: Event = {
    ...eventData,
    id: nextId++,
    participants: 0,
    registered: false,
  }
  MOCK_EVENTS.push(newEvent)
  return newEvent
}

export function updateEvent(id: number, eventData: Partial<Event>): Event | null {
  const index = MOCK_EVENTS.findIndex((event) => event.id === id)
  if (index === -1) return null

  MOCK_EVENTS[index] = { ...MOCK_EVENTS[index], ...eventData }
  return MOCK_EVENTS[index]
}

export function deleteEvent(id: number): boolean {
  const index = MOCK_EVENTS.findIndex((event) => event.id === id)
  if (index === -1) return false

  MOCK_EVENTS.splice(index, 1)
  return true
}
