import { type NextRequest, NextResponse } from "next/server"
import { PerformanceMonitor } from "@/lib/monitoring/performance-monitor"

/**
 * 获取性能指标
 */
export async function GET(req: NextRequest) {
  const monitor = PerformanceMonitor.getInstance()
  const searchParams = req.nextUrl.searchParams

  // 解析查询参数
  const endpoint = searchParams.get("endpoint") || undefined
  const method = searchParams.get("method") || undefined
  const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

  // 解析时间范围
  let timeRange: [Date, Date] | undefined
  const startTime = searchParams.get("startTime")
  const endTime = searchParams.get("endTime")

  if (startTime && endTime) {
    timeRange = [new Date(startTime), new Date(endTime)]
  }

  // 获取指标或统计数据
  const type = searchParams.get("type") || "metrics"

  if (type === "stats") {
    const stats = monitor.getStatistics({ endpoint, method, timeRange })
    return NextResponse.json(stats)
  } else {
    const metrics = monitor.getMetrics({ endpoint, method, timeRange, limit })
    return NextResponse.json(metrics)
  }
}

/**
 * 设置性能阈值
 */
export async function POST(req: NextRequest) {
  const monitor = PerformanceMonitor.getInstance()
  const body = await req.json()

  // 设置阈值
  if (body.thresholds) {
    monitor.setThresholds(body.thresholds)
  }

  return NextResponse.json({ success: true })
}

/**
 * 清除性能指标
 */
export async function DELETE() {
  const monitor = PerformanceMonitor.getInstance()
  monitor.clearMetrics()

  return NextResponse.json({ success: true })
}
