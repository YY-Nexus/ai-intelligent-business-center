"use client"

import { useEffect, useRef } from "react"
import type { MonitoringResult } from "@/lib/api-binding/monitoring/monitoring-service"

interface MonitoringChartProps {
  data: MonitoringResult[]
  threshold: number
}

export default function MonitoringChart({ data, threshold }: MonitoringChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置canvas尺寸
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, rect.width, rect.height)

    if (data.length === 0) {
      // 绘制无数据提示
      ctx.fillStyle = "#888"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("暂无监控数据", rect.width / 2, rect.height / 2)
      return
    }

    // 图表边距
    const margin = { top: 20, right: 20, bottom: 30, left: 50 }
    const width = rect.width - margin.left - margin.right
    const height = rect.height - margin.top - margin.bottom

    // 找出最大响应时间，用于Y轴缩放
    const maxResponseTime = Math.max(
      ...data.map((d) => d.responseTime),
      threshold + 200, // 确保阈值线可见
    )

    // X轴和Y轴缩放
    const xScale = width / (data.length - 1 || 1)
    const yScale = height / maxResponseTime

    // 绘制坐标轴
    ctx.strokeStyle = "#ddd"
    ctx.lineWidth = 1

    // X轴
    ctx.beginPath()
    ctx.moveTo(margin.left, height + margin.top)
    ctx.lineTo(width + margin.left, height + margin.top)
    ctx.stroke()

    // Y轴
    ctx.beginPath()
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, height + margin.top)
    ctx.stroke()

    // Y轴刻度
    const yTicks = 5
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#888"
    ctx.font = "12px sans-serif"

    for (let i = 0; i <= yTicks; i++) {
      const y = height + margin.top - (i * height) / yTicks
      const value = Math.round((i * maxResponseTime) / yTicks)

      ctx.beginPath()
      ctx.moveTo(margin.left - 5, y)
      ctx.lineTo(margin.left, y)
      ctx.stroke()

      ctx.fillText(`${value}ms`, margin.left - 10, y)
    }

    // X轴刻度（只显示部分时间点）
    const xTickInterval = Math.max(1, Math.floor(data.length / 5))
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    for (let i = 0; i < data.length; i += xTickInterval) {
      const x = margin.left + i * xScale
      const date = new Date(data[i].timestamp)
      const timeStr = date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })

      ctx.beginPath()
      ctx.moveTo(x, height + margin.top)
      ctx.lineTo(x, height + margin.top + 5)
      ctx.stroke()

      ctx.fillText(timeStr, x, height + margin.top + 8)
    }

    // 绘制阈值线
    const thresholdY = height + margin.top - threshold * yScale
    ctx.beginPath()
    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"
    ctx.setLineDash([5, 5])
    ctx.moveTo(margin.left, thresholdY)
    ctx.lineTo(width + margin.left, thresholdY)
    ctx.stroke()
    ctx.setLineDash([])

    // 绘制阈值标签
    ctx.fillStyle = "rgba(255, 0, 0, 0.8)"
    ctx.textAlign = "left"
    ctx.textBaseline = "bottom"
    ctx.fillText(`阈值: ${threshold}ms`, margin.left + 5, thresholdY - 5)

    // 绘制响应时间线
    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2

    // 移动到第一个点
    const firstPoint = data[0]
    ctx.moveTo(margin.left, height + margin.top - (firstPoint.available ? firstPoint.responseTime * yScale : 0))

    // 连接其余点
    for (let i = 1; i < data.length; i++) {
      const point = data[i]
      const x = margin.left + i * xScale
      const y = height + margin.top - (point.available ? point.responseTime * yScale : 0)
      ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 绘制数据点
    for (let i = 0; i < data.length; i++) {
      const point = data[i]
      const x = margin.left + i * xScale
      const y = height + margin.top - (point.available ? point.responseTime * yScale : 0)

      // 根据点的状态设置颜色
      if (!point.available) {
        ctx.fillStyle = "#ef4444" // 红色表示不可用
      } else if (point.responseTime > threshold) {
        ctx.fillStyle = "#f97316" // 橙色表示超过阈值
      } else {
        ctx.fillStyle = "#3b82f6" // 蓝色表示正常
      }

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [data, threshold])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
}
