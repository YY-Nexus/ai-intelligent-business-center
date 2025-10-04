"use client"

import { useEffect, useRef } from "react"
import type { ApiVersion } from "./version-manager"

interface VersionHistoryTimelineProps {
  versions: ApiVersion[]
  highlightIds?: string[]
}

export function VersionHistoryTimeline({ versions, highlightIds = [] }: VersionHistoryTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || versions.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布大小
    const container = canvas.parentElement
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 绘制时间线
    const padding = 50
    const lineY = canvas.height / 2
    const lineStartX = padding
    const lineEndX = canvas.width - padding

    // 绘制主线
    ctx.beginPath()
    ctx.moveTo(lineStartX, lineY)
    ctx.lineTo(lineEndX, lineY)
    ctx.strokeStyle = "#d1d5db" // 灰色线
    ctx.lineWidth = 2
    ctx.stroke()

    // 计算每个版本的位置
    const nodeSpacing = (lineEndX - lineStartX) / (versions.length - 1 || 1)
    const nodeRadius = 8

    // 绘制版本节点
    versions.forEach((version, index) => {
      const x = lineStartX + index * nodeSpacing
      const y = lineY

      // 绘制节点
      ctx.beginPath()
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2)

      // 根据版本状态和是否高亮设置颜色
      if (highlightIds.includes(version.id)) {
        ctx.fillStyle = "#3b82f6" // 蓝色高亮
        ctx.strokeStyle = "#2563eb"
      } else {
        switch (version.status) {
          case "published":
            ctx.fillStyle = "#10b981" // 绿色
            ctx.strokeStyle = "#059669"
            break
          case "deprecated":
            ctx.fillStyle = "#6b7280" // 灰色
            ctx.strokeStyle = "#4b5563"
            break
          default:
            ctx.fillStyle = "#f59e0b" // 黄色
            ctx.strokeStyle = "#d97706"
        }
      }

      ctx.fill()
      ctx.lineWidth = 2
      ctx.stroke()

      // 绘制版本号
      ctx.font = "12px sans-serif"
      ctx.fillStyle = "#111827"
      ctx.textAlign = "center"

      // 交替在时间线上下放置文本，避免重叠
      const textY = index % 2 === 0 ? y - 25 : y + 35
      ctx.fillText(version.version, x, textY)

      // 绘制日期
      const date = new Date(version.createdAt)
      const dateStr = date.toLocaleDateString()
      ctx.font = "10px sans-serif"
      ctx.fillStyle = "#6b7280"
      ctx.fillText(dateStr, x, index % 2 === 0 ? y - 40 : y + 50)
    })
  }, [versions, highlightIds])

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>

      <div className="absolute bottom-2 right-2 flex gap-2">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
          <span className="text-xs">草稿</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
          <span className="text-xs">已发布</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-gray-500 mr-1"></span>
          <span className="text-xs">已废弃</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
          <span className="text-xs">当前选中</span>
        </div>
      </div>
    </div>
  )
}
