/**
 * 智谱AI API错误处理工具
 */

// 错误类型定义
export enum ZhipuErrorType {
  AUTHENTICATION = "authentication",
  RATE_LIMIT = "rate_limit",
  QUOTA_EXCEEDED = "quota_exceeded",
  INVALID_REQUEST = "invalid_request",
  SERVER_ERROR = "server_error",
  TIMEOUT = "timeout",
  NETWORK = "network",
  UNKNOWN = "unknown",
}

// 错误详情接口
export interface ZhipuErrorDetails {
  type: ZhipuErrorType
  message: string
  retryable: boolean
  statusCode?: number
  requestId?: string
}

// 智谱AI API错误类
export class ZhipuAPIError extends Error {
  type: ZhipuErrorType
  retryable: boolean
  statusCode?: number
  requestId?: string

  constructor(details: ZhipuErrorDetails) {
    super(details.message)
    this.name = "ZhipuAPIError"
    this.type = details.type
    this.retryable = details.retryable
    this.statusCode = details.statusCode
    this.requestId = details.requestId
  }
}

/**
 * 解析API错误响应
 * @param error 捕获的错误对象
 * @returns 格式化的错误详情
 */
export function parseZhipuError(error: any): ZhipuErrorDetails {
  // 如果已经是ZhipuAPIError，直接返回
  if (error instanceof ZhipuAPIError) {
    return {
      type: error.type,
      message: error.message,
      retryable: error.retryable,
      statusCode: error.statusCode,
      requestId: error.requestId,
    }
  }

  // 默认错误信息
  const errorDetails: ZhipuErrorDetails = {
    type: ZhipuErrorType.UNKNOWN,
    message: "未知错误",
    retryable: false,
  }

  // 尝试解析错误响应
  try {
    // 处理网络错误
    if (error.name === "AbortError") {
      return {
        type: ZhipuErrorType.TIMEOUT,
        message: "请求超时",
        retryable: true,
      }
    }

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        type: ZhipuErrorType.NETWORK,
        message: "网络连接错误",
        retryable: true,
      }
    }

    // 处理HTTP错误
    if (error.status || error.statusCode) {
      const statusCode = error.status || error.statusCode

      // 提取错误信息
      let errorMessage = "API请求失败"
      let requestId = undefined

      if (error.data) {
        errorMessage = error.data.error?.message || error.data.message || errorMessage
        requestId = error.data.request_id || error.data.requestId
      } else if (error.response?.data) {
        errorMessage = error.response.data.error?.message || error.response.data.message || errorMessage
        requestId = error.response.data.request_id || error.response.data.requestId
      }

      // 根据状态码分类错误
      switch (statusCode) {
        case 401:
          return {
            type: ZhipuErrorType.AUTHENTICATION,
            message: "认证失败: " + errorMessage,
            retryable: false,
            statusCode,
            requestId,
          }
        case 429:
          return {
            type: ZhipuErrorType.RATE_LIMIT,
            message: "请求频率超限: " + errorMessage,
            retryable: true,
            statusCode,
            requestId,
          }
        case 402:
          return {
            type: ZhipuErrorType.QUOTA_EXCEEDED,
            message: "配额已用尽: " + errorMessage,
            retryable: false,
            statusCode,
            requestId,
          }
        case 400:
        case 404:
        case 415:
        case 422:
          return {
            type: ZhipuErrorType.INVALID_REQUEST,
            message: "无效请求: " + errorMessage,
            retryable: false,
            statusCode,
            requestId,
          }
        case 500:
        case 502:
        case 503:
        case 504:
          return {
            type: ZhipuErrorType.SERVER_ERROR,
            message: "服务器错误: " + errorMessage,
            retryable: true,
            statusCode,
            requestId,
          }
        default:
          return {
            type: ZhipuErrorType.UNKNOWN,
            message: `未知错误 (${statusCode}): ${errorMessage}`,
            retryable: statusCode >= 500,
            statusCode,
            requestId,
          }
      }
    }

    // 处理其他错误
    errorDetails.message = error.message || "未知错误"
  } catch (parseError) {
    console.error("解析错误失败:", parseError)
  }

  return errorDetails
}

/**
 * 创建智谱API错误
 * @param error 原始错误
 * @returns ZhipuAPIError实例
 */
export function createZhipuError(error: any): ZhipuAPIError {
  const errorDetails = parseZhipuError(error)
  return new ZhipuAPIError(errorDetails)
}
