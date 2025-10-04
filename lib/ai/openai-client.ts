/**
 * OpenAI API客户端
 * 用于与OpenAI的API进行交互
 */

import { getOpenAIApiKey } from "./ai-config-manager"

export interface OpenAIMessage {
  role: "system" | "user" | "assistant" | "function"
  content: string | Array<OpenAIMessageContent>
  name?: string
  function_call?: {
    name: string
    arguments: string
  }
}

export interface OpenAIMessageContent {
  type: "text" | "image_url"
  text?: string
  image_url?: {
    url: string
    detail?: "low" | "high" | "auto"
  }
}

export interface OpenAIChatCompletionOptions {
  model: string
  messages: OpenAIMessage[]
  temperature?: number
  top_p?: number
  n?: number
  stream?: boolean
  stop?: string | string[]
  max_tokens?: number
  presence_penalty?: number
  frequency_penalty?: number
  logit_bias?: Record<string, number>
  user?: string
}

export interface OpenAIImageGenerationOptions {
  prompt: string
  model?: string
  n?: number
  size?: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792"
  quality?: "standard" | "hd"
  style?: "vivid" | "natural"
  response_format?: "url" | "b64_json"
  user?: string
}

export interface OpenAIImageGenerationResponse {
  created: number
  data: Array<{
    url?: string
    b64_json?: string
    revised_prompt?: string
  }>
}

export interface OpenAIChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
      function_call?: {
        name: string
        arguments: string
      }
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class OpenAIClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey?: string, baseUrl = "https://api.openai.com/v1") {
    this.apiKey = apiKey || getOpenAIApiKey() || ""
    this.baseUrl = baseUrl
  }

  /**
   * 设置API密钥
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("openai_api_key", apiKey)
      } catch (e) {
        console.error("保存OpenAI API密钥到localStorage失败:", e)
      }
    }
  }

  /**
   * 获取API密钥
   */
  getApiKey(): string {
    return this.apiKey
  }

  /**
   * 验证API密钥是否有效
   */
  async validateApiKey(): Promise<boolean> {
    if (!this.apiKey) return false

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      })

      return response.ok
    } catch (error) {
      console.error("验证OpenAI API密钥失败:", error)
      return false
    }
  }

  /**
   * 发送聊天完成请求
   */
  async createChatCompletion(options: OpenAIChatCompletionOptions): Promise<OpenAIChatCompletionResponse> {
    if (!this.apiKey) {
      throw new Error("OpenAI API密钥未设置")
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`OpenAI API错误 (${response.status}): ${JSON.stringify(errorData)}`)
      }

      return await response.json()
    } catch (error) {
      console.error("OpenAI聊天完成请求失败:", error)
      throw error
    }
  }

  /**
   * 发送流式聊天完成请求
   */
  async createChatCompletionStream(
    options: OpenAIChatCompletionOptions & { stream: true },
    callbacks: {
      onStart?: () => void
      onToken?: (token: string) => void
      onComplete?: (fullText: string) => void
      onError?: (error: Error) => void
    },
  ): Promise<void> {
    if (!this.apiKey) {
      throw new Error("OpenAI API密钥未设置")
    }

    try {
      callbacks.onStart?.()

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...options, stream: true }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`OpenAI API错误 (${response.status}): ${JSON.stringify(errorData)}`)
      }

      if (!response.body) {
        throw new Error("响应没有可读取的流")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder("utf-8")
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n").filter((line) => line.trim() !== "" && line.trim() !== "data: [DONE]")

        for (const line of lines) {
          if (!line.startsWith("data:")) continue

          try {
            const jsonStr = line.slice(5).trim()
            const data = JSON.parse(jsonStr)

            if (data.choices && data.choices.length > 0) {
              const content = data.choices[0].delta?.content || ""
              if (content) {
                fullText += content
                callbacks.onToken?.(content)
              }
            }
          } catch (e) {
            console.warn("解析流数据失败:", e)
          }
        }
      }

      callbacks.onComplete?.(fullText)
    } catch (error: any) {
      console.error("OpenAI流式聊天完成请求失败:", error)
      callbacks.onError?.(new Error(`OpenAI流式聊天完成请求失败: ${error.message}`))
    }
  }

  /**
   * 生成图像
   */
  async createImage(options: OpenAIImageGenerationOptions): Promise<OpenAIImageGenerationResponse> {
    if (!this.apiKey) {
      throw new Error("OpenAI API密钥未设置")
    }

    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: options.model || "dall-e-3",
          prompt: options.prompt,
          n: options.n || 1,
          size: options.size || "1024x1024",
          quality: options.quality || "standard",
          style: options.style || "vivid",
          response_format: options.response_format || "url",
          user: options.user,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`OpenAI API错误 (${response.status}): ${JSON.stringify(errorData)}`)
      }

      return await response.json()
    } catch (error) {
      console.error("OpenAI图像生成请求失败:", error)
      throw error
    }
  }

  /**
   * 获取可用模型列表
   */
  async listModels() {
    if (!this.apiKey) {
      throw new Error("OpenAI API密钥未设置")
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`OpenAI API错误 (${response.status}): ${JSON.stringify(errorData)}`)
      }

      return await response.json()
    } catch (error) {
      console.error("获取OpenAI模型列表失败:", error)
      throw error
    }
  }
}

// 导出默认实例
export default new OpenAIClient()
