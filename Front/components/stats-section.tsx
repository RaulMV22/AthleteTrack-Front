import { Card } from "@/components/ui/card"
import { Trophy, Target, Flame, Award } from "lucide-react"

const stats = [
  {
    icon: Trophy,
    value: "50K+",
    label: "Atletas Activos",
    description: "Comunidad global creciendo cada día",
  },
  {
    icon: Target,
    value: "1.2M+",
    label: "Entrenamientos Registrados",
    description: "Millones de sesiones completadas",
  },
  {
    icon: Flame,
    value: "500+",
    label: "Eventos Anuales",
    description: "Competiciones en todo el mundo",
  },
  {
    icon: Award,
    value: "95%",
    label: "Satisfacción",
    description: "Atletas que alcanzan sus metas",
  },
]

export function StatsSection() {
  return (
    <section id="stats" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">
            IMPULSANDO EL <span className="text-primary">RENDIMIENTO</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Miles de atletas confían en nosotros para alcanzar sus objetivos
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="group border-border bg-card p-6 text-center transition-all hover:border-primary/50"
              >
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 transition-transform group-hover:scale-110">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="mb-2 text-4xl font-bold text-card-foreground">{stat.value}</div>
                <div className="mb-1 text-lg font-semibold text-card-foreground">{stat.label}</div>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
