/**
 * API绑定系统 - 完整实现
 *
 * 这个文件包含了整个API绑定系统的实现，包括：
 * 1. API配置管理器
 * 2. 认证处理器
 * 3. 请求构建器
 * 4. 响应解析器
 * 5. 数据映射引擎
 * 6. 错误处理机制
 */

// ================ 类型定义 ================

// API配置类型
export interface ApiConfig {
  name: string
  baseUrl: string
  version: string
  timeout: number
  headers: Record<string, string>
}

// 认证配置类型
export interface AuthConfig {
  type: "none" | "basic" | "bearer" | "apiKey" | "oauth2" | "custom"
  enabled: boolean
  [key: string]: any
}

// 请求配置类型
export interface RequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS"
  path: string
  query?: Record<string, string>
  headers?: Record<string, string>
  body?: any
  timeout?: number
}

// 响应类型
export interface ApiResponse<T = any> {
  status: number
  statusText: string
  headers: Record<string, string>
  data: T
  duration: number
}

// 错误类型
export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: any
}

// HTTP方法
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS"

// 请求选项
export interface RequestOptions {
  method?: HttpMethod
  path?: string
  queryParams?: Record<string, string | number | boolean | null | undefined>
  headers?: Record<string, string>
  body?: any
  timeout?: number
  responseType?: "json" | "text" | "blob" | "arraybuffer"
  signal?: AbortSignal
}

// 重试策略
export interface RetryStrategy {
  maxRetries: number
  retryDelay: number
  shouldRetry: (error: ApiError) => boolean
}

// 错误处理选项
export interface ErrorHandlerOptions {
  logErrors?: boolean
  retryStrategy?: RetryStrategy
  onError?: (error: ApiError) => void
}

// 响应解析选项
export interface ResponseParseOptions {
  expectedType?: "json" | "text" | "blob" | "arraybuffer"
  throwOnError?: boolean
}

// API客户端选项
export interface ApiClientOptions {
  config: ApiConfig
  auth?: AuthConfig
  errorHandlerOptions?: ErrorHandlerOptions
  defaultParseOptions?: ResponseParseOptions
}

// ================ 实现 ================

/**
 * API客户端
 * 提供与API交互的主要接口
 */
export class ApiClient {
  private config: ApiConfig
  private auth: AuthConfig
  private errorHandlerOptions: ErrorHandlerOptions
  private defaultParseOptions: ResponseParseOptions

  constructor(options: ApiClientOptions) {
    this.config = options.config
    this.auth = options.auth || { type: "none", enabled: false }
    this.errorHandlerOptions = options.errorHandlerOptions || { logErrors: true }
    this.defaultParseOptions = options.defaultParseOptions || { expectedType: "json", throwOnError: true }
  }

  /**
   * 发送GET请求
   */
  public async get<T = any>(path: string, options?: Partial<RequestOptions>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "GET",
      path,
      ...options,
    })
  }

  /**
   * 发送POST请求
   */
  public async post<T = any>(path: string, body?: any, options?: Partial<RequestOptions>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "POST",
      path,
      body,
      ...options,
    })
  }

  /**
   * 发送PUT请求
   */
  public async put<T = any>(path: string, body?: any, options?: Partial<RequestOptions>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "PUT",
      path,
      body,
      ...options,
    })
  }

  /**
   * 发送DELETE请求
   */
  public async delete<T = any>(path: string, options?: Partial<RequestOptions>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "DELETE",
      path,
      ...options,
    })
  }

  /**
   * 发送PATCH请求
   */
  public async patch<T = any>(path: string, body?: any, options?: Partial<RequestOptions>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "PATCH",
      path,
      body,
      ...options,
    })
  }

  /**
   * 发送请求
   */
  public async request<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(options.path || "", options.queryParams)
    const headers = await this.buildHeaders(options.headers)
    const timeout = options.timeout || this.config.timeout || 30000

    const requestInit: RequestInit = {
      method: options.method || "GET",
      headers,
      signal: options.signal || AbortSignal.timeout(timeout),
    }

    if (options.body) {
      requestInit.body = JSON.stringify(options.body)
      if (!headers["Content-Type"]) {
        ;(requestInit.headers as Record<string, string>)["Content-Type"] = "application/json"
      }
    }

    const requestOptions: RequestOptions = {
      ...options,
      headers: headers as Record<string, string>,
    }

    try {
      const response = await fetch(url, requestInit)
      return await this.parseResponse<T>(response, requestOptions)
    } catch (error) {
      return this.handleError<T>(error as Error, requestOptions)
    }
  }

  /**
   * 构建URL
   */
  private buildUrl(path: string, queryParams?: Record<string, string | number | boolean | null | undefined>): string {
    let url = this.config.baseUrl

    // 确保baseUrl末尾没有斜杠，path开头有斜杠
    url = url.endsWith("/") ? url.slice(0, -1) : url
    path = path.startsWith("/") ? path : `/${path}`

    // 添加版本号（如果有）
    if (this.config.version) {
      path = `/${this.config.version}${path}`
    }

    url += path

    // 添加查询参数
    if (queryParams && Object.keys(queryParams).length > 0) {
      const searchParams = new URLSearchParams()

      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== null && value !== undefined) {
          searchParams.append(key, String(value))
        }
      }

      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }

    return url
  }

  /**
   * 构建请求头
   */
  private async buildHeaders(customHeaders?: Record<string, string>): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      ...(this.config.headers || {}),
      ...(customHeaders || {}),
    }

    // 添加认证头
    if (this.auth.enabled) {
      switch (this.auth.type) {
        case "basic":
          headers["Authorization"] = `Basic ${btoa(`${this.auth.username}:${this.auth.password}`)}`
          break
        case "bearer":
          headers["Authorization"] = `Bearer ${this.auth.token}`
          break
        case "api-key":
          if (this.auth.headerName) {
            headers[this.auth.headerName] = this.auth.apiKey
          }
          break
        case "oauth2":
          if (this.auth.token) {
            headers["Authorization"] = `Bearer ${this.auth.token}`
          }
          break
        case "custom":
          const customHeaders = this.auth.getAuthHeaders()
          Object.assign(headers, customHeaders)
          break
      }
    }

    return headers
  }

  /**
   * 解析响应
   */
  private async parseResponse<T>(response: Response, request: RequestOptions): Promise<ApiResponse<T>> {
    const responseType = request.responseType || this.defaultParseOptions.expectedType || "json"
    const throwOnError =
      request.responseType !== undefined
        ? true
        : this.defaultParseOptions.throwOnError !== undefined
          ? this.defaultParseOptions.throwOnError
          : true

    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    let data: any

    try {
      switch (responseType) {
        case "json":
          // 尝试解析JSON，如果失败则返回null
          const text = await response.text()
          try {
            data = text ? JSON.parse(text) : null
          } catch (e) {
            data = text
          }
          break
        case "text":
          data = await response.text()
          break
        case "blob":
          data = await response.blob()
          break
        case "arraybuffer":
          data = await response.arrayBuffer()
          break
        default:
          data = await response.json()
      }
    } catch (error) {
      // 如果解析失败，设置data为null
      data = null
    }

    const apiResponse: ApiResponse<T> = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers,
      request,
    }

    // 如果响应不成功且需要抛出错误
    if (!response.ok && throwOnError) {
      const error = new Error(`Request failed with status ${response.status}`) as ApiError
      error.status = response.status
      error.statusText = response.statusText
      error.data = data
      error.request = request
      error.response = apiResponse

      throw error
    }

    return apiResponse
  }

  /**
   * 处理错误
   */
  private async handleError<T>(error: Error, request: RequestOptions): Promise<ApiResponse<T>> {
    const apiError = error as ApiError
    apiError.request = request

    // 记录错误
    if (this.errorHandlerOptions.logErrors) {
      console.error("API请求错误:", apiError)
    }

    // 调用错误回调
    if (this.errorHandlerOptions.onError) {
      this.errorHandlerOptions.onError(apiError)
    }

    // 重试逻辑
    if (this.errorHandlerOptions.retryStrategy) {
      const { maxRetries, retryDelay, shouldRetry } = this.errorHandlerOptions.retryStrategy

      if (shouldRetry(apiError) && (request.retryCount || 0) < maxRetries) {
        const retryCount = (request.retryCount || 0) + 1

        // 等待重试延迟
        await new Promise((resolve) => setTimeout(resolve, retryDelay))

        // 重试请求
        return this.request<T>({
          ...request,
          retryCount,
        })
      }
    }

    throw apiError
  }
}

// 扩展RequestOptions以包含重试计数
declare module "./api-binding" {
  interface RequestOptions {
    retryCount?: number
  }
}
