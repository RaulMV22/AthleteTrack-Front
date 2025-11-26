"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dumbbell, Timer, TrendingUp, Activity } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function QuickLogSection() {
  const [exercise, setExercise] = useState("")
  const [weight, setWeight] = useState("")
  const [time, setTime] = useState("")
  const { user } = useAuth()
  const router = useRouter()

  const handleSaveWorkout = () => {
    if (user) {
      router.push("/dashboard/workouts")
    } else {
      router.push("/login")
    }
  }

  return (
    <section id="workouts" className="bg-secondary/20 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">REGISTRA TU ENTRENAMIENTO</h2>
            <p className="text-lg text-muted-foreground">Lleva el control de cada ejercicio, tiempo y peso levantado</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border bg-card p-6">
              <h3 className="mb-6 text-xl font-bold text-card-foreground">Registro Rápido</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="exercise" className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Activity className="h-4 w-4 text-primary" />
                    Ejercicio
                  </Label>
                  <Input
                    id="exercise"
                    placeholder="Ej: Sentadillas, Carrera, Press de banca..."
                    value={exercise}
                    onChange={(e) => setExercise(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="weight" className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Dumbbell className="h-4 w-4 text-primary" />
                      Peso (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="0"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="bg-background"
                    />
                  </div>

                  <div>
                    <Label htmlFor="time" className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Timer className="h-4 w-4 text-primary" />
                      Tiempo (min)
                    </Label>
                    <Input
                      id="time"
                      type="number"
                      placeholder="0"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleSaveWorkout}
                >
                  Guardar Entrenamiento
                </Button>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Entrenamientos esta semana</p>
                    <p className="text-3xl font-bold text-card-foreground">12</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Peso total levantado</p>
                    <p className="text-3xl font-bold text-card-foreground">2,450 kg</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tiempo total</p>
                    <p className="text-3xl font-bold text-card-foreground">8.5 hrs</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                    <Timer className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
