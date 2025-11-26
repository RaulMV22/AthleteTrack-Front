"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useWorkouts } from "@/contexts/workouts-context"
import { useEvents } from "@/contexts/events-context"
import { User, Mail, Calendar, Trophy, Edit, AtSign, Shield, ImageIcon } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { workouts } = useWorkouts()
  const { userRegistrations, events } = useEvents()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  // Sync local state with user data when it changes
  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setAvatarUrl(user.avatar || "")
    }
  }, [user])

  // All workouts are considered completed (no status field in Workout entity)
  const completedWorkouts = workouts
  const totalWorkouts = completedWorkouts.length
  const totalTime = completedWorkouts.reduce(
    (sum, w) => sum + w.exercises.reduce((s, e) => s + (Number.parseFloat(e.time || "0") || 0), 0),
    0,
  )
  const completedEvents = events.filter((e) => {
    const eventDate = new Date(e.date)
    return eventDate < new Date() && userRegistrations.includes(e.id)
  }).length

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // Crear canvas para redimensionar
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            reject(new Error('No se pudo crear el canvas'))
            return
          }

          // Calcular nuevo tamaño (máximo 200x200 para reducir tamaño)
          let width = img.width
          let height = img.height
          const maxSize = 200

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height
              height = maxSize
            }
          }

          canvas.width = width
          canvas.height = height

          // Dibujar imagen redimensionada
          ctx.drawImage(img, 0, 0, width, height)

          // Convertir a base64 con compresión (0.7 = 70% calidad)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)

          // Verificar que el tamaño sea aceptable (menos de 200KB en base64)
          if (compressedBase64.length > 200000) {
            // Si aún es muy grande, reducir más la calidad
            const smallerBase64 = canvas.toDataURL('image/jpeg', 0.5)
            resolve(smallerBase64)
          } else {
            resolve(compressedBase64)
          }
        }
        img.onerror = () => reject(new Error('Error al cargar la imagen'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Error al leer el archivo'))
      reader.readAsDataURL(file)
    })
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona una imagen válida')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no puede superar los 5MB')
        return
      }

      try {
        setAvatarFile(file)

        // Comprimir y redimensionar imagen
        toast.info('Procesando imagen...')
        const compressedBase64 = await compressImage(file)
        setAvatarUrl(compressedBase64)
        toast.success('Imagen cargada correctamente')
      } catch (error) {
        toast.error('Error al procesar la imagen')
        console.error(error)
      }
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    const result = await updateProfile({
      name: name !== user?.name ? name : undefined,
      email: email !== user?.email ? email : undefined,
      avatar: avatarFile ? avatarUrl : (avatarUrl !== user?.avatar ? avatarUrl : undefined),
    })

    setIsSaving(false)

    if (result.success) {
      setIsEditing(false)
      setAvatarFile(null)
      toast.success("Perfil actualizado correctamente")
    } else {
      toast.error(result.error || "Error al actualizar el perfil")
    }
  }

  const handleCancel = () => {
    setName(user?.name || "")
    setEmail(user?.email || "")
    setAvatarUrl(user?.avatar || "")
    setAvatarFile(null)
    setIsEditing(false)
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-lg text-muted-foreground">Gestiona tu información personal</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Información Personal</h2>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancelar
              </Button>
            )}
          </div>

          <div className="mb-6 flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl || user?.avatar || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {user?.role === "ADMIN" && (
              <Badge variant="default" className="gap-1">
                <Shield className="h-3 w-3" />
                Administrador
              </Badge>
            )}
          </div>

          {isEditing && (
            <div className="mb-4 space-y-2">
              <Label htmlFor="avatar" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                Foto de perfil
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="cursor-pointer"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Selecciona una imagen desde tu ordenador (máx. 5MB)
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Nombre completo
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
            </div>

            <div>
              <Label htmlFor="username" className="mb-2 flex items-center gap-2">
                <AtSign className="h-4 w-4 text-primary" />
                Nombre de usuario
              </Label>
              <Input id="username" value={`@${user?.username} `} disabled className="bg-muted" />
              <p className="mt-1 text-xs text-muted-foreground">El nombre de usuario no se puede cambiar</p>
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label className="mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Miembro desde
              </Label>
              <Input value="Enero 2025" disabled />
            </div>

            {isEditing && (
              <Button className="w-full" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </Button>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 text-xl font-bold">Logros</h3>
            <div className="space-y-3">
              {totalWorkouts >= 1 && (
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Primer Entrenamiento</p>
                    <p className="text-xs text-muted-foreground">Completaste tu primer entrenamiento</p>
                  </div>
                </div>
              )}
              {completedEvents >= 1 && (
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Primera Carrera</p>
                    <p className="text-xs text-muted-foreground">Completaste tu primer evento</p>
                  </div>
                </div>
              )}
              {totalWorkouts >= 10 && (
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Atleta Dedicado</p>
                    <p className="text-xs text-muted-foreground">Completaste 10 entrenamientos</p>
                  </div>
                </div>
              )}
              {totalWorkouts === 0 && completedEvents === 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  Completa entrenamientos y eventos para desbloquear logros
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-xl font-bold">Estadísticas Rápidas</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Entrenamientos totales</p>
                <p className="text-2xl font-bold">{totalWorkouts}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eventos completados</p>
                <p className="text-2xl font-bold">{completedEvents}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Horas de entrenamiento</p>
                <p className="text-2xl font-bold">{(totalTime / 60).toFixed(1)}h</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
