"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

// API配置类型
export interface ApiConfig {
  id: string
  name: string
  baseUrl: string
  description?: string
  version?: string
  auth: {
    type: "none" | "basic" | "bearer" | "api-key" | "oauth2" | "custom"
    enabled: boolean
    config?: Record<string, any>
  }
  headers: Record<string, string>
  parameters: Record<string, string>
  createdAt: string
  updatedAt: string
}

// API历史记录项类型
export interface ApiHistoryItem {
  id: string
  configId: string
  endpoint: string
  method: string
  url: string
  headers: Record<string, string>
  body?: any
  queryParams: Record<string, string>
  responseStatus: number
  responseHeaders: Record<string, string>
  responseBody?: any
  duration: number
  timestamp: string
  error?: string
}

// 上下文类型
interface ApiConfigContextType {
  apiConfigs: ApiConfig[]
  selectedApiConfig: ApiConfig | null
  apiHistoryItems: ApiHistoryItem[]
  loading: boolean
  setSelectedApiConfig: (config: ApiConfig | null) => void
  addApiConfig: (config: Omit<ApiConfig, "id" | "createdAt" | "updatedAt">) => string
  updateApiConfig: (id: string, config: Partial<Omit<ApiConfig, "id" | "createdAt" | "updatedAt">>) => boolean
  deleteApiConfig: (id: string) => boolean
  getApiConfigById: (id: string) => ApiConfig | null
  addHistoryItem: (item: Omit<ApiHistoryItem, "id" | "timestamp">) => string
  clearHistory: (configId?: string) => boolean
}

// 创建上下文
const ApiConfigContext = createContext<ApiConfigContextType | undefined>(undefined)

// 存储键
const API_CONFIGS_KEY = "api-configs"
const API_HISTORY_KEY = "api-history"

// 提供者组件
export function ApiConfigProvider({ children }: { children: ReactNode }) {
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>([])
  const [selectedApiConfig, setSelectedApiConfig] = useState<ApiConfig | null>(null)
  const [apiHistoryItems, setApiHistoryItems] = useState<ApiHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // 加载数据
  useEffect(() => {
    const loadData = () => {
      try {
        // 加载API配置
        const storedConfigs = localStorage.getItem(API_CONFIGS_KEY)
        if (storedConfigs) {
          const configs = JSON.parse(storedConfigs)
          setApiConfigs(configs)

          // 如果有配置，默认选择第一个
          if (configs.length > 0) {
            setSelectedApiConfig(configs[0])
          }
        } else {
          // 添加示例配置
          const exampleConfig: ApiConfig = {
            id: "example-api",
            name: "示例API",
            baseUrl: "https://jsonplaceholder.typicode.com",
            description: "用于测试和演示的免费API",
            version: "1.0.0",
            auth: {
              type: "none",
              enabled: false,
            },
            headers: {
              "Content-Type": "application/json",
            },
            parameters: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          setApiConfigs([exampleConfig])
          setSelectedApiConfig(exampleConfig)
          localStorage.setItem(API_CONFIGS_KEY, JSON.stringify([exampleConfig]))
        }

        // 加载历史记录
        const storedHistory = localStorage.getItem(API_HISTORY_KEY)
        if (storedHistory) {
          setApiHistoryItems(JSON.parse(storedHistory))
        }
      } catch (error) {
        console.error("加载数据失败:", error)
        toast({
          title: "加载失败",
          description: "无法加载API配置和历史记录",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [toast])

  // 保存API配置
  const saveApiConfigs = (configs: ApiConfig[]) => {
    try {
      localStorage.setItem(API_CONFIGS_KEY, JSON.stringify(configs))
      setApiConfigs(configs)
      return true
    } catch (error) {
      console.error("保存API配置失败:", error)
      toast({
        title: "保存失败",
        description: "无法保存API配置",
        variant: "destructive",
      })
      return false
    }
  }

  // 保存历史记录
  const saveApiHistory = (history: ApiHistoryItem[]) => {
    try {
      localStorage.setItem(API_HISTORY_KEY, JSON.stringify(history))
      setApiHistoryItems(history)
      return true
    } catch (error) {
      console.error("保存历史记录失败:", error)
      toast({
        title: "保存失败",
        description: "无法保存API历史记录",
        variant: "destructive",
      })
      return false
    }
  }

  // 获取API配置
  const getApiConfigById = (id: string) => {
    const config = apiConfigs.find((config) => config.id === id)
    return config || null
  }

  // 添加API配置
  const addApiConfig = (config: Omit<ApiConfig, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString()
    const id = `api-${Date.now()}`
    const newConfig: ApiConfig = {
      ...config,
      id,
      createdAt: now,
      updatedAt: now,
    }

    const newConfigs = [...apiConfigs, newConfig]
    if (saveApiConfigs(newConfigs)) {
      toast({
        title: "添加成功",
        description: `API配置 "${config.name}" 已成功添加`,
      })
      return id
    }
    return ""
  }

  // 更新API配置
  const updateApiConfig = (id: string, configUpdate: Partial<Omit<ApiConfig, "id" | "createdAt" | "updatedAt">>) => {
    const index = apiConfigs.findIndex((config) => config.id === id)
    if (index === -1) {
      toast({
        title: "更新失败",
        description: "找不到要更新的API配置",
        variant: "destructive",
      })
      return false
    }

    const updatedConfig = {
      ...apiConfigs[index],
      ...configUpdate,
      updatedAt: new Date().toISOString(),
    }

    const newConfigs = [...apiConfigs]
    newConfigs[index] = updatedConfig

    // 如果更新的是当前选中的配置，也更新选中状态
    if (selectedApiConfig && selectedApiConfig.id === id) {
      setSelectedApiConfig(updatedConfig)
    }

    if (saveApiConfigs(newConfigs)) {
      toast({
        title: "更新成功",
        description: `API配置 "${updatedConfig.name}" 已成功更新`,
      })
      return true
    }
    return false
  }

  // 删除API配置
  const deleteApiConfig = (id: string) => {
    const configToDelete = apiConfigs.find((config) => config.id === id)
    if (!configToDelete) {
      toast({
        title: "删除失败",
        description: "找不到要删除的API配置",
        variant: "destructive",
      })
      return false
    }

    const newConfigs = apiConfigs.filter((config) => config.id !== id)

    // 如果删除的是当前选中的配置，重置选中状态或选择另一个
    if (selectedApiConfig && selectedApiConfig.id === id) {
      setSelectedApiConfig(newConfigs.length > 0 ? newConfigs[0] : null)
    }

    if (saveApiConfigs(newConfigs)) {
      toast({
        title: "删除成功",
        description: `API配置 "${configToDelete.name}" 已成功删除`,
      })
      return true
    }
    return false
  }

  // 添加历史记录
  const addHistoryItem = (item: Omit<ApiHistoryItem, "id" | "timestamp">) => {
    const id = `hist-${Date.now()}`
    const newItem: ApiHistoryItem = {
      ...item,
      id,
      timestamp: new Date().toISOString(),
    }

    const newHistory = [newItem, ...apiHistoryItems].slice(0, 100) // 限制最多保存100条记录
    if (saveApiHistory(newHistory)) {
      return id
    }
    return ""
  }

  // 清除历史记录
  const clearHistory = (configId?: string) => {
    let newHistory: ApiHistoryItem[]

    if (configId) {
      // 只清除特定API的历史记录
      newHistory = apiHistoryItems.filter((item) => item.configId !== configId)
    } else {
      // 清除所有历史记录
      newHistory = []
    }

    if (saveApiHistory(newHistory)) {
      toast({
        title: "清除成功",
        description: configId ? "已清除所选API的历史记录" : "已清除所有历史记录",
      })
      return true
    }
    return false
  }

  // 上下文值
  const contextValue: ApiConfigContextType = {
    apiConfigs,
    selectedApiConfig,
    apiHistoryItems,
    loading,
    setSelectedApiConfig,
    addApiConfig,
    updateApiConfig,
    deleteApiConfig,
    getApiConfigById,
    addHistoryItem,
    clearHistory,
  }

  return <ApiConfigContext.Provider value={contextValue}>{children}</ApiConfigContext.Provider>
}

// 使用上下文的钩子
export function useApiConfig() {
  const context = useContext(ApiConfigContext)
  if (context === undefined) {
    throw new Error("useApiConfig must be used within an ApiConfigProvider")
  }
  return context
}
