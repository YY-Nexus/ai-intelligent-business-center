import { type NextRequest, NextResponse } from "next/server"
import { PerformanceMonitor } from "@/lib/monitoring/performance-monitor"

/**
 * 性能监控中间件
 * 记录API请求的性能指标
 */
export function performanceMiddleware(req: NextRequest) {
  // 只监控API请求
  if (!req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  const monitor = PerformanceMonitor.getInstance()
  const startTime = performance.now()
  const method = req.method
  const endpoint = req.nextUrl.pathname

  // 创建响应监听器
  const originalNext = NextResponse.next
  NextResponse.next = function (...args) {
    const response = originalNext.apply(this, args)

    // 记录性能指标
    const endTime = performance.now()
    const duration = endTime - startTime

    monitor.recordMetric({
      requestId: req.headers.get("x-request-id") || `req_${Date.now()}`,
      endpoint,
      method,
      startTime,
      endTime,
      duration,
      status: response.status,
      timestamp: new Date(),
    })

    return response
  }

  return NextResponse.next()
}
