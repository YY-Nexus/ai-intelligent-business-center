import { ApiServiceProvider } from "./service-provider"
import { DIApiClient } from "./di-api-client"
import { ApiClient } from "./api-client"
import type { ApiClientOptions } from "./types"

/**
 * API客户端工厂
 * 负责创建API客户端实例
 */
export class ApiClientFactory {
  /**
   * 创建使用依赖注入的API客户端
   * @param options 客户端选项
   */
  static createDIClient(options: ApiClientOptions): DIApiClient {
    // 注册服务
    ApiServiceProvider.registerServices()
    ApiServiceProvider.registerAuthHandler(options.auth || { type: "none", enabled: false })
    ApiServiceProvider.registerErrorHandler(options.errorHandlerOptions)

    // 创建客户端
    return new DIApiClient(options)
  }

  /**
   * 创建传统API客户端
   * @param options 客户端选项
   */
  static createClient(options: ApiClientOptions): ApiClient {
    return new ApiClient(options)
  }
}
