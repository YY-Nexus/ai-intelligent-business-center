import { container } from "@/lib/di/container"
import { SERVICE_TOKENS } from "./services"
import { ApiConfigManager } from "../config/config-manager"
import { AuthHandlerFactory } from "../auth/auth-handler"
import { ApiResponseParser } from "../response/response-parser"
import { ApiDataMapper } from "../mapping/data-mapper"
import { ApiErrorHandler } from "../error/error-handler"
import type { AuthConfiguration } from "../auth/auth-types"
import type { ErrorHandlerOptions } from "../error/error-types"

/**
 * API服务提供者
 * 负责注册API相关服务到依赖注入容器
 */
export class ApiServiceProvider {
  /**
   * 注册所有API服务
   */
  static registerServices(): void {
    // 注册配置管理器
    if (!container.has(SERVICE_TOKENS.CONFIG_MANAGER)) {
      container.register(SERVICE_TOKENS.CONFIG_MANAGER, () => new ApiConfigManager())
    }

    // 注册响应解析器
    if (!container.has(SERVICE_TOKENS.RESPONSE_PARSER)) {
      container.register(SERVICE_TOKENS.RESPONSE_PARSER, () => new ApiResponseParser())
    }

    // 注册数据映射器
    if (!container.has(SERVICE_TOKENS.DATA_MAPPER)) {
      container.register(SERVICE_TOKENS.DATA_MAPPER, () => new ApiDataMapper())
    }
  }

  /**
   * 注册认证处理器
   * @param config 认证配置
   */
  static registerAuthHandler(config: AuthConfiguration): void {
    container.register(SERVICE_TOKENS.AUTH_HANDLER, () => AuthHandlerFactory.createHandler(config))
  }

  /**
   * 注册错误处理器
   * @param options 错误处理器选项
   */
  static registerErrorHandler(options?: ErrorHandlerOptions): void {
    container.register(SERVICE_TOKENS.ERROR_HANDLER, () => new ApiErrorHandler(options))
  }

  /**
   * 获取配置管理器
   */
  static getConfigManager(): ApiConfigManager {
    return container.resolve<ApiConfigManager>(SERVICE_TOKENS.CONFIG_MANAGER)
  }
}
