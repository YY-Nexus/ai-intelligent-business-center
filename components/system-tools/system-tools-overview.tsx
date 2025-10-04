"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSystemTools, type SystemToolType } from "./system-tools-context"
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Shield,
  Activity,
  Database,
  RefreshCw,
  Wrench,
  Loader2,
} from "lucide-react"

export function SystemToolsOverview() {
  const { activeToolType, toolStatus, progress, issues, startTool, stopTool, fixAllIssues, refreshIssues, scanSystem } =
    useSystemTools()

  const [activeTab, setActiveTab] = useState<string>("overview")

  // 计算问题统计
  const issueStats = {
    total: issues.length,
    critical: issues.filter((i) => i.severity === "critical").length,
    high: issues.filter((i) => i.severity === "high").length,
    medium: issues.filter((i) => i.severity === "medium").length,
    low: issues.filter((i) => i.severity === "low").length,
    fixed: issues.filter((i) => i.status === "fixed").length,
    failed: issues.filter((i) => i.status === "failed").length,
    detected: issues.filter((i) => i.status === "detected").length,
    fixing: issues.filter((i) => i.status === "fixing").length,
    fixable: issues.filter((i) => i.fixable).length,
    autoFixable: issues.filter((i) => i.autoFixable).length,
  }

  // 计算系统健康度
  const calculateHealthScore = (): number => {
    if (issues.length === 0) return 100

    // 根据问题严重程度和状态计算健康度
    const weights = {
      critical: 10,
      high: 5,
      medium: 2,
      low: 1,
    }

    const totalWeight = issues.reduce((sum, issue) => {
      // 已修复的问题不计入
      if (issue.status === "fixed") return sum
      return sum + weights[issue.severity]
    }, 0)

    const maxWeight = issues.length * weights.critical

    // 健康度 = 100 - (总权重 / 最大可能权重) * 100
    return Math.max(0, Math.round(100 - (totalWeight / (maxWeight || 1)) * 100))
  }

  const healthScore = calculateHealthScore()

  // 获取健康度状态样式
  const getHealthStatusStyle = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    if (score >= 50) return "text-orange-500"
    return "text-red-500"
  }

  // 获取工具状态图标
  const getToolStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  // 启动工具
  const handleStartTool = async (type: SystemToolType) => {
    await startTool(type)
  }

  // 修复所有问题
  const handleFixAllIssues = async () => {
    await fixAllIssues()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>系统工具概览</CardTitle>
            <CardDescription>监控和管理系统健康状态</CardDescription>
          </div>
          <div className="flex items-center mt-2 md:mt-0">
            <span className="text-sm mr-2">系统健康度:</span>
            <span className={`text-xl font-bold ${getHealthStatusStyle(healthScore)}`}>{healthScore}%</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 工具进度条 */}
        {toolStatus === "running" && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">{activeToolType && getToolName(activeToolType)}进度</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* 问题统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />
                <div className="text-2xl font-bold">{issueStats.total}</div>
                <div className="text-xs text-muted-foreground">检测到的问题</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <Shield className="h-8 w-8 text-red-500 mb-2" />
                <div className="text-2xl font-bold">{issueStats.critical + issueStats.high}</div>
                <div className="text-xs text-muted-foreground">严重/高风险问题</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                <div className="text-2xl font-bold">{issueStats.fixed}</div>
                <div className="text-xs text-muted-foreground">已修复问题</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <Wrench className="h-8 w-8 text-blue-500 mb-2" />
                <div className="text-2xl font-bold">{issueStats.autoFixable}</div>
                <div className="text-xs text-muted-foreground">可自动修复</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 工具按钮 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4"
            onClick={() => handleStartTool("scanner")}
            disabled={toolStatus === "running"}
          >
            <Activity className="h-6 w-6 mb-2" />
            <span>系统扫描</span>
            {activeToolType === "scanner" && getToolStatusIcon(toolStatus)}
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-auto py-4"
            onClick={() => handleStartTool("optimizer")}
            disabled={toolStatus === "running"}
          >
            <Zap className="h-6 w-6 mb-2" />
            <span>系统优化</span>
            {activeToolType === "optimizer" && getToolStatusIcon(toolStatus)}
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-auto py-4"
            onClick={() => handleStartTool("fixer")}
            disabled={toolStatus === "running"}
          >
            <Wrench className="h-6 w-6 mb-2" />
            <span>问题修复</span>
            {activeToolType === "fixer" && getToolStatusIcon(toolStatus)}
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-auto py-4"
            onClick={() => handleStartTool("monitor")}
            disabled={toolStatus === "running"}
          >
            <Activity className="h-6 w-6 mb-2" />
            <span>系统监控</span>
            {activeToolType === "monitor" && getToolStatusIcon(toolStatus)}
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-auto py-4"
            onClick={() => handleStartTool("backup")}
            disabled={toolStatus === "running"}
          >
            <Database className="h-6 w-6 mb-2" />
            <span>系统备份</span>
            {activeToolType === "backup" && getToolStatusIcon(toolStatus)}
          </Button>
        </div>

        {/* 问题列表 */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="critical">严重问题</TabsTrigger>
            <TabsTrigger value="fixable">可修复问题</TabsTrigger>
            <TabsTrigger value="fixed">已修复问题</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-4 mt-4">
              {issues.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">系统状态良好，未发现问题</p>
                  <Button variant="outline" className="mt-4" onClick={() => scanSystem()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    运行系统扫描
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">最近检测到的问题</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => refreshIssues()}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        刷新
                      </Button>
                      {issueStats.autoFixable > 0 && (
                        <Button size="sm" onClick={() => handleFixAllIssues()}>
                          <Wrench className="mr-2 h-4 w-4" />
                          修复所有问题
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {issues.slice(0, 5).map((issue) => (
                      <div key={issue.id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              {issue.severity === "critical" && <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />}
                              {issue.severity === "high" && <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />}
                              <h4 className="font-medium">{issue.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">{issue.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getSeverityClass(issue.severity)}>
                              {getSeverityLabel(issue.severity)}
                            </Badge>
                            <Badge variant="outline" className={getStatusClass(issue.status)}>
                              {getStatusLabel(issue.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}

                    {issues.length > 5 && (
                      <Button variant="link" className="w-full" onClick={() => setActiveTab("fixable")}>
                        查看全部 {issues.length} 个问题
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="critical">
            <div className="space-y-4 mt-4">
              {issues.filter((i) => i.severity === "critical" || i.severity === "high").length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>没有严重问题</AlertTitle>
                  <AlertDescription>系统中没有严重或高风险问题，继续保持良好状态。</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {issues
                    .filter((i) => i.severity === "critical" || i.severity === "high")
                    .map((issue) => (
                      <div key={issue.id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              {issue.severity === "critical" && <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />}
                              {issue.severity === "high" && <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />}
                              <h4 className="font-medium">{issue.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">{issue.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getSeverityClass(issue.severity)}>
                              {getSeverityLabel(issue.severity)}
                            </Badge>
                            <Badge variant="outline" className={getStatusClass(issue.status)}>
                              {getStatusLabel(issue.status)}
                            </Badge>
                          </div>
                        </div>

                        {issue.status === "detected" && issue.fixable && (
                          <div className="mt-2 flex justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => (window.location.href = `/system-tools/issue/${issue.id}`)}
                            >
                              查看详情
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="fixable">
            <div className="space-y-4 mt-4">
              {issues.filter((i) => i.fixable && i.status === "detected").length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>没有待修复问题</AlertTitle>
                  <AlertDescription>系统中没有待修复的问题，所有可修复问题已处理。</AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">可修复问题</h3>
                    {issueStats.autoFixable > 0 && (
                      <Button size="sm" onClick={() => handleFixAllIssues()}>
                        <Wrench className="mr-2 h-4 w-4" />
                        修复所有问题
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {issues
                      .filter((i) => i.fixable && i.status === "detected")
                      .map((issue) => (
                        <div key={issue.id} className="p-3 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                {issue.severity === "critical" && (
                                  <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                                )}
                                {issue.severity === "high" && (
                                  <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
                                )}
                                <h4 className="font-medium">{issue.title}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground">{issue.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getSeverityClass(issue.severity)}>
                                {getSeverityLabel(issue.severity)}
                              </Badge>
                              {issue.autoFixable ? (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  可自动修复
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                  需手动修复
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="mt-2 flex justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => (window.location.href = `/system-tools/issue/${issue.id}`)}
                            >
                              查看详情
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="fixed">
            <div className="space-y-4 mt-4">
              {issues.filter((i) => i.status === "fixed").length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>没有已修复问题</AlertTitle>
                  <AlertDescription>系统中没有已修复的问题记录。</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {issues
                    .filter((i) => i.status === "fixed")
                    .map((issue) => (
                      <div key={issue.id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <h4 className="font-medium">{issue.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">{issue.description}</p>
                            {issue.updatedAt && (
                              <p className="text-xs text-muted-foreground mt-1">
                                修复时间: {issue.updatedAt.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getSeverityClass(issue.severity)}>
                              {getSeverityLabel(issue.severity)}
                            </Badge>
                            <Badge variant="outline" className={getStatusClass(issue.status)}>
                              {getStatusLabel(issue.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => stopTool()} disabled={toolStatus !== "running"}>
          取消当前操作
        </Button>
        <Button onClick={() => scanSystem()} disabled={toolStatus === "running"}>
          <Activity className="mr-2 h-4 w-4" />
          运行系统扫描
        </Button>
      </CardFooter>
    </Card>
  )
}

// 获取工具名称
function getToolName(type: SystemToolType): string {
  switch (type) {
    case "scanner":
      return "系统扫描"
    case "optimizer":
      return "系统优化"
    case "fixer":
      return "问题修复"
    case "monitor":
      return "系统监控"
    case "backup":
      return "系统备份"
  }
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
