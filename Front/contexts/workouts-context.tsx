"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "./auth-context"

export interface Exercise {
  id?: number
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

interface WorkoutsContextType {
  workouts: Workout[]
  createWorkout: (exercises: Exercise[], notes?: string) => Promise<Workout>
  deleteWorkout: (id: number) => Promise<void>
  refreshWorkouts: () => Promise<void>
}

const WorkoutsContext = createContext<WorkoutsContextType | undefined>(undefined)

export function WorkoutsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState<Workout[]>([])

  const refreshWorkouts = async () => {
    if (!user) return
    
    try {
      const userWorkouts = await apiClient.getWorkouts(parseInt(user.id))
      setWorkouts(userWorkouts)
    } catch (error) {
      console.error("[v0] Error refreshing workouts:", error)
    }
  }

  useEffect(() => {
    refreshWorkouts()
  }, [user])

  const createWorkout = async (exercises: Exercise[], notes?: string): Promise<Workout> => {
    if (!user) throw new Error("User not authenticated")
    
    try {
      const newWorkout = await apiClient.createWorkout({
        userId: parseInt(user.id),
        date: new Date().toISOString().split('T')[0],
        exercises,
        notes,
      })
      await refreshWorkouts()
      return newWorkout
    } catch (error) {
      console.error("[v0] Error creating workout:", error)
      throw error
    }
  }

  const deleteWorkout = async (id: number) => {
    try {
      await apiClient.deleteWorkout(id)
      await refreshWorkouts()
    } catch (error) {
      console.error("[v0] Error deleting workout:", error)
      throw error
    }
  }

  return (
    <WorkoutsContext.Provider
      value={{
        workouts,
        createWorkout,
        deleteWorkout,
        refreshWorkouts,
      }}
    >
      {children}
    </WorkoutsContext.Provider>
  )
}

export function useWorkouts() {
  const context = useContext(WorkoutsContext)
  if (context === undefined) {
    throw new Error("useWorkouts must be used within a WorkoutsProvider")
  }
  return context
}
