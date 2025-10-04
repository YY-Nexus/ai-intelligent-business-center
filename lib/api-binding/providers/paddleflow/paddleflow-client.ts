import type { ChatCompletionRequestMessage } from "../../types"

export interface PaddleFlowConfig {
  apiKey: string
  baseUrl: string
  model: string
  temperature?: number
  maxTokens?: number
}

export interface PaddleFlowChatOptions {
  messages: ChatCompletionRequestMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface PaddleFlowResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class PaddleFlowClient {
  private apiKey: string
  private baseUrl: string
  private model: string
  private temperature: number
  private maxTokens: number

  constructor(config: PaddleFlowConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl
    this.model = config.model
    this.temperature = config.temperature || 0.7
    this.maxTokens = config.maxTokens || 2048
  }

  /**
   * 发送聊天请求
   */
  async chat(options: PaddleFlowChatOptions): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: options.messages,
          temperature: options.temperature || this.temperature,
          max_tokens: options.maxTokens || this.maxTokens,
          stream: options.stream || false,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`飞桨星河API错误 (${response.status}): ${JSON.stringify(errorData)}`)
      }

      const data: PaddleFlowResponse = await response.json()

      if (!data.choices || data.choices.length === 0) {
        throw new Error("飞桨星河API返回了空响应")
      }

      return data.choices[0].message.content
    } catch (error: any) {
      console.error("飞桨星河API调用失败:", error)
      throw new Error(`飞桨星河API调用失败: ${error.message}`)
    }
  }

  /**
   * 流式聊天请求
   */
  async chatStream(
    options: PaddleFlowChatOptions,
    callbacks: {
      onStart?: () => void
      onToken?: (token: string) => void
      onComplete?: (fullText: string) => void
      onError?: (error: Error) => void
    },
  ): Promise<void> {
    try {
      callbacks.onStart?.()

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: options.messages,
          temperature: options.temperature || this.temperature,
          max_tokens: options.maxTokens || this.maxTokens,
          stream: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`飞桨星河API错误 (${response.status}): ${JSON.stringify(errorData)}`)
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
      console.error("飞桨星河流式API调用失败:", error)
      callbacks.onError?.(new Error(`飞桨星河流式API调用失败: ${error.message}`))
    }
  }
}
