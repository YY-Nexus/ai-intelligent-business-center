"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, AlertTriangle, RotateCcw } from "lucide-react"
import type { RepairStrategy } from "./repair-strategy"

// 问题类型定义
export type ProblemType = "framework" | "fileCompliance" | "interaction" | "missingFeature"

// 问题严重程度
export type ProblemSeverity = "critical" | "high" | "medium" | "low"

// 问题状态
export type ProblemStatus = "pending" | "fixing" | "fixed" | "failed"

// 问题项定义
export interface Problem {
  id: string
  type: ProblemType
  name: string
  description: string
  status: ProblemStatus
  severity?: ProblemSeverity // 问题严重程度
  fixDescription?: string
  error?: string
  fixSuccessRate?: number // 修复成功率预估 (0-100)
}

// 系统状态快照，用于回滚
export interface SystemSnapshot {
  id: string
  timestamp: Date
  description: string
  data: any // 实际应用中，这里应该包含系统状态数据
}

interface AutoFixEngineProps {
  problems: Problem[]
  isOpen: boolean
  onClose: () => void
  onFixComplete: (fixedProblems: Problem[], snapshot?: SystemSnapshot) => void
  strategy: RepairStrategy // 修复策略
}

export function AutoFixEngine({ problems, isOpen, onClose, onFixComplete, strategy }: AutoFixEngineProps) {
  const [fixingProblems, setFixingProblems] = useState<Problem[]>(problems)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isFixing, setIsFixing] = useState(false)
  const [fixProgress, setFixProgress] = useState(0)
  const [fixCompleted, setFixCompleted] = useState(false)
  const [systemSnapshot, setSystemSnapshot] = useState<SystemSnapshot | null>(null)
  const [isRollingBack, setIsRollingBack] = useState(false)
  const [rollbackProgress, setRollbackProgress] = useState(0)
  const [showRollbackAlert, setShowRollbackAlert] = useState(false)

  // 当问题列表变化时重置状态
  useEffect(() => {
    if (isOpen) {
      setFixingProblems(sortProblemsByPriority(problems, strategy))
    }
  }, [problems, isOpen, strategy])

  // 根据策略对问题进行优先级排序
  const sortProblemsByPriority = (problemList: Problem[], repairStrategy: RepairStrategy): Problem[] => {
    // 过滤问题范围
    let filteredProblems = [...problemList]
    if (!repairStrategy.fixFrameworkIssues) {
      filteredProblems = filteredProblems.filter((p) => p.type !== "framework")
    }
    if (!repairStrategy.fixFileComplianceIssues) {
      filteredProblems = filteredProblems.filter((p) => p.type !== "fileCompliance")
    }
    if (!repairStrategy.fixInteractionIssues) {
      filteredProblems = filteredProblems.filter((p) => p.type !== "interaction")
    }
    if (!repairStrategy.implementMissingFeatures) {
      filteredProblems = filteredProblems.filter((p) => p.type !== "missingFeature")
    }

    // 根据策略排序
    return [...filteredProblems].sort((a, b) => {
      // 按严重程度排序
      if (repairStrategy.priorityOrder === "severity") {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        const aSeverity = a.severity ? severityOrder[a.severity] : 0
        const bSeverity = b.severity ? severityOrder[b.severity] : 0
        return bSeverity - aSeverity
      }

      // 按修复成功率排序
      if (repairStrategy.priorityOrder === "fixSuccess") {
        const aRate = a.fixSuccessRate || 0
        const bRate = b.fixSuccessRate || 0
        return bRate - aRate
      }

      // 按自定义优先级排序
      if (repairStrategy.priorityOrder === "custom") {
        const typePriority = {
          framework: repairStrategy.frameworkPriority,
          fileCompliance: repairStrategy.fileCompliancePriority,
          interaction: repairStrategy.interactionPriority,
          missingFeature: repairStrategy.missingFeaturePriority,
        }
        return typePriority[b.type] - typePriority[a.type]
      }

      return 0
    })
  }

  // 创建系统快照
  const createSystemSnapshot = async (): Promise<SystemSnapshot> => {
    // 实际应用中，这里应该获取系统当前状态
    // 例如：数据库状态、文件系统状态、配置状态等

    // 模拟创建快照
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id: `snapshot-${Date.now()}`,
      timestamp: new Date(),
      description: "修复前系统状态快照",
      data: {
        /* 系统状态数据 */
      },
    }
  }

  // 开始修复过程
  const startFixing = async () => {
    if (fixingProblems.length === 0) return

    setIsFixing(true)
    setCurrentIndex(0)
    setFixProgress(0)
    setFixCompleted(false)
    setShowRollbackAlert(false)

    // 初始化所有问题为待修复状态
    setFixingProblems(
      fixingProblems.map((problem) => ({
        ...problem,
        status: "pending",
      })),
    )

    // 创建系统快照（如果策略要求）
    if (strategy.createBackupBeforeFix) {
      try {
        const snapshot = await createSystemSnapshot()
        setSystemSnapshot(snapshot)
      } catch (error) {
        console.error("创建系统快照失败:", error)
        // 可以选择继续或中止修复
      }
    }

    // 开始逐个修复问题
    await fixProblemsSequentially()
  }

  // 顺序修复所有问题
  const fixProblemsSequentially = async () => {
    let updatedProblems = [...fixingProblems]
    let fixedCount = 0
    let failedCount = 0

    for (let i = 0; i < updatedProblems.length; i++) {
      setCurrentIndex(i)

      // 更新当前问题状态为修复中
      updatedProblems = updatedProblems.map((p, idx) => (idx === i ? { ...p, status: "fixing" } : p))
      setFixingProblems(updatedProblems)

      // 计算进度
      const progressPerProblem = 100 / updatedProblems.length
      setFixProgress(i * progressPerProblem)

      try {
        // 模拟修复过程 - 在实际应用中替换为真实修复逻辑
        // 添加超时控制
        const fixResult = await Promise.race([
          fixProblem(updatedProblems[i]),
          new Promise<{ status: "failed"; error: string }>((_, reject) =>
            setTimeout(() => reject(new Error("修复超时")), strategy.fixTimeout * 1000),
          ),
        ])

        if (fixResult.status === "fixed") {
          // 修复成功
          fixedCount++
          updatedProblems = updatedProblems.map((p, idx) =>
            idx === i
              ? {
                  ...p,
                  status: "fixed",
                  fixDescription: fixResult.fixDescription,
                }
              : p,
          )
        } else {
          // 修复失败
          failedCount++
          updatedProblems = updatedProblems.map((p, idx) =>
            idx === i
              ? {
                  ...p,
                  status: "failed",
                  error: fixResult.error,
                }
              : p,
          )
        }

        setFixingProblems(updatedProblems)

        // 检查是否需要自动回滚
        const failureRate = (failedCount / (fixedCount + failedCount)) * 100
        if (failureRate >= strategy.rollbackOnFailureThreshold && systemSnapshot) {
          setShowRollbackAlert(true)
          break // 停止继续修复
        }
      } catch (error) {
        // 处理修复过程中的错误
        failedCount++
        updatedProblems = updatedProblems.map((p, idx) =>
          idx === i
            ? {
                ...p,
                status: "failed",
                error: error instanceof Error ? error.message : "未知错误",
              }
            : p,
        )
        setFixingProblems(updatedProblems)

        // 检查是否需要自动回滚
        const failureRate = (failedCount / (fixedCount + failedCount)) * 100
        if (failureRate >= strategy.rollbackOnFailureThreshold && systemSnapshot) {
          setShowRollbackAlert(true)
          break // 停止继续修复
        }
      }
    }

    // 所有问题处理完成
    setFixProgress(100)
    setIsFixing(false)
    setFixCompleted(true)
  }

  // 修复单个问题
  const fixProblem = async (
    problem: Problem,
  ): Promise<{ status: "fixed" | "failed"; fixDescription?: string; error?: string }> => {
    // 实际应用中，这里应该包含真实的修复逻辑
    // 例如：调用API、修改文件、更新配置等

    // 模拟修复过程
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // 模拟修复结果（根据问题类型和预估成功率）
    const successRate =
      problem.fixSuccessRate ||
      (problem.severity === "critical"
        ? 70
        : problem.severity === "high"
          ? 80
          : problem.severity === "medium"
            ? 90
            : 95)

    const isSuccess = Math.random() * 100 < successRate

    if (isSuccess) {
      return {
        status: "fixed",
        fixDescription: getFixDescription(problem.type),
      }
    } else {
      return {
        status: "failed",
        error: "修复过程中遇到技术问题，需要手动干预。",
      }
    }
  }

  // 执行回滚
  const performRollback = async () => {
    if (!systemSnapshot) return

    setIsRollingBack(true)
    setRollbackProgress(0)

    // 模拟回滚过程
    for (let i = 0; i <= 10; i++) {
      setRollbackProgress(i * 10)
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    // 实际应用中，这里应该恢复系统状态
    // 例如：恢复数据库、恢复文件、恢复配置等

    setIsRollingBack(false)

    // 关闭对话框，通知回滚完成
    onClose()

    // 可以在这里添加回滚完成的回调
  }

  // 根据问题类型生成修复描述
  const getFixDescription = (type: ProblemType): string => {
    switch (type) {
      case "framework":
        return "已修复框架组件依赖和配置问题，确保核心功能正常运行。"
      case "fileCompliance":
        return "已自动调整代码格式和结构，使其符合项目规范。"
      case "interaction":
        return "已优化交互流程，修复用户操作断点，确保流程流畅。"
      case "missingFeature":
        return "已实现缺失功能，并集成到系统中。"
      default:
        return "问题已修复。"
    }
  }

  // 完成修复过程
  const completeFixing = () => {
    onFixComplete(fixingProblems, systemSnapshot || undefined)
    onClose()
    setFixCompleted(false)
    setCurrentIndex(-1)
    setFixProgress(0)
    setSystemSnapshot(null)
  }

  // 获取问题类型的中文名称
  const getProblemTypeName = (type: ProblemType): string => {
    switch (type) {
      case "framework":
        return "框架完整性"
      case "fileCompliance":
        return "文件合规性"
      case "interaction":
        return "交互流畅性"
      case "missingFeature":
        return "缺失功能"
      default:
        return "未知类型"
    }
  }

  // 获取问题严重程度的中文名称和样式
  const getSeverityInfo = (severity?: ProblemSeverity) => {
    switch (severity) {
      case "critical":
        return { name: "严重", className: "bg-red-50 text-red-700 border-red-200" }
      case "high":
        return { name: "高", className: "bg-orange-50 text-orange-700 border-orange-200" }
      case "medium":
        return { name: "中", className: "bg-yellow-50 text-yellow-700 border-yellow-200" }
      case "low":
        return { name: "低", className: "bg-green-50 text-green-700 border-green-200" }
      default:
        return { name: "未知", className: "bg-gray-50 text-gray-700 border-gray-200" }
    }
  }

  // 计算修复统计
  const getFixStats = () => {
    const fixed = fixingProblems.filter((p) => p.status === "fixed").length
    const failed = fixingProblems.filter((p) => p.status === "failed").length
    const total = fixingProblems.length

    return { fixed, failed, total }
  }

  const stats = getFixStats()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isFixing && !isRollingBack && !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>自动修复系统问题</DialogTitle>
          <DialogDescription>系统将自动修复审查中发现的问题，修复过程中请勿关闭此窗口</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {showRollbackAlert && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>修复失败率过高</AlertTitle>
              <AlertDescription>
                修复失败率已超过设定阈值 ({strategy.rollbackOnFailureThreshold}%)，建议回滚到修复前状态。
              </AlertDescription>
            </Alert>
          )}

          {isRollingBack ? (
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">回滚进度</span>
                <span className="text-sm font-medium">{rollbackProgress}%</span>
              </div>
              <Progress value={rollbackProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">正在回滚系统到修复前状态，请稍候...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">修复进度</span>
                  <span className="text-sm font-medium">{Math.round(fixProgress)}%</span>
                </div>
                <Progress value={fixProgress} className="h-2" />
              </div>

              {fixCompleted && (
                <div className="mb-4 p-3 bg-muted rounded-md">
                  <h4 className="font-medium mb-1">修复完成</h4>
                  <div className="flex gap-3 text-sm">
                    <span className="flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                      已修复: {stats.fixed}
                    </span>
                    <span className="flex items-center">
                      <XCircle className="mr-1 h-4 w-4 text-red-500" />
                      失败: {stats.failed}
                    </span>
                    <span className="flex items-center">总计: {stats.total}</span>
                  </div>
                </div>
              )}

              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="space-y-4">
                  {fixingProblems.map((problem, index) => (
                    <div
                      key={problem.id}
                      className={`p-3 rounded-md border ${
                        currentIndex === index && isFixing
                          ? "border-blue-300 bg-blue-50"
                          : problem.status === "fixed"
                            ? "border-green-300 bg-green-50"
                            : problem.status === "failed"
                              ? "border-red-300 bg-red-50"
                              : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="font-medium flex items-center flex-wrap gap-1">
                            {problem.name}
                            <Badge variant="outline" className="ml-1">
                              {getProblemTypeName(problem.type)}
                            </Badge>
                            {problem.severity && (
                              <Badge variant="outline" className={getSeverityInfo(problem.severity).className}>
                                {getSeverityInfo(problem.severity).name}
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground">{problem.description}</p>
                        </div>
                        <div>
                          {problem.status === "pending" && <Badge variant="outline">待修复</Badge>}
                          {problem.status === "fixing" && (
                            <Badge variant="outline" className="flex items-center">
                              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              修复中
                            </Badge>
                          )}
                          {problem.status === "fixed" && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              已修复
                            </Badge>
                          )}
                          {problem.status === "failed" && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <XCircle className="mr-1 h-3 w-3" />
                              失败
                            </Badge>
                          )}
                        </div>
                      </div>

                      {problem.status === "fixed" && problem.fixDescription && (
                        <div className="mt-2 text-sm bg-green-50 p-2 rounded border border-green-100">
                          <span className="font-medium">修复结果：</span> {problem.fixDescription}
                        </div>
                      )}

                      {problem.status === "failed" && problem.error && (
                        <div className="mt-2 text-sm bg-red-50 p-2 rounded border border-red-100">
                          <span className="font-medium">错误信息：</span> {problem.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          {!isFixing && !fixCompleted && !isRollingBack && (
            <>
              <Button variant="outline" onClick={onClose}>
                取消
              </Button>
              <Button onClick={startFixing}>开始修复</Button>
            </>
          )}

          {isFixing && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              修复中...
            </Button>
          )}

          {isRollingBack && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              回滚中...
            </Button>
          )}

          {fixCompleted && !isRollingBack && (
            <>
              {systemSnapshot && showRollbackAlert && (
                <Button variant="destructive" onClick={performRollback}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  回滚修复
                </Button>
              )}
              {(!showRollbackAlert || !systemSnapshot) && (
                <Button variant="outline" onClick={onClose}>
                  关闭
                </Button>
              )}
              <Button onClick={completeFixing} disabled={showRollbackAlert}>
                应用修复结果
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
