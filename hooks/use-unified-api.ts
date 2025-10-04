"use client"

import { useState } from "react"
import type { ApiRequest, ApiResponse } from "@/types/api"

export function useUnifiedApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendChatMessage = async (request: ApiRequest): Promise<ApiResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      // 在实际应用中，这里应该调用API
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(request)
      // })
      //
      // if (!response.ok) {
      //   const errorData = await response.json()
      //   throw new Error(errorData.message || '发送消息失败')
      // }
      //
      // return await response.json()

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

      // 模拟不同提供商的响应
      const providers = [
        { id: "baidu", name: "百度文心一言", model: "ernie-bot-4" },
        { id: "xfyun", name: "讯飞星火", model: "spark-3.5" },
        { id: "zhipu", name: "智谱AI", model: "glm-4" },
        { id: "aliyun", name: "阿里云通义千问", model: "qwen-max" },
        { id: "tencent", name: "腾讯云混元", model: "hunyuan-pro" },
        { id: "moonshot", name: "Moonshot AI", model: "moonshot-v1-8k" },
        { id: "baichuan", name: "百川智能", model: "baichuan-53b" },
      ]

      // 如果指定了提供商，则使用指定的提供商
      let selectedProvider
      if (request.providerId) {
        selectedProvider = providers.find((p) => p.id === request.providerId)
      }

      // 如果没有指定提供商或指定的提供商不存在，则随机选择一个
      if (!selectedProvider) {
        selectedProvider = providers[Math.floor(Math.random() * providers.length)]
      }

      // 模拟响应
      const userMessage = request.messages[request.messages.length - 1].content
      return {
        text: `这是来自${selectedProvider.name}的响应。\n\n您的消息: "${userMessage}"\n\n根据您的问题，我可以提供以下信息...\n\n这是一个模拟的AI响应，实际应用中会调用真实的AI服务。在统一API管理系统中，您可以无缝切换不同的AI提供商，而不需要修改应用代码。`,
        model: request.model || selectedProvider.model,
        provider: selectedProvider.id,
        usage: {
          promptTokens: Math.floor(userMessage.length / 4) + 10,
          completionTokens: Math.floor(Math.random() * 100) + 50,
          totalTokens: Math.floor(userMessage.length / 4) + 10 + Math.floor(Math.random() * 100) + 50,
        },
      }
    } catch (err: any) {
      console.error("发送聊天消息失败:", err)
      setError(err.message || "发送消息失败，请稍后再试")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const generateImage = async (request: ApiRequest): Promise<ApiResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      // 在实际应用中，这里应该调用API
      // const response = await fetch('/api/images', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(request)
      // })
      //
      // if (!response.ok) {
      //   const errorData = await response.json()
      //   throw new Error(errorData.message || '生成图像失败')
      // }
      //
      // return await response.json()

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 2000))

      // 模拟响应
      return {
        text: "图像生成成功",
        imageUrl: `https://picsum.photos/seed/${Date.now()}/512/512`,
        provider: request.providerId || "aliyun",
        model: request.model || "cogview-3",
      }
    } catch (err: any) {
      console.error("生成图像失败:", err)
      setError(err.message || "生成图像失败，请稍后再试")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { sendChatMessage, generateImage, isLoading, error }
}
