"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useNotifications } from "@/lib/notifications/notification-context"
import { v4 as uuidv4 } from "uuid"

interface AutoFixEngineProps {
  issues: {
    id: string
    component: string
    description: string
    severity: "low" | "medium" | "high" | "critical"
    type: string
  }[]
}

export function AutoFixEngine({ issues }: AutoFixEngineProps) {
  const [isFixing, setIsFixing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fixedIssues, setFixedIssues] = useState<string[]>([])
  const [currentIssue, setCurrentIssue] = useState<string | null>(null)
  const { toast } = useToast()
  const { addRepairNotification } = useNotifications()

  const startAutoFix = async () => {
    if (issues.length === 0) return

    setIsFixing(true)
    setProgress(0)
    setFixedIssues([])

    const repairId = uuidv4()

    // 通知修复开始
    addRepairNotification({
      title: "自动修复开始",
      message: `开始修复 ${issues.length} 个问题`,
      level: "info",
      source: "自动修复引擎",
      repairId,
      status: "started",
      affectedComponents: issues.map((issue) => issue.component),
      actionLabel: "查看进度",
      actionUrl: `/system-repair?tab=auto-fix`,
    })

    toast({
      title: "自动修复开始",
      description: `开始修复 ${issues.length} 个问题`,
    })

    // 模拟修复过程
    for (let i = 0; i < issues.length; i++) {
      const issue = issues[i]
      setCurrentIssue(issue.component)

      // 通知当前修复的组件
      addRepairNotification({
        title: `正在修复: ${issue.component}`,
        message: `正在修复 ${issue.component} 中的 ${issue.type} 问题`,
        level: "info",
        source: "自动修复引擎",
        repairId,
        status: "started",
        affectedComponents: [issue.component],
      })

      // 模拟修复延迟
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 随机决定是否修复成功 (90%成功率)
      const success = Math.random() > 0.1

      if (success) {
        setFixedIssues((prev) => [...prev, issue.id])

        // 通知修复成功
        addRepairNotification({
          title: `修复成功: ${issue.component}`,
          message: `成功修复 ${issue.component} 中的 ${issue.type} 问题`,
          level: "success",
          source: "自动修复引擎",
          repairId,
          status: "completed",
          affectedComponents: [issue.component],
        })
      } else {
        // 通知修复失败
        addRepairNotification({
          title: `修复失败: ${issue.component}`,
          message: `修复 ${issue.component} 中的 ${issue.type} 问题失败`,
          level: "error",
          source: "自动修复引擎",
          repairId,
          status: "failed",
          affectedComponents: [issue.component],
          actionLabel: "手动修复",
          actionUrl: `/system-repair?component=${encodeURIComponent(issue.component)}`,
        })

        toast({
          title: "修复失败",
          description: `修复 ${issue.component} 中的问题失败`,
          variant: "destructive",
        })
      }

      // 更新进度
      setProgress(Math.round(((i + 1) / issues.length) * 100))
    }

    setCurrentIssue(null)

    // 通知修复完成
    const successRate = (fixedIssues.length / issues.length) * 100

    addRepairNotification({
      title: "自动修复完成",
      message: `修复完成，成功率: ${successRate.toFixed(0)}%`,
      level: successRate === 100 ? "success" : successRate >= 50 ? "warning" : "error",
      source: "自动修复引擎",
      repairId,
      status: "completed",
      affectedComponents: issues.map((issue) => issue.component),
      actionLabel: "查看详情",
      actionUrl: `/system-repair/history?id=${repairId}`,
    })

    toast({
      title: "自动修复完成",
      description: `修复完成，成功率: ${successRate.toFixed(0)}%`,
      variant: successRate === 100 ? "default" : "warning",
    })

    setIsFixing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>自动修复引擎</CardTitle>
        <CardDescription>自动检测并修复系统中的问题</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {issues.length > 0 ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>待修复问题: {issues.length}</span>
                <span>已修复: {fixedIssues.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
              {isFixing && currentIssue && <p className="text-sm text-muted-foreground">正在修复: {currentIssue}</p>}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">问题列表</h3>
              <ul className="space-y-1">
                {issues.map((issue) => (
                  <li key={issue.id} className="text-sm flex items-center">
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        fixedIssues.includes(issue.id)
                          ? "bg-green-500"
                          : issue.severity === "critical"
                            ? "bg-red-500"
                            : issue.severity === "high"
                              ? "bg-orange-500"
                              : issue.severity === "medium"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                      }`}
                    />
                    <span className={fixedIssues.includes(issue.id) ? "line-through text-muted-foreground" : ""}>
                      {issue.component}: {issue.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">没有检测到需要修复的问题</div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={startAutoFix} disabled={isFixing || issues.length === 0} className="w-full">
          {isFixing ? "修复中..." : "开始自动修复"}
        </Button>
      </CardFooter>
    </Card>
  )
}
