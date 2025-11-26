"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { NumberInput } from "@/components/number-input"
import { Dumbbell, Timer, Activity, Plus, Trash2, Calendar, Save, Weight, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react'
import { useWorkouts } from "@/contexts/workouts-context"
import type { Exercise } from "@/lib/mock-workouts"

export default function WorkoutsPage() {
  const { workouts, createWorkout, deleteWorkout } = useWorkouts()

  const [currentExercises, setCurrentExercises] = useState<Exercise[]>([])
  const [exercise, setExercise] = useState("")
  const [sets, setSets] = useState("")
  const [reps, setReps] = useState("")
  const [weight, setWeight] = useState("")
  const [weightUnit, setWeightUnit] = useState<"kg" | "km">("kg")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")

  const [timerSeconds, setTimerSeconds] = useState(0)
  const [initialTimerSeconds, setInitialTimerSeconds] = useState(60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

  const startTimer = () => {
    if (isTimerRunning) return
    if (timerSeconds === 0) {
      setTimerSeconds(initialTimerSeconds)
    }
    setIsTimerRunning(true)
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsTimerRunning(false)
          // Sonido de finalización (opcional)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    setTimerInterval(interval)
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
    setTimerSeconds(initialTimerSeconds)
  }

  const increaseTime = () => {
    if (!isTimerRunning) {
      const newTime = initialTimerSeconds + 10
      setInitialTimerSeconds(newTime)
      setTimerSeconds(newTime)
    }
  }

  const decreaseTime = () => {
    if (!isTimerRunning && initialTimerSeconds > 10) {
      const newTime = initialTimerSeconds - 10
      setInitialTimerSeconds(newTime)
      setTimerSeconds(newTime)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAddExercise = () => {
    if (!exercise) return

    const newExercise: Exercise = {
      id: Date.now(),
      exercise,
      sets: sets || undefined,
      reps: reps || undefined,
      weight: weight || undefined,
      weightUnit,
      time: time || undefined,
    }

    setCurrentExercises([...currentExercises, newExercise])
    setExercise("")
    setSets("")
    setReps("")
    setWeight("")
    setWeightUnit("kg")
    setTime("")
  }

  const handleRemoveExercise = (id: number) => {
    setCurrentExercises(currentExercises.filter((e) => e.id !== id))
  }

  const handleSaveWorkout = () => {
    if (currentExercises.length === 0) return

    createWorkout(currentExercises, notes)
    setCurrentExercises([])
    setNotes("")
    resetTimer()
  }

  const groupedWorkouts = workouts.reduce(
    (acc, workout) => {
      if (!acc[workout.date]) {
        acc[workout.date] = []
      }
      acc[workout.date].push(workout)
      return acc
    },
    {} as Record<string, typeof workouts>,
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Hoy"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer"
    } else {
      return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
    }
  }

  const totalWorkouts = workouts.length
  const totalWeight = workouts.reduce(
    (sum, w) =>
      sum +
      w.exercises.reduce((s, e) => (e.weightUnit === "kg" ? s + (Number.parseFloat(e.weight || "0") || 0) : s), 0),
    0,
  )
  const totalTime = workouts.reduce(
    (sum, w) => sum + w.exercises.reduce((s, e) => s + (Number.parseFloat(e.time || "0") || 0), 0),
    0,
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-center gap-4">
            <Timer className="h-5 w-5 text-primary" />
            
            {!isTimerRunning && (
              <div className="flex flex-col items-center">
                <Button
                  onClick={increaseTime}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <div className="text-2xl font-bold tabular-nums">
                  {formatTime(timerSeconds || initialTimerSeconds)}
                </div>
                <Button
                  onClick={decreaseTime}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  disabled={initialTimerSeconds <= 10}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}

            {isTimerRunning && (
              <div className="text-2xl font-bold tabular-nums">
                {formatTime(timerSeconds)}
              </div>
            )}

            <div className="flex gap-2">
              {!isTimerRunning ? (
                <Button onClick={startTimer} size="sm" className="gap-2">
                  <Play className="h-4 w-4" />
                  Iniciar
                </Button>
              ) : (
                <Button onClick={pauseTimer} size="sm" variant="outline" className="gap-2">
                  <Pause className="h-4 w-4" />
                  Pausar
                </Button>
              )}
              <Button onClick={resetTimer} size="sm" variant="ghost">
                Reiniciar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Mis Entrenamientos</h1>
          <p className="text-lg text-muted-foreground">Registra y sigue el progreso de tus entrenamientos</p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Entrenamientos</p>
                <p className="text-3xl font-bold">{totalWorkouts}</p>
              </div>
              <Activity className="h-10 w-10 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Peso Total</p>
                <p className="text-3xl font-bold">{totalWeight.toFixed(0)} kg</p>
              </div>
              <Dumbbell className="h-10 w-10 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tiempo Total</p>
                <p className="text-3xl font-bold">{(totalTime / 60).toFixed(1)} hrs</p>
              </div>
              <Timer className="h-10 w-10 text-primary" />
            </div>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6">
              <h2 className="mb-6 text-2xl font-bold">Nuevo Entrenamiento</h2>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="exercise" className="mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Ejercicio *
                  </Label>
                  <Input
                    id="exercise"
                    placeholder="Ej: Sentadillas, Carrera..."
                    value={exercise}
                    onChange={(e) => setExercise(e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="sets" className="mb-3 block">
                      Series
                    </Label>
                    <NumberInput value={sets} onChange={setSets} min={1} max={20} placeholder="0" />
                  </div>

                  <div>
                    <Label htmlFor="reps" className="mb-3 block">
                      Repeticiones
                    </Label>
                    <NumberInput value={reps} onChange={setReps} min={1} max={100} placeholder="0" />
                  </div>
                </div>

                <div>
                  <Label className="mb-3 flex items-center gap-2">
                    <Weight className="h-4 w-4 text-primary" />
                    Unidad de medida
                  </Label>
                  <RadioGroup value={weightUnit} onValueChange={(value) => setWeightUnit(value as "kg" | "km")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="kg" id="kg" />
                      <Label htmlFor="kg" className="cursor-pointer font-normal">
                        Kilogramos (kg) - Para pesas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="km" id="km" />
                      <Label htmlFor="km" className="cursor-pointer font-normal">
                        Kilómetros (km) - Para distancia
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="weight" className="mb-3 flex items-center gap-2">
                      {weightUnit === "kg" ? (
                        <Dumbbell className="h-4 w-4 text-primary" />
                      ) : (
                        <Activity className="h-4 w-4 text-primary" />
                      )}
                      {weightUnit === "kg" ? "Peso (kg)" : "Distancia (km)"}
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="time" className="mb-3 flex items-center gap-2">
                      <Timer className="h-4 w-4 text-primary" />
                      Tiempo (min) - Opcional
                    </Label>
                    <Input
                      id="time"
                      type="number"
                      placeholder="0"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  className="w-full gap-2 bg-transparent"
                  onClick={handleAddExercise}
                  variant="outline"
                  disabled={!exercise}
                >
                  <Plus className="h-4 w-4" />
                  Añadir Ejercicio
                </Button>

                {currentExercises.length > 0 && (
                  <div className="space-y-2">
                    <Label className="mb-3 block">Ejercicios añadidos ({currentExercises.length})</Label>
                    <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-2">
                      {currentExercises.map((ex) => (
                        <div key={ex.id} className="flex items-center justify-between rounded bg-muted p-2 text-sm">
                          <div>
                            <p className="font-medium">{ex.exercise}</p>
                            <p className="text-xs text-muted-foreground">
                              {ex.sets && ex.reps && `${ex.sets}x${ex.reps} • `}
                              {ex.weight && `${ex.weight}${ex.weightUnit}`}
                              {ex.time && ` • ${ex.time}min`}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleRemoveExercise(ex.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="notes" className="mb-3 block">
                    Notas del Entrenamiento
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Añade notas generales sobre tu entrenamiento..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button className="w-full gap-2" onClick={handleSaveWorkout} disabled={currentExercises.length === 0}>
                  <Save className="h-4 w-4" />
                  Guardar Entrenamiento ({currentExercises.length} ejercicios)
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <h2 className="mb-6 text-2xl font-bold">Historial de Entrenamientos</h2>

            {Object.keys(groupedWorkouts).length === 0 ? (
              <Card className="p-12 text-center">
                <Activity className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-bold">No hay entrenamientos registrados</h3>
                <p className="text-muted-foreground">Comienza a registrar tus entrenamientos para ver tu progreso</p>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedWorkouts)
                  .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                  .map(([date, dayWorkouts]) => (
                    <div key={date}>
                      <div className="mb-3 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-bold">{formatDate(date)}</h3>
                        <Badge variant="outline" className="ml-2">
                          {dayWorkouts.length} entrenamientos
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {dayWorkouts.map((workout) => (
                          <Card key={workout.id} className="p-4 transition-all hover:border-primary/50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="mb-3 flex items-center gap-2">
                                  <h4 className="text-lg font-bold">Entrenamiento</h4>
                                  <Badge variant="secondary">{workout.exercises.length} ejercicios</Badge>
                                </div>

                                <div className="space-y-2">
                                  {workout.exercises.map((ex) => (
                                    <div key={ex.id} className="rounded-md bg-muted/50 p-3">
                                      <p className="mb-1 font-medium">{ex.exercise}</p>
                                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                        {ex.sets && ex.reps && (
                                          <div className="flex items-center gap-1">
                                            <Activity className="h-3 w-3" />
                                            <span>
                                              {ex.sets}x{ex.reps}
                                            </span>
                                          </div>
                                        )}
                                        {ex.weight && (
                                          <div className="flex items-center gap-1">
                                            {ex.weightUnit === "kg" ? (
                                              <Dumbbell className="h-3 w-3" />
                                            ) : (
                                              <Activity className="h-3 w-3" />
                                            )}
                                            <span>
                                              {ex.weight} {ex.weightUnit}
                                            </span>
                                          </div>
                                        )}
                                        {ex.time && (
                                          <div className="flex items-center gap-1">
                                            <Timer className="h-3 w-3" />
                                            <span>{ex.time} min</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {workout.notes && (
                                  <p className="mt-3 text-sm italic text-muted-foreground">{workout.notes}</p>
                                )}
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => deleteWorkout(workout.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
