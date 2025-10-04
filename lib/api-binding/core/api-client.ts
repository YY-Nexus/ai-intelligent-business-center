import { ApiConfigManager } from "../config/config-manager"
import { AuthHandlerFactory } from "../auth/auth-handler"
import { RequestBuilder } from "../request/request-builder"
import { ApiResponseParser } from "../response/response-parser"
import { ApiDataMapper } from "../mapping/data-mapper"
import { ApiErrorHandler } from "../error/error-handler"
import type { ApiClientOptions, ApiRequestOptions, ApiResponse } from "./types"
import type { AuthHandler } from "../auth/auth-types"
import type { NormalizedResponse } from "../response/response-types"
import type { MappingResult } from "../mapping/mapping-types"

/**
 * API客户端
 * 集成所有组件，提供完整的API绑定功能
 */
export class ApiClient {
  private configManager: ApiConfigManager
  private authHandler: AuthHandler
  private responseParser: ApiResponseParser
  private dataMapper: ApiDataMapper
  private errorHandler: ApiErrorHandler
  private options: ApiClientOptions

  constructor(options: ApiClientOptions) {
    this.options = options

    // 初始化组件
    this.configManager = new ApiConfigManager()
    this.configManager.addConfig("default", options.config)

    this.authHandler = AuthHandlerFactory.createHandler(options.auth || { type: "none", enabled: false })
    this.responseParser = new ApiResponseParser()
    this.dataMapper = new ApiDataMapper()
    this.errorHandler = new ApiErrorHandler(options.errorHandlerOptions)
  }

  /**
   * 发送GET请求
   */
  public async get<T>(path: string, options: Omit<ApiRequestOptions, "method"> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: "GET" })
  }

  /**
   * 发送POST请求
   */
  public async post<T>(
    path: string,
    data?: any,
    options: Omit<ApiRequestOptions, "method" | "body"> = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: "POST", body: data })
  }

  /**
   * 发送PUT请求
   */
  public async put<T>(
    path: string,
    data?: any,
    options: Omit<ApiRequestOptions, "method" | "body"> = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: "PUT", body: data })
  }

  /**
   * 发送DELETE请求
   */
  public async delete<T>(path: string, options: Omit<ApiRequestOptions, "method"> = {}): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: "DELETE" })
  }

  /**
   * 发送PATCH请求
   */
  public async patch<T>(
    path: string,
    data?: any,
    options: Omit<ApiRequestOptions, "method" | "body"> = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: "PATCH", body: data })
  }

  /**
   * 发送请求
   */
  public async request<T>(path: string, options: ApiRequestOptions): Promise<ApiResponse<T>> {
    const config = this.configManager.getConfig("default")
    if (!config) {
      throw new Error("API配置未找到")
    }

    // 创建请求构建器
    const requestBuilder = new RequestBuilder(config.baseUrl).setPath(path).setMethod(options.method)

    // 添加查询参数
    if (options.queryParams) {
      requestBuilder.addQueryParams(options.queryParams)
    }

    // 添加请求头
    if (options.headers) {
      requestBuilder.addHeaders(options.headers)
    }

    // 添加请求体
    if (options.body !== undefined) {
      requestBuilder.setBody(options.body, options.contentType)
    }

    // 设置超时
    if (options.timeout || config.timeout) {
      requestBuilder.setTimeout(options.timeout || config.timeout || 30000)
    }

    // 添加认证头
    try {
      const authHeaders = await this.authHandler.getAuthHeaders()
      requestBuilder.addHeaders(authHeaders)
    } catch (error) {
      throw this.errorHandler.handleError(error)
    }

    // 添加请求拦截器
    if (this.options.requestInterceptors) {
      for (const interceptor of this.options.requestInterceptors) {
        requestBuilder.addInterceptor(interceptor)
      }
    }

    // 构建请求配置
    let requestConfig
    try {
      requestConfig = await requestBuilder.build()
    } catch (error) {
      throw this.errorHandler.handleError(error)
    }

    // 验证请求
    const validation = requestBuilder.validate()
    if (!validation.valid) {
      throw new Error(`请求验证失败: ${validation.errors?.join(", ")}`)
    }

    // 发送请求
    let response: Response
    let retryCount = 0
    const maxRetries = options.retries || 0

    while (true) {
      try {
        // 创建AbortController用于超时控制
        const controller = new AbortController()
        const timeout = options.timeout || config.timeout || 30000
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        // 发送请求
        response = await fetch(requestConfig.url, {
          method: requestConfig.method,
          headers: requestConfig.headers,
          body: requestConfig.body,
          signal: controller.signal,
        })

        // 清除超时
        clearTimeout(timeoutId)

        // 检查响应状态
        if (!response.ok && options.validateStatus) {
          if (!options.validateStatus(response.status)) {
            throw new Error(`请求失败: ${response.status} ${response.statusText}`)
          }
        }

        break
      } catch (error) {
        const apiError = this.errorHandler.handleError(
          error,
          new Request(requestConfig.url, {
            method: requestConfig.method,
            headers: requestConfig.headers,
            body: requestConfig.body,
          }),
        )

        // 检查是否应该重试
        if (retryCount < maxRetries && this.errorHandler.shouldRetry(apiError, retryCount)) {
          retryCount++
          const delay = this.errorHandler.getRetryDelay(retryCount, apiError)
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }

        throw apiError
      }
    }

    // 解析响应
    let normalizedResponse: NormalizedResponse<any>
    try {
      const parseOptions = {
        ...this.options.defaultParseOptions,
        ...options.parseOptions,
      }
      normalizedResponse = await this.responseParser.parse(response, parseOptions)
    } catch (error) {
      throw this.errorHandler.handleError(error, new Request(requestConfig.url))
    }

    // 应用响应拦截器
    if (this.options.responseInterceptors) {
      for (const interceptor of this.options.responseInterceptors) {
        try {
          normalizedResponse.data = await interceptor.onResponse(response, normalizedResponse.data)
        } catch (error) {
          if (interceptor.onError) {
            const transformedError = await interceptor.onError(
              error instanceof Error ? error : new Error(String(error)),
              requestConfig,
            )
            throw this.errorHandler.handleError(transformedError)
          }
          throw this.errorHandler.handleError(error)
        }
      }
    }

    // 应用数据映射
    let mappedData: any = normalizedResponse.data
    if (options.mapping) {
      const mappingResult: MappingResult<T> = this.dataMapper.map(
        normalizedResponse.data,
        options.mapping,
        options.mappingDirection || "apiToApp",
      )

      mappedData = mappingResult.data

      // 如果映射有错误，记录但不抛出
      if (mappingResult.errors && mappingResult.errors.length > 0) {
        console.warn("数据映射警告:", mappingResult.errors)
      }
    }

    // 返回API响应
    return {
      data: mappedData,
      status: normalizedResponse.status,
      statusText: normalizedResponse.statusText,
      headers: normalizedResponse.headers,
      metadata: normalizedResponse.metadata,
    }
  }

  /**
   * 获取认证处理器
   */
  public getAuthHandler(): AuthHandler {
    return this.authHandler
  }

  /**
   * 获取配置管理器
   */
  public getConfigManager(): ApiConfigManager {
    return this.configManager
  }

  /**
   * 获取数据映射器
   */
  public getDataMapper(): ApiDataMapper {
    return this.dataMapper
  }

  /**
   * 获取错误处理器
   */
  public getErrorHandler(): ApiErrorHandler {
    return this.errorHandler
  }
}
