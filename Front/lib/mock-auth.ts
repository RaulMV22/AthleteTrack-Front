// Mock authentication system with predefined users

export interface User {
  id: string
  email: string
  password: string
  name: string
  username: string
  role: "admin" | "user"
  avatar?: string
  stats?: {
    totalWorkouts: number
    totalEvents: number
    totalDistance: number
    totalTime: number
  }
}

// Predefined mock users
export const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@fittrack.com",
    password: "Admin123!",
    name: "Admin FitTrack",
    username: "admin",
    role: "admin",
    avatar: "/admin-avatar.png",
    stats: {
      totalWorkouts: 156,
      totalEvents: 12,
      totalDistance: 2450,
      totalTime: 18900,
    },
  },
  {
    id: "2",
    email: "carlos@example.com",
    password: "Carlos123!",
    name: "Carlos Rodríguez",
    username: "carlos_runner",
    role: "user",
    avatar: "/male-athlete.png",
    stats: {
      totalWorkouts: 89,
      totalEvents: 5,
      totalDistance: 1230,
      totalTime: 9450,
    },
  },
  {
    id: "3",
    email: "maria@example.com",
    password: "Maria123!",
    name: "María González",
    username: "maria123",
    role: "admin",
    avatar: "/athlete-female.jpg",
    stats: {
      totalWorkouts: 124,
      totalEvents: 8,
      totalDistance: 1890,
      totalTime: 14200,
    },
  },
]

export function authenticateUser(email: string, password: string): User | null {
  const user = MOCK_USERS.find((u) => u.email === email && u.password === password)
  return user || null
}

export function getUserById(id: string): User | null {
  return MOCK_USERS.find((u) => u.id === id) || null
}

export function isUsernameAvailable(username: string): boolean {
  return !MOCK_USERS.some((u) => u.username.toLowerCase() === username.toLowerCase())
}

export function registerUser(
  email: string,
  password: string,
  name: string,
  username: string,
): { success: boolean; user?: User; error?: string } {
  // Check if email already exists
  if (MOCK_USERS.some((u) => u.email === email)) {
    return { success: false, error: "El email ya está registrado" }
  }

  // Check if username already exists
  if (!isUsernameAvailable(username)) {
    return { success: false, error: "El nombre de usuario ya está en uso" }
  }

  // Create new user
  const newUser: User = {
    id: String(MOCK_USERS.length + 1),
    email,
    password,
    name,
    username,
    role: "user",
    stats: {
      totalWorkouts: 0,
      totalEvents: 0,
      totalDistance: 0,
      totalTime: 0,
    },
  }

  MOCK_USERS.push(newUser)
  return { success: true, user: newUser }
}
