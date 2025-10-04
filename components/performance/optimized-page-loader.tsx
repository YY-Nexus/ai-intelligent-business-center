"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { PerformanceOptimizer, PerformanceMonitor } from "@/lib/performance/performance-optimizer"
import { Skeleton } from "@/components/ui/skeleton"
import { LogoLoader } from "@/components/ui/logo-loader"

interface OptimizedPageLoaderProps {
  children: React.ReactNode
  pageName: string
  preloadResources?: Array<{ url: string; type: "image" | "style" | "script" | "font" }>
}

export function OptimizedPageLoader({ children, pageName, preloadResources = [] }: OptimizedPageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [renderTime, setRenderTime] = useState<number | null>(null)

  useEffect(() => {
    // 预加载资源
    if (preloadResources.length > 0) {
      PerformanceOptimizer.preloadResources(preloadResources)
    }

    // 开始计时
    const stopTimer = PerformanceMonitor.startTimer(`page_load_${pageName}`)

    // 模拟页面加载
    const timer = setTimeout(() => {
      setIsLoading(false)
      const time = stopTimer()
      setRenderTime(time)
    }, 300) // 使用较短的时间以避免明显延迟

    return () => clearTimeout(timer)
  }, [pageName, preloadResources])

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center">
        <LogoLoader size="lg" />
        <p className="mt-4 text-muted-foreground">加载中，请稍候...</p>
      </div>
    )
  }

  return (
    <>
      {children}
      {process.env.NODE_ENV === "development" && renderTime && (
        <div className="fixed bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded z-50">
          页面加载时间: {renderTime.toFixed(2)}ms
        </div>
      )}
    </>
  )
}

// 骨架屏组件
export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[300px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[100px]" />
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
      </div>

      <Skeleton className="h-[400px]" />
    </div>
  )
}

// 表格骨架屏
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <div className="space-y-2">
        {Array(rows)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
      </div>
    </div>
  )
}
