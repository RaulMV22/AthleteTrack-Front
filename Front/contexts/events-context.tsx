"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "./auth-context"

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
  description: string
}

interface EventsContextType {
  events: Event[]
  userRegistrations: number[]
  registerForEvent: (eventId: number) => Promise<void>
  unregisterFromEvent: (eventId: number) => Promise<void>
  isRegistered: (eventId: number) => boolean
  refreshEvents: () => Promise<void>
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

export function EventsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [userRegistrations, setUserRegistrations] = useState<number[]>([])

  const refreshEvents = async () => {
    try {
      const allEvents = await apiClient.getEvents()
      setEvents(allEvents)

      if (user) {
        const registrations = await apiClient.getUserEventRegistrations(parseInt(user.id))
        setUserRegistrations(registrations)
      }
    } catch (error) {
      console.error("[v0] Error refreshing events:", error)
    }
  }

  useEffect(() => {
    refreshEvents()
  }, [user])

  const registerForEvent = async (eventId: number) => {
    if (!user) return

    try {
      await apiClient.registerForEvent(eventId)
      await refreshEvents()
    } catch (error) {
      console.error("[v0] Error registering for event:", error)
      throw error
    }
  }

  const unregisterFromEvent = async (eventId: number) => {
    if (!user) return

    try {
      await apiClient.unregisterFromEvent(eventId)
      await refreshEvents()
    } catch (error) {
      console.error("[v0] Error unregistering from event:", error)
      throw error
    }
  }

  const isRegistered = (eventId: number): boolean => {
    return userRegistrations.includes(eventId)
  }

  return (
    <EventsContext.Provider
      value={{
        events,
        userRegistrations,
        registerForEvent,
        unregisterFromEvent,
        isRegistered,
        refreshEvents,
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventsContext)
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider")
  }
  return context
}
