"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Event, createEvent, updateEvent } from "@/lib/mock-events"

interface EventFormModalProps {
  open: boolean
  onClose: (updated: boolean) => void
  event?: Event | null
}

const CATEGORIES = ["RUNNING", "CROSSFIT", "TRIATHLON", "CYCLING", "SWIMMING", "OTROS"]
const DIFFICULTIES = ["Principiante", "Intermedio", "Avanzado"]

export function EventFormModal({ open, onClose, event }: EventFormModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    maxParticipants: "",
    image: "",
    category: "",
    distance: "",
    difficulty: "",
    description: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        date: event.date,
        location: event.location,
        maxParticipants: String(event.maxParticipants),
        image: event.image,
        category: event.category,
        distance: event.distance,
        difficulty: event.difficulty,
        description: event.description || "",
      })
    } else {
      setFormData({
        title: "",
        date: "",
        location: "",
        maxParticipants: "",
        image: "",
        category: "",
        distance: "",
        difficulty: "",
        description: "",
      })
    }
    setErrors({})
  }, [event, open])

  const formatDateDisplay = (dateString: string): string => {
    const date = new Date(dateString)
    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "El título es obligatorio"
    if (!formData.date) newErrors.date = "La fecha es obligatoria"
    else if (formData.date < today) newErrors.date = "La fecha no puede ser anterior a hoy"
    if (!formData.location.trim()) newErrors.location = "La ubicación es obligatoria"
    if (!formData.maxParticipants || Number(formData.maxParticipants) <= 0)
      newErrors.maxParticipants = "Debe ser un número mayor a 0"
    if (!formData.category) newErrors.category = "La categoría es obligatoria"
    if (!formData.distance.trim()) newErrors.distance = "La distancia es obligatoria"
    if (!formData.difficulty) newErrors.difficulty = "La dificultad es obligatoria"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const eventData = {
      title: formData.title,
      date: formData.date,
      dateDisplay: formatDateDisplay(formData.date),
      location: formData.location,
      maxParticipants: Number(formData.maxParticipants),
      image: formData.image || "/vibrant-sports-event.png",
      category: formData.category,
      distance: formData.distance,
      difficulty: formData.difficulty,
      description: formData.description,
    }

    if (event) {
      updateEvent(event.id, eventData)
    } else {
      createEvent(eventData)
    }

    onClose(true)
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{event ? "Editar Evento" : "Crear Nuevo Evento"}</DialogTitle>
          <DialogDescription>
            {event ? "Modifica los detalles del evento" : "Completa los detalles del nuevo evento deportivo"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título del Evento *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Maratón Ciudad 2025"
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                type="date"
                min={today}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ej: Estadio Nacional"
            />
            {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="distance">Distancia *</Label>
              <Input
                id="distance"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                placeholder="Ej: 42.2 km"
              />
              {errors.distance && <p className="text-sm text-destructive">{errors.distance}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Dificultad *</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona dificultad" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((diff) => (
                    <SelectItem key={diff} value={diff}>
                      {diff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.difficulty && <p className="text-sm text-destructive">{errors.difficulty}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Máximo de Participantes *</Label>
            <Input
              id="maxParticipants"
              type="number"
              min="1"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
              placeholder="Ej: 1000"
            />
            {errors.maxParticipants && <p className="text-sm text-destructive">{errors.maxParticipants}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL de Imagen</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Ej: /marathon-event.jpg (opcional)"
            />
            <p className="text-xs text-muted-foreground">Si se deja vacío, se usará una imagen por defecto</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción del evento (opcional)"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onClose(false)}>
              Cancelar
            </Button>
            <Button type="submit">{event ? "Guardar Cambios" : "Crear Evento"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
