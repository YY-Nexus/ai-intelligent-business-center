/**
 * CogView API 客户端
 * 提供与智谱AI的CogView模型交互的功能
 */

import { v4 as uuidv4 } from "uuid"
import { createHmac } from "crypto"

export interface CogViewConfig {
  apiKey: string
  apiUrl?: string
  version?: string
}

export interface CogViewGenerateOptions {
  prompt: string
  size?: string
  quality?: "standard" | "hd"
  negativePrompt?: string
  numImages?: number
  steps?: number
  seed?: number
}

export interface CogViewResponse {
  success: boolean
  data: {
    id: string
    data: Array<{
      url: string
    }>
    created: number
  }
  error?: string
}

export class CogViewClient {
  private apiKey: string
  private apiUrl: string
  private version: string

  constructor(config: CogViewConfig) {
    this.apiKey = config.apiKey
    this.apiUrl = config.apiUrl || "https://open.bigmodel.cn/api/paas/v4/images/generations"
    this.version = config.version || "cogview-3"
  }

  /**
   * 生成JWT令牌
   */
  private generateToken(): string {
    // 从API密钥中提取ID和密钥
    const [apiId, apiSecret] = this.apiKey.split(".")

    if (!apiId || !apiSecret) {
      throw new Error("无效的API密钥格式，应为'id.secret'格式")
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
   * 生成图像
   */
  public async generateImage(options: CogViewGenerateOptions): Promise<CogViewResponse> {
    try {
      const token = this.generateToken()

      // 解析尺寸
      let width = 1024
      let height = 1024

      if (options.size) {
        const [w, h] = options.size.split("x").map(Number)
        if (w && h) {
          width = w
          height = h
        }
      }

      const requestBody = {
        model: this.version,
        prompt: options.prompt,
        n: options.numImages || 1,
        width,
        height,
        steps: options.steps || 30,
        seed: options.seed || Math.floor(Math.random() * 1000000),
        negative_prompt: options.negativePrompt || "",
        quality: options.quality || "standard",
      }

      console.log("CogView请求参数:", JSON.stringify(requestBody))

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("CogView API错误:", data)
        throw new Error(data.error?.message || `请求失败: ${response.status}`)
      }

      return {
        success: true,
        data: {
          id: data.id || uuidv4(),
          data: data.data || [],
          created: data.created || Date.now(),
        },
      }
    } catch (error: any) {
      console.error("CogView生成图像失败:", error)
      return {
        success: false,
        data: {
          id: uuidv4(),
          data: [],
          created: Date.now(),
        },
        error: error.message || "生成图像失败",
      }
    }
  }

  /**
   * 获取推荐的图像尺寸
   */
  public static getRecommendedSizes(): string[] {
    return ["1024x1024", "1024x768", "768x1024", "512x512", "512x768", "768x512"]
  }

  /**
   * 验证图像尺寸是否有效
   */
  public static validateImageSize(size: string): boolean {
    const [width, height] = size.split("x").map(Number)

    // 检查是否为有效数字
    if (!width || !height) return false

    // 检查尺寸范围
    if (width < 512 || width > 2048 || height < 512 || height > 2048) return false

    // 检查是否能被16整除
    if (width % 16 !== 0 || height % 16 !== 0) return false

    // 检查总像素数是否超过限制 (2^21)
    if (width * height > 2097152) return false

    return true
  }
}
