"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  FileCheck,
  Layers,
  Workflow,
  PlusCircle,
  BarChart4,
  Lightbulb,
  Brain,
  Download,
  RefreshCw,
  Clock,
  Calendar,
  Settings,
} from "lucide-react"

import { FrameworkAudit } from "./framework-audit"
import { FileComplianceAudit } from "./file-compliance-audit"
import { InteractionAudit } from "./interaction-audit"
import { MissingFeaturesAudit } from "./missing-features-audit"
import { CompletionAnalysis } from "./completion-analysis"
import { RootCauseAnalysis } from "./root-cause-analysis"
import { SmartFixSuggestions } from "./smart-fix-suggestions"
import { HealthTrendAnalysis } from "./health-trend-analysis"
import { AutoFixEngine, type Problem, type RepairStrategy } from "./auto-fix-engine"

// 审计状态类型
type AuditStatus = "idle" | "running" | "completed"

// 审计结果类型
interface AuditResults {
  framework: { passed: number; warnings: number; failed: number; total: number }
  fileCompliance: { passed: number; warnings: number; failed: number; total: number }
  interaction: { passed: number; warnings: number; failed: number; total: number }
  missingFeatures: { identified: number; implemented: number; total: number }
}

// 审计历史记录类型
interface AuditHistory {
  id: string
  date: Date
  results: AuditResults
  healthScore: number
  issues: number
  fixedIssues: number
}

// 修复问题类型
interface FixableProblem extends Problem {
  auditType: "framework" | "fileCompliance" | "interaction" | "missingFeature"
  name: string
  description: string
}

export default function EnhancedAuditDashboard() {
  const [auditStatus, setAuditStatus] = useState<AuditStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<AuditResults>({
    framework: { passed: 0, warnings: 0, failed: 0, total: 0 },
    fileCompliance: { passed: 0, warnings: 0, failed: 0, total: 0 },
    interaction: { passed: 0, warnings: 0, failed: 0, total: 0 },
    missingFeatures: { identified: 0, implemented: 0, total: 0 },
  })
  const [activeTab, setActiveTab] = useState("overview")
  const [auditHistory, setAuditHistory] = useState<AuditHistory[]>([])
  const [lastAuditDate, setLastAuditDate] = useState<Date | null>(null)
  const [isAutoFixDialogOpen, setIsAutoFixDialogOpen] = useState(false)
  const [fixableProblems, setFixableProblems] = useState<FixableProblem[]>([])
  const [repairStrategy, setRepairStrategy] = useState<RepairStrategy>({
    fixFrameworkIssues: true,
    fixFileComplianceIssues: true,
    fixInteractionIssues: true,
    implementMissingFeatures: false,
    priorityOrder: "severity",
    frameworkPriority: 3,
    fileCompliancePriority: 2,
    interactionPriority: 1,
    missingFeaturePriority: 0,
    createBackupBeforeFix: true,
    rollbackOnFailureThreshold: 30,
    fixTimeout: 30,
  })
  const [scheduledAudit, setScheduledAudit] = useState(false)
  const [auditFrequency, setAuditFrequency] = useState("weekly")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const { toast } = useToast()

  // 启动实际审查过程
  const startAudit = async () => {
    setAuditStatus("running")
    setProgress(0)
    setActiveTab("overview")

    // 重置结果
    setResults({
      framework: { passed: 0, warnings: 0, failed: 0, total: 0 },
      fileCompliance: { passed: 0, warnings: 0, failed: 0, total: 0 },
      interaction: { passed: 0, warnings: 0, failed: 0, total: 0 },
      missingFeatures: { identified: 0, implemented: 0, total: 0 },
    })

    try {
      // 框架审查 - 25%进度
      setProgress(10)
      const frameworkResults = await performFrameworkAudit()
      setProgress(25)

      // 文件合规性审查 - 50%进度
      setProgress(35)
      const fileComplianceResults = await performFileComplianceAudit()
      setProgress(50)

      // 交互流畅性审查 - 75%进度
      setProgress(60)
      const interactionResults = await performInteractionAudit()
      setProgress(75)

      // 缺失功能识别 - 100%进度
      setProgress(85)
      const missingFeaturesResults = await identifyMissingFeatures()
      setProgress(100)

      // 更新审查结果
      const newResults = {
        framework: {
          passed: frameworkResults.passed,
          warnings: frameworkResults.warnings,
          failed: frameworkResults.failed,
          total: frameworkResults.total,
        },
        fileCompliance: {
          passed: fileComplianceResults.passed,
          warnings: fileComplianceResults.warnings,
          failed: fileComplianceResults.failed,
          total: fileComplianceResults.total,
        },
        interaction: {
          passed: interactionResults.passed,
          warnings: interactionResults.warnings,
          failed: interactionResults.failed,
          total: interactionResults.total,
        },
        missingFeatures: {
          identified: missingFeaturesResults.identified,
          implemented: missingFeaturesResults.implemented,
          total: missingFeaturesResults.total,
        },
      }

      setResults(newResults)
      setAuditStatus("completed")
      setLastAuditDate(new Date())

      // 更新审计历史
      const newAuditHistory: AuditHistory = {
        id: `audit-${Date.now()}`,
        date: new Date(),
        results: newResults,
        healthScore: calculateHealthScore(newResults),
        issues:
          newResults.framework.warnings +
          newResults.framework.failed +
          newResults.fileCompliance.warnings +
          newResults.fileCompliance.failed +
          newResults.interaction.warnings +
          newResults.interaction.failed +
          newResults.missingFeatures.identified,
        fixedIssues: 0,
      }

      setAuditHistory((prev) => [newAuditHistory, ...prev])

      // 收集可修复的问题
      collectFixableProblems(newResults)

      toast({
        title: "审计完成",
        description: `系统健康度: ${calculateHealthScore(newResults)}%，发现 ${
          newResults.framework.warnings +
          newResults.framework.failed +
          newResults.fileCompliance.warnings +
          newResults.fileCompliance.failed +
          newResults.interaction.warnings +
          newResults.interaction.failed
        } 个问题，${newResults.missingFeatures.identified} 个缺失功能`,
      })
    } catch (error) {
      console.error("审查过程出错:", error)
      toast({
        title: "审计失败",
        description: "审计过程中发生错误，请重试",
        variant: "destructive",
      })
      setAuditStatus("idle")
    }
  }

  // 收集可修复的问题
  const collectFixableProblems = (auditResults: AuditResults) => {
    // 在实际应用中，这里应该从审计结果中提取具体的问题
    // 这里使用模拟数据作为示例
    const problems: FixableProblem[] = [
      {
        id: "fw-1",
        problemId: "fw-1",
        type: "framework",
        name: "CSRF防护缺失",
        description: "表单提交缺少CSRF令牌验证，存在安全风险",
        status: "pending",
        severity: "high",
        auditType: "framework",
        fixDescription: "添加CSRF令牌验证机制",
      },
      {
        id: "fc-1",
        problemId: "fc-1",
        type: "fileCompliance",
        name: "环境变量配置不完整",
        description: "缺少必要的环境变量定义，可能导致运行时错误",
        status: "pending",
        severity: "medium",
        auditType: "fileCompliance",
        fixDescription: "创建完整的环境变量模板和验证机制",
      },
      {
        id: "ia-1",
        problemId: "ia-1",
        type: "interaction",
        name: "错误处理不完善",
        description: "网络错误处理机制不完善，用户体验不佳",
        status: "pending",
        severity: "medium",
        auditType: "interaction",
        fixDescription: "实现统一的错误处理机制",
      },
      {
        id: "mf-1",
        problemId: "mf-1",
        type: "missingFeature",
        name: "数据导出功能缺失",
        description: "系统缺少数据导出功能，影响用户数据管理",
        status: "pending",
        severity: "low",
        auditType: "missingFeature",
        fixDescription: "实现数据导出功能",
      },
    ]

    setFixableProblems(problems)
  }

  // 计算总体健康度评分
  const calculateHealthScore = (auditResults: AuditResults) => {
    const frameworkScore = (auditResults.framework.passed / auditResults.framework.total) * 100
    const fileScore = (auditResults.fileCompliance.passed / auditResults.fileCompliance.total) * 100
    const interactionScore = (auditResults.interaction.passed / auditResults.interaction.total) * 100

    return Math.round((frameworkScore + fileScore + interactionScore) / 3)
  }

  // 导出审查报告
  const exportReport = () => {
    // 实现导出报告的逻辑
    toast({
      title: "报告导出中",
      description: "正在生成审计报告，请稍候...",
    })

    // 模拟导出过程
    setTimeout(() => {
      toast({
        title: "报告已导出",
        description: "审计报告已成功导出到下载文件夹",
      })
    }, 2000)
  }

  // 打开自动修复对话框
  const openAutoFixDialog = () => {
    if (fixableProblems.length > 0) {
      setIsAutoFixDialogOpen(true)
    } else {
      toast({
        title: "没有可修复的问题",
        description: "当前没有发现需要修复的问题",
      })
    }
  }

  // 处理修复完成
  const handleFixComplete = (fixedProblems: Problem[]) => {
    // 更新已修复的问题数量
    const fixedCount = fixedProblems.filter((p) => p.status === "fixed").length

    if (auditHistory.length > 0) {
      setAuditHistory((prev) => {
        const updated = [...prev]
        updated[0] = { ...updated[0], fixedIssues: updated[0].fixedIssues + fixedCount }
        return updated
      })
    }

    toast({
      title: "修复完成",
      description: `成功修复了 ${fixedCount} 个问题，${fixedProblems.length - fixedCount} 个问题需要手动处理`,
    })

    // 关闭对话框
    setIsAutoFixDialogOpen(false)
  }

  // 切换定期审计
  const toggleScheduledAudit = () => {
    setScheduledAudit(!scheduledAudit)
    toast({
      title: !scheduledAudit ? "已启用定期审计" : "已禁用定期审计",
      description: !scheduledAudit
        ? `系统将${
            auditFrequency === "daily"
              ? "每天"
              : auditFrequency === "weekly"
                ? "每周"
                : auditFrequency === "biweekly"
                  ? "每两周"
                  : "每月"
          }自动执行审计`
        : "已取消定期审计计划",
    })
  }

  // 实际审查函数 - 这里需要替换为您的实际审查逻辑
  async function performFrameworkAudit() {
    // 实际检查应用框架完整性的逻辑
    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      passed: 10,
      warnings: 1,
      failed: 1,
      total: 12,
      items: [], // 实际审查项结果
    }
  }

  async function performFileComplianceAudit() {
    // 实际检查文件合规性的逻辑
    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      passed: 20,
      warnings: 3,
      failed: 1,
      total: 24,
      items: [], // 实际审查项结果
    }
  }

  async function performInteractionAudit() {
    // 实际检查交互流畅性的逻辑
    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      passed: 15,
      warnings: 2,
      failed: 1,
      total: 18,
      items: [], // 实际审查项结果
    }
  }

  async function identifyMissingFeatures() {
    // 实际识别缺失功能的逻辑
    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      identified: 5,
      implemented: 0,
      total: 5,
      items: [], // 实际缺失功能项
    }
  }

  // 自动执行首次审计
  useEffect(() => {
    // 可以选择自动执行或等待用户手动启动
    // startAudit();
  }, [])

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">系统全局审查</CardTitle>
              <CardDescription>全面检查系统框架完整性、文件合规性和交互流畅性，发现并解决问题</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {lastAuditDate && (
                <div className="text-sm text-muted-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  上次审计: {lastAuditDate.toLocaleString("zh-CN")}
                </div>
              )}
              <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="ml-2">
                <Settings className="h-4 w-4 mr-2" />
                设置
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isSettingsOpen && (
            <div className="mb-6 p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-4">审计设置</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">定期审计</h4>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="scheduled-audit"
                      checked={scheduledAudit}
                      onChange={toggleScheduledAudit}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="scheduled-audit">启用定期审计</label>
                  </div>
                  {scheduledAudit && (
                    <div className="mt-2">
                      <label htmlFor="audit-frequency" className="block text-sm mb-1">
                        审计频率
                      </label>
                      <select
                        id="audit-frequency"
                        value={auditFrequency}
                        onChange={(e) => setAuditFrequency(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="daily">每天</option>
                        <option value="weekly">每周</option>
                        <option value="biweekly">每两周</option>
                        <option value="monthly">每月</option>
                      </select>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">修复策略</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="fix-framework"
                        checked={repairStrategy.fixFrameworkIssues}
                        onChange={(e) => setRepairStrategy({ ...repairStrategy, fixFrameworkIssues: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="fix-framework">修复框架问题</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="fix-compliance"
                        checked={repairStrategy.fixFileComplianceIssues}
                        onChange={(e) =>
                          setRepairStrategy({ ...repairStrategy, fixFileComplianceIssues: e.target.checked })
                        }
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="fix-compliance">修复文件合规性问题</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="fix-interaction"
                        checked={repairStrategy.fixInteractionIssues}
                        onChange={(e) =>
                          setRepairStrategy({ ...repairStrategy, fixInteractionIssues: e.target.checked })
                        }
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="fix-interaction">修复交互问题</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="implement-features"
                        checked={repairStrategy.implementMissingFeatures}
                        onChange={(e) =>
                          setRepairStrategy({ ...repairStrategy, implementMissingFeatures: e.target.checked })
                        }
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="implement-features">实现缺失功能</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">优先级顺序</h4>
                <select
                  value={repairStrategy.priorityOrder}
                  onChange={(e) => setRepairStrategy({ ...repairStrategy, priorityOrder: e.target.value as any })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="severity">按严重程度</option>
                  <option value="fixSuccess">按修复成功率</option>
                  <option value="custom">自定义优先级</option>
                </select>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(false)}>
                  关闭设置
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
            <Button onClick={startAudit} disabled={auditStatus === "running"} className="w-full md:w-auto">
              <Play className="mr-2 h-4 w-4" />
              启动全局审查
            </Button>

            <div className="w-full">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">审查进度</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {auditStatus === "completed" && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">系统健康度:</span>
                <Badge
                  variant={
                    calculateHealthScore(results) > 80
                      ? "default"
                      : calculateHealthScore(results) > 60
                        ? "outline"
                        : "destructive"
                  }
                >
                  {calculateHealthScore(results)}%
                </Badge>
              </div>
            )}
          </div>

          {auditStatus === "completed" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Layers className="mr-2 h-4 w-4" />
                    框架完整性
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-green-50">
                        <CheckCircle className="mr-1 h-3 w-3" /> {results.framework.passed}
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-50">
                        <AlertTriangle className="mr-1 h-3 w-3" /> {results.framework.warnings}
                      </Badge>
                      <Badge variant="outline" className="bg-red-50">
                        <XCircle className="mr-1 h-3 w-3" /> {results.framework.failed}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">共 {results.framework.total} 项</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <FileCheck className="mr-2 h-4 w-4" />
                    文件合规性
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-green-50">
                        <CheckCircle className="mr-1 h-3 w-3" /> {results.fileCompliance.passed}
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-50">
                        <AlertTriangle className="mr-1 h-3 w-3" /> {results.fileCompliance.warnings}
                      </Badge>
                      <Badge variant="outline" className="bg-red-50">
                        <XCircle className="mr-1 h-3 w-3" /> {results.fileCompliance.failed}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">共 {results.fileCompliance.total} 项</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Workflow className="mr-2 h-4 w-4" />
                    交互流畅性
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-green-50">
                        <CheckCircle className="mr-1 h-3 w-3" /> {results.interaction.passed}
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-50">
                        <AlertTriangle className="mr-1 h-3 w-3" /> {results.interaction.warnings}
                      </Badge>
                      <Badge variant="outline" className="bg-red-50">
                        <XCircle className="mr-1 h-3 w-3" /> {results.interaction.failed}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">共 {results.interaction.total} 项</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">缺失功能</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-blue-50">
                        已识别: {results.missingFeatures.identified}
                      </Badge>
                      <Badge variant="outline" className="bg-green-50">
                        已实现: {results.missingFeatures.implemented}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">共 {results.missingFeatures.identified} 项</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {auditStatus === "completed" && (
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4">
                <TabsTrigger value="overview">总览</TabsTrigger>
                <TabsTrigger value="framework">框架完整性</TabsTrigger>
                <TabsTrigger value="fileCompliance">文件合规性</TabsTrigger>
                <TabsTrigger value="interaction">交互流畅性</TabsTrigger>
                <TabsTrigger value="missingFeatures">缺失功能</TabsTrigger>
                <TabsTrigger value="advanced">高级分析</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">审计摘要</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">系统健康状况</h3>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div
                                className={`h-2.5 rounded-full ${
                                  calculateHealthScore(results) > 80
                                    ? "bg-green-500"
                                    : calculateHealthScore(results) > 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${calculateHealthScore(results)}%` }}
                              ></div>
                            </div>
                            <span>{calculateHealthScore(results)}%</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">问题分布</h3>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="p-2 bg-gray-50 rounded-md text-center">
                              <div className="text-lg font-bold">
                                {results.framework.warnings + results.framework.failed}
                              </div>
                              <div className="text-xs text-muted-foreground">框架问题</div>
                            </div>
                            <div className="p-2 bg-gray-50 rounded-md text-center">
                              <div className="text-lg font-bold">
                                {results.fileCompliance.warnings + results.fileCompliance.failed}
                              </div>
                              <div className="text-xs text-muted-foreground">文件问题</div>
                            </div>
                            <div className="p-2 bg-gray-50 rounded-md text-center">
                              <div className="text-lg font-bold">
                                {results.interaction.warnings + results.interaction.failed}
                              </div>
                              <div className="text-xs text-muted-foreground">交互问题</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">缺失功能</h3>
                          <div className="p-2 bg-gray-50 rounded-md">
                            <div className="flex justify-between items-center">
                              <span>已识别功能点</span>
                              <span className="font-bold">{results.missingFeatures.identified}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span>已实现功能点</span>
                              <span className="font-bold">{results.missingFeatures.implemented}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span>功能完整度</span>
                              <span className="font-bold">
                                {results.missingFeatures.total > 0
                                  ? Math.round(
                                      (results.missingFeatures.implemented / results.missingFeatures.total) * 100,
                                    )
                                  : 0}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">审计历史</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {auditHistory.length > 0 ? (
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-4">
                            {auditHistory.map((history) => (
                              <div key={history.id} className="p-3 border rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>{history.date.toLocaleString("zh-CN")}</span>
                                  </div>
                                  <Badge
                                    variant={
                                      history.healthScore > 80
                                        ? "default"
                                        : history.healthScore > 60
                                          ? "outline"
                                          : "destructive"
                                    }
                                  >
                                    {history.healthScore}%
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>发现问题: {history.issues}</div>
                                  <div>已修复: {history.fixedIssues}</div>
                                </div>
                                <div className="mt-2 flex justify-end">
                                  <Button variant="ghost" size="sm">
                                    查看详情
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <BarChart4 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>暂无审计历史记录</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">快速操作</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                          variant="outline"
                          className="h-auto py-4 flex flex-col items-center justify-center"
                          onClick={() => setActiveTab("advanced")}
                        >
                          <Brain className="h-8 w-8 mb-2" />
                          <div className="text-sm font-medium">根因分析</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            深入分析问题根本原因，提供针对性修复建议
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="h-auto py-4 flex flex-col items-center justify-center"
                          onClick={openAutoFixDialog}
                        >
                          <Lightbulb className="h-8 w-8 mb-2" />
                          <div className="text-sm font-medium">智能修复</div>
                          <div className="text-xs text-muted-foreground mt-1">自动修复发现的问题，提高系统健康度</div>
                        </Button>

                        <Button
                          variant="outline"
                          className="h-auto py-4 flex flex-col items-center justify-center"
                          onClick={() => setActiveTab("missingFeatures")}
                        >
                          <PlusCircle className="h-8 w-8 mb-2" />
                          <div className="text-sm font-medium">功能实现</div>
                          <div className="text-xs text-muted-foreground mt-1">查看并实现系统中缺失的功能点</div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="framework">
                <FrameworkAudit results={results.framework} />
              </TabsContent>

              <TabsContent value="fileCompliance">
                <FileComplianceAudit results={results.fileCompliance} />
              </TabsContent>

              <TabsContent value="interaction">
                <InteractionAudit results={results.interaction} />
              </TabsContent>

              <TabsContent value="missingFeatures">
                <MissingFeaturesAudit results={results.missingFeatures} />
              </TabsContent>

              <TabsContent value="advanced">
                <Tabs defaultValue="completion">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="completion">完成度分析</TabsTrigger>
                    <TabsTrigger value="rootCause">根因分析</TabsTrigger>
                    <TabsTrigger value="smartFix">智能修复建议</TabsTrigger>
                    <TabsTrigger value="healthTrend">健康趋势分析</TabsTrigger>
                  </TabsList>

                  <TabsContent value="completion">
                    <CompletionAnalysis />
                  </TabsContent>

                  <TabsContent value="rootCause">
                    <RootCauseAnalysis />
                  </TabsContent>

                  <TabsContent value="smartFix">
                    <SmartFixSuggestions />
                  </TabsContent>

                  <TabsContent value="healthTrend">
                    <HealthTrendAnalysis />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportReport}>
              <Download className="mr-2 h-4 w-4" />
              导出审查报告
            </Button>
            <Button variant="outline" onClick={toggleScheduledAudit}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {scheduledAudit ? "禁用定期审计" : "启用定期审计"}
            </Button>
          </div>
          <Button disabled={auditStatus !== "completed"} onClick={openAutoFixDialog}>
            <Lightbulb className="mr-2 h-4 w-4" />
            智能修复问题
          </Button>
        </CardFooter>
      </Card>

      {/* 自动修复对话框 */}
      {isAutoFixDialogOpen && (
        <AutoFixEngine
          problems={fixableProblems}
          isOpen={isAutoFixDialogOpen}
          onClose={() => setIsAutoFixDialogOpen(false)}
          onFixComplete={handleFixComplete}
          strategy={repairStrategy}
        />
      )}
    </div>
  )
}
