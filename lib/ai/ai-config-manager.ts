"use client"

/**
 * AI配置管理器
 * 用于管理所有AI模型的配置信息
 */

import { useState, useEffect } from "react"

export interface AIModelConfig {
  id: string
  name: string
  provider: string
  apiKey?: string
  apiEndpoint?: string
  version?: string
  enabled: boolean
  description: string
  capabilities: string[]
  maxTokens?: number
  temperature?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stopSequences?: string[]
}

// 默认AI模型配置
export const defaultAIModels: AIModelConfig[] = [
  {
    id: "glm-4v",
    name: "GLM-4V",
    provider: "智谱AI",
    enabled: true,
    description: "智谱AI的多模态大语言模型，支持图像理解和文本生成",
    capabilities: ["聊天对话", "图像理解", "多模态交互"],
    maxTokens: 2048,
    temperature: 0.7,
  },
  {
    id: "cogview-3",
    name: "CogView-3",
    provider: "智谱AI",
    enabled: true,
    description: "智谱AI的文生图模型，可根据文本描述生成图像",
    capabilities: ["文生图", "图像编辑"],
  },
  {
    id: "codegeex-4",
    name: "CodeGeeX-4",
    provider: "智谱AI",
    enabled: true,
    description: "智谱AI的代码生成模型，支持多种编程语言",
    capabilities: ["代码生成", "代码补全", "代码解释"],
    maxTokens: 2048,
    temperature: 0.7,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    enabled: true,
    description: "OpenAI的最新多模态大语言模型，支持图像理解和文本生成",
    capabilities: ["聊天对话", "图像理解", "多模态交互"],
    maxTokens: 4096,
    temperature: 0.7,
  },
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    provider: "OpenAI",
    enabled: true,
    description: "OpenAI的文生图模型，可根据文本描述生成图像",
    capabilities: ["文生图", "图像编辑"],
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    enabled: true,
    description: "Anthropic的最新多模态大语言模型，支持图像理解和文本生成",
    capabilities: ["聊天对话", "图像理解", "多模态交互"],
    maxTokens: 4096,
    temperature: 0.7,
  },
]

// 本地存储键
const AI_CONFIG_STORAGE_KEY = "ai_model_configs"
const AI_ACTIVE_MODEL_KEY = "ai_active_model"

/**
 * 使用AI配置的Hook
 */
export function useAIConfig() {
  const [models, setModels] = useState<AIModelConfig[]>([])
  const [activeModelId, setActiveModelId] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  // 初始化时从本地存储加载配置
  useEffect(() => {
    const loadConfigs = () => {
      try {
        // 尝试从本地存储加载配置
        const storedConfigs = localStorage.getItem(AI_CONFIG_STORAGE_KEY)
        const storedActiveModel = localStorage.getItem(AI_ACTIVE_MODEL_KEY)

        if (storedConfigs) {
          const parsedConfigs = JSON.parse(storedConfigs)
          setModels(parsedConfigs)
        } else {
          // 如果没有存储的配置，使用默认配置
          setModels(defaultAIModels)
        }

        if (storedActiveModel) {
          setActiveModelId(storedActiveModel)
        } else if (defaultAIModels.length > 0) {
          // 如果没有存储的活动模型，使用第一个模型
          setActiveModelId(defaultAIModels[0].id)
        }

        setIsLoaded(true)
      } catch (error) {
        console.error("加载AI配置失败:", error)
        // 出错时使用默认配置
        setModels(defaultAIModels)
        if (defaultAIModels.length > 0) {
          setActiveModelId(defaultAIModels[0].id)
        }
        setIsLoaded(true)
      }
    }

    loadConfigs()
  }, [])

  // 保存配置到本地存储
  const saveConfigs = (newModels: AIModelConfig[]) => {
    try {
      localStorage.setItem(AI_CONFIG_STORAGE_KEY, JSON.stringify(newModels))
      setModels(newModels)
    } catch (error) {
      console.error("保存AI配置失败:", error)
    }
  }

  // 保存活动模型ID到本地存储
  const saveActiveModel = (modelId: string) => {
    try {
      localStorage.setItem(AI_ACTIVE_MODEL_KEY, modelId)
      setActiveModelId(modelId)
    } catch (error) {
      console.error("保存活动AI模型失败:", error)
    }
  }

  // 获取模型配置
  const getModelConfig = (modelId: string): AIModelConfig | undefined => {
    return models.find((model) => model.id === modelId)
  }

  // 获取活动模型配置
  const getActiveModelConfig = (): AIModelConfig | undefined => {
    return models.find((model) => model.id === activeModelId)
  }

  // 更新模型配置
  const updateModelConfig = (modelId: string, updates: Partial<AIModelConfig>) => {
    const newModels = models.map((model) => (model.id === modelId ? { ...model, ...updates } : model))
    saveConfigs(newModels)
  }

  // 添加新模型配置
  const addModelConfig = (newModel: AIModelConfig) => {
    // 确保ID不重复
    if (models.some((model) => model.id === newModel.id)) {
      throw new Error(`模型ID '${newModel.id}' 已存在`)
    }
    const newModels = [...models, newModel]
    saveConfigs(newModels)
  }

  // 删除模型配置
  const deleteModelConfig = (modelId: string) => {
    const newModels = models.filter((model) => model.id !== modelId)
    saveConfigs(newModels)

    // 如果删除的是当前活动模型，则切换到第一个可用模型
    if (modelId === activeModelId && newModels.length > 0) {
      saveActiveModel(newModels[0].id)
    }
  }

  // 设置API密钥
  const setApiKey = (modelId: string, apiKey: string) => {
    updateModelConfig(modelId, { apiKey })
  }

  // 获取API密钥
  const getApiKey = (modelId: string): string | undefined => {
    const model = getModelConfig(modelId)
    return model?.apiKey
  }

  // 获取活动模型的API密钥
  const getActiveApiKey = (): string | undefined => {
    const model = getActiveModelConfig()
    return model?.apiKey
  }

  return {
    models,
    activeModelId,
    isLoaded,
    getModelConfig,
    getActiveModelConfig,
    updateModelConfig,
    addModelConfig,
    deleteModelConfig,
    setActiveModel: saveActiveModel,
    setApiKey,
    getApiKey,
    getActiveApiKey,
  }
}

// 创建一个环境变量获取函数，优先使用环境变量，然后使用本地存储
export function getEnvOrLocalStorage(key: string, localStorageKey?: string): string | undefined {
  // 首先尝试从环境变量获取
  if (typeof process !== "undefined" && process.env) {
    const envValue = process.env[key]
    if (envValue) return envValue
  }

  // 如果没有环境变量，尝试从localStorage获取
  if (typeof window !== "undefined" && localStorageKey) {
    try {
      return localStorage.getItem(localStorageKey) || undefined
    } catch (e) {
      console.error(`从localStorage获取${localStorageKey}失败:`, e)
    }
  }

  return undefined
}

// 获取OpenAI API密钥
export function getOpenAIApiKey(): string | undefined {
  return getEnvOrLocalStorage("OPENAI_API_KEY", "openai_api_key")
}

// 获取智谱AI API密钥
export function getZhipuApiKey(): string | undefined {
  return getEnvOrLocalStorage("ZHIPU_API_KEY", "zhipu_api_key")
}

// 获取Anthropic API密钥
export function getAnthropicApiKey(): string | undefined {
  return getEnvOrLocalStorage("ANTHROPIC_API_KEY", "anthropic_api_key")
}
