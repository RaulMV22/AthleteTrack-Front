"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const events = [
  {
    id: 1,
    title: "Maratón Ciudad 2025",
    date: "ABR 15-16",
    location: "Estadio Nacional",
    participants: 2500,
    image: "/marathon-runners-city.jpg",
    category: "RUNNING",
  },
  {
    id: 2,
    title: "CrossFit Challenge",
    date: "MAY 8-10",
    location: "Centro Deportivo Elite",
    participants: 850,
    image: "/crossfit-competition-athletes.jpg",
    category: "CROSSFIT",
  },
  {
    id: 3,
    title: "Triatlón Costa",
    date: "JUN 2-3",
    location: "Playa del Sol",
    participants: 1200,
    image: "/triathlon-swimming-ocean.jpg",
    category: "TRIATHLON",
  },
]

export function EventsSection() {
  const { user } = useAuth()
  const router = useRouter()

  const handleEventClick = () => {
    if (user) {
      router.push("/dashboard/events")
    } else {
      router.push("/login")
    }
  }

  return (
    <section id="events" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">PRÓXIMOS EVENTOS</h2>
            <p className="text-lg text-muted-foreground">Inscríbete y compite con los mejores atletas</p>
          </div>
          <Button variant="ghost" className="hidden gap-2 md:flex" onClick={handleEventClick}>
            Ver Todos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card
              key={event.id}
              className="group overflow-hidden border-border bg-card transition-all hover:border-primary/50"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 rounded-md bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  {event.category}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{event.participants}</span>
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-bold text-card-foreground">{event.title}</h3>

                <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleEventClick}
                  >
                    Inscribirse
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={handleEventClick}>
                    Detalles
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
