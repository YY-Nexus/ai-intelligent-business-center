/**
 * 错误处理类型定义
 */

// API错误类型
export enum ApiErrorType {
  // 网络错误
  NETWORK = "network",
  // 超时错误
  TIMEOUT = "timeout",
  // 认证错误
  AUTHENTICATION = "authentication",
  // 授权错误
  AUTHORIZATION = "authorization",
  // 验证错误
  VALIDATION = "validation",
  // 资源未找到
  NOT_FOUND = "not_found",
  // 服务器错误
  SERVER = "server",
  // 未知错误
  UNKNOWN = "unknown",
}

// API错误接口
export interface ApiError extends Error {
  // 错误类型
  type: ApiErrorType
  // 状态码
  status?: number
  // 状态文本
  statusText?: string
  // 错误数据
  data?: any
  // 请求对象
  request?: Request
  // 响应对象
  response?: Response
}

// 重试策略
export interface RetryStrategy {
  // 最大重试次数
  maxRetries: number
  // 重试延迟（毫秒）
  retryDelay: number
  // 是否应该重试
  shouldRetry: (error: ApiError, retryCount: number) => boolean
  // 计算重试延迟
  calculateDelay?: (retryCount: number, error?: ApiError) => number
}

// 错误处理器选项
export interface ErrorHandlerOptions {
  // 重试策略
  retryStrategy?: RetryStrategy
  // 是否记录错误
  logErrors?: boolean
  // 错误转换函数
  transformError?: (error: any) => ApiError
  // 错误回调
  onError?: (error: ApiError) => void
}

// 错误处理器接口
export interface ErrorHandler {
  // 处理错误
  handleError(error: any, request?: Request): ApiError
  // 判断是否应该重试
  shouldRetry(error: ApiError, retryCount: number): boolean
  // 获取重试延迟时间
  getRetryDelay(retryCount: number, error: ApiError): number
  // 记录错误
  logError(error: ApiError): void
}
