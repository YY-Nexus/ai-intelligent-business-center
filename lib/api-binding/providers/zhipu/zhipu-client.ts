"use client"

/**
 * 智谱AI客户端
 * 支持GLM-4、GLM-3-Turbo等模型
 */
import * as crypto from "crypto"

export interface ZhipuAIConfig {
  apiKey: string
  apiEndpoint?: string
}

export interface ZhipuAIMessage {
  role: "system" | "user" | "assistant" | "function"
  content: string
  name?: string
  function_call?: {
    name: string
    arguments: string
  }
}

export interface ZhipuAIFunction {
  name: string
  description: string
  parameters: {
    type: "object"
    properties: Record<string, any>
    required?: string[]
  }
}

export interface ZhipuAICompletionOptions {
  model: string
  messages: ZhipuAIMessage[]
  temperature?: number
  top_p?: number
  max_tokens?: number
  stream?: boolean
  functions?: ZhipuAIFunction[]
  function_call?: "auto" | "none" | { name: string }
  system?: string
  tools?: any[]
  tool_choice?: "auto" | "none" | { type: "function"; function: { name: string } }
}

export interface ZhipuAICompletionResponse {
  id: string
  created: number
  model: string
  choices: {
    index: number
    message: ZhipuAIMessage
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * 智谱AI客户端类
 */
export class ZhipuAIClient {
  private apiKey: string
  private apiEndpoint: string

  constructor(config: ZhipuAIConfig) {
    this.apiKey = config.apiKey
    this.apiEndpoint = config.apiEndpoint || "https://open.bigmodel.cn/api/paas/v4"
  }

  /**
   * 生成JWT Token
   * @returns JWT Token
   */
  private generateToken(): string {
    // 从API密钥中提取id和secret
    const [id, secret] = this.apiKey.split(".")

    if (!id || !secret) {
      throw new Error('API密钥格式不正确，请确保格式为"id.secret"')
    }

    // 当前时间戳（秒）
    const timestamp = Math.floor(Date.now() / 1000)
    // Token有效期设为1小时
    const expiry = timestamp + 3600

    // 构建JWT头部
    const header = {
      alg: "HS256",
      typ: "JWT",
    }

    // 构建JWT载荷
    const payload = {
      api_key: id,
      exp: expiry,
      timestamp: timestamp,
    }

    // Base64编码头部和载荷
    const base64Header = Buffer.from(JSON.stringify(header))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
    const base64Payload = Buffer.from(JSON.stringify(payload))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")

    // 构建签名
    const signatureInput = `${base64Header}.${base64Payload}`
    const signature = crypto
      .createHmac("sha256", secret)
      .update(signatureInput)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")

    // 返回完整的JWT Token
    return `${signatureInput}.${signature}`
  }

  /**
   * 发送聊天请求
   * @param options 请求选项
   * @returns 响应结果
   */
  async createChatCompletion(options: ZhipuAICompletionOptions): Promise<ZhipuAICompletionResponse> {
    const token = this.generateToken()
    const url = `${this.apiEndpoint}/chat/completions`

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`智谱AI API请求失败: ${errorData.error?.message || response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("调用智谱AI API失败:", error)
      throw error
    }
  }

  /**
   * 发送聊天请求（流式响应）
   * @param options 请求选项
   * @returns 响应流
   */
  async createChatCompletionStream(options: ZhipuAICompletionOptions): Promise<ReadableStream<Uint8Array>> {
    const token = this.generateToken()
    const url = `${this.apiEndpoint}/chat/completions`

    // 确保启用流式传输
    const streamOptions = { ...options, stream: true }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(streamOptions),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`智谱AI API流式请求失败: ${errorData.error?.message || response.statusText}`)
      }

      if (!response.body) {
        throw new Error("智谱AI API返回了空的响应流")
      }

      return response.body
    } catch (error) {
      console.error("调用智谱AI API流式接口失败:", error)
      throw error
    }
  }

  /**
   * 验证API密钥是否有效
   * @returns 密钥是否有效
   */
  async validateApiKey(): Promise<boolean> {
    try {
      // 发送一个简单的请求来验证API密钥
      await this.createChatCompletion({
        model: "glm-3-turbo",
        messages: [{ role: "user", content: "你好" }],
        max_tokens: 1, // 只请求一个token以减少API调用开销
      })
      return true
    } catch (error) {
      console.error("验证智谱AI API密钥失败:", error)
      return false
    }
  }

  /**
   * 获取模型列表
   * @returns 模型列表
   */
  async listModels(): Promise<string[]> {
    // 由于智谱AI没有提供获取模型列表的API，这里返回固定的模型列表
    return [
      "glm-4",
      "glm-4-vision",
      "glm-3-turbo",
      "glm-4v",
      "chatglm_turbo",
      "chatglm_pro",
      "chatglm_std",
      "chatglm_lite",
    ]
  }
}

/**
 * 默认导出智谱AI客户端类
 */
export default ZhipuAIClient
