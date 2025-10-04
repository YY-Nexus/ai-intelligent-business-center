"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2 } from "lucide-react"

interface RiskGaugeProps {
  riskLevel: "high" | "medium" | "low"
  title: string
  description: string
}

export function RiskGauge({ riskLevel, title, description }: RiskGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 获取风险级别信息
  const getRiskInfo = () => {
    switch (riskLevel) {
      case "high":
        return {
          color: "#ef4444",
          label: "高风险",
          value: 0.9,
          icon: <AlertTriangle className="h-3 w-3 mr-1" />,
        }
      case "medium":
        return {
          color: "#f59e0b",
          label: "中等风险",
          value: 0.5,
          icon: <AlertTriangle className="h-3 w-3 mr-1" />,
        }
      case "low":
        return {
          color: "#10b981",
          label: "低风险",
          value: 0.1,
          icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
        }
      default:
        return {
          color: "#6b7280",
          label: "未知",
          value: 0,
          icon: null,
        }
    }
  }

  // 绘制仪表盘
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const riskInfo = getRiskInfo()

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height - 20
    const radius = Math.min(canvas.width, canvas.height) / 1.5

    // 绘制仪表盘背景
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, 0)
    ctx.lineWidth = 10
    ctx.strokeStyle = "#e5e7eb"
    ctx.stroke()

    // 绘制仪表盘值
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, Math.PI - Math.PI * riskInfo.value)
    ctx.lineWidth = 10
    ctx.strokeStyle = riskInfo.color
    ctx.stroke()

    // 绘制指针
    const angle = Math.PI - Math.PI * riskInfo.value
    const pointerLength = radius - 20

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + pointerLength * Math.cos(angle), centerY + pointerLength * Math.sin(angle))
    ctx.lineWidth = 3
    ctx.strokeStyle = "#111827"
    ctx.stroke()

    // 绘制中心点
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
    ctx.fillStyle = "#111827"
    ctx.fill()

    // 绘制刻度
    const ticks = [0, 0.25, 0.5, 0.75, 1]
    ticks.forEach((tick) => {
      const tickAngle = Math.PI - Math.PI * tick

      ctx.beginPath()
      ctx.moveTo(centerX + (radius - 5) * Math.cos(tickAngle), centerY + (radius - 5) * Math.sin(tickAngle))
      ctx.lineTo(centerX + (radius + 5) * Math.cos(tickAngle), centerY + (radius + 5) * Math.sin(tickAngle))
      ctx.lineWidth = 2
      ctx.strokeStyle = "#6b7280"
      ctx.stroke()
    })

    // 绘制标签
    ctx.fillStyle = "#6b7280"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    ctx.fillText("低", centerX + radius * 0.8 * Math.cos(Math.PI), centerY + radius * 0.8 * Math.sin(Math.PI) - 10)
    ctx.fillText(
      "中",
      centerX + radius * 0.8 * Math.cos(Math.PI / 2),
      centerY + radius * 0.8 * Math.sin(Math.PI / 2) - 10,
    )
    ctx.fillText("高", centerX + radius * 0.8 * Math.cos(0), centerY + radius * 0.8 * Math.sin(0) - 10)
  }, [riskLevel])

  const riskInfo = getRiskInfo()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col items-center">
          <canvas ref={canvasRef} width={200} height={120} className="mb-2" />
          <Badge
            className={`
              ${riskLevel === "high" ? "bg-red-50 text-red-700 border-red-200" : ""}
              ${riskLevel === "medium" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
              ${riskLevel === "low" ? "bg-green-50 text-green-700 border-green-200" : ""}
            `}
          >
            {riskInfo.icon}
            {riskInfo.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
