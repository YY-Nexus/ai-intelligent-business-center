/**
 * CogView API客户端
 * 用于与智谱AI的CogView模型进行交互
 */

import { getZhipuApiKey } from "./ai-config-manager"
import { createHmac } from "crypto"
import { v4 as uuidv4 } from "uuid"

export interface CogViewConfig {
  apiKey?: string
  apiUrl?: string
  version?: string
}

export interface CogViewGenerateOptions {
  prompt: string
  negative_prompt?: string
  size?: string
  steps?: number
  seed?: number
  quality?: "standard" | "hd"
  n?: number
  user_id?: string
}

export interface CogViewResponse {
  success: boolean
  data: {
    id: string
    created: number
    data: Array<{
      url: string
      revised_prompt?: string
    }>
  }
  error?: string
}

export class CogViewClient {
  private apiKey: string
  private apiUrl: string
  private version: string

  constructor(config: CogViewConfig = {}) {
    this.apiKey = config.apiKey || getZhipuApiKey() || ""
    this.apiUrl = config.apiUrl || "https://open.bigmodel.cn/api/paas/v4/images/generations"
    this.version = config.version || "cogview-3"
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
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: this.version,
          prompt: "test",
          n: 1,
        }),
      })

      return response.ok
    } catch (error) {
      console.error("验证智谱AI API密钥失败:", error)
      return false
    }
  }

  /**
   * 生成图像
   */
  async generateImage(options: CogViewGenerateOptions): Promise<CogViewResponse> {
    if (!this.apiKey) {
      throw new Error("智谱AI API密钥未设置")
    }

    try {
      const token = this.generateJWT()

      const requestBody = {
        model: this.version,
        prompt: options.prompt,
        negative_prompt: options.negative_prompt || "",
        size: options.size || "1024x1024",
        steps: options.steps || 30,
        seed: options.seed !== undefined ? options.seed : Math.floor(Math.random() * 1000000),
        quality: options.quality || "standard",
        n: options.n || 1,
        user_id: options.user_id,
      }

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`智谱AI API错误 (${response.status}): ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: {
          id: data.id || uuidv4(),
          created: data.created || Date.now(),
          data: data.data || [],
        },
      }
    } catch (error: any) {
      console.error("CogView生成图像失败:", error)
      return {
        success: false,
        data: {
          id: uuidv4(),
          created: Date.now(),
          data: [],
        },
        error: error.message || "生成图像失败",
      }
    }
  }

  /**
   * 验证图像尺寸是否有效
   */
  static validateImageSize(size: string): boolean {
    // 检查格式是否为"宽x高"
    const sizeRegex = /^(\d+)x(\d+)$/
    const match = size.match(sizeRegex)
    if (!match) return false

    const width = Number.parseInt(match[1], 10)
    const height = Number.parseInt(match[2], 10)

    // 检查宽高是否在有效范围内
    if (width < 512 || width > 2048 || height < 512 || height > 2048) return false

    // 检查宽高是否能被16整除
    if (width % 16 !== 0 || height % 16 !== 0) return false

    // 检查总像素数是否不超过2^21
    if (width * height > Math.pow(2, 21)) return false

    return true
  }

  /**
   * 获取推荐的图像尺寸列表
   */
  static getRecommendedSizes(): string[] {
    return ["1024x1024", "768x1344", "864x1152", "1344x768", "1152x864", "1440x720", "720x1440"]
  }
}

// 导出默认实例
export default new CogViewClient()
