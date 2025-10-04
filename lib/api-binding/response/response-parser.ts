import type { ResponseParseOptions, NormalizedResponse } from "./response-types"

/**
 * API响应解析器
 * 负责解析API响应并提取数据
 */
export class ApiResponseParser {
  /**
   * 解析响应
   */
  public async parse<T>(response: Response, options?: ResponseParseOptions): Promise<NormalizedResponse<T>> {
    // 提取响应头
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    // 解析响应体
    let data: any
    let metadata: any = {}

    try {
      // 根据Content-Type解析响应
      const contentType = response.headers.get("content-type") || ""

      if (contentType.includes("application/json")) {
        data = await this.parseJson<T>(response)
      } else if (contentType.includes("text/")) {
        data = await response.text()
      } else if (contentType.includes("multipart/form-data")) {
        data = await this.parseFormData(response)
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        data = await this.parseFormUrlEncoded(response)
      } else {
        // 二进制数据
        data = await response.blob()
      }

      // 提取元数据
      metadata = this.extractMetadata(response, data, options)
    } catch (error) {
      console.error("解析响应失败:", error)
      throw new Error(`解析响应失败: ${error instanceof Error ? error.message : String(error)}`)
    }

    // 返回标准化的响应
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers,
      metadata,
    }
  }

  /**
   * 解析JSON响应
   */
  private async parseJson<T>(response: Response): Promise<T> {
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch (error) {
      console.error("解析JSON失败:", error)
      throw new Error(`解析JSON失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * 解析表单数据
   */
  private async parseFormData(response: Response): Promise<any> {
    const formData = await response.formData()
    const data: Record<string, any> = {}

    formData.forEach((value, key) => {
      data[key] = value
    })

    return data
  }

  /**
   * 解析URL编码表单
   */
  private async parseFormUrlEncoded(response: Response): Promise<any> {
    const text = await response.text()
    const data: Record<string, string> = {}

    new URLSearchParams(text).forEach((value, key) => {
      data[key] = value
    })

    return data
  }

  /**
   * 提取元数据
   */
  private extractMetadata(response: Response, data: any, options?: ResponseParseOptions): any {
    const metadata: any = {}

    // 提取分页信息
    if (options?.extractPagination) {
      const pagination = options.extractPagination(response, data)
      if (pagination) {
        metadata.pagination = pagination
      }
    } else {
      // 尝试从常见的分页格式中提取
      metadata.pagination = this.extractPaginationFromCommonFormats(response, data)
    }

    // 提取其他元数据
    if (options?.extractMetadata) {
      const additionalMetadata = options.extractMetadata(response, data)
      if (additionalMetadata) {
        Object.assign(metadata, additionalMetadata)
      }
    }

    return metadata
  }

  /**
   * 从常见格式中提取分页信息
   */
  private extractPaginationFromCommonFormats(response: Response, data: any): any {
    // 尝试从响应头中提取
    const totalHeader = response.headers.get("x-total-count") || response.headers.get("x-total")
    const pageHeader = response.headers.get("x-page") || response.headers.get("x-current-page")
    const perPageHeader = response.headers.get("x-per-page") || response.headers.get("x-page-size")

    if (totalHeader) {
      return {
        total: Number.parseInt(totalHeader, 10),
        page: pageHeader ? Number.parseInt(pageHeader, 10) : undefined,
        perPage: perPageHeader ? Number.parseInt(perPageHeader, 10) : undefined,
      }
    }

    // 尝试从响应体中提取
    if (data && typeof data === "object") {
      // 格式1: { data: [...], meta: { pagination: { total, page, perPage } } }
      if (data.meta?.pagination) {
        return data.meta.pagination
      }

      // 格式2: { data: [...], pagination: { total, page, perPage } }
      if (data.pagination) {
        return data.pagination
      }

      // 格式3: { items: [...], total, page, perPage }
      if (data.total !== undefined) {
        return {
          total: data.total,
          page: data.page || data.currentPage,
          perPage: data.perPage || data.pageSize || data.limit,
        }
      }
    }

    return undefined
  }
}

/**
 * 创建响应解析器的便捷函数
 * 方便在应用中快速创建和配置响应解析器
 */
export function createResponseParser(): ApiResponseParser {
  return new ApiResponseParser()
}
