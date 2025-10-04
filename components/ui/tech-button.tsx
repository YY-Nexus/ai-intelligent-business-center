"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const techButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 smart-interactive gpu-accelerated",
  {
    variants: {
      variant: {
        default: "smart-button text-white shadow-lg hover:shadow-xl",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground gradient-border",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 smart-glow",
        ghost: "hover:bg-accent hover:text-accent-foreground flowing-light",
        link: "text-primary underline-offset-4 hover:underline micro-interaction",
        ai: "yanyu-gradient text-white shadow-lg hover:shadow-xl ai-enhanced pulse-glow",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      depth: {
        flat: "",
        shallow: "shadow-md hover:shadow-lg",
        medium: "shadow-lg hover:shadow-xl",
        deep: "shadow-xl hover:shadow-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      depth: "medium",
    },
  },
)

export interface TechButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof techButtonVariants> {
  asChild?: boolean
}

const TechButton = React.forwardRef<HTMLButtonElement, TechButtonProps>(
  ({ className, variant, size, depth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(techButtonVariants({ variant, size, depth, className }))} ref={ref} {...props} />
  },
)
TechButton.displayName = "TechButton"

export { TechButton, techButtonVariants }
