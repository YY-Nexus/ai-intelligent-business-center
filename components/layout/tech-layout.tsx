import type React from "react"
import { TechBackground } from "@/components/ui/tech-background"

interface TechLayoutProps {
  children: React.ReactNode
  backgroundVariant?: "vortex" | "grid" | "particles" | "waves" | "circuit"
  backgroundIntensity?: "light" | "medium" | "strong"
}

export function TechLayout({
  children,
  backgroundVariant = "vortex",
  backgroundIntensity = "medium",
}: TechLayoutProps) {
  return (
    <div className="relative min-h-screen">
      <TechBackground variant={backgroundVariant} intensity={backgroundIntensity} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
