// Sistema de autenticación mock con usuarios predefinidos

export interface Usuario {
  id: string
  email: string
  password: string
  nombre: string
  nombreUsuario: string
  rol: "admin" | "usuario"
  avatar?: string
  estadisticas?: {
    entrenamientosTotales: number
    eventosTotales: number
    distanciaTotal: number
    tiempoTotal: number
  }
}

// Usuarios mock predefinidos
export const USUARIOS_MOCK: Usuario[] = [
  {
    id: "1",
    email: "admin@fittrack.com",
    password: "Admin123!",
    nombre: "Admin FitTrack",
    nombreUsuario: "admin",
    rol: "admin",
    avatar: "/admin-avatar.png",
    estadisticas: {
      entrenamientosTotales: 156,
      eventosTotales: 12,
      distanciaTotal: 2450,
      tiempoTotal: 18900,
    },
  },
  {
    id: "2",
    email: "carlos@example.com",
    password: "Carlos123!",
    nombre: "Carlos Rodríguez",
    nombreUsuario: "carlos_runner",
    rol: "usuario",
    avatar: "/male-athlete.png",
    estadisticas: {
      entrenamientosTotales: 89,
      eventosTotales: 5,
      distanciaTotal: 1230,
      tiempoTotal: 9450,
    },
  },
  {
    id: "3",
    email: "maria@example.com",
    password: "Maria123!",
    nombre: "María González",
    nombreUsuario: "maria123",
    rol: "admin",
    avatar: "/athlete-female.jpg",
    estadisticas: {
      entrenamientosTotales: 124,
      eventosTotales: 8,
      distanciaTotal: 1890,
      tiempoTotal: 14200,
    },
  },
]

export function autenticarUsuario(email: string, password: string): Usuario | null {
  const usuario = USUARIOS_MOCK.find((u) => u.email === email && u.password === password)
  return usuario || null
}

export function obtenerUsuarioPorId(id: string): Usuario | null {
  return USUARIOS_MOCK.find((u) => u.id === id) || null
}

export function nombreUsuarioDisponible(nombreUsuario: string): boolean {
  return !USUARIOS_MOCK.some((u) => u.nombreUsuario.toLowerCase() === nombreUsuario.toLowerCase())
}

export function registrarUsuario(
  email: string,
  password: string,
  nombre: string,
  nombreUsuario: string,
): { exito: boolean; usuario?: Usuario; error?: string } {
  // Verificar si el email ya existe
  if (USUARIOS_MOCK.some((u) => u.email === email)) {
    return { exito: false, error: "El email ya está registrado" }
  }

  // Verificar si el nombre de usuario ya existe
  if (!nombreUsuarioDisponible(nombreUsuario)) {
    return { exito: false, error: "El nombre de usuario ya está en uso" }
  }

  // Crear nuevo usuario
  const nuevoUsuario: Usuario = {
    id: String(USUARIOS_MOCK.length + 1),
    email,
    password,
    nombre,
    nombreUsuario,
    rol: "usuario",
    estadisticas: {
      entrenamientosTotales: 0,
      eventosTotales: 0,
      distanciaTotal: 0,
      tiempoTotal: 0,
    },
  }

  USUARIOS_MOCK.push(nuevoUsuario)
  return { exito: true, usuario: nuevoUsuario }
}
