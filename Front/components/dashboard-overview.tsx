"use client"

import { useAuth } from "@/contexts/auth-context"
import { useWorkouts } from "@/contexts/workouts-context"
import { useEvents } from "@/contexts/events-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Calendar, TrendingUp, Trophy, Plus, Clock, Dumbbell } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useEffect } from "react"

export function DashboardOverview() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { workouts } = useWorkouts()
  const { userRegistrations } = useEvents()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const totalWorkouts = workouts.length
  const totalExercises = workouts.reduce((sum, w) => sum + w.exercises.length, 0)
  const totalDistance = workouts.reduce(
    (sum, w) =>
      sum +
      w.exercises.reduce((s, e) => (e.weightUnit === "km" ? s + (Number.parseFloat(e.weight || "0") || 0) : s), 0),
    0,
  )
  const totalTime = workouts.reduce(
    (sum, w) => sum + w.exercises.reduce((s, e) => s + (Number.parseFloat(e.time || "0") || 0), 0),
    0,
  )
  const totalEvents = userRegistrations.length

  const recentWorkouts = workouts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Bienvenid@ @{user.username}</h1>
        <p className="text-muted-foreground">Aquí está tu resumen de actividad deportiva</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entrenamientos</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">{totalExercises} ejercicios totales</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Inscritos</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">Próximos desafíos</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distancia Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistance.toFixed(1)} km</div>
            <p className="text-xs text-muted-foreground">Recorridos completados</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalTime / 60).toFixed(1)} hrs</div>
            <p className="text-xs text-muted-foreground">Tiempo entrenando</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Acciones Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50 bg-card transition-all hover:border-primary/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Registrar Entrenamiento</CardTitle>
                  <CardDescription>Añade tu última sesión</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/workouts">
                <Button className="w-full bg-primary hover:bg-primary/90">Registrar Ahora</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card transition-all hover:border-primary/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Inscribirse a Evento</CardTitle>
                  <CardDescription>Encuentra tu próximo desafío</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/events">
                <Button variant="outline" className="w-full border-primary/20 bg-transparent hover:bg-primary/10">
                  Ver Eventos
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card transition-all hover:border-primary/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Ver Estadísticas</CardTitle>
                  <CardDescription>Analiza tu progreso</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/stats">
                <Button variant="outline" className="w-full border-primary/20 bg-transparent hover:bg-primary/10">
                  Ver Estadísticas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">Actividad Reciente</h2>
        <Card className="border-border/50 bg-card">
          <CardContent className="p-6">
            {recentWorkouts.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Activity className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>No hay actividad reciente</p>
                <p className="text-sm">Comienza a entrenar para ver tu progreso aquí</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentWorkouts.map((workout, index) => (
                  <div
                    key={workout.id}
                    className={`flex items-center gap-4 ${index !== recentWorkouts.length - 1 ? "border-b border-border/50 pb-4" : ""}`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Entrenamiento - {workout.exercises.length} ejercicios</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(workout.date).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
