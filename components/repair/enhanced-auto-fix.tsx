"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { CheckCircle, XCircle, AlertTriangle, FileText, Code, Zap, Cpu, Settings, Clock, ArrowLeft, ArrowRight, ChevronRight, ExternalLink, RefreshCw, CheckCircle2, GitPullRequest, RotateCw } from 'lucide-react'
import type { Problem, ProblemSeverity, ProblemType, SystemSnapshot } from "@/components/system-audit/auto-fix-engine"
import type { RepairStrategy } from "@/components/system-audit/repair-strategy"

// 修复方法类型
type FixMethod = "automatic" | "guided" | "manual" | "ai-assisted"

// 修复详情类型
interface FixDetails {
  code?: string
  explanation: string
  affectedFiles: string[]
  beforeAfterComparison?: {
    before: string
    after: string
  }[]
  testResults?: {
    passed: boolean
    message: string
  }[]
  aiSuggestions?: string[]
}

// 增强的问题类型
interface EnhancedProblem extends Problem {
  fixMethod?: FixMethod
  fixDetails?: FixDetails
  fixConfidence?: number // 0-100
  estimatedTime?: number // 分钟
  dependsOn?: string[] // 依赖的其他问题ID
  blockedBy?: string[] // 被其他问题阻塞的ID
  tags?: string[]
  category?: string
  prCreated?: boolean
  prUrl?: string
}

// 增强的修复策略类型
interface EnhancedRepairStrategy extends RepairStrategy {
  preferredFixMethod: FixMethod
  useAI: boolean
  createPullRequest: boolean
  runTestsAfterFix: boolean
  notifyAfterCompletion: boolean
  maxConcurrentFixes: number
  prioritizeIndependentFixes: boolean
}

// 增强的自动修复引擎组件
interface EnhancedAutoFixProps {
  problems: EnhancedProblem[]
  isOpen: boolean
  onClose: () => void
  onFixComplete: (fixedProblems: EnhancedProblem[], snapshot?: SystemSnapshot) => void
  strategy: EnhancedRepairStrategy
}

export function EnhancedAutoFix({
  problems,
  isOpen,
  onClose,
  onFixComplete,
  strategy,
}: EnhancedAutoFixProps) {
  const [fixingProblems, setFixingProblems] = useState<EnhancedProblem[]>(problems)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isFixing, setIsFixing] = useState(false)
  const [fixProgress, setFixProgress] = useState(0)
  const [fixCompleted, setFixCompleted] = useState(false)
  const [systemSnapshot, setSystemSnapshot] = useState<SystemSnapshot | null>(null)
  const [isRollingBack, setIsRollingBack] = useState(false)
  const [rollbackProgress, setRollbackProgress] = useState(0)
  const [showRollbackAlert, setShowRollbackAlert] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null)
  const [showCode, setShowCode] = useState(true)
  const [fixPlan, setFixPlan] = useState<{
    totalTime: number
    fixOrder: EnhancedProblem[]
    dependencies: Record<string, string[]>
  } | null>(null)

  // 当问题列表变化时重置状态
  useEffect(() => {
    if (isOpen) {
      const sortedProblems = sortProblemsByPriority(problems, strategy)
      setFixingProblems(sortedProblems)
      
      // 生成修复计划
      generateFixPlan(sortedProblems)
    }
  }, [problems, isOpen, strategy])

  // 生成修复计划
  const generateFixPlan = (problemList: EnhancedProblem[]) => {
    // 构建依赖图
    const dependencies: Record<string, string[]> = {}
    problemList.forEach(problem => {
      dependencies[problem.id] = problem.dependsOn || []
    })
    
    // 计算总修复时间
    const totalTime = problemList.reduce((sum, problem) => sum + (problem.estimatedTime || 5), 0)
    
    // 确定修复顺序（考虑依赖关系）
    const fixOrder = [...problemList]
    
    // 使用拓扑排序确保依赖问题先修复
    const visited = new Set<string>()
    const temp = new Set<string>()
    const order: EnhancedProblem[] = []
    
    const visit = (problemId: string) => {
      if (temp.has(problemId)) {
        // 检测到循环依赖，忽略此依赖
        return
      }
      
      if (visited.has(problemId)) {
        return
      }
      
      temp.add(problemId)
      
      const problem = fixOrder.find(p => p.id === problemId)
      if (problem && problem.dependsOn) {
        problem.dependsOn.forEach(depId => {
          visit(depId)
        })
      }
      
      temp.delete(problemId)
      visited.add(problemId)
      
      const problemToAdd = fixOrder.find(p => p.id === problemId)
      if (problemToAdd) {
        order.push(problemToAdd)
      }
    }
    
    // 对所有问题进行拓扑排序
    fixOrder.forEach(problem => {
      if (!visited.has(problem.id)) {
        visit(problem.id)
      }
    })
    
    // 如果策略要求优先修复独立问题，则调整顺序
    if (strategy.prioritizeIndependentFixes) {
      order.sort((a, b) => {
        const aDeps = a.dependsOn?.length || 0
        const bDeps = b.dependsOn?.length || 0
        return aDeps - bDeps
      })
    }
    
    setFixPlan({
      totalTime,
      fixOrder: order.reverse(), // 反转以获得正确的顺序
      dependencies
    })
  }

  // 根据策略对问题进行优先级排序
  const sortProblemsByPriority = (problemList: EnhancedProblem[], repairStrategy: EnhancedRepairStrategy): EnhancedProblem[] => {
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
    
    // 使用修复计划中的顺序（如果有）
    const problemsToFix = fixPlan?.fixOrder || updatedProblems
    
    // 并行修复（如果策略允许）
    if (strategy.maxConcurrentFixes > 1) {
      // 分批处理问题
      for (let i = 0; i < problemsToFix.length; i += strategy.maxConcurrentFixes) {
        const batch = problemsToFix.slice(i, i + strategy.maxConcurrentFixes)
        
        // 更新当前索引
        setCurrentIndex(i)
        
        // 更新所有批次问题的状态为修复中
        updatedProblems = updatedProblems.map(p => {
          const inBatch = batch.some(bp => bp.id === p.id)
          return inBatch ? { ...p, status: "fixing" } : p
        })
        setFixingProblems(updatedProblems)
        
        // 计算进度
        const progressPerBatch = (strategy.maxConcurrentFixes / problemsToFix.length) * 100
        setFixProgress(i / strategy.maxConcurrentFixes * progressPerBatch)
        
        // 并行修复批次中的问题
        const fixResults = await Promise.all(
          batch.map(problem => fixProblem(problem).catch(error => ({
            status: "failed" as const,
            error: error instanceof Error ? error.message : "未知错误"
          })))
        )
        
        // 更新问题状态
        updatedProblems = updatedProblems.map(p => {
          const batchIndex = batch.findIndex(bp => bp.id === p.id)
          if (batchIndex === -1) return p
          
          const result = fixResults[batchIndex]
          if (result.status === "fixed") {
            fixedCount++
            return {
              ...p,
              status: "fixed",
              fixDescription: result.fixDescription,
              fixDetails: result.fixDetails
            }
          } else {
            failedCount++
            return {
              ...p,
              status: "failed",
              error: result.error
            }
          }
        })
        
        setFixingProblems(updatedProblems)
        
        // 检查是否需要自动回滚
        const failureRate = (failedCount / (fixedCount + failedCount)) * 100
        if (failureRate >= strategy.rollbackOnFailureThreshold && systemSnapshot) {
          setShowRollbackAlert(true)
          break // 停止继续修复
        }
      }
    } else {
      // 顺序修复
      for (let i = 0; i < problemsToFix.length; i++) {
        setCurrentIndex(i)
        
        // 检查依赖是否已修复
        const problem = problemsToFix[i]
        if (problem.dependsOn && problem.dependsOn.length > 0) {
          const unresolvedDependencies = problem.dependsOn.filter(depId => {
            const depProblem = updatedProblems.find(p => p.id === depId)
            return !depProblem || depProblem.status !== "fixed"
          })
          
          if (unresolvedDependencies.length > 0) {
            // 依赖未修复，跳过此问题
            updatedProblems = updatedProblems.map(p => 
              p.id === problem.id ? { ...p, status: "failed", error: "依赖问题未修复" } : p
            )
            setFixingProblems(updatedProblems)
            failedCount++
            continue
          }
        }

        // 更新当前问题状态为修复中
        updatedProblems = updatedProblems.map((p) => (p.id === problem.id ? { ...p, status: "fixing" } : p))
        setFixingProblems(updatedProblems)

        // 计算进度
        const progressPerProblem = 100 / problemsToFix.length
        setFixProgress(i * progressPerProblem)

        try {
          // 修复问题
          const fixResult = await Promise.race([
            fixProblem(problem),
            new Promise<{ status: "failed"; error: string }>((_, reject) =>
              setTimeout(() => reject(new Error("修复超时")), strategy.fixTimeout * 1000),
            ),
          ])

          if (fixResult.status === "fixed") {
            // 修复成功
            fixedCount++
            updatedProblems = updatedProblems.map((p) =>
              p.id === problem.id
                ? {
                    ...p,
                    status: "fixed",
                    fixDescription: fixResult.fixDescription,
                    fixDetails: fixResult.fixDetails
                  }
                : p,
            )
          } else {
            // 修复失败
            failedCount++
            updatedProblems = updatedProblems.map((p) =>
              p.id === problem.id
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
          updatedProblems = updatedProblems.map((p) =>
            p.id === problem.id
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
    }

    // 所有问题处理完成
    setFixProgress(100)
    setIsFixing(false)
    setFixCompleted(true)
    
    // 如果策略要求，创建PR
    if (strategy.createPullRequest && fixedCount > 0) {
      await createPullRequest(updatedProblems.filter(p => p.status === "fixed"))
    }
    
    // 如果策略要求，发送通知
    if (strategy.notifyAfterCompletion) {
      sendCompletionNotification(fixedCount, failedCount)
    }
    
    // 调用完成回调
    onFixComplete(
      updatedProblems.filter(p => p.status === "fixed"),
      systemSnapshot
    )
  }

  // 创建Pull Request
  const createPullRequest = async (fixedProblems: EnhancedProblem[]) => {
    // 实际应用中，这里应该调用版本控制系统API创建PR
    console.log("创建PR，包含以下修复:", fixedProblems.map(p => p.name))
    
    // 模拟PR创建
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新问题状态，添加PR信息
    setFixingProblems(prev => 
      prev.map(p => {
        if (fixedProblems.some(fp => fp.id === p.id)) {
          return {
            ...p,
            prCreated: true,
            prUrl: "https://github.com/example/repo/pull/123"
          }
        }
        return p
      })
    )
  }
  
  // 发送完成通知
  const sendCompletionNotification = (fixedCount: number, failedCount: number) => {
    // 实际应用中，这里应该发送通知
    console.log(`修复完成通知: 成功 ${fixedCount}, 失败 ${failedCount}`)
  }

  // 修复单个问题
  const fixProblem = async (
    problem: EnhancedProblem,
  ): Promise<{ 
    status: "fixed" | "failed"; 
    fixDescription?: string; 
    error?: string;
    fixDetails?: FixDetails;
  }> => {
    // 实际应用中，这里应该包含真实的修复逻辑
    // 例如：调用API、修改文件、更新配置等

    // 模拟修复过程
    await new Promise((resolve) => setTimeout(resolve, problem.estimatedTime ? problem.estimatedTime * 200 : 1000))

    // 根据修复方法选择不同的修复逻辑
    const fixMethod = problem.fixMethod || strategy.preferredFixMethod
    
    // 模拟修复结果（根据问题类型、预估成功率和修复方法）
    const baseSuccessRate = problem.fixSuccessRate ||
      (problem.severity === "critical"
        ? 70
        : problem.severity === "high"
          ? 80
          : problem.severity === "medium"
            ? 90
            : 95)
    
    // 不同修复方法的成功率调整
    const methodSuccessRateAdjustment = {
      "automatic": 0,
      "guided": 5,
      "manual": 10,
      "ai-assisted": strategy.useAI ? 15 : 0
    }
    
    const adjustedSuccessRate = baseSuccessRate + methodSuccessRateAdjustment[fixMethod]
    const isSuccess = Math.random() * 100 < adjustedSuccessRate

    if (isSuccess) {
      // 生成修复详情
      const fixDetails: FixDetails = {
        explanation: getFixExplanation(problem.type, fixMethod),
        affectedFiles: getAffectedFiles(problem.type),
        beforeAfterComparison: getBeforeAfterComparison(problem.type),
        testResults: strategy.runTestsAfterFix ? getTestResults() : undefined,
        aiSuggestions: strategy.useAI && fixMethod === "ai-assisted" ? getAISuggestions() : undefined
      }
      
      if (problem.type === "fileCompliance" || problem.type === "framework") {
        fixDetails.code = getFixCode(problem.type)
      }
      
      return {
        status: "fixed",
        fixDescription: getFixDescription(problem.type, fixMethod),
        fixDetails
      }
    } else {
      return {
        status: "failed",
        error: getFailureReason(problem.type, fixMethod),
      }
    }
  }
  
  // 获取修复说明
  const getFixDescription = (type: ProblemType, method: FixMethod): string => {
    const methodText = method === "automatic" ? "自动" : 
                      method === "guided" ? "引导式" : 
                      method === "manual" ? "手动" : "AI辅助"
    
    switch (type) {
      case "framework":
        return `已${methodText}修复框架组件依赖和配置问题，确保核心功能正常运行。`
      case "fileCompliance":
        return `已${methodText}调整代码格式和结构，使其符合项目规范。`
      case "interaction":
        return `已${methodText}优化交互流程，修复用户操作断点，确保流程流畅。`
      case "missingFeature":
        return `已${methodText}实现缺失功能，并集成到系统中。`
      default:
        return `问题已${methodText}修复。`
    }
  }
  
  // 获取修复详细说明
  const getFixExplanation = (type: ProblemType, method: FixMethod): string => {
    switch (type) {
      case "framework":
        return `修复了框架组件依赖问题，更新了依赖版本并解决了冲突。修复过程中${method === "ai-assisted" ? "使用AI分析了依赖关系图，" : ""}确保了所有组件正确加载和初始化。`
      case "fileCompliance":
        return `调整了代码格式和结构，使其符合项目规范。${method === "ai-assisted" ? "AI分析了代码风格并提供了修复建议，" : ""}修复包括缩进、命名规范和注释格式等问题。`
      case "interaction":
        return `优化了用户交互流程，修复了操作断点。${method === "ai-assisted" ? "AI分析了用户行为数据，" : ""}确保了所有用户操作都能得到适当的反馈和响应。`
      case "missingFeature":
        return `实现了缺失的功能，并将其集成到系统中。${method === "ai-assisted" ? "AI提供了功能实现建议，" : ""}确保了新功能与现有系统的兼容性和一致性。`
      default:
        return `问题已修复，系统现在可以正常运行。`
    }
  }
  
  // 获取受影响的文件
  const getAffectedFiles = (type: ProblemType): string[] => {
    switch (type) {
      case "framework":
        return [
          "package.json",
          "tsconfig.json",
          "next.config.js",
          "app/layout.tsx"
        ]
      case "fileCompliance":
        return [
          "app/components/ui/button.tsx",
          "app/components/ui/card.tsx",
          "lib/utils.ts"
        ]
      case "interaction":
        return [
          "app/components/form.tsx",
          "app/components/navigation.tsx",
          "app/components/modal.tsx"
        ]
      case "missingFeature":
        return [
          "app/api/feature/route.ts",
          "app/components/feature.tsx",
          "app/feature/page.tsx"
        ]
      default:
        return ["unknown.ts"]
    }
  }
  
  // 获取修复前后对比
  const getBeforeAfterComparison = (type: ProblemType): { before: string, after: string }[] => {
    switch (type) {
      case "framework":
        return [
          {
            before: `"dependencies": {\n  "react": "17.0.2",\n  "next": "12.0.0"\n}`,
            after: `"dependencies": {\n  "react": "18.2.0",\n  "next": "13.4.0"\n}`
          }
        ]
      case "fileCompliance":
        return [
          {
            before: `function button(props){\nreturn <button className='btn'>{props.children}</button>\n}`,
            after: `function Button(props) {\n  return <button className="btn">{props.children}</button>\n}`
          }
        ]
      case "interaction":
        return [
          {
            before: `onClick={() => {\nsetData(newData)\n}}`,
            after: `onClick={() => {\n  setIsLoading(true)\n  setData(newData)\n  setIsLoading(false)\n}}`
          }
        ]
      case "missingFeature":
        return [
          {
            before: `// TODO: Implement feature`,
            after: `function Feature() {\n  const [data, setData] = useState([])\n  \n  useEffect(() => {\n    fetchData().then(setData)\n  }, [])\n  \n  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>\n}`
          }
        ]
      default:
        return [{ before: "", after: "" }]
    }
  }
  
  // 获取测试结果
  const getTestResults = (): { passed: boolean, message: string }[] => {
    return [
      { passed: true, message: "单元测试通过" },
      { passed: true, message: "集成测试通过" },
      { passed: Math.random() > 0.2, message: "端到端测试" },
      { passed: Math.random() > 0.1, message: "性能测试" }
    ]
  }
  
  // 获取AI建议
  const getAISuggestions = (): string[] => {
    return [
      "考虑添加更详细的错误处理逻辑",
      "可以进一步优化性能，减少不必要的重渲染",
      "建议添加更多的单元测试覆盖边缘情况",
      "考虑使用更现代的API以提高代码可维护性"
    ]
  }
  
  // 获取修复代码
  const getFixCode = (type: ProblemType): string => {
    switch (type) {
      case "framework":
        return `// 更新的依赖配置
{
  "dependencies": {
    "react": "18.2.0",
    "next": "13.4.0",
    "typescript": "5.0.4",
    "@types/react": "18.2.0",
    "@types/node": "18.16.0"
  }
}`
      case "fileCompliance":
        return `// 修复后的代码
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
          variant === "outline" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
          size === "sm" && "h-8 px-3 text-xs",
          size === "md" && "h-10 px-4 py-2",
          size === "lg" && "h-12 px-6 py-3 text-lg",
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }`
      default:
        return ""
    }
  }
  
  // 获取失败原因
  const getFailureReason = (type: ProblemType, method: FixMethod): string => {
    const reasons = [
      "修复过程中遇到技术问题，需要手动干预。",
      "依赖冲突无法自动解决，需要开发者决策。",
      "修复需要更高权限，请联系系统管理员。",
      "修复涉及到核心系统组件，需要更谨慎的处理。"
    ]
    
    return reasons[Math.floor(Math.random() * reasons.length)]
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
  
  // 获取修复方法的中文名称和图标
  const getFixMethodInfo = (method?: FixMethod) => {
    switch (method) {
      case "automatic":
        return { name: "自动修复", icon: <Zap className="h-4 w-4" /> }
      case "guided":
        return { name: "引导式修复", icon: <FileText className="h-4 w-4" /> }
      case "manual":
        return { name: "手动修复", icon: <Code className="h-4 w-4" /> }
      case "ai-assisted":
        return { name: "AI辅助修复", icon: <Cpu className="h-4 w-4" /> }
      default:
        return { name: "未知方法", icon: <Settings className="h-4 w-4" /> }
    }
  }

  // 计算修复统计
  const getFixStats = () => {
    const fixed = fixingProblems.filter((p) => p.status === "fixed").length
    const failed = fixingProblems.filter((p) => p.status === "failed").length
    const total = fixingProblems.length

    return { fixed, failed, total }
  }
  
  // 获取选中的问题
  const getSelectedProblem = () => {
    return fixingProblems.find(p => p.id === selectedProblemId)
  }

  const stats = getFixStats()
  const selectedProblem = getSelectedProblem()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isFixing && !isRollingBack && !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>增强型自动修复系统</DialogTitle>
          <DialogDescription>系统将智能分析并修复审查中发现的问题，修复过程中请勿关闭此窗口</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden py-4">
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

              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full overflow-hidden">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">概览</TabsTrigger>
                  <TabsTrigger value="details">详情</TabsTrigger>
                  <TabsTrigger value="plan">修复计划</TabsTrigger>
                  {fixCompleted && <TabsTrigger value="summary">总结</TabsTrigger>}
                </TabsList>
                
                <TabsContent value="overview" className="flex-1 overflow-auto">
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    <div className="space-y-4">
                      {fixingProblems.map((problem, index) => (
                        <div
                          key={problem.id}
                          className={`p-3 rounded-md border ${
                            currentIndex === index && isFixing
                              ? "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
                              : problem.status === "fixed"
                                ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
                                : problem.status === "failed"
                                  ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                                  : "border-gray-200 dark:border-gray-800"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              {problem.status === "fixed" ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                              ) : problem.status === "failed" ? (
                                <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                              ) : problem.status === "fixing" ? (
                                <RefreshCw className="h-5 w-5 text-blue-500 mr-2 animate-spin flex-shrink-0" />
                              ) : (
                                <Clock className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                              )}
                              <div>
                                <div className="font-medium">{problem.name}</div>
                                <div className="text-sm text-muted-foreground">{problem.description}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={getSeverityInfo(problem.severity).className}>
                                {getSeverityInfo(problem.severity).name}
                              </Badge>
                              <Badge variant="outline">
                                {getProblemTypeName(problem.type)}
                              </Badge>
                              {problem.fixMethod && (
                                <Badge variant="outline" className="flex items-center">
                                  {getFixMethodInfo(problem.fixMethod).icon}
                                  <span className="ml-1">{getFixMethodInfo(problem.fixMethod).name}</span>
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {problem.status === "fixed" && problem.fixDescription && (
                            <div className="mt-2 text-sm bg-green-50 p-2 rounded-md dark:bg-green-950/30">
                              <div className="font-medium text-green-700 dark:text-green-400">修复成功</div>
                              <div>{problem.fixDescription}</div>
                              {problem.prCreated && (
                                <div className="mt-1 flex items-center text-xs">
                                  <GitPullRequest className="h-3 w-3 mr-1" />
                                  <a href={problem.prUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                    查看PR <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {problem.status === "failed" && problem.error && (
                            <div className="mt-2 text-sm bg-red-50 p-2 rounded-md dark:bg-red-950/30">
                              <div className="font-medium text-red-700 dark:text-red-400">修复失败</div>
                              <div>{problem.error}</div>
                            </div>
                          )}
                          
                          {problem.status === "fixing" && (
                            <div className="mt-2 text-sm bg-blue-50 p-2 rounded-md dark:bg-blue-950/30">
                              <div className="font-medium text-blue-700 dark:text-blue-400">正在修复...</div>
                              <div>系统正在处理此问题，请稍候</div>
                            </div>
                          )}
                          
                          {problem.fixDetails && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="mt-2 text-xs" 
                              onClick={() => {
                                setSelectedProblemId(problem.id)
                                setActiveTab("details")
                              }}
                            >
                              查看详情 <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="details" className="flex-1 overflow-auto">
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    {selectedProblem ? (
                      <div>
                        <div className="flex items-center mb-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mr-2" 
                            onClick={() => setActiveTab("overview")}
                          >
                            <ArrowLeft className="h-4 w-4 mr-1" /> 返回
                          </Button>
                          <h3 className="text-lg font-medium">{selectedProblem.name}</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm font-medium mb-1">问题类型</div>
                            <Badge variant="outline">
                              {getProblemTypeName(selectedProblem.type)}
                            </Badge>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">严重程度</div>
                            <Badge variant="outline" className={getSeverityInfo(selectedProblem.severity).className}>
                              {getSeverityInfo(selectedProblem.severity).name}
                            </Badge>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">修复方法</div>
                            <Badge variant="outline" className="flex items-center">
                              {getFixMethodInfo(selectedProblem.fixMethod).icon}
                              <span className="ml-1">{getFixMethodInfo(selectedProblem.fixMethod).name}</span>
                            </Badge>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">修复状态</div>
                            <Badge variant="outline" className={
                              selectedProblem.status === "fixed" 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : selectedProblem.status === "failed"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : selectedProblem.status === "fixing"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-gray-50 text-gray-700 border-gray-200"
                            }>
                              {selectedProblem.status === "fixed" 
                                ? "已修复" 
                                : selectedProblem.status === "failed"
                                  ? "修复失败"
                                  : selectedProblem.status === "fixing"
                                    ? "修复中"
                                    : "待修复"}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="text-sm font-medium mb-1">问题描述</div>
                          <p className="text-sm text-muted-foreground">{selectedProblem.description}</p>
                        </div>
                        
                        {selectedProblem.fixDetails && (
                          <>
                            <Separator className="my-4" />
                            
                            <div className="mb-4">
                              <div className="text-sm font-medium mb-1">修复说明</div>
                              <p className="text-sm">{selectedProblem.fixDetails.explanation}</p>
                            </div>
                            
                            <div className="mb-4">
                              <div className="text-sm font-medium mb-1">受影响的文件</div>
                              <div className="flex flex-wrap gap-2">
                                {selectedProblem.fixDetails.affectedFiles.map((file, index) => (
                                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {file}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            {selectedProblem.fixDetails.code && showCode && (
                              <div className="mb-4">
                                <div className="flex justify-between items-center mb-1">
                                  <div className="text-sm font-medium">修复代码</div>
                                  <Button variant="ghost" size="sm" onClick={() => setShowCode(false)}>
                                    隐藏代码
                                  </Button>
                                </div>
                                <div className="bg-muted p-3 rounded-md overflow-x-auto">
                                  <pre className="text-xs">{selectedProblem.fixDetails.code}</pre>
                                </div>
                              </div>
                            )}
                            
                            {selectedProblem.fixDetails.code && !showCode && (
                              <div className="mb-4">
                                <Button variant="outline" size="sm" onClick={() => setShowCode(true)}>
                                  显示修复代码
                                </Button>
                              </div>
                            )}
                            
                            {selectedProblem.fixDetails.beforeAfterComparison && selectedProblem.fixDetails.beforeAfterComparison.length > 0 && (
                              <div className="mb-4">
                                <div className="text-sm font-medium mb-1">修复前后对比</div>
                                <Accordion type="single" collapsible className="w-full">
                                  {selectedProblem.fixDetails.beforeAfterComparison.map((comparison, index) => (
                                    <AccordionItem key={index} value={`comparison-${index}`}>
                                      <AccordionTrigger className="text-sm">对比 #{index + 1}</AccordionTrigger>
                                      <AccordionContent>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <div className="text-xs font-medium mb-1">修复前</div>
                                            <div className="bg-muted p-2 rounded-md overflow-x-auto">
                                              <pre className="text-xs">{comparison.before}</pre>
                                            </div>
                                          </div>
                                          <div>
                                            <div className="text-xs font-medium mb-1">修复后</div>
                                            <div className="bg-muted p-2 rounded-md overflow-x-auto">
                                              <pre className="text-xs">{comparison.after}</pre>
                                            </div>
                                          </div>
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  ))}
                                </Accordion>
                              </div>
                            )}
                            
                            {selectedProblem.fixDetails.testResults && (
                              <div className="mb-4">
                                <div className="text-sm font-medium mb-1">测试结果</div>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>测试</TableHead>
                                      <TableHead>结果</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedProblem.fixDetails.testResults.map((test, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{test.message}</TableCell>
                                        <TableCell>
                                          {test.passed ? (
                                            <span className="flex items-center text-green-600">
                                              <CheckCircle2 className="h-4 w-4 mr-1" /> 通过
                                            </span>
                                          ) : (
                                            <span className="flex items-center text-red-600">
                                              <XCircle className="h-4 w-4 mr-1" /> 失败
                                            </span>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                            
                            {selectedProblem.fixDetails.aiSuggestions && selectedProblem.fixDetails.aiSuggestions.length > 0 && (
                              <div className="mb-4">
                                <div className="text-sm font-medium mb-1">AI建议</div>
                                <ul className="list-disc pl-5 space-y-1">
                                  {selectedProblem.fixDetails.aiSuggestions.map((suggestion, index) => (
                                    <li key={index} className="text-sm">{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-muted-foreground">请从概览中选择一个问题查看详情</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2" 
                          onClick={() => setActiveTab("overview")}
                        >
                          返回概览
                        </Button>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="plan" className="flex-1 overflow-auto">
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    {fixPlan ? (
                      <div>
                        <div className="mb-4">
                          <h3 className="text-lg font-medium mb-2">修复计划</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <Card>
                              <CardHeader className="py-2">
                                <CardTitle className="text-sm">预计总修复时间</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">{fixPlan.totalTime} 分钟</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="py-2">
                                <CardTitle className="text-sm">问题数量</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold">{fixPlan.fixOrder.length}</div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">修复顺序</h4>
                          <div className="space-y-2">
                            {fixPlan.fixOrder.map((problem, index) => (
                              <div key={problem.id} className="flex items-center p-2 border rounded-md">
                                <div className="flex items-center justify-center bg-muted rounded-full w-6 h-6 mr-2 text-xs font-medium">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{problem.name}</div>
                                  <div className="text-xs text-muted-foreground">{getProblemTypeName(problem.type)}</div>
                                </div>
                                <div className="flex items-center">
                                  <Badge variant="outline" className={getSeverityInfo(problem.severity).className}>
                                    {getSeverityInfo(problem.severity).name}
                                  </Badge>
                                  <div className="ml-2 text-xs flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {problem.estimatedTime || 5} 分钟
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">修复策略</h4>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">首选修复方法</TableCell>
                                <TableCell>{getFixMethodInfo(strategy.preferredFixMethod).name}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">使用AI辅助</TableCell>
                                <TableCell>{strategy.useAI ? "是" : "否"}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">创建Pull Request</TableCell>
                                <TableCell>{strategy.createPullRequest ? "是" : "否"}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">修复后运行测试</TableCell>
                                <TableCell>{strategy.runTestsAfterFix ? "是" : "否"}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">最大并行修复数</TableCell>
                                <TableCell>{strategy.maxConcurrentFixes}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">优先修复独立问题</TableCell>
                                <TableCell>{strategy.prioritizeIndependentFixes ? "是" : "否"}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-muted-foreground">正在生成修复计划...</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="summary" className="flex-1 overflow-auto">
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    <div>
                      <h3 className="text-lg font-medium mb-4">修复总结</h3>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <Card className="bg-green-50 border-green-200">
                          <CardHeader className="py-2">
                            <CardTitle className="text-sm text-green-700">已修复</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-700">{stats.fixed}</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-red-50 border-red-200">
                          <CardHeader className="py-2">
                            <CardTitle className="text-sm text-red-700">修复失败</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-red-700">{stats.failed}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="py-2">
                            <CardTitle className="text-sm">成功率</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {stats.total > 0 ? Math.round((stats.fixed / stats.total) * 100) : 0}%
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-2">按问题类型统计</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>问题类型</TableHead>
                              <TableHead>总数</TableHead>
                              <TableHead>已修复</TableHead>
                              <TableHead>失败</TableHead>
                              <TableHead>成功率</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {["framework", "fileCompliance", "interaction", "missingFeature"].map((type) => {
                              const typeProblems = fixingProblems.filter(p => p.type === type)
                              const typeFixed = typeProblems.filter(p => p.status === "fixed").length
                              const typeFailed = typeProblems.filter(p => p.status === "failed").length
                              const typeTotal = typeProblems.length
                              
                              if (typeTotal === 0) return null
                              
                              return (
                                <TableRow key={type}>
                                  <TableCell>{getProblemTypeName(type as ProblemType)}</TableCell>
                                  <TableCell>{typeTotal}</TableCell>
                                  <TableCell>{typeFixed}</TableCell>
                                  <TableCell>{typeFailed}</TableCell>
                                  <TableCell>
                                    {typeTotal > 0 ? Math.round((typeFixed / typeTotal) * 100) : 0}%
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-2">按严重程度统计</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>严重程度</TableHead>
                              <TableHead>总数</TableHead>
                              <TableHead>已修复</TableHead>
                              <TableHead>失败</TableHead>
                              <TableHead>成功率</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {["critical", "high", "medium", "low"].map((severity) => {
                              const severityProblems = fixingProblems.filter(p => p.severity === severity)
                              const severityFixed = severityProblems.filter(p => p.status === "fixed").length
                              const severityFailed = severityProblems.filter(p => p.status === "failed").length
                              const severityTotal = severityProblems.length
                              
                              if (severityTotal === 0) return null
                              
                              return (
                                <TableRow key={severity}>
                                  <TableCell>
                                    <Badge variant="outline" className={getSeverityInfo(severity as ProblemSeverity).className}>
                                      {getSeverityInfo(severity as ProblemSeverity).name}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{severityTotal}</TableCell>
                                  <TableCell>{severityFixed}</TableCell>
                                  <TableCell>{severityFailed}</TableCell>
                                  <TableCell>
                                    {severityTotal > 0 ? Math.round((severityFixed / severityTotal) * 100) : 0}%
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                      
                      {strategy.createPullRequest && fixingProblems.some(p => p.prCreated) && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium mb-2">创建的Pull Requests</h4>
                          <div className="p-3 border rounded-md flex items-center">
                            <GitPullRequest className="h-5 w-5 mr-2 text-purple-600" />
                            <div className="flex-1">
                              <div className="font-medium">修复PR已创建</div>
                              <div className="text-sm text-muted-foreground">包含所有已修复的问题</div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={fixingProblems.find(p => p.prCreated)?.prUrl} target="_blank" rel="noopener noreferrer">
                                查看PR <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">后续建议</h4>
                        <ul className="list-disc pl-5 space-y-2">
                          {stats.failed > 0 && (
                            <li className="text-sm">
                              有 {stats.failed} 个问题需要手动修复，建议查看详情了解失败原因。
                            </li>
                          )}
                          <li className="text-sm">
                            定期运行自动修复工具，保持系统健康状态。
                          </li>
                          <li className="text-sm">
                            考虑更新修复策略，提高修复成功率。
                          </li>
                          <li className="text-sm">
                            对于复杂问题，建议使用AI辅助修复方法。
                          </li>
                        </ul>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          {showRollbackAlert && systemSnapshot && (
            <Button variant="destructive" onClick={performRollback} disabled={isRollingBack}>
              {isRollingBack ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  正在回滚...
                </>
              ) : (
                <>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  回滚到修复前状态
                </>
              )}
            </Button>
          )}
          
          <div className="flex gap-2">
            {!isFixing && !isRollingBack && !fixCompleted && (
              <Button onClick={startFixing} disabled={fixingProblems.length === 0}>
                开始修复
              </Button>
            )}
            
            {!isFixing && !isRollingBack && fixCompleted && (
              <Button onClick={onClose}>
                完成
              </Button>
            )}
            
            {isFixing && (
              <Button disabled>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                修复中...
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
