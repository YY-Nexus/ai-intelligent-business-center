import type { AuthHandler, AuthResult, BearerAuthConfig } from "../auth-types"

/**
 * Bearer令牌认证策略
 */
export class BearerAuthStrategy implements AuthHandler {
  private config: BearerAuthConfig

  constructor(config: BearerAuthConfig) {
    this.config = config
  }

  /**
   * 获取认证头
   */
  public async getAuthHeaders(): Promise<Record<string, string>> {
    if (!this.config.enabled) {
      return {}
    }

    // 如果令牌已过期且配置了自动刷新，则尝试刷新
    if (this.isTokenExpired() && this.config.autoRefresh) {
      await this.refreshAuth()
    }

    return {
      Authorization: `Bearer ${this.config.token}`,
    }
  }

  /**
   * 执行认证
   */
  public async authenticate(): Promise<AuthResult> {
    if (!this.config.token) {
      return {
        success: false,
        error: "缺少令牌",
      }
    }

    try {
      const headers = await this.getAuthHeaders()
      return {
        success: true,
        headers,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "认证失败",
      }
    }
  }

  /**
   * 检查是否已认证
   */
  public isAuthenticated(): boolean {
    return this.config.enabled && !!this.config.token && !this.isTokenExpired()
  }

  /**
   * 刷新认证
   */
  public async refreshAuth(): Promise<AuthResult> {
    if (!this.config.refreshToken) {
      return {
        success: false,
        error: "缺少刷新令牌",
      }
    }

    // 这里应该实现实际的令牌刷新逻辑
    // 通常涉及调用令牌端点并使用刷新令牌获取新的访问令牌
    // 这是一个简化的示例
    try {
      console.log("刷新令牌...")

      // 模拟令牌刷新
      this.config.token = `new_token_${Date.now()}`
      this.config.expiresAt = Date.now() + 3600 * 1000 // 1小时后过期

      return {
        success: true,
        headers: await this.getAuthHeaders(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "令牌刷新失败",
      }
    }
  }

  /**
   * 撤销认证
   */
  public async revokeAuth(): Promise<void> {
    // 清除令牌
    this.config.token = ""
    this.config.refreshToken = ""
    this.config.expiresAt = undefined
  }

  /**
   * 检查令牌是否已过期
   */
  private isTokenExpired(): boolean {
    if (!this.config.expiresAt) {
      return false
    }

    return Date.now() >= this.config.expiresAt
  }
}
