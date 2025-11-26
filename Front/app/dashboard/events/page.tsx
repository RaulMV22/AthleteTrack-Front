"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar, MapPin, Users, Search, Filter, Trophy, Clock, Mail, CheckCircle } from "lucide-react"
import { sendEventEmail } from "@/lib/email-service"
import { useEvents } from "@/contexts/events-context"

export default function EventsPage() {
  const { events, userRegistrations, registerForEvent, unregisterFromEvent, isRegistered } = useEvents()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    eventId: number | null
    eventTitle: string
    isRegistering: boolean
  }>({
    open: false,
    eventId: null,
    eventTitle: "",
    isRegistering: true,
  })

  const [emailSent, setEmailSent] = useState(false)

  const categories = ["RUNNING", "CROSSFIT", "TRIATHLON", "CYCLING", "SWIMMING"]

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleRegisterClick = (eventId: number, eventTitle: string) => {
    const isCurrentlyRegistered = isRegistered(eventId)
    setConfirmDialog({
      open: true,
      eventId,
      eventTitle,
      isRegistering: !isCurrentlyRegistered,
    })
  }

  const handleConfirmAction = () => {
    if (!confirmDialog.eventId) return

    const event = events.find((e) => e.id === confirmDialog.eventId)
    if (!event) return

    if (confirmDialog.isRegistering) {
      registerForEvent(confirmDialog.eventId)
      sendEventEmail("registration", event.title, event.date, event.location)
      setEmailSent(true)
      setTimeout(() => setEmailSent(false), 3000)
    } else {
      unregisterFromEvent(confirmDialog.eventId)
    }

    setConfirmDialog({ open: false, eventId: null, eventTitle: "", isRegistering: true })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Eventos Deportivos</h1>
          <p className="text-lg text-muted-foreground">Encuentra y regístrate en los mejores eventos</p>
        </div>

        {emailSent && (
          <Card className="mb-6 border-green-500 bg-green-50 p-4 dark:bg-green-950">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">¡Inscripción confirmada!</p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Te hemos enviado un email de confirmación con todos los detalles del evento.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="flex-shrink-0"
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-bold">Mis Eventos Registrados</h2>
          {userRegistrations.length === 0 ? (
            <Card className="p-8 text-center">
              <Trophy className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No estás registrado en ningún evento todavía</p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events
                .filter((event) => userRegistrations.includes(event.id))
                .map((event) => (
                  <Card key={event.id} className="overflow-hidden border-primary/50">
                    <div className="relative h-40">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                      <Badge className="absolute left-4 top-4 bg-primary">{event.category}</Badge>
                      <Badge className="absolute right-4 top-4 bg-green-600">Registrado</Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 font-bold">{event.title}</h3>
                      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{event.dateDisplay}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-bold">Todos los Eventos</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const isEventRegistered = isRegistered(event.id)
              const spotsLeft = event.maxParticipants - event.participants

              return (
                <Card key={event.id} className="group overflow-hidden transition-all hover:border-primary/50">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge className="absolute left-4 top-4 bg-primary">{event.category}</Badge>
                    {isEventRegistered && <Badge className="absolute right-4 top-4 bg-green-600">Registrado</Badge>}
                  </div>

                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <Badge variant="outline">{event.difficulty}</Badge>
                      <Badge className="bg-green-600">Gratis</Badge>
                    </div>

                    <h3 className="mb-3 text-xl font-bold">{event.title}</h3>

                    <div className="mb-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{event.dateDisplay}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.distance}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>
                          {event.participants} / {event.maxParticipants} participantes
                        </span>
                      </div>
                    </div>

                    {spotsLeft <= 50 && spotsLeft > 0 && (
                      <p className="mb-3 text-sm font-medium text-orange-500">¡Solo quedan {spotsLeft} plazas!</p>
                    )}

                    <Button
                      className="w-full"
                      variant={isEventRegistered ? "outline" : "default"}
                      onClick={() => handleRegisterClick(event.id, event.title)}
                    >
                      {isEventRegistered ? "Cancelar Inscripción" : "Inscribirse"}
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {confirmDialog.isRegistering ? "Confirmar Inscripción" : "Cancelar Inscripción"}
              </DialogTitle>
              <DialogDescription asChild>
                <div>
                  {confirmDialog.isRegistering ? (
                    <div className="space-y-3 pt-2">
                      <p>¿Estás seguro de que quieres inscribirte al evento:</p>
                      <p className="font-semibold text-foreground">{confirmDialog.eventTitle}?</p>
                      <div className="flex items-start gap-2 rounded-md bg-blue-50 p-3 dark:bg-blue-950">
                        <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                          Recibirás un email de confirmación con todos los detalles del evento y recordatorios cuando se
                          acerque la fecha.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      <p>¿Estás seguro de que quieres cancelar tu inscripción al evento:</p>
                      <p className="font-semibold text-foreground">{confirmDialog.eventTitle}?</p>
                    </div>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmAction}>
                {confirmDialog.isRegistering ? "Confirmar Inscripción" : "Confirmar Cancelación"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
