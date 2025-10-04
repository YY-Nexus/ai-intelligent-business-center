"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export interface FrameworkAuditProps {
  projectType?: string
}

export function FrameworkAudit({ projectType = "Next.js" }: FrameworkAuditProps) {
  const [auditResults, setAuditResults] = useState<{
    completed: boolean
    issues: string[]
    recommendations: string[]
  }>({
    completed: false,
    issues: [],
    recommendations: [],
  })

  const [isAuditing, setIsAuditing] = useState(false)

  const frameworkChecks = [
    { id: "routing", label: "路由配置检查" },
    { id: "components", label: "组件结构审查" },
    { id: "state", label: "状态管理审计" },
    { id: "api", label: "API集成检查" },
    { id: "performance", label: "性能优化审计" },
  ]

  const [selectedChecks, setSelectedChecks] = useState<string[]>(frameworkChecks.map((check) => check.id))

  const toggleCheck = (id: string) => {
    setSelectedChecks((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const runAudit = async () => {
    setIsAuditing(true)

    // 模拟审计过程
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setAuditResults({
      completed: true,
      issues: ["路由配置中发现潜在的冲突", "部分组件缺少错误边界处理", "API请求缺少超时处理"],
      recommendations: [
        "优化路由配置，避免模式冲突",
        "为关键组件添加错误边界",
        "实现API请求超时和重试机制",
        "考虑添加性能监控",
      ],
    })

    setIsAuditing(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>框架审计</CardTitle>
        <CardDescription>检查{projectType}项目的框架配置和最佳实践</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {frameworkChecks.map((check) => (
              <div key={check.id} className="flex items-center space-x-2">
                <Checkbox
                  id={check.id}
                  checked={selectedChecks.includes(check.id)}
                  onCheckedChange={() => toggleCheck(check.id)}
                />
                <Label htmlFor={check.id}>{check.label}</Label>
              </div>
            ))}
          </div>

          <Button onClick={runAudit} disabled={isAuditing || selectedChecks.length === 0} className="w-full">
            {isAuditing ? "审计中..." : "运行框架审计"}
          </Button>

          {auditResults.completed && (
            <div className="space-y-4 mt-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>发现问题 ({auditResults.issues.length})</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2">
                    {auditResults.issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>建议 ({auditResults.recommendations.length})</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2">
                    {auditResults.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
