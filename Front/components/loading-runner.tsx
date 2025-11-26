"use client"

export function LoadingRunner() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6">
      <div className="relative h-32 w-32">
        <div className="animate-bounce">
          <svg viewBox="0 0 100 100" className="h-32 w-32" xmlns="http://www.w3.org/2000/svg">
            {/* Head */}
            <circle cx="50" cy="20" r="10" fill="currentColor" className="text-primary" />

            {/* Body */}
            <line x1="50" y1="30" x2="50" y2="55" stroke="currentColor" strokeWidth="4" className="text-primary" />

            {/* Arms - animated */}
            <g className="origin-center animate-pulse" style={{ animationDuration: "0.6s" }}>
              <line x1="50" y1="38" x2="32" y2="48" stroke="currentColor" strokeWidth="4" className="text-primary" />
              <line x1="50" y1="38" x2="68" y2="32" stroke="currentColor" strokeWidth="4" className="text-primary" />
            </g>

            {/* Legs - animated */}
            <g className="animate-pulse" style={{ animationDuration: "0.5s" }}>
              <line x1="50" y1="55" x2="38" y2="75" stroke="currentColor" strokeWidth="4" className="text-primary" />
              <line x1="50" y1="55" x2="62" y2="80" stroke="currentColor" strokeWidth="4" className="text-primary" />
              <line x1="38" y1="75" x2="32" y2="88" stroke="currentColor" strokeWidth="4" className="text-primary" />
              <line x1="62" y1="80" x2="68" y2="92" stroke="currentColor" strokeWidth="4" className="text-primary" />
            </g>
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-1 text-lg font-medium text-muted-foreground">
        <span>Cargando</span>
        <span className="animate-pulse">.</span>
        <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>
          .
        </span>
        <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>
          .
        </span>
      </div>
    </div>
  )
}
