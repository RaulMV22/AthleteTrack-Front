"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Calendar, MapPin, Users, Search, Plus, Pencil, Trash2, Shield } from "lucide-react"
import { deleteEvent, type Event } from "@/lib/mock-events"
import { EventFormModal } from "@/components/event-form-modal"
import { useAuth } from "@/contexts/auth-context"
import { useEvents } from "@/contexts/events-context"
import { useRouter } from "next/navigation"

export default function ManageEventsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { events, refreshEvents } = useEvents()
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; eventId: number | null }>({
    open: false,
    eventId: null,
  })

  // Redirect if not admin
  if (user?.role !== "ADMIN") {
    router.push("/dashboard")
    return null
  }

  const filteredEvents = events.filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleCreateEvent = () => {
    setEditingEvent(null)
    setIsModalOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (eventId: number) => {
    setDeleteDialog({ open: true, eventId })
  }

  const handleConfirmDelete = () => {
    if (deleteDialog.eventId) {
      deleteEvent(deleteDialog.eventId)
      refreshEvents()
      setDeleteDialog({ open: false, eventId: null })
    }
  }

  const handleModalClose = (updated: boolean) => {
    setIsModalOpen(false)
    setEditingEvent(null)
    if (updated) {
      refreshEvents()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-4xl font-bold tracking-tight">Gestión de Eventos</h1>
              <Badge className="bg-primary">
                <Shield className="mr-1 h-3 w-3" />
                Admin
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">Crea, edita y elimina eventos deportivos</p>
          </div>
          <Button onClick={handleCreateEvent} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Crear Evento
          </Button>
        </div>

        <Card className="mb-6 p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Total: <span className="font-semibold text-foreground">{events.length}</span> eventos
            </div>
          </div>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Participantes</TableHead>
                  <TableHead>Dificultad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No se encontraron eventos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            className="h-12 w-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.distance}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{event.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {event.dateDisplay}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {event.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {event.participants} / {event.maxParticipants}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            event.difficulty === "Principiante"
                              ? "border-green-500 text-green-500"
                              : event.difficulty === "Intermedio"
                                ? "border-yellow-500 text-yellow-500"
                                : "border-red-500 text-red-500"
                          }
                        >
                          {event.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(event.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <EventFormModal open={isModalOpen} onClose={handleModalClose} event={editingEvent} />

        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El evento será eliminado permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
