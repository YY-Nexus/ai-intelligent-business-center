"use client"

import { useState, useEffect } from "react"
import type { RoutingRule } from "@/types/api"

// 模拟初始路由规则
const initialRules: RoutingRule[] = [
  {
    id: "rule1",
    name: "文本生成优先规则",
    description: "对于文本生成任务，优先使用百度文心一言",
    enabled: true,
    priority: 1,
    conditions: [
      {
        field: "endpoint",
        operator: "equals",
        value: "completions",
      },
    ],
    action: {
      providerId: "baidu",
      model: "ernie-bot-4",
      fallbackProviderId: "xfyun",
    },
  },
  {
    id: "rule2",
    name: "多轮对话优先规则",
    description: "对于多轮对话任务，优先使用智谱AI",
    enabled: true,
    priority: 2,
    conditions: [
      {
        field: "endpoint",
        operator: "equals",
        value: "chat",
      },
      {
        field: "messages.length",
        operator: "greaterThan",
        value: 1,
      },
    ],
    action: {
      providerId: "zhipu",
      model: "glm-4",
      fallbackProviderId: "aliyun",
    },
  },
  {
    id: "rule3",
    name: "成本优化规则",
    description: "对于非关键任务，使用成本较低的模型",
    enabled: false,
    priority: 3,
    conditions: [
      {
        field: "priority",
        operator: "equals",
        value: "low",
      },
    ],
    action: {
      providerId: "xfyun",
      model: "spark-3.0",
    },
  },
]

// 模拟初始设置
const initialSettings = {
  enableSmartRouting: true,
  enableFailover: true,
  enableCostOptimization: true,
  enableABTesting: false,
}

export function useRouting() {
  const [rules, setRules] = useState<RoutingRule[]>([])
  const [settings, setSettings] = useState(initialSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 模拟从API加载路由规则
    const loadRules = async () => {
      try {
        // 在实际应用中，这里应该从API获取数据
        // const response = await fetch('/api/routing/rules')
        // const data = await response.json()
        // setRules(data)

        // 使用模拟数据
        await new Promise((resolve) => setTimeout(resolve, 500))
        setRules(initialRules)
        setIsLoading(false)
      } catch (err) {
        console.error("加载路由规则失败:", err)
        setError("无法加载路由规则，请稍后再试")
        setIsLoading(false)
      }
    }

    // 模拟从API加载设置
    const loadSettings = async () => {
      try {
        // 在实际应用中，这里应该从API获取数据
        // const response = await fetch('/api/routing/settings')
        // const data = await response.json()
        // setSettings(data)

        // 使用模拟数据
        await new Promise((resolve) => setTimeout(resolve, 500))
        setSettings(initialSettings)
      } catch (err) {
        console.error("加载路由设置失败:", err)
        setError("无法加载路由设置，请稍后再试")
      }
    }

    loadRules()
    loadSettings()
  }, [])

  const addRule = async (rule: RoutingRule) => {
    try {
      // 在实际应用中，这里应该调用API
      // const response = await fetch('/api/routing/rules', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(rule)
      // })
      // const data = await response.json()
      // setRules(prev => [...prev, data])

      // 使用模拟数据
      setRules((prev) => [...prev, rule])
    } catch (err) {
      console.error("添加路由规则失败:", err)
      throw new Error("无法添加路由规则，请稍后再试")
    }
  }

  const updateRule = async (ruleId: string, updates: Partial<RoutingRule>) => {
    try {
      // 在实际应用中，这里应该调用API
      // const response = await fetch(`/api/routing/rules/${ruleId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // })
      // const data = await response.json()
      // setRules(prev => prev.map(r => r.id === ruleId ? data : r))

      // 使用模拟数据
      setRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)))
    } catch (err) {
      console.error("更新路由规则失败:", err)
      throw new Error("无法更新路由规则，请稍后再试")
    }
  }

  const deleteRule = async (ruleId: string) => {
    try {
      // 在实际应用中，这里应该调用API
      // await fetch(`/api/routing/rules/${ruleId}`, {
      //   method: 'DELETE'
      // })
      // setRules(prev => prev.filter(r => r.id !== ruleId))

      // 使用模拟数据
      setRules((prev) => prev.filter((r) => r.id !== ruleId))
    } catch (err) {
      console.error("删除路由规则失败:", err)
      throw new Error("无法删除路由规则，请稍后再试")
    }
  }

  const updateSettings = async (updates: Partial<typeof settings>) => {
    try {
      // 在实际应用中，这里应该调用API
      // const response = await fetch('/api/routing/settings', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // })
      // const data = await response.json()
      // setSettings(data)

      // 使用模拟数据
      setSettings((prev) => ({ ...prev, ...updates }))
    } catch (err) {
      console.error("更新路由设置失败:", err)
      throw new Error("无法更新路由设置，请稍后再试")
    }
  }

  const simulateRouting = async (request: any) => {
    try {
      // 在实际应用中，这里应该调用API
      // const response = await fetch('/api/routing/simulate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(request)
      // })
      // return await response.json()

      // 使用模拟数据
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 模拟路由决策
      const enabledRules = rules.filter((r) => r.enabled).sort((a, b) => a.priority - b.priority)

      for (const rule of enabledRules) {
        // 简单模拟条件匹配
        const isMatch = rule.conditions.length === 0 || Math.random() > 0.3

        if (isMatch) {
          return {
            selectedProvider: rule.action.providerId,
            selectedModel: rule.action.model,
            matchedRule: rule.id,
            ruleName: rule.name,
            reason: `匹配规则: ${rule.name}`,
          }
        }
      }

      // 如果没有匹配的规则，返回默认提供商
      return {
        selectedProvider: "baidu",
        selectedModel: "ernie-bot-4",
        matchedRule: null,
        ruleName: null,
        reason: "没有匹配的规则，使用默认提供商",
      }
    } catch (err) {
      console.error("模拟路由失败:", err)
      throw new Error("无法模拟路由，请稍后再试")
    }
  }

  return {
    rules,
    settings,
    isLoading,
    error,
    addRule,
    updateRule,
    deleteRule,
    updateSettings,
    simulateRouting,
  }
}
