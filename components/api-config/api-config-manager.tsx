"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import type { ApiConfig, AuthConfig } from "@/lib/api-binding"

// API配置类型（包含元数据）
export interface ApiConfigWithMeta {
  id: string
  name: string
  config: ApiConfig
  auth: AuthConfig
  createdAt: string
  updatedAt: string
}

// 新API配置类型（不包含元数据）
export interface NewApiConfig {
  name: string
  config: ApiConfig
  auth: AuthConfig
}

// 上下文类型
interface ApiConfigContextType {
  configs: ApiConfigWithMeta[]
  addConfig: (config: NewApiConfig) => void
  updateConfig: (id: string, config: NewApiConfig) => void
  deleteConfig: (id: string) => void
  getConfigById: (id: string) => ApiConfigWithMeta | undefined
}

// 创建上下文
const ApiConfigContext = createContext<ApiConfigContextType | undefined>(undefined)

// 存储键
const STORAGE_KEY = "api-configs"

// 提供者组件
export function ApiConfigProvider({ children }: { children: React.ReactNode }) {
  const [configs, setConfigs] = useState<ApiConfigWithMeta[]>([])

  // 初始化：从本地存储加载配置
  useEffect(() => {
    const savedConfigs = localStorage.getItem(STORAGE_KEY)
    if (savedConfigs) {
      try {
        setConfigs(JSON.parse(savedConfigs))
      } catch (error) {
        console.error("无法解析保存的API配置:", error)
      }
    }
  }, [])

  // 保存到本地存储
  useEffect(() => {
    if (configs.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configs))
    }
  }, [configs])

  // 添加新配置
  const addConfig = (newConfig: NewApiConfig) => {
    const now = new Date().toISOString()
    const configWithMeta: ApiConfigWithMeta = {
      id: uuidv4(),
      ...newConfig,
      createdAt: now,
      updatedAt: now,
    }
    setConfigs((prev) => [...prev, configWithMeta])
  }

  // 更新配置
  const updateConfig = (id: string, updatedConfig: NewApiConfig) => {
    setConfigs((prev) =>
      prev.map((config) =>
        config.id === id
          ? {
              ...config,
              ...updatedConfig,
              updatedAt: new Date().toISOString(),
            }
          : config,
      ),
    )
  }

  // 删除配置
  const deleteConfig = (id: string) => {
    setConfigs((prev) => prev.filter((config) => config.id !== id))
  }

  // 通过ID获取配置
  const getConfigById = (id: string) => {
    return configs.find((config) => config.id === id)
  }

  return (
    <ApiConfigContext.Provider
      value={{
        configs,
        addConfig,
        updateConfig,
        deleteConfig,
        getConfigById,
      }}
    >
      {children}
    </ApiConfigContext.Provider>
  )
}

// 自定义钩子
export function useApiConfig() {
  const context = useContext(ApiConfigContext)
  if (context === undefined) {
    throw new Error("useApiConfig must be used within an ApiConfigProvider")
  }
  return context
}

export default ApiConfigProvider
