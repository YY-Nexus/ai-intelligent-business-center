"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useNotifications } from "@/lib/notifications/notification-context"
import {
  sendIssueDetectedNotification,
  sendRepairStartedNotification,
  sendRepairCompletedNotification,
} from "@/lib/notifications/notification-service"

// 系统工具类型
export type SystemToolType = "scanner" | "optimizer" | "fixer" | "monitor" | "backup"

// 系统工具状态
export type SystemToolStatus = "idle" | "running" | "success" | "error"

// 系统问题类型
export interface SystemIssue {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  category: "performance" | "security" | "compatibility" | "functionality" | "data"
  status: "detected" | "fixing" | "fixed" | "failed"
  fixable: boolean
  autoFixable: boolean
  fixSteps?: string[]
  createdAt: Date
  updatedAt?: Date
}

// 系统工具上下文类型
interface SystemToolsContextType {
  // 状态
  activeToolType: SystemToolType | null
  toolStatus: SystemToolStatus
  progress: number
  issues: SystemIssue[]
  selectedIssueId: string | null

  // 操作
  startTool: (type: SystemToolType) => Promise<void>
  stopTool: () => void
  selectIssue: (id: string | null) => void
  fixIssue: (id: string) => Promise<boolean>
  fixAllIssues: () => Promise<{ success: number; failed: number }>
  dismissIssue: (id: string) => void
  refreshIssues: () => Promise<void>

  // 工具特定功能
  scanSystem: () => Promise<void>
  optimizeSystem: () => Promise<void>
  monitorSystem: () => Promise<void>
  backupSystem: () => Promise<string>
  restoreSystem: (backupId: string) => Promise<boolean>

  // 通知相关方法
  notifyIssueDetected: (componentName: string, issueType: string, message: string) => void
  notifyRepairStarted: (componentName: string, repairId: string) => void
  notifyRepairCompleted: (componentName: string, repairId: string, success: boolean) => void
}

// 创建上下文
const SystemToolsContext = createContext<SystemToolsContextType | undefined>(undefined)

// 使用上下文的钩子
export const useSystemTools = () => {
  const context = useContext(SystemToolsContext)
  if (!context) {
    throw new Error("useSystemTools must be used within a SystemToolsProvider")
  }
  return context
}

// 上下文提供者属性
interface SystemToolsProviderProps {
  children: ReactNode
}

// 系统工具提供者组件
export const SystemToolsProvider: React.FC<SystemToolsProviderProps> = ({ children }) => {
  const { toast } = useToast()
  const [activeToolType, setActiveToolType] = useState<SystemToolType | null>(null)
  const [toolStatus, setToolStatus] = useState<SystemToolStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [issues, setIssues] = useState<SystemIssue[]>([])
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)

  // 获取通知上下文
  const { addSystemAuditNotification, addRepairNotification, settings } = useNotifications()

  // 通知问题检测
  const notifyIssueDetected = (componentName: string, issueType: string, message: string) => {
    // 使用通知上下文添加通知
    addSystemAuditNotification({
      title: `检测到问题: ${componentName}`,
      message,
      level: "warning",
      source: "系统审计",
      componentName,
      issueType,
      repairAvailable: true,
      actionLabel: "查看详情",
      actionUrl: `/system-repair?component=${encodeURIComponent(componentName)}`,
    })

    // 如果启用了服务器端通知，也发送到服务器
    if (settings.emailNotifications) {
      sendIssueDetectedNotification(componentName, issueType, message).catch((error) =>
        console.error("发送问题检测通知到服务器失败:", error),
      )
    }
  }

  // 通知修复开始
  const notifyRepairStarted = (componentName: string, repairId: string) => {
    // 使用通知上下文添加通知
    addRepairNotification({
      title: `修复开始: ${componentName}`,
      message: `系统已开始修复 ${componentName} 中的问题`,
      level: "info",
      source: "系统修复",
      repairId,
      status: "started",
      affectedComponents: [componentName],
      actionLabel: "查看进度",
      actionUrl: `/system-repair/history?id=${repairId}`,
    })

    // 如果启用了服务器端通知，也发送到服务器
    if (settings.emailNotifications) {
      sendRepairStartedNotification(componentName, repairId).catch((error) =>
        console.error("发送修复开始通知到服务器失败:", error),
      )
    }
  }

  // 通知修复完成
  const notifyRepairCompleted = (componentName: string, repairId: string, success: boolean) => {
    // 使用通知上下文添加通知
    addRepairNotification({
      title: `修复${success ? "完成" : "失败"}: ${componentName}`,
      message: success ? `系统已成功修复 ${componentName} 中的问题` : `系统修复 ${componentName} 中的问题失败`,
      level: success ? "success" : "error",
      source: "系统修复",
      repairId,
      status: success ? "completed" : "failed",
      affectedComponents: [componentName],
      actionLabel: "查看详情",
      actionUrl: `/system-repair/history?id=${repairId}`,
    })

    // 如果启用了服务器端通知，也发送到服务器
    if (settings.emailNotifications) {
      sendRepairCompletedNotification(componentName, repairId, success).catch((error) =>
        console.error("发送修复完成通知到服务器失败:", error),
      )
    }
  }

  // 初始化 - 加载已保存的问题
  useEffect(() => {
    const loadSavedIssues = async () => {
      try {
        // 从本地存储或API加载问题
        const savedIssues = localStorage.getItem("systemIssues")
        if (savedIssues) {
          const parsedIssues = JSON.parse(savedIssues)
          // 确保日期正确解析
          const formattedIssues = parsedIssues.map((issue: any) => ({
            ...issue,
            createdAt: new Date(issue.createdAt),
            updatedAt: issue.updatedAt ? new Date(issue.updatedAt) : undefined,
          }))
          setIssues(formattedIssues)
        }
      } catch (error) {
        console.error("加载系统问题失败:", error)
      }
    }

    loadSavedIssues()
  }, [])

  // 保存问题到存储
  useEffect(() => {
    if (issues.length > 0) {
      localStorage.setItem("systemIssues", JSON.stringify(issues))
    }
  }, [issues])

  // 启动工具
  const startTool = useCallback(async (type: SystemToolType) => {
    setActiveToolType(type)
    setToolStatus("running")
    setProgress(0)

    // 根据工具类型执行不同操作
    try {
      if (type === "scanner") {
        await scanSystem()
      } else if (type === "optimizer") {
        await optimizeSystem()
      } else if (type === "monitor") {
        await monitorSystem()
      } else if (type === "backup") {
        await backupSystem()
      } else if (type === "fixer") {
        // 修复工具不自动执行，等待用户选择要修复的问题
        setToolStatus("idle")
      }
    } catch (error) {
      console.error(`执行${type}工具时出错:`, error)
      setToolStatus("error")
      toast({
        title: "工具执行失败",
        description: `执行${getToolName(type)}时发生错误，请重试。`,
        variant: "destructive",
      })
    }
  }, [])

  // 停止工具
  const stopTool = useCallback(() => {
    setActiveToolType(null)
    setToolStatus("idle")
    setProgress(0)
  }, [])

  // 选择问题
  const selectIssue = useCallback((id: string | null) => {
    setSelectedIssueId(id)
  }, [])

  // 修复单个问题
  const fixIssue = useCallback(
    async (id: string) => {
      const issue = issues.find((i) => i.id === id)
      if (!issue || !issue.fixable) {
        toast({
          title: "无法修复",
          description: "此问题无法自动修复或不存在。",
          variant: "destructive",
        })
        return false
      }

      // 更新问题状态为修复中
      setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, status: "fixing" } : i)))

      try {
        // 模拟修复过程
        setToolStatus("running")

        // 进度更新
        for (let i = 0; i <= 100; i += 10) {
          setProgress(i)
          await new Promise((r) => setTimeout(r, 200))
        }

        // 80%概率修复成功
        const success = Math.random() > 0.2

        if (success) {
          // 修复成功
          setIssues((prev) =>
            prev.map((i) =>
              i.id === id
                ? {
                    ...i,
                    status: "fixed",
                    updatedAt: new Date(),
                  }
                : i,
            ),
          )

          toast({
            title: "修复成功",
            description: `问题"${issue.title}"已成功修复。`,
          })

          // 执行实际修复逻辑
          await executeActualFix(issue)

          setToolStatus("success")
          return true
        } else {
          // 修复失败
          setIssues((prev) =>
            prev.map((i) =>
              i.id === id
                ? {
                    ...i,
                    status: "failed",
                    updatedAt: new Date(),
                  }
                : i,
            ),
          )

          toast({
            title: "修复失败",
            description: `问题"${issue.title}"修复失败，请尝试手动修复。`,
            variant: "destructive",
          })

          setToolStatus("error")
          return false
        }
      } catch (error) {
        console.error("修复问题时出错:", error)

        setIssues((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: "failed",
                  updatedAt: new Date(),
                }
              : i,
          ),
        )

        toast({
          title: "修复错误",
          description: `修复过程中发生错误: ${error instanceof Error ? error.message : "未知错误"}`,
          variant: "destructive",
        })

        setToolStatus("error")
        return false
      } finally {
        setProgress(0)
      }
    },
    [issues, toast],
  )

  // 修复所有问题
  const fixAllIssues = useCallback(async () => {
    const fixableIssues = issues.filter((i) => i.fixable && i.status === "detected")
    if (fixableIssues.length === 0) {
      toast({
        title: "没有可修复的问题",
        description: "当前没有可修复的问题。",
      })
      return { success: 0, failed: 0 }
    }

    setToolStatus("running")
    let successCount = 0
    let failedCount = 0

    for (let i = 0; i < fixableIssues.length; i++) {
      const issue = fixableIssues[i]
      setProgress(Math.round((i / fixableIssues.length) * 100))

      // 更新问题状态为修复中
      setIssues((prev) => prev.map((item) => (item.id === issue.id ? { ...item, status: "fixing" } : item)))

      // 等待一段时间模拟修复过程
      await new Promise((r) => setTimeout(r, 1000))

      // 80%概率修复成功
      const success = Math.random() > 0.2

      if (success) {
        // 修复成功
        setIssues((prev) =>
          prev.map((item) =>
            item.id === issue.id
              ? {
                  ...item,
                  status: "fixed",
                  updatedAt: new Date(),
                }
              : item,
          ),
        )

        // 执行实际修复逻辑
        await executeActualFix(issue)

        successCount++
      } else {
        // 修复失败
        setIssues((prev) =>
          prev.map((item) =>
            item.id === issue.id
              ? {
                  ...item,
                  status: "failed",
                  updatedAt: new Date(),
                }
              : item,
          ),
        )

        failedCount++
      }
    }

    setProgress(100)

    // 显示结果通知
    toast({
      title: "批量修复完成",
      description: `成功修复 ${successCount} 个问题，${failedCount} 个问题修复失败。`,
      variant: successCount > 0 ? "default" : "destructive",
    })

    // 重置进度
    setTimeout(() => {
      setProgress(0)
      setToolStatus(successCount > 0 ? "success" : "error")
    }, 1000)

    return { success: successCount, failed: failedCount }
  }, [issues, toast])

  // 忽略问题
  const dismissIssue = useCallback(
    (id: string) => {
      setIssues((prev) => prev.filter((i) => i.id !== id))
      if (selectedIssueId === id) {
        setSelectedIssueId(null)
      }

      toast({
        title: "问题已忽略",
        description: "已从列表中移除此问题。",
      })
    },
    [selectedIssueId, toast],
  )

  // 刷新问题列表
  const refreshIssues = useCallback(async () => {
    setToolStatus("running")
    setProgress(0)

    try {
      // 模拟加载过程
      for (let i = 0; i <= 100; i += 20) {
        setProgress(i)
        await new Promise((r) => setTimeout(r, 200))
      }

      // 保留已修复的问题，移除已失败的问题，添加新问题
      setIssues((prev) => {
        const fixedIssues = prev.filter((i) => i.status === "fixed")
        return [...fixedIssues, ...generateMockIssues()]
      })

      setToolStatus("success")

      toast({
        title: "问题列表已更新",
        description: "系统问题列表已成功刷新。",
      })
    } catch (error) {
      console.error("刷新问题列表时出错:", error)
      setToolStatus("error")

      toast({
        title: "刷新失败",
        description: "刷新问题列表时发生错误，请重试。",
        variant: "destructive",
      })
    } finally {
      setProgress(0)
    }
  }, [toast])

  // 扫描系统
  const scanSystem = useCallback(async () => {
    setToolStatus("running")
    setProgress(0)

    try {
      // 模拟扫描过程
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i)
        await new Promise((r) => setTimeout(r, 100))
      }

      // 生成模拟问题
      const newIssues = generateMockIssues()

      // 合并问题列表，保留已修复的问题
      setIssues((prev) => {
        const fixedIssues = prev.filter((i) => i.status === "fixed")
        return [...fixedIssues, ...newIssues]
      })

      setToolStatus("success")

      toast({
        title: "系统扫描完成",
        description: `发现 ${newIssues.length} 个潜在问题。`,
      })
    } catch (error) {
      console.error("扫描系统时出错:", error)
      setToolStatus("error")

      toast({
        title: "扫描失败",
        description: "扫描系统时发生错误，请重试。",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => setProgress(0), 1000)
    }
  }, [toast])

  // 优化系统
  const optimizeSystem = useCallback(async () => {
    setToolStatus("running")
    setProgress(0)

    try {
      // 模拟优化过程
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise((r) => setTimeout(r, 200))
      }

      setToolStatus("success")

      toast({
        title: "系统优化完成",
        description: "系统性能已成功优化。",
      })
    } catch (error) {
      console.error("优化系统时出错:", error)
      setToolStatus("error")

      toast({
        title: "优化失败",
        description: "优化系统时发生错误，请重试。",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => setProgress(0), 1000)
    }
  }, [toast])

  // 监控系统
  const monitorSystem = useCallback(async () => {
    setToolStatus("running")
    setProgress(0)

    try {
      // 模拟监控过程
      for (let i = 0; i <= 100; i += 25) {
        setProgress(i)
        await new Promise((r) => setTimeout(r, 300))
      }

      setToolStatus("success")

      toast({
        title: "系统监控已启动",
        description: "系统监控已成功启动，将持续监控系统状态。",
      })
    } catch (error) {
      console.error("监控系统时出错:", error)
      setToolStatus("error")

      toast({
        title: "监控启动失败",
        description: "启动系统监控时发生错误，请重试。",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => setProgress(0), 1000)
    }
  }, [toast])

  // 备份系统
  const backupSystem = useCallback(async () => {
    setToolStatus("running")
    setProgress(0)

    try {
      // 模拟备份过程
      for (let i = 0; i <= 100; i += 5) {
        setProgress(i)
        await new Promise((r) => setTimeout(r, 100))
      }

      const backupId = `backup-${Date.now()}`
      setToolStatus("success")

      toast({
        title: "系统备份完成",
        description: `系统已成功备份，备份ID: ${backupId}`,
      })

      return backupId
    } catch (error) {
      console.error("备份系统时出错:", error)
      setToolStatus("error")

      toast({
        title: "备份失败",
        description: "备份系统时发生错误，请重试。",
        variant: "destructive",
      })

      throw error
    } finally {
      setTimeout(() => setProgress(0), 1000)
    }
  }, [toast])

  // 恢复系统
  const restoreSystem = useCallback(
    async (backupId: string) => {
      setToolStatus("running")
      setProgress(0)

      try {
        // 模拟恢复过程
        for (let i = 0; i <= 100; i += 5) {
          setProgress(i)
          await new Promise((r) => setTimeout(r, 100))
        }

        setToolStatus("success")

        toast({
          title: "系统恢复完成",
          description: `系统已成功从备份 ${backupId} 恢复。`,
        })

        return true
      } catch (error) {
        console.error("恢复系统时出错:", error)
        setToolStatus("error")

        toast({
          title: "恢复失败",
          description: "恢复系统时发生错误，请重试。",
          variant: "destructive",
        })

        return false
      } finally {
        setTimeout(() => setProgress(0), 1000)
      }
    },
    [toast],
  )

  // 执行实际修复逻辑
  const executeActualFix = async (issue: SystemIssue) => {
    // 根据问题类别执行不同的修复逻辑
    switch (issue.category) {
      case "performance":
        // 执行性能优化
        console.log(`执行性能优化: ${issue.title}`)
        break
      case "security":
        // 执行安全修复
        console.log(`执行安全修复: ${issue.title}`)
        break
      case "compatibility":
        // 执行兼容性修复
        console.log(`执行兼容性修复: ${issue.title}`)
        break
      case "functionality":
        // 执行功能修复
        console.log(`执行功能修复: ${issue.title}`)
        break
      case "data":
        // 执行数据修复
        console.log(`执行数据修复: ${issue.title}`)
        break
    }

    // 等待一段时间模拟修复过程
    await new Promise((r) => setTimeout(r, 500))
  }

  // 获取工具名称
  const getToolName = (type: SystemToolType): string => {
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

  // 生成模拟问题
  const generateMockIssues = (): SystemIssue[] => {
    const mockIssues: SystemIssue[] = [
      {
        id: `issue-${Date.now()}-1`,
        title: "API响应时间过长",
        description: "部分API端点响应时间超过2秒，影响用户体验。",
        severity: "medium",
        category: "performance",
        status: "detected",
        fixable: true,
        autoFixable: true,
        fixSteps: ["分析API响应时间日志", "优化数据库查询", "添加适当的缓存机制"],
        createdAt: new Date(),
      },
      {
        id: `issue-${Date.now()}-2`,
        title: "安全漏洞：缺少CSRF保护",
        description: "系统中的表单提交缺少CSRF令牌保护，存在跨站请求伪造风险。",
        severity: "high",
        category: "security",
        status: "detected",
        fixable: true,
        autoFixable: true,
        fixSteps: ["在所有表单中添加CSRF令牌", "在服务器端验证CSRF令牌", "配置适当的CSRF中间件"],
        createdAt: new Date(),
      },
      {
        id: `issue-${Date.now()}-3`,
        title: "数据库连接池配置不当",
        description: "数据库连接池大小配置不当，可能导致连接耗尽。",
        severity: "medium",
        category: "performance",
        status: "detected",
        fixable: true,
        autoFixable: true,
        fixSteps: ["分析当前连接池使用情况", "调整连接池大小参数", "添加连接池监控"],
        createdAt: new Date(),
      },
      {
        id: `issue-${Date.now()}-4`,
        title: "日志记录不完整",
        description: "系统日志记录不完整，缺少关键操作的审计日志。",
        severity: "low",
        category: "functionality",
        status: "detected",
        fixable: true,
        autoFixable: false,
        fixSteps: ["识别需要记录日志的关键操作", "实现完整的日志记录机制", "配置日志轮转和保留策略"],
        createdAt: new Date(),
      },
      {
        id: `issue-${Date.now()}-5`,
        title: "缺少错误边界处理",
        description: "前端应用缺少错误边界处理，可能导致整个应用崩溃。",
        severity: "medium",
        category: "functionality",
        status: "detected",
        fixable: true,
        autoFixable: true,
        fixSteps: ["实现React错误边界组件", "在关键组件中添加错误边界", "添加错误报告机制"],
        createdAt: new Date(),
      },
    ]

    // 随机选择3-5个问题
    return mockIssues.slice(0, Math.floor(Math.random() * 3) + 3)
  }

  const value: SystemToolsContextType = {
    activeToolType,
    toolStatus,
    progress,
    issues,
    selectedIssueId,
    startTool,
    stopTool,
    selectIssue,
    fixIssue,
    fixAllIssues,
    dismissIssue,
    refreshIssues,
    scanSystem,
    optimizeSystem,
    monitorSystem,
    backupSystem,
    restoreSystem,
    notifyIssueDetected,
    notifyRepairStarted,
    notifyRepairCompleted,
  }

  return <SystemToolsContext.Provider value={value}>{children}</SystemToolsContext.Provider>
}
