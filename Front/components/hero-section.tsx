"use client"

import { Button } from "@/components/ui/button"
import { Play, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const { user } = useAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }

  return (
    <section className="relative min-h-[600px] overflow-hidden bg-gradient-to-b from-background to-secondary/20">
      <div className="absolute inset-0 bg-[url('/athlete-running-track-finish-line.jpg')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

      <div className="container relative mx-auto px-4 pt-32 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <TrendingUp className="h-4 w-4" />
            <span>Únete a más de 50,000 atletas</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tighter text-balance md:text-7xl">
            ENTRENA.
            <br />
            COMPITE.
            <br />
            <span className="text-primary">SUPÉRATE.</span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground text-pretty md:text-xl">
            La plataforma definitiva para deportistas. Registra tus entrenamientos, inscríbete en eventos y alcanza tus
            objetivos con nuestra comunidad global.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-12 bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90"
              onClick={handleGetStarted}
            >
              Comenzar Gratis
            </Button>
            <Button size="lg" variant="outline" className="h-12 gap-2 px-8 text-base font-semibold bg-transparent">
              <Play className="h-5 w-5" />
              Ver Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
