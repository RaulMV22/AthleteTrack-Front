interface EventEmailData {
  type: "registration" | "reminder"
  eventTitle: string
  eventDate: string
  eventLocation: string
}

export function sendEventEmail(
  type: "registration" | "reminder",
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
) {
  // Simulación de envío de email
  console.log("[v0] Email enviado:")
  console.log("[v0] Tipo:", type === "registration" ? "Confirmación de inscripción" : "Recordatorio de evento")
  console.log("[v0] Evento:", eventTitle)
  console.log("[v0] Fecha:", eventDate)
  console.log("[v0] Ubicación:", eventLocation)
  console.log("[v0] Para:", "usuario@example.com")

  if (type === "registration") {
    console.log("[v0] Contenido del email:")
    console.log(`
      ¡Hola!
      
      Tu inscripción al evento "${eventTitle}" ha sido confirmada.
      
      Detalles del evento:
      - Fecha: ${eventDate}
      - Ubicación: ${eventLocation}
      
      Te enviaremos un recordatorio cuando se acerque la fecha del evento.
      
      ¡Nos vemos allí!
    `)
  } else {
    console.log("[v0] Contenido del email:")
    console.log(`
      ¡Hola!
      
      Te recordamos que el evento "${eventTitle}" se acerca.
      
      Detalles del evento:
      - Fecha: ${eventDate}
      - Ubicación: ${eventLocation}
      
      ¡No olvides prepararte!
    `)
  }

  // Simular programación de recordatorio
  if (type === "registration") {
    scheduleEventReminder(eventTitle, eventDate, eventLocation)
  }

  return true
}

function scheduleEventReminder(eventTitle: string, eventDate: string, eventLocation: string) {
  const eventDateObj = new Date(eventDate)
  const reminderDate = new Date(eventDateObj)
  reminderDate.setDate(reminderDate.getDate() - 3) // 3 días antes

  console.log("[v0] Recordatorio programado para:", reminderDate.toLocaleDateString("es-ES"))
  console.log("[v0] Se enviará un email recordatorio 3 días antes del evento")

  // En un sistema real, aquí se programaría un job/cron para enviar el email
  // Por ahora solo lo simulamos en consola
}
