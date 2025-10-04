"use client"

import { useState, useEffect } from "react"

// 模拟数据
const initialProviders = [
  {
    id: "1",
    name: "智谱 AI",
    description: "智谱 AI 提供的 GLM 大模型",
    apiType: "zhipu",
    apiKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    apiEndpoint: "https://open.bigmodel.cn/api/paas/v3",
    defaultModel: "glm-4",
    organizationId: "",
    customHeaders: "",
    status: "active",
    healthStatus: "healthy",
    lastChecked: "2023-05-15T08:30:00.000Z",
  },
  {
    id: "2",
    name: "百度文心一言",
    description: "百度提供的文心一言大模型",
    apiType: "wenxin",
    apiKey: "xxxxxxxxxxxxxxxxxxxxxxxx",
    apiEndpoint: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop",
    defaultModel: "ernie-bot-4",
    organizationId: "",
    customHeaders: "",
    status: "active",
    healthStatus: "healthy",
    lastChecked: "2023-05-15T08:30:00.000Z",
  },
  {
    id: "3",
    name: "讯飞星火",
    description: "讯飞提供的星火大模型",
    apiType: "spark",
    apiKey: "xxxxxxxxxxxxxxxxxxxxxxxx",
    apiEndpoint: "https://spark-api.xf-yun.com/v2.1",
    defaultModel: "spark-3.5",
    organizationId: "",
    customHeaders: "",
    status: "active",
    healthStatus: "degraded",
    lastChecked: "2023-05-15T08:30:00.000Z",
  },
]

export function useProviders() {
  const [providers, setProviders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 在实际应用中，这里应该从API获取数据
    // 为了演示，我们使用模拟数据
    setProviders(initialProviders)
    setIsLoading(false)
  }, [])

  const addProvider = (provider) => {
    setProviders((prev) => [...prev, provider])
  }

  const updateProvider = (id, updates) => {
    setProviders((prev) => prev.map((provider) => (provider.id === id ? { ...provider, ...updates } : provider)))
  }

  const deleteProvider = (id) => {
    setProviders((prev) => prev.filter((provider) => provider.id !== id))
  }

  const checkProviderHealth = async (providerId: string) => {
    try {
      // 在实际应用中，这里应该调用API
      // const response = await fetch(`/api/providers/${providerId}/health`)
      // const data = await response.json()
      // setProviders(prev => prev.map(p => p.id === providerId ? { ...p, healthStatus: data.status, lastChecked: new Date().toISOString() } : p))

      // 使用模拟数据
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const statuses = ["healthy", "degraded", "unhealthy"] as const
      const randomStatus = statuses[Math.floor(Math.random() * (statuses.length - 0.2))]
      // setProviders((prev) =>
      //   prev.map((p) =>
      //     p.id === providerId ? { ...p, healthStatus: randomStatus, lastChecked: new Date().toISOString() } : p,
      //   ),
      // )
      return randomStatus
    } catch (err) {
      console.error("检查提供商健康状态失败:", err)
      throw new Error("无法检查提供商健康状态，请稍后再试")
    }
  }

  const checkAllProvidersHealth = async () => {
    try {
      // 在实际应用中，这里应该调用API
      // const response = await fetch('/api/providers/health')
      // const data = await response.json()
      // setProviders(prev => prev.map(p => {
      //   const healthData = data.find((d: any) => d.id === p.id)
      //   return healthData ? { ...p, healthStatus: healthData.status, lastChecked: new Date().toISOString() } : p
      // }))

      // 使用模拟数据
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const statuses = ["healthy", "degraded", "unhealthy"] as const
      // setProviders((prev) =>
      //   prev.map((p) => ({
      //     ...p,
      //     healthStatus: statuses[Math.floor(Math.random() * (statuses.length - 0.2))] as
      //       | "healthy"
      //       | "degraded"
      //       | "unhealthy",
      //     lastChecked: new Date().toISOString(),
      //   })),
      // )
    } catch (err) {
      console.error("检查所有提供商健康状态失败:", err)
      throw new Error("无法检查提供商健康状态，请稍后再试")
    }
  }

  return {
    providers,
    addProvider,
    updateProvider,
    deleteProvider,
    isLoading,
    error,
    checkProviderHealth,
    checkAllProvidersHealth,
  }
}
