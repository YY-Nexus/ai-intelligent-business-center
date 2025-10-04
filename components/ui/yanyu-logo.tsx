"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

interface YanYuLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  animated?: "none" | "hover" | "entrance" | "pulse" | "glow"
  responsive?: boolean
  className?: string
  showText?: boolean
  variant?: "full" | "icon-only" | "text-only"
}

export function YanYuLogo({
  size = "md",
  animated = "none",
  responsive = false,
  className,
  showText = true,
  variant = "full",
}: YanYuLogoProps) {
  const sizeClasses = {
    xs: "h-6",
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
    xl: "h-16",
  }

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  const responsiveClasses = responsive
    ? {
        xs: "sm:h-6",
        sm: "sm:h-8",
        md: "sm:h-10",
        lg: "sm:h-12",
        xl: "sm:h-16",
      }
    : {}

  const animationClasses = {
    none: "",
    hover: "smart-interactive gpu-accelerated",
    entrance: "animate-in fade-in zoom-in duration-700 ease-out",
    pulse: "pulse-glow",
    glow: "smart-glow",
  }

  if (variant === "text-only") {
    return (
      <div className={cn("flex flex-col items-center justify-center", animationClasses[animated], className)}>
        <span className={cn("font-bold yanyu-text-gradient", textSizeClasses[size])}>言语云</span>
        <span
          className={cn(
            "text-muted-foreground font-medium",
            size === "xs"
              ? "text-[10px]"
              : size === "sm"
                ? "text-xs"
                : size === "md"
                  ? "text-sm"
                  : size === "lg"
                    ? "text-base"
                    : "text-lg",
          )}
        >
          YanYu Cloud³
        </span>
      </div>
    )
  }

  if (variant === "icon-only") {
    return (
      <div
        className={cn("relative", sizeClasses[size], responsiveClasses[size], animationClasses[animated], className)}
      >
        <Image
          src="/images/yanyu-cloud-logo.png"
          alt="言语云 YanYu Cloud"
          width={64}
          height={64}
          className="w-full h-full object-contain drop-shadow-lg"
          priority
        />
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-3 group", animationClasses[animated], className)}>
      <div
        className={cn(
          "relative",
          sizeClasses[size],
          responsiveClasses[size],
          "transition-transform duration-300 group-hover:scale-110",
        )}
      >
        <Image
          src="/images/yanyu-cloud-logo.png"
          alt="言语云 YanYu Cloud"
          width={64}
          height={64}
          className="w-full h-full object-contain drop-shadow-lg"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-bold leading-none tracking-tight yanyu-text-gradient transition-all duration-300 group-hover:scale-105",
              textSizeClasses[size],
            )}
          >
            言语云
          </span>
          <span
            className={cn(
              "text-muted-foreground font-medium leading-none transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400",
              size === "xs"
                ? "text-[10px]"
                : size === "sm"
                  ? "text-xs"
                  : size === "md"
                    ? "text-sm"
                    : size === "lg"
                      ? "text-base"
                      : "text-lg",
            )}
          >
            YanYu Cloud³
          </span>
        </div>
      )}
    </div>
  )
}
