"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ImpactAnalysis } from "@/lib/api/impact-analysis-service"

interface ImpactChartProps {
  analysis: ImpactAnalysis
  type: "apis" | "services" | "clients"
  title: string
  description: string
}

export function ImpactChart({ analysis, type, title, description }: ImpactChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 根据类型获取数据
  const getData = () => {
    switch (type) {
      case "apis":
        return analysis.affectedApis
      case "services":
        return analysis.affectedServices
      case "clients":
        return analysis.affectedClients
      default:
        return []
    }
  }

  // 获取颜色
  const getColors = () => {
    switch (type) {
      case "apis":
        return ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"]
      case "services":
        return ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"]
      case "clients":
        return ["#f59e0b", "#fbbf24", "#fcd34d", "#fde68a", "#fef3c7"]
      default:
        return ["#6b7280", "#9ca3af", "#d1d5db", "#e5e7eb", "#f3f4f6"]
    }
  }

  // 绘制图表
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const data = getData()
    const colors = getColors()

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 如果没有数据，显示空状态
    if (data.length === 0) {
      ctx.fillStyle = "#9ca3af"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("暂无数据", canvas.width / 2, canvas.height / 2)
      return
    }

    // 绘制饼图
    const total = data.length
    let startAngle = 0

    data.forEach((item, index) => {
      const sliceAngle = (2 * Math.PI) / total
      const endAngle = startAngle + sliceAngle

      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, canvas.height / 2)
      ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2 - 10, startAngle, endAngle)
      ctx.closePath()

      ctx.fillStyle = colors[index % colors.length]
      ctx.fill()

      startAngle = endAngle
    })

    // 绘制中心圆
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 4, 0, 2 * Math.PI)
    ctx.fillStyle = "#ffffff"
    ctx.fill()

    // 绘制数字
    ctx.fillStyle = "#111827"
    ctx.font = "bold 24px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(total.toString(), canvas.width / 2, canvas.height / 2)
  }, [analysis, type])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col items-center">
          <canvas ref={canvasRef} width={200} height={200} className="mb-4" />
          <ul className="w-full space-y-1 text-sm">
            {getData().map((item, index) => (
              <li key={index} className="flex items-center">
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getColors()[index % getColors().length] }}
                />
                <span className="truncate">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
