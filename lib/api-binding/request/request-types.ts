/**
 * 请求类型定义
 */

// HTTP方法
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS"

// 内容类型
export type ContentType =
  | "application/json"
  | "application/x-www-form-urlencoded"
  | "multipart/form-data"
  | "text/plain"
  | "application/xml"
  | string

// 请求选项
export interface RequestOptions {
  // HTTP方法
  method: HttpMethod
  // 请求头
  headers: Record<string, string>
  // 查询参数
  queryParams: Record<string, string | number | boolean | null | undefined>
  // 请求体
  body?: any
  // 内容类型
  contentType?: ContentType
  // 超时时间（毫秒）
  timeout?: number
  // 重试次数
  retries?: number
  // 重试延迟（毫秒）
  retryDelay?: number
  // 响应类型
  responseType?: "json" | "text" | "blob" | "arraybuffer"
  validateStatus?: (status: number) => boolean
  abortSignal?: AbortSignal
}

// 请求配置
export interface RequestConfig extends RequestOptions {
  // 请求URL
  url: string
}

// 请求验证结果
export interface RequestValidationResult {
  // 是否有效
  valid: boolean
  // 错误信息
  errors?: string[]
}

// 请求拦截器
export interface RequestInterceptor {
  // 请求拦截函数
  onRequest(config: RequestConfig): Promise<RequestConfig> | RequestConfig
}

// 响应拦截器
export interface ResponseInterceptor {
  onResponse: <T>(response: Response, data: T) => Promise<T> | T
  onError?: (error: Error, config: RequestConfig) => Promise<Error> | Error
}
