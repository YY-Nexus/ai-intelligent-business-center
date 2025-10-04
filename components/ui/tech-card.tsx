import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva("rounded-lg overflow-hidden", {
  variants: {
    variant: {
      default: "bg-card text-card-foreground",
      glass: "tech-glass",
      gradient: "bg-gradient-to-br from-techblue-50 to-techblue-100 dark:from-techblue-900 dark:to-techblue-800",
      outline: "border border-techblue-200 dark:border-techblue-800 bg-transparent",
      panel: "tech-panel",
    },
    glow: {
      none: "",
      subtle: "shadow-tech-glow",
      strong: "shadow-tech-glow-lg",
    },
    border: {
      none: "",
      default: "border border-techblue-200 dark:border-techblue-800",
      tech: "tech-border",
    },
    animation: {
      none: "",
      float: "animate-float",
      pulse: "animate-pulse-soft",
    },
  },
  defaultVariants: {
    variant: "default",
    glow: "none",
    border: "none",
    animation: "none",
  },
})

export interface TechCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  title?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  icon?: React.ReactNode
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
}

const TechCard = forwardRef<HTMLDivElement, TechCardProps>(
  (
    {
      className,
      variant,
      glow,
      border,
      animation,
      title,
      description,
      footer,
      icon,
      headerClassName,
      contentClassName,
      footerClassName,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn(cardVariants({ variant, glow, border, animation }), className)} {...props}>
        {(title || description || icon) && (
          <div className={cn("flex flex-col space-y-1.5 p-6", headerClassName)}>
            {icon && <div className="mb-2">{icon}</div>}
            {title && <h3 className="text-2xl font-semibold leading-none tracking-tight">{title}</h3>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        )}
        <div className={cn("p-6 pt-0", contentClassName)}>{children}</div>
        {footer && <div className={cn("p-6 pt-0", footerClassName)}>{footer}</div>}
      </div>
    )
  },
)
TechCard.displayName = "TechCard"

export { TechCard }
