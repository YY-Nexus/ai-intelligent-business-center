/**
 * Anthropic API客户端
 * 用于与Anthropic的API进行交互
 */

import { getAnthropicApiKey } from "./ai-config-manager"

export interface AnthropicMessage {
  role: "user" | "assistant"
  content: string | Array<AnthropicMessageContent>
}

export interface AnthropicMessageContent {
  type: "text" | "image"
  text?: string
  source?: {
    type: "base64" | "url"
    media_type: string
    data: string
  }
}

export interface AnthropicChatCompletionOptions {
  model: string
  messages: AnthropicMessage[]
  system?: string
  max_tokens?: number
  temperature?: number
  top_p?: number
  top_k?: number
  stream?: boolean
  stop_sequences?: string[]
  metadata?: Record<string, string>
}

export interface AnthropicChatCompletionResponse {
  id: string
  type: string
  model: string
  role: string
  content: Array<{
    type: string
    text: string
  }>
  stop_reason: string
  stop_sequence?: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

export class AnthropicClient {
  private apiKey: string
  private baseUrl: string
  private apiVersion: string

  constructor(apiKey?: string, baseUrl = "https://api.anthropic.com", apiVersion = "2023-06-01") {
    this.apiKey = apiKey || getAnthropicApiKey() || ""
    this.baseUrl = baseUrl
    this.apiVersion = apiVersion
  }

  /**
   * 设置API密钥
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("anthropic_api_key", apiKey)
      } catch (e) {
        console.error("保存Anthropic API密钥到localStorage失败:", e)
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
      // Anthropic没有专门的验证端点，我们发送一个简单的请求来检查
      const response = await fetch(`${this.baseUrl}/v1/messages`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "anthropic-version": this.apiVersion,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 1,
        }),
      })

      return response.ok
    } catch (error) {
      console.error("验证Anthropic API密钥失败:", error)
      return false
    }
  }

  /**
   * 发送聊天��成请求
   */
  async createChatCompletion(options: AnthropicChatCompletionOptions): Promise<AnthropicChatCompletionResponse> {
    if (!this.apiKey) {
      throw new Error("Anthropic API密钥未设置")
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/messages`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "anthropic-version": this.apiVersion,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: options.model,
          messages: options.messages,
          system: options.system,
          max_tokens: options.max_tokens || 1024,
          temperature: options.temperature,
          top_p: options.top_p,
          top_k: options.top_k,
          stop_sequences: options.stop_sequences,
          stream: options.stream || false,
          metadata: options.metadata,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Anthropic API错误 (${response.status}): ${JSON.stringify(errorData)}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Anthropic聊天完成请求失败:", error)
      throw error
    }
  }

  /**
   * 发送流式聊天完成请求
   */
  async createChatCompletionStream(
    options: AnthropicChatCompletionOptions & { stream: true },
    callbacks: {
      onStart?: () => void
      onToken?: (token: string) => void
      onComplete?: (fullText: string) => void
      onError?: (error: Error) => void
    },
  ): Promise<void> {
    if (!this.apiKey) {
      throw new Error("Anthropic API密钥未设置")
    }

    try {
      callbacks.onStart?.()

      const response = await fetch(`${this.baseUrl}/v1/messages`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "anthropic-version": this.apiVersion,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: options.model,
          messages: options.messages,
          system: options.system,
          max_tokens: options.max_tokens || 1024,
          temperature: options.temperature,
          top_p: options.top_p,
          top_k: options.top_k,
          stop_sequences: options.stop_sequences,
          stream: true,
          metadata: options.metadata,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Anthropic API错误 (${response.status}): ${JSON.stringify(errorData)}`)
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
        const lines = chunk.split("\n").filter((line) => line.trim() !== "")

        for (const line of lines) {
          if (!line.startsWith("data:")) continue
          if (line.includes("[DONE]")) continue

          try {
            const jsonStr = line.slice(5).trim()
            const data = JSON.parse(jsonStr)

            if (data.type === "content_block_delta" && data.delta?.text) {
              const text = data.delta.text
              fullText += text
              callbacks.onToken?.(text)
            }
          } catch (e) {
            console.warn("解析流数据失败:", e)
          }
        }
      }

      callbacks.onComplete?.(fullText)
    } catch (error: any) {
      console.error("Anthropic流式聊天完成请求失败:", error)
      callbacks.onError?.(new Error(`Anthropic流式聊天完成请求失败: ${error.message}`))
    }
  }
}

// 导出默认实例
export default new AnthropicClient()
