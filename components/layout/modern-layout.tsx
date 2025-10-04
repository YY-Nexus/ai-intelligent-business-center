import type { ReactNode } from "react"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { cn } from "@/lib/utils"

interface ModernLayoutProps {
  children: ReactNode
  backgroundVariant?: "default" | "grid" | "gradient" | "dots" | "waves"
  backgroundIntensity?: "light" | "medium" | "strong"
  className?: string
  contentClassName?: string
}

export function ModernLayout({
  children,
  backgroundVariant = "default",
  backgroundIntensity = "medium",
  className,
  contentClassName,
}: ModernLayoutProps) {
  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden", className)}>
      <AnimatedBackground variant={backgroundVariant} intensity={backgroundIntensity} />
      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </div>
  )
}
