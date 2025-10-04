import { BasicAuthStrategy } from "./strategies/basic-auth"
import { BearerAuthStrategy } from "./strategies/bearer-auth"
import { ApiKeyAuthStrategy } from "./strategies/api-key-auth"
import { OAuth2AuthStrategy } from "./strategies/oauth2-auth"
import { CustomAuthStrategy } from "./strategies/custom-auth"
import type { AuthHandler, AuthConfiguration, AuthStrategy } from "./auth-types"

/**
 * 认证处理器工厂
 * 负责创建不同类型的认证处理器
 */
export class AuthHandlerFactory {
  /**
   * 创建认证处理器
   */
  static createHandler(config: AuthConfiguration): AuthHandler {
    if (!config.enabled) {
      return new NoAuthHandler()
    }

    switch (config.type) {
      case "basic":
        return new BasicAuthHandler(new BasicAuthStrategy(config))
      case "bearer":
        return new BearerAuthHandler(new BearerAuthStrategy(config))
      case "api-key":
        return new ApiKeyAuthHandler(new ApiKeyAuthStrategy(config))
      case "oauth2":
        return new OAuth2AuthHandler(new OAuth2AuthStrategy(config))
      case "custom":
        return new CustomAuthHandler(new CustomAuthStrategy(config))
      default:
        return new NoAuthHandler()
    }
  }
}

/**
 * 基础认证处理器
 */
abstract class BaseAuthHandler implements AuthHandler {
  protected strategy: AuthStrategy

  constructor(strategy: AuthStrategy) {
    this.strategy = strategy
  }

  /**
   * 获取认证头
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    return this.strategy.getAuthHeaders()
  }

  /**
   * 刷新认证
   */
  async refreshAuth(): Promise<void> {
    if (this.strategy.refreshAuth) {
      await this.strategy.refreshAuth()
    }
  }

  /**
   * 验证认证状态
   */
  async validateAuth(): Promise<boolean> {
    if (this.strategy.validateAuth) {
      return this.strategy.validateAuth()
    }
    return true
  }

  /**
   * 获取认证信息
   */
  getAuthInfo(): any {
    if (this.strategy.getAuthInfo) {
      return this.strategy.getAuthInfo()
    }
    return null
  }
}

/**
 * 无认证处理器
 */
class NoAuthHandler implements AuthHandler {
  async getAuthHeaders(): Promise<Record<string, string>> {
    return {}
  }

  async refreshAuth(): Promise<void> {
    // 无需刷新
  }

  async validateAuth(): Promise<boolean> {
    return true
  }

  getAuthInfo(): any {
    return null
  }
}

/**
 * Basic认证处理器
 */
class BasicAuthHandler extends BaseAuthHandler {}

/**
 * Bearer认证处理器
 */
class BearerAuthHandler extends BaseAuthHandler {}

/**
 * API Key认证处理器
 */
class ApiKeyAuthHandler extends BaseAuthHandler {}

/**
 * OAuth2认证处理器
 */
class OAuth2AuthHandler extends BaseAuthHandler {}

/**
 * 自定义认证处理器
 */
class CustomAuthHandler extends BaseAuthHandler {}

/**
 * 创建认证处理器的便捷函数
 * 方便在应用中快速创建和配置认证处理器
 */
export function createAuthHandler(config: AuthConfiguration): AuthHandler {
  return AuthHandlerFactory.createHandler(config)
}
