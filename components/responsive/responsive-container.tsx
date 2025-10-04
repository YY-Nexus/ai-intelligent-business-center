"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

// 断点类型
type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

// 断点值（像素）
const breakpoints: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

// 使用媒体查询钩子
export function useBreakpoint() {
  // 默认为xs
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xs")
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // 更新宽度和断点
    const updateSize = () => {
      setWidth(window.innerWidth)

      if (window.innerWidth >= breakpoints["2xl"]) {
        setBreakpoint("2xl")
      } else if (window.innerWidth >= breakpoints.xl) {
        setBreakpoint("xl")
      } else if (window.innerWidth >= breakpoints.lg) {
        setBreakpoint("lg")
      } else if (window.innerWidth >= breakpoints.md) {
        setBreakpoint("md")
      } else if (window.innerWidth >= breakpoints.sm) {
        setBreakpoint("sm")
      } else {
        setBreakpoint("xs")
      }
    }

    // 初始更新
    updateSize()

    // 监听窗口大小变化
    window.addEventListener("resize", updateSize)

    // 清理
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return { breakpoint, width, isMobile: breakpoint === "xs" || breakpoint === "sm" }
}

// 响应式容器组件
interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  breakpoints?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    "2xl"?: string
  }
}

export function ResponsiveContainer({
  children,
  breakpoints: bpClasses,
  className,
  ...props
}: ResponsiveContainerProps) {
  const { breakpoint } = useBreakpoint()

  // 获取当前断点的类名
  const currentClass = bpClasses?.[breakpoint] || ""

  return (
    <div className={cn(currentClass, className)} {...props}>
      {children}
    </div>
  )
}

// 响应式网格组件
interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  "2xl"?: number
  gap?: number | string
}

export function ResponsiveGrid({
  children,
  xs = 1,
  sm,
  md,
  lg,
  xl,
  "2xl": xxl,
  gap = 4,
  className,
  ...props
}: ResponsiveGridProps) {
  // 构建网格类名
  const gridClasses = [
    `grid-cols-${xs}`,
    sm && `sm:grid-cols-${sm}`,
    md && `md:grid-cols-${md}`,
    lg && `lg:grid-cols-${lg}`,
    xl && `xl:grid-cols-${xl}`,
    xxl && `2xl:grid-cols-${xxl}`,
  ]
    .filter(Boolean)
    .join(" ")

  // 处理间距
  const gapClass = typeof gap === "number" ? `gap-${gap}` : `gap-[${gap}]`

  return (
    <div className={cn("grid", gridClasses, gapClass, className)} {...props}>
      {children}
    </div>
  )
}

// 响应式显示组件
interface ResponsiveShowProps {
  children: React.ReactNode
  breakpoint: Breakpoint | "mobile" | "desktop"
  mode?: "show" | "hide"
}

export function ResponsiveShow({ children, breakpoint, mode = "show" }: ResponsiveShowProps) {
  const { breakpoint: currentBreakpoint } = useBreakpoint()

  // 处理特殊断点
  if (breakpoint === "mobile") {
    const isMobile = currentBreakpoint === "xs" || currentBreakpoint === "sm"
    if ((mode === "show" && !isMobile) || (mode === "hide" && isMobile)) {
      return null
    }
    return <>{children}</>
  }

  if (breakpoint === "desktop") {
    const isDesktop = currentBreakpoint !== "xs" && currentBreakpoint !== "sm"
    if ((mode === "show" && !isDesktop) || (mode === "hide" && isDesktop)) {
      return null
    }
    return <>{children}</>
  }

  // 处理标准断点
  const breakpointOrder: Breakpoint[] = ["xs", "sm", "md", "lg", "xl", "2xl"]
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint)
  const targetIndex = breakpointOrder.indexOf(breakpoint as Breakpoint)

  if (mode === "show" && currentIndex >= targetIndex) {
    return <>{children}</>
  }

  if (mode === "hide" && currentIndex < targetIndex) {
    return <>{children}</>
  }

  return null
}
