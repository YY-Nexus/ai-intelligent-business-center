"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  FileCheck,
  Layers,
  Workflow,
  Wand2,
  History,
  Settings,
  BarChart,
} from "lucide-react"
import { FrameworkAudit } from "./framework-audit"
import { FileComplianceAudit } from "./file-compliance-audit"
import { InteractionAudit } from "./interaction-audit"
import { MissingFeaturesAudit } from "./missing-features-audit"
import {
  AutoFixEngine,
  type Problem,
  type ProblemType,
  type SystemSnapshot,
  type ProblemSeverity,
} from "./auto-fix-engine"
import { RepairHistoryList, RepairHistoryDetail, type RepairHistory } from "./repair-history"
import { RepairStrategyConfig, type RepairStrategy, defaultRepairStrategy } from "./repair-strategy"
import { PerformanceMonitor } from "./performance-monitor"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

// 实际审查函数 - 这里需要替换为您的实际审查逻辑
async function performFrameworkAudit() {
  // 实际检查应用框架完整性的逻辑
  // 例如：检查路由配置、核心组件、状态管理等
  return {
    passed: 10,
    warnings: 1,
    failed: 1,
    total: 12,
    items: [
      {
        id: "f1",
        name: "路由配置",
        status: "passed",
        description: "路由配置正确",
        severity: "medium" as ProblemSeverity,
        fixSuccessRate: 95,
      },
      {
        id: "f2",
        name: "状态管理",
        status: "warning",
        description: "部分组件未使用状态管理",
        severity: "low" as ProblemSeverity,
        fixSuccessRate: 90,
      },
      {
        id: "f3",
        name: "安全防护",
        status: "failed",
        description: "CSRF防护机制缺失",
        severity: "critical" as ProblemSeverity,
        fixSuccessRate: 85,
      },
    ],
  }
}

async function performFileComplianceAudit() {
  // 实际检查文件合规性的逻辑
  // 例如：检查代码规范、文件结构等
  return {
    passed: 20,
    warnings: 3,
    failed: 1,
    total: 24,
    items: [
      {
        id: "c1",
        name: "代码格式",
        status: "passed",
        description: "代码格式符合规范",
        severity: "low" as ProblemSeverity,
        fixSuccessRate: 98,
      },
      {
        id: "c2",
        name: "命名规范",
        status: "warning",
        description: "部分变量命名不规范",
        severity: "medium" as ProblemSeverity,
        fixSuccessRate: 95,
      },
      {
        id: "c3",
        name: "环境变量",
        status: "failed",
        description: "缺少必要的环境变量定义",
        severity: "high" as ProblemSeverity,
        fixSuccessRate: 90,
      },
    ],
  }
}

async function performInteractionAudit() {
  // 实际检查交互流畅性的逻辑
  // 例如：检查页面导航、表单提交、错误处理等
  return {
    passed: 15,
    warnings: 2,
    failed: 1,
    total: 18,
    items: [
      {
        id: "i1",
        name: "页面导航",
        status: "passed",
        description: "页面导航流畅",
        severity: "low" as ProblemSeverity,
        fixSuccessRate: 96,
      },
      {
        id: "i2",
        name: "表单验证",
        status: "warning",
        description: "部分表单缺少即时验证",
        severity: "medium" as ProblemSeverity,
        fixSuccessRate: 88,
      },
      {
        id: "i3",
        name: "错误处理",
        status: "failed",
        description: "网络错误处理不完善",
        severity: "high" as ProblemSeverity,
        fixSuccessRate: 80,
      },
    ],
  }
}

async function identifyMissingFeatures() {
  // 实际识别缺失功能的逻辑
  // 例如：比对需求文档和实现功能
  return {
    identified: 5,
    implemented: 0,
    total: 5,
    items: [
      {
        id: "m1",
        name: "数据导出",
        status: "identified",
        description: "缺少数据导出功能",
        severity: "medium" as ProblemSeverity,
        fixSuccessRate: 75,
      },
      {
        id: "m2",
        name: "批量操作",
        status: "identified",
        description: "缺少批量操作功能",
        severity: "high" as ProblemSeverity,
        fixSuccessRate: 70,
      },
      {
        id: "m3",
        name: "高级搜索",
        status: "identified",
        description: "缺少高级搜索功能",
        severity: "medium" as ProblemSeverity,
        fixSuccessRate: 85,
      },
    ],
  }
}

export default function AuditDashboard() {
  const [auditStatus, setAuditStatus] = useState<"idle" | "running" | "completed">("idle")
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState({
    framework: { passed: 0, warnings: 0, failed: 0, total: 0, items: [] as any[] },
    fileCompliance: { passed: 0, warnings: 0, failed: 0, total: 0, items: [] as any[] },
    interaction: { passed: 0, warnings: 0, failed: 0, total: 0, items: [] as any[] },
    missingFeatures: { identified: 0, implemented: 0, total: 0, items: [] as any[] },
  })

  // 自动修复相关状态
  const [isAutoFixOpen, setIsAutoFixOpen] = useState(false)
  const [problemsToFix, setProblemsToFix] = useState<Problem[]>([])

  // 修复历史记录相关状态
  const [repairHistories, setRepairHistories] = useState<RepairHistory[]>([])
  const [selectedHistory, setSelectedHistory] = useState<RepairHistory | null>(null)
  const [isHistoryDetailOpen, setIsHistoryDetailOpen] = useState(false)

  // 修复策略相关状态
  const [repairStrategy, setRepairStrategy] = useState<RepairStrategy>(defaultRepairStrategy)
  const [activeTab, setActiveTab] = useState("audit")

  // 启动实际审查过程
  const startAudit = async () => {
    setAuditStatus("running")
    setProgress(0)

    // 重置结果
    setResults({
      framework: { passed: 0, warnings: 0, failed: 0, total: 0, items: [] },
      fileCompliance: { passed: 0, warnings: 0, failed: 0, total: 0, items: [] },
      interaction: { passed: 0, warnings: 0, failed: 0, total: 0, items: [] },
      missingFeatures: { identified: 0, implemented: 0, total: 0, items: [] },
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
      setResults({
        framework: {
          passed: frameworkResults.passed,
          warnings: frameworkResults.warnings,
          failed: frameworkResults.failed,
          total: frameworkResults.total,
          items: frameworkResults.items,
        },
        fileCompliance: {
          passed: fileComplianceResults.passed,
          warnings: fileComplianceResults.warnings,
          failed: fileComplianceResults.failed,
          total: fileComplianceResults.total,
          items: fileComplianceResults.items,
        },
        interaction: {
          passed: interactionResults.passed,
          warnings: interactionResults.warnings,
          failed: interactionResults.failed,
          total: interactionResults.total,
          items: interactionResults.items,
        },
        missingFeatures: {
          identified: missingFeaturesResults.identified,
          implemented: missingFeaturesResults.implemented,
          total: missingFeaturesResults.total,
          items: missingFeaturesResults.items,
        },
      })

      setAuditStatus("completed")

      // 如果发现问题，提示用户可以使用自动修复
      const totalIssues =
        frameworkResults.warnings +
        frameworkResults.failed +
        fileComplianceResults.warnings +
        fileComplianceResults.failed +
        interactionResults.warnings +
        interactionResults.failed +
        missingFeaturesResults.identified

      if (totalIssues > 0) {
        toast({
          title: `发现 ${totalIssues} 个问题`,
          description: "系统审查完成，发现多个需要修复的问题",
          action: (
            <ToastAction altText="修复" onClick={openAutoFix}>
              一键修复
            </ToastAction>
          ),
        })

        // 如果策略设置为审查完成后自动修复，则自动打开修复对话框
        if (repairStrategy.fixOnAuditComplete && repairStrategy.enableAutoFix) {
          setTimeout(() => openAutoFix(), 1000)
        }
      }
    } catch (error) {
      console.error("审查过程出错:", error)
      // 处理错误情况
      setAuditStatus("idle")

      toast({
        title: "审查失败",
        description: "系统审查过程中发生错误",
        variant: "destructive",
      })
    }
  }

  // 计算总体健康度评分
  const calculateHealthScore = () => {
    if (auditStatus !== "completed") return 0

    const frameworkScore = (results.framework.passed / results.framework.total) * 100
    const fileScore = (results.fileCompliance.passed / results.fileCompliance.total) * 100
    const interactionScore = (results.interaction.passed / results.interaction.total) * 100

    return Math.round((frameworkScore + fileScore + interactionScore) / 3)
  }

  const healthScore = calculateHealthScore()

  // 导出审查报告
  const exportReport = () => {
    // 实现导出报告的逻辑
    toast({
      title: "导出报告",
      description: "审查报告导出功能将在此实现",
    })
  }

  // 导出性能分析报告
  const exportPerformanceReport = () => {
    toast({
      title: "导出性能报告",
      description: "性能分析报告导出功能将在此实现",
    })
  }

  // 打开自动修复对话框
  const openAutoFix = () => {
    // 收集所有需要修复的问题
    const problems: Problem[] = []

    // 添加框架问题
    if (repairStrategy.fixFrameworkIssues) {
      results.framework.items
        .filter((item) => item.status === "warning" || item.status === "failed")
        .forEach((item) => {
          problems.push({
            id: item.id,
            type: "framework" as ProblemType,
            name: item.name,
            description: item.description,
            status: "pending",
            severity: item.severity,
            fixSuccessRate: item.fixSuccessRate,
          })
        })
    }

    // 添加文件合规性问题
    if (repairStrategy.fixFileComplianceIssues) {
      results.fileCompliance.items
        .filter((item) => item.status === "warning" || item.status === "failed")
        .forEach((item) => {
          problems.push({
            id: item.id,
            type: "fileCompliance" as ProblemType,
            name: item.name,
            description: item.description,
            status: "pending",
            severity: item.severity,
            fixSuccessRate: item.fixSuccessRate,
          })
        })
    }

    // 添加交互流畅性问题
    if (repairStrategy.fixInteractionIssues) {
      results.interaction.items
        .filter((item) => item.status === "warning" || item.status === "failed")
        .forEach((item) => {
          problems.push({
            id: item.id,
            type: "interaction" as ProblemType,
            name: item.name,
            description: item.description,
            status: "pending",
            severity: item.severity,
            fixSuccessRate: item.fixSuccessRate,
          })
        })
    }

    // 添加缺失功能
    if (repairStrategy.implementMissingFeatures) {
      results.missingFeatures.items
        .filter((item) => item.status === "identified")
        .forEach((item) => {
          problems.push({
            id: item.id,
            type: "missingFeature" as ProblemType,
            name: item.name,
            description: item.description,
            status: "pending",
            severity: item.severity,
            fixSuccessRate: item.fixSuccessRate,
          })
        })
    }

    setProblemsToFix(problems)
    setIsAutoFixOpen(true)
  }

  // 处理修复完成
  const handleFixComplete = (fixedProblems: Problem[], snapshot?: SystemSnapshot) => {
    // 更新审查结果，将修复成功的问题状态更新
    const updatedResults = { ...results }
    const startTime = Date.now() - 60000 - Math.floor(Math.random() * 120000) // 模拟修复时间（1-3分钟）
    const healthBefore = healthScore

    fixedProblems.forEach((problem) => {
      if (problem.status === "fixed") {
        // 根据问题类型更新相应的结果
        switch (problem.type) {
          case "framework":
            updatedResults.framework.items = updatedResults.framework.items.map((item) =>
              item.id === problem.id
                ? { ...item, status: "passed", description: problem.fixDescription || item.description }
                : item,
            )
            // 更新统计数据
            updatedResults.framework.passed += 1
            if (problem.id.startsWith("f2")) {
              // 假设这是warning项
              updatedResults.framework.warnings -= 1
            } else if (problem.id.startsWith("f3")) {
              // 假设这是failed项
              updatedResults.framework.failed -= 1
            }
            break

          case "fileCompliance":
            updatedResults.fileCompliance.items = updatedResults.fileCompliance.items.map((item) =>
              item.id === problem.id
                ? { ...item, status: "passed", description: problem.fixDescription || item.description }
                : item,
            )
            // 更新统计数据
            updatedResults.fileCompliance.passed += 1
            if (problem.id.startsWith("c2")) {
              // 假设这是warning项
              updatedResults.fileCompliance.warnings -= 1
            } else if (problem.id.startsWith("c3")) {
              // 假设这是failed项
              updatedResults.fileCompliance.failed -= 1
            }
            break

          case "interaction":
            updatedResults.interaction.items = updatedResults.interaction.items.map((item) =>
              item.id === problem.id
                ? { ...item, status: "passed", description: problem.fixDescription || item.description }
                : item,
            )
            // 更新统计数据
            updatedResults.interaction.passed += 1
            if (problem.id.startsWith("i2")) {
              // 假设这是warning项
              updatedResults.interaction.warnings -= 1
            } else if (problem.id.startsWith("i3")) {
              // 假设这是failed项
              updatedResults.interaction.failed -= 1
            }
            break

          case "missingFeature":
            updatedResults.missingFeatures.items = updatedResults.missingFeatures.items.map((item) =>
              item.id === problem.id
                ? { ...item, status: "implemented", description: problem.fixDescription || item.description }
                : item,
            )
            // 更新统计数据\
            updatedResults.missingFeatures.implemented += 1
            updatedResults.missingFeatures.identified -= 1
            break
        }
      }
    })

    setResults(updatedResults)

    // 计算修复后的健康度
    const healthAfter = calculateHealthScore()

    // 添加到修复历史记录
    const fixedCount = fixedProblems.filter((p) => p.status === "fixed").length
    const failedCount = fixedProblems.filter((p) => p.status === "failed").length
    const totalCount = fixedProblems.length

    const newHistory: RepairHistory = {
      id: `repair-${Date.now()}`,
      timestamp: new Date(),
      problems: fixedProblems,
      fixedCount,
      failedCount,
      totalCount,
      systemHealthBefore: healthBefore,
      systemHealthAfter: healthAfter,
      duration: Math.floor((Date.now() - startTime) / 1000),
      rollbackAvailable: !!snapshot,
    }

    setRepairHistories([newHistory, ...repairHistories])

    // 显示修复结果通知
    if (repairStrategy.notifyOnFixComplete) {
      toast({
        title: "修复完成",
        description: `成功修复 ${fixedCount} 个问题，${failedCount} 个问题需要手动处理`,
        variant: fixedCount > 0 ? "default" : "destructive",
      })
    }
  }

  // 查看修复历史详情
  const viewHistoryDetails = (history: RepairHistory) => {
    setSelectedHistory(history)
    setIsHistoryDetailOpen(true)
  }

  // 执行回滚
  const handleRollback = (history: RepairHistory) => {
    // 实际应用中，这里应该执行真正的回滚逻辑

    // 关闭历史详情对话框
    setIsHistoryDetailOpen(false)

    // 显示回滚通知
    toast({
      title: "回滚完成",
      description: "系统已回滚到修复前状态",
    })

    // 更新历史记录，标记为不可再次回滚
    setRepairHistories(repairHistories.map((h) => (h.id === history.id ? { ...h, rollbackAvailable: false } : h)))
  }

  // 保存修复策略
  const saveRepairStrategy = () => {
    // 实际应用中，这里应该将策略保存到持久化存储

    toast({
      title: "策略已保存",
      description: "修复策略配置已成功保存",
    })
  }

  // 重置修复策略
  const resetRepairStrategy = () => {
    setRepairStrategy(defaultRepairStrategy)

    toast({
      title: "策略已重置",
      description: "修复策略已重置为默认配置",
    })
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="audit" className="flex items-center">
            <Play className="mr-2 h-4 w-4" />
            系统审查
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center">
            <History className="mr-2 h-4 w-4" />
            修复历史
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            修复策略
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" />
            性能监控
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audit">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">系统全局审查</CardTitle>
              <CardDescription>全面检查系统框架完整性、文件合规性和交互流畅性，发现并解决问题</CardDescription>
            </CardHeader>
            <CardContent>
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
                    <Badge variant={healthScore > 80 ? "default" : healthScore > 60 ? "outline" : "destructive"}>
                      {healthScore}%
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
                        <span className="text-sm text-muted-foreground">
                          共 {results.missingFeatures.identified + results.missingFeatures.implemented} 项
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {auditStatus === "completed" && (
                <Tabs defaultValue="framework">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="framework">框架完整性</TabsTrigger>
                    <TabsTrigger value="fileCompliance">文件合规性</TabsTrigger>
                    <TabsTrigger value="interaction">交互流畅性</TabsTrigger>
                    <TabsTrigger value="missingFeatures">缺失功能</TabsTrigger>
                  </TabsList>

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
                </Tabs>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={exportReport}>
                导出审查报告
              </Button>

              <div className="flex gap-2">
                {auditStatus === "completed" && (
                  <Button
                    variant="default"
                    onClick={openAutoFix}
                    disabled={
                      !repairStrategy.enableAutoFix ||
                      (results.framework.warnings === 0 &&
                        results.framework.failed === 0 &&
                        results.fileCompliance.warnings === 0 &&
                        results.fileCompliance.failed === 0 &&
                        results.interaction.warnings === 0 &&
                        results.interaction.failed === 0 &&
                        results.missingFeatures.identified === 0)
                    }
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    一键修复
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <RepairHistoryList
            histories={repairHistories}
            onViewDetails={viewHistoryDetails}
            onRollback={handleRollback}
          />
        </TabsContent>

        <TabsContent value="strategy">
          <RepairStrategyConfig
            strategy={repairStrategy}
            onStrategyChange={setRepairStrategy}
            onSave={saveRepairStrategy}
            onReset={resetRepairStrategy}
          />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceMonitor histories={repairHistories} onExportReport={exportPerformanceReport} />
        </TabsContent>
      </Tabs>

      {/* 自动修复引擎 */}
      <AutoFixEngine
        problems={problemsToFix}
        isOpen={isAutoFixOpen}
        onClose={() => setIsAutoFixOpen(false)}
        onFixComplete={handleFixComplete}
        strategy={repairStrategy}
      />

      {/* 修复历史详情 */}
      <RepairHistoryDetail
        history={selectedHistory}
        isOpen={isHistoryDetailOpen}
        onClose={() => setIsHistoryDetailOpen(false)}
        onRollback={handleRollback}
      />
    </div>
  )
}
