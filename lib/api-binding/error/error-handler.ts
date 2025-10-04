import type { ApiError, ErrorHandlerOptions } from "./error-types"

/**
 * API错误处理器
 * 负责处理API请求过程中的错误
 */
export class ApiErrorHandler {
  private options: ErrorHandlerOptions

  constructor(options?: ErrorHandlerOptions) {
    this.options = {
      retryStrategy: options?.retryStrategy || "exponential",
      maxRetries: options?.maxRetries || 3,
      baseRetryDelay: options?.baseRetryDelay || 1000,
      retryableStatusCodes: options?.retryableStatusCodes || [408, 429, 500, 502, 503, 504],
      retryableErrors: options?.retryableErrors || ["ECONNRESET", "ETIMEDOUT", "ECONNREFUSED"],
      ...options,
    }
  }

  /**
   * 处理错误
   */
  public handleError(error: any, request?: Request): ApiError {
    // 如果已经是ApiError，直接返回
    if (error && error.isApiError) {
      return error
    }

    // 创建ApiError
    const apiError: ApiError = {
      isApiError: true,
      message: error instanceof Error ? error.message : String(error),
      originalError: error,
      request,
      status: this.extractStatusCode(error),
      code: this.extractErrorCode(error),
      retryable: this.isRetryable(error),
    }

    // 应用自定义错误转换
    if (this.options.errorTransformer) {
      return this.options.errorTransformer(apiError)
    }

    return apiError
  }

  /**
   * 判断是否应该重试
   */
  public shouldRetry(error: ApiError, retryCount: number): boolean {
    // 超过最大重试次数
    if (retryCount >= this.options.maxRetries) {
      return false
    }

    // 错误不可重试
    if (!error.retryable) {
      return false
    }

    // 应用自定义重试判断
    if (this.options.shouldRetry) {
      return this.options.shouldRetry(error, retryCount)
    }

    return true
  }

  /**
   * 获取重试延迟时间
   */
  public getRetryDelay(retryCount: number, error?: ApiError): number {
    const baseDelay = this.options.baseRetryDelay

    // 应用自定义重试延迟计算
    if (this.options.getRetryDelay) {
      return this.options.getRetryDelay(retryCount, error)
    }

    // 根据重试策略计算延迟
    switch (this.options.retryStrategy) {
      case "fixed":
        return baseDelay
      case "linear":
        return baseDelay * retryCount
      case "exponential":
      default:
        return baseDelay * Math.pow(2, retryCount)
    }
  }

  /**
   * 提取状态码
   */
  private extractStatusCode(error: any): number | undefined {
    if (error.status) {
      return error.status
    }

    if (error.statusCode) {
      return error.statusCode
    }

    if (error.response && error.response.status) {
      return error.response.status
    }

    return undefined
  }

  /**
   * 提取错误代码
   */
  private extractErrorCode(error: any): string | undefined {
    if (error.code) {
      return error.code
    }

    if (error.name) {
      return error.name
    }

    if (error.type) {
      return error.type
    }

    return undefined
  }

  /**
   * 判断错误是否可重试
   */
  private isRetryable(error: any): boolean {
    const status = this.extractStatusCode(error)
    const code = this.extractErrorCode(error)

    // 根据状态码判断
    if (status && this.options.retryableStatusCodes.includes(status)) {
      return true
    }

    // 根据错误代码判断
    if (code && this.options.retryableErrors.includes(code)) {
      return true
    }

    // 网络错误通常可以重试
    if (error instanceof TypeError && error.message.includes("network")) {
      return true
    }

    // 请求被中断通常不重试
    if (error instanceof DOMException && error.name === "AbortError") {
      return false
    }

    return false
  }
}

/**
 * 创建错误处理器的便捷函数
 * 方便在应用中快速创建和配置错误处理器
 */
export function createErrorHandler(options?: ErrorHandlerOptions): ApiErrorHandler {
  return new ApiErrorHandler(options)
}
