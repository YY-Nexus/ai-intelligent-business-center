import type { ApiConfig } from "@/lib/api-binding/config/config-types"
import { ApiClient } from "./api-client"
import { createAuthHandler } from "../auth/auth-handler"
import { RequestBuilder } from "../request/request-builder"
import { createResponseParser } from "../response/response-parser"
import { createErrorHandler } from "../error/error-handler"
import { createDataMapper } from "../mapping/data-mapper"

/**
 * API客户端工厂 - 根据配置创建API客户端实例
 */
export function createApiClient(config: ApiConfig): ApiClient {
  // 创建认证处理器
  const authHandler = createAuthHandler(config.auth)

  // 创建请求构建器
  const requestBuilder = new RequestBuilder({
    baseUrl: config.baseUrl,
    defaultHeaders: config.headers,
    defaultParams: config.params,
  })

  // 创建响应解析器
  const responseParser = createResponseParser({
    defaultContentType: config.responseType || "json",
    dataPath: config.dataPath,
  })

  // 创建错误处理器
  const errorHandler = createErrorHandler({
    retryConfig: config.retry,
    errorMapping: config.errorMapping,
  })

  // 创建数据映射器
  const dataMapper = createDataMapper({
    mappings: config.dataMappings,
  })

  // 创建并返回API客户端实例
  return new ApiClient({
    config,
    authHandler,
    requestBuilder,
    responseParser,
    errorHandler,
    dataMapper,
  })
}

/**
 * 创建API客户端实例池 - 管理多个API客户端实例
 */
export class ApiClientPool {
  private clients: Map<string, ApiClient> = new Map()

  /**
   * 获取或创建API客户端实例
   */
  getOrCreate(configId: string, config: ApiConfig): ApiClient {
    if (this.clients.has(configId)) {
      return this.clients.get(configId)!
    }

    const client = createApiClient(config)
    this.clients.set(configId, client)
    return client
  }

  /**
   * 移除API客户端实例
   */
  remove(configId: string): boolean {
    return this.clients.delete(configId)
  }

  /**
   * 获取所有API客户端实例
   */
  getAll(): Map<string, ApiClient> {
    return this.clients
  }

  /**
   * 清除所有API客户端实例
   */
  clear(): void {
    this.clients.clear()
  }
}

// 导出全局API客户端池实例
export const apiClientPool = new ApiClientPool()
