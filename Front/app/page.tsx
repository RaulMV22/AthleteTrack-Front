import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { EventsSection } from "@/components/events-section"
import { QuickLogSection } from "@/components/quick-log-section"
import { StatsSection } from "@/components/stats-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <EventsSection />
      <QuickLogSection />
      <StatsSection />
      <Footer />
    </main>
  )
}
