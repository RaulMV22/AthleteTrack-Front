// Mock workouts management system

export interface Exercise {
  id: number
  exercise: string
  sets?: string
  reps?: string
  weight?: string
  weightUnit: "kg" | "km"
  time?: string
}

export interface Workout {
  id: number
  userId: string
  date: string
  exercises: Exercise[]
  notes?: string
  createdAt: string
  updatedAt: string
}

// Mock workouts data
export const MOCK_WORKOUTS: Workout[] = [
  {
    id: 1,
    userId: "2",
    date: "2025-01-06",
    exercises: [
      {
        id: 1,
        exercise: "Sentadillas",
        sets: "4",
        reps: "10",
        weight: "80",
        weightUnit: "kg",
        time: "45",
      },
      {
        id: 2,
        exercise: "Press de Banca",
        sets: "3",
        reps: "12",
        weight: "60",
        weightUnit: "kg",
        time: "30",
      },
    ],
    notes: "Buena sesión de fuerza, aumentar peso la próxima vez",
    createdAt: "2025-01-06T10:00:00Z",
    updatedAt: "2025-01-06T11:30:00Z",
  },
  {
    id: 2,
    userId: "2",
    date: "2025-01-05",
    exercises: [
      {
        id: 3,
        exercise: "Carrera",
        weight: "10",
        weightUnit: "km",
        time: "60",
      },
      {
        id: 4,
        exercise: "Dominadas",
        sets: "5",
        reps: "8",
        weightUnit: "kg",
        time: "20",
      },
    ],
    notes: "Ritmo constante, buen tiempo",
    createdAt: "2025-01-05T09:00:00Z",
    updatedAt: "2025-01-05T10:30:00Z",
  },
  {
    id: 3,
    userId: "2",
    date: "2025-01-07",
    exercises: [
      {
        id: 5,
        exercise: "Sentadillas",
        sets: "3",
        reps: "12",
        weight: "70",
        weightUnit: "kg",
        time: "30",
      },
      {
        id: 6,
        exercise: "Press militar",
        sets: "2",
        reps: "10",
        weight: "40",
        weightUnit: "kg",
        time: "20",
      },
    ],
    createdAt: "2025-01-07T08:00:00Z",
    updatedAt: "2025-01-07T08:45:00Z",
  },
]

let nextWorkoutId = 4
let nextExerciseId = 7

export function getWorkoutsByUserId(userId: string): Workout[] {
  return MOCK_WORKOUTS.filter((w) => w.userId === userId)
}

export function createWorkout(userId: string, exercises: Exercise[], notes?: string): Workout {
  const newWorkout: Workout = {
    id: nextWorkoutId++,
    userId,
    date: new Date().toISOString().split("T")[0],
    exercises,
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  MOCK_WORKOUTS.push(newWorkout)
  return newWorkout
}

export function updateWorkout(id: number, data: Partial<Workout>): Workout | null {
  const index = MOCK_WORKOUTS.findIndex((w) => w.id === id)
  if (index === -1) return null

  MOCK_WORKOUTS[index] = {
    ...MOCK_WORKOUTS[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  return MOCK_WORKOUTS[index]
}

export function deleteWorkout(id: number): boolean {
  const index = MOCK_WORKOUTS.findIndex((w) => w.id === id)
  if (index === -1) return false

  MOCK_WORKOUTS.splice(index, 1)
  return true
}
