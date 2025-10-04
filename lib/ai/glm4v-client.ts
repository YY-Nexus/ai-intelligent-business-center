/**
 * GLM-4V API客户端
 * 用于与智谱AI的GLM-4V模型进行交互
 */

import { getZhipuApiKey } from "./ai-config-manager"
import { createHmac } from "crypto"

export interface GLM4VMessage {
  role: "user" | "assistant" | "system"
  content: string | GLM4VContent[]
}

export type GLM4VContent = GLM4VTextContent | GLM4VImageContent | GLM4VVideoContent

export interface GLM4VTextContent {
  type: "text"
  text: string
}

export interface GLM4VImageContent {
  type: "image_url"
  image_url: {
    url: string
  }
}

export interface GLM4VVideoContent {
  type: "video_url"
  video_url: {
    url: string
  }
}

export interface GLM4VRequestOptions {
  model?: string
  messages: GLM4VMessage[]
  stream?: boolean
  temperature?: number
  top_p?: number
  max_tokens?: number
  user_id?: string
}

export interface GLM4VResponse {
  id: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class GLM4VClient {
  private apiKey: string
  private apiEndpoint: string
  private model: string

  constructor(
    apiKey?: string,
    apiEndpoint = "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    model = "glm-4v",
  ) {
    this.apiKey = apiKey || getZhipuApiKey() || ""
    this.apiEndpoint = apiEndpoint
    this.model = model
  }

  /**
   * 设置API密钥
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("zhipu_api_key", apiKey)
      } catch (e) {
        console.error("保存智谱AI API密钥到localStorage失败:", e)
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
   * 生成JWT令牌
   */
  private generateJWT(): string {
    if (!this.apiKey) {
      throw new Error("智谱AI API密钥未设置")
    }

    // 从API密钥中提取ID和密钥
    const [apiId, apiSecret] = this.apiKey.split(".")

    if (!apiId || !apiSecret) {
      throw new Error('无效的API密钥格式，应为"id.secret"格式')
    }

    const payload = {
      api_key: apiId,
      exp: Math.floor(Date.now() / 1000) + 3600,
      timestamp: Math.floor(Date.now() / 1000),
    }

    // 创建JWT头部
    const header = { alg: "HS256", typ: "JWT" }

    // Base64编码头部和载荷
    const headerBase64 = Buffer.from(JSON.stringify(header)).toString("base64").replace(/=/g, "")
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64").replace(/=/g, "")

    // 创建签名
    const signature = createHmac("sha256", apiSecret)
      .update(`${headerBase64}.${payloadBase64}`)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")

    // 返回完整的JWT
    return `${headerBase64}.${payloadBase64}.${signature}`
  }

  /**
   * 验证API密钥是否有效
   */
  async validateApiKey(): Promise<boolean> {
    if (!this.apiKey) return false

    try {
      const token = this.generateJWT()

      // 发送一个简单的请求来检查API密钥是否有效
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 1,
        }),
      })

      return response.ok
    } catch (error) {
      console.error("验证智谱AI API密钥失败:", error)
      return false
    }
  }

  /**
   * 发送聊天请求
   */
  async chat(options: GLM4VRequestOptions): Promise<GLM4VResponse> {
    if (!this.apiKey) {
      throw new Error("智谱AI API密钥未设置")
    }

    try {
      const token = this.generateJWT()

      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: options.model || this.model,
          messages: options.messages,
          temperature: options.temperature,
          top_p: options.top_p,
          max_tokens: options.max_tokens,
          stream: options.stream || false,
          user_id: options.user_id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`智谱AI API错误 (${response.status}): ${JSON.stringify(errorData)}`)
      }

      return await response.json()
    } catch (error) {
      console.error("智谱AI聊天请求失败:", error)
      throw error
    }
  }

  /**
   * 发送流式聊天请求
   */
  async chatStream(
    options: GLM4VRequestOptions & { stream: true },
    callbacks: {
      onStart?: () => void
      onToken?: (token: string) => void
      onComplete?: (fullText: string) => void
      onError?: (error: Error) => void
    },
  ): Promise<void> {
    if (!this.apiKey) {
      throw new Error("智谱AI API密钥未设置")
    }

    try {
      callbacks.onStart?.()

      const token = this.generateJWT()

      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          model: options.model || this.model,
          messages: options.messages,
          temperature: options.temperature,
          top_p: options.top_p,
          max_tokens: options.max_tokens,
          stream: true,
          user_id: options.user_id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`智谱AI API错误 (${response.status}): ${JSON.stringify(errorData)}`)
      }

      if (!response.body) {
        throw new Error("响应没有可读取的流")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder("utf-8")
      let fullText = ""
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") continue

            try {
              const parsedData = JSON.parse(data)
              if (parsedData.choices && parsedData.choices.length > 0 && parsedData.choices[0].delta) {
                const content = parsedData.choices[0].delta.content || ""
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
      }

      callbacks.onComplete?.(fullText)
    } catch (error: any) {
      console.error("智谱AI流式聊天请求失败:", error)
      callbacks.onError?.(new Error(`智谱AI流式聊天请求失败: ${error.message}`))
    }
  }

  /**
   * 处理图像理解请求
   */
  async imageUnderstanding(
    imageUrl: string,
    prompt: string,
    options: Omit<GLM4VRequestOptions, "messages"> = {},
  ): Promise<GLM4VResponse> {
    const messages: GLM4VMessage[] = [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ]

    return this.chat({
      ...options,
      messages,
    })
  }

  /**
   * 处理视频理解请求
   */
  async videoUnderstanding(
    videoUrl: string,
    prompt: string,
    options: Omit<GLM4VRequestOptions, "messages"> = {},
  ): Promise<GLM4VResponse> {
    const messages: GLM4VMessage[] = [
      {
        role: "user",
        content: [
          {
            type: "video_url",
            video_url: {
              url: videoUrl,
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ]

    return this.chat({
      ...options,
      messages,
    })
  }
}

// 导出默认实例
export default new GLM4VClient()
