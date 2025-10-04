import { ApiClient } from "../../core/api-client"
import type { RequestConfig } from "../../request/request-types"
import type { NormalizedResponse } from "../../response/response-types"
import type { CogViewRequestOptions, CogViewResponse } from "./cogview-types"

/**
 * CogView-3 API客户端
 * 用于与智谱AI的CogView-3系列模型进行交互，生成图像
 */
export class CogViewClient extends ApiClient {
  constructor(apiKey: string, baseUrl = "https://open.bigmodel.cn/api/paas/v4") {
    super({
      baseUrl,
      defaultHeaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    })
  }

  /**
   * 生成图像
   * @param options 请求选项
   * @returns 包含生成图像URL的响应
   */
  public async generateImage(options: CogViewRequestOptions): Promise<NormalizedResponse<CogViewResponse>> {
    const { model = "cogview-3-flash", prompt, quality = "standard", size = "1024x1024", user_id } = options

    const requestConfig: RequestConfig = {
      method: "POST",
      url: `${this.config.baseUrl}/images/generations`,
      headers: { ...this.config.defaultHeaders },
      body: {
        model,
        prompt,
        quality,
        size,
        ...(user_id !== undefined && { user_id }),
      },
    }

    return this.request<CogViewResponse>(requestConfig)
  }

  /**
   * 验证图像尺寸是否有效
   * @param size 图像尺寸字符串，格式为"宽x高"
   * @returns 是否有效
   */
  public static validateImageSize(size: string): boolean {
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
   * @returns 推���的图像尺寸列表
   */
  public static getRecommendedSizes(): string[] {
    return ["1024x1024", "768x1344", "864x1152", "1344x768", "1152x864", "1440x720", "720x1440"]
  }
}
