"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useSystemTools, type SystemIssue } from "@/components/system-tools/system-tools-context"
import { AlertTriangle, CheckCircle, XCircle, ArrowLeft, Wrench, Clock, Loader2 } from "lucide-react"

export default function IssueDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { issues, fixIssue, dismissIssue } = useSystemTools()

  const [issue, setIssue] = useState<SystemIssue | null>(null)
  const [isFixing, setIsFixing] = useState(false)
  const [fixProgress, setFixProgress] = useState(0)

  // 获取问题详情
  useEffect(() => {
    if (params.id) {
      const foundIssue = issues.find((i) => i.id === params.id)
      if (foundIssue) {
        setIssue(foundIssue)
      }
    }
  }, [params.id, issues])

  // 修复问题
  const handleFixIssue = async () => {
    if (!issue) return

    setIsFixing(true)
    setFixProgress(0)

    try {
      // 模拟修复进度
      const progressInterval = setInterval(() => {
        setFixProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      // 执行实际修复
      const success = await fixIssue(issue.id)

      // 清除进度间隔
      clearInterval(progressInterval)

      // 设置最终进度
      setFixProgress(100)

      // 如果修复成功，更新问题状态
      if (success) {
        const updatedIssue = issues.find((i) => i.id === issue.id)
        if (updatedIssue) {
          setIssue(updatedIssue)
        }
      }
    } catch (error) {
      console.error("修复问题时出错:", error)
    } finally {
      // 延迟重置状态，让用户看到100%进度
      setTimeout(() => {
        setIsFixing(false)
        setFixProgress(0)
      }, 1000)
    }
  }

  // 忽略问题
  const handleDismissIssue = () => {
    if (!issue) return

    dismissIssue(issue.id)
    router.push("/system-tools")
  }

  // 返回系统工具页面
  const handleBack = () => {
    router.push("/system-tools")
  }

  // 如果问题不存在
  if (!issue) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>问题不存在</AlertTitle>
          <AlertDescription>找不到指定的问题，可能已被删除或修复。</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回系统工具
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" className="mb-4" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回系统工具
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <CardTitle className="text-xl flex items-center">
                {issue.severity === "critical" && <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />}
                {issue.severity === "high" && <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />}
                {issue.severity === "medium" && <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />}
                {issue.severity === "low" && <AlertTriangle className="h-5 w-5 text-green-500 mr-2" />}
                {issue.title}
              </CardTitle>
              <CardDescription>{issue.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getSeverityClass(issue.severity)}>
                {getSeverityLabel(issue.severity)}
              </Badge>
              <Badge variant="outline" className={getStatusClass(issue.status)}>
                {getStatusLabel(issue.status)}
              </Badge>
              {issue.autoFixable && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  可自动修复
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 修复进度 */}
          {isFixing && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">修复进度</span>
                <span className="text-sm font-medium">{fixProgress}%</span>
              </div>
              <Progress value={fixProgress} className="h-2" />
            </div>
          )}

          {/* 问题详情 */}
          <div>
            <h3 className="text-lg font-medium mb-2">问题详情</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">问题类别:</span>
                  <span className="ml-2">{getCategoryLabel(issue.category)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">检测时间:</span>
                  <span className="ml-2">{issue.createdAt.toLocaleString()}</span>
                </div>
                {issue.updatedAt && (
                  <div>
                    <span className="text-sm font-medium">更新时间:</span>
                    <span className="ml-2">{issue.updatedAt.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">修复方式:</span>
                  <span className="ml-2">{issue.autoFixable ? "可自动修复" : "需手动修复"}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">当前状态:</span>
                  <span className="ml-2 flex items-center">
                    {issue.status === "detected" && <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />}
                    {issue.status === "fixing" && <Loader2 className="h-4 w-4 text-blue-500 animate-spin mr-1" />}
                    {issue.status === "fixed" && <CheckCircle className="h-4 w-4 text-green-500 mr-1" />}
                    {issue.status === "failed" && <XCircle className="h-4 w-4 text-red-500 mr-1" />}
                    {getStatusLabel(issue.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 修复步骤 */}
          {issue.fixSteps && issue.fixSteps.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">修复步骤</h3>
              <ol className="list-decimal list-inside space-y-2">
                {issue.fixSteps.map((step, index) => (
                  <li key={index} className="text-sm">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* 修复状态 */}
          {issue.status === "fixed" && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>问题已修复</AlertTitle>
              <AlertDescription>
                此问题已成功修复，系统运行正常。
                {issue.updatedAt && (
                  <div className="mt-1 text-xs flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    修复时间: {issue.updatedAt.toLocaleString()}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {issue.status === "failed" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>修复失败</AlertTitle>
              <AlertDescription>
                自动修复失败，请尝试手动修复此问题。
                {issue.updatedAt && (
                  <div className="mt-1 text-xs flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    尝试时间: {issue.updatedAt.toLocaleString()}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleDismissIssue}>
            {issue.status === "fixed" ? "归档问题" : "忽略问题"}
          </Button>

          {issue.status === "detected" && issue.fixable && (
            <Button onClick={handleFixIssue} disabled={isFixing}>
              {isFixing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  修复中...
                </>
              ) : (
                <>
                  <Wrench className="mr-2 h-4 w-4" />
                  {issue.autoFixable ? "自动修复" : "手动修复"}
                </>
              )}
            </Button>
          )}

          {issue.status === "failed" && issue.fixable && (
            <Button onClick={handleFixIssue} disabled={isFixing}>
              <Wrench className="mr-2 h-4 w-4" />
              重试修复
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

// 获取严重程度标签
function getSeverityLabel(severity: string): string {
  switch (severity) {
    case "critical":
      return "严重"
    case "high":
      return "高风险"
    case "medium":
      return "中风险"
    case "low":
      return "低风险"
    default:
      return severity
  }
}

// 获取严重程度样式类
function getSeverityClass(severity: string): string {
  switch (severity) {
    case "critical":
      return "bg-red-50 text-red-700 border-red-200"
    case "high":
      return "bg-orange-50 text-orange-700 border-orange-200"
    case "medium":
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "low":
      return "bg-green-50 text-green-700 border-green-200"
    default:
      return ""
  }
}

// 获取状态标签
function getStatusLabel(status: string): string {
  switch (status) {
    case "detected":
      return "已检测"
    case "fixing":
      return "修复中"
    case "fixed":
      return "已修复"
    case "failed":
      return "修复失败"
    default:
      return status
  }
}

// 获取状态样式类
function getStatusClass(status: string): string {
  switch (status) {
    case "detected":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "fixing":
      return "bg-purple-50 text-purple-700 border-purple-200"
    case "fixed":
      return "bg-green-50 text-green-700 border-green-200"
    case "failed":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return ""
  }
}

// 获取类别标签
function getCategoryLabel(category: string): string {
  switch (category) {
    case "performance":
      return "性能问题"
    case "security":
      return "安全问题"
    case "compatibility":
      return "兼容性问题"
    case "functionality":
      return "功能问题"
    case "data":
      return "数据问题"
    default:
      return category
  }
}
