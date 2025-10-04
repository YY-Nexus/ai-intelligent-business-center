import type { AuthHandler, AuthResult, OAuth2AuthConfig } from "../auth-types"

/**
 * OAuth2认证策略
 */
export class OAuth2AuthStrategy implements AuthHandler {
  private config: OAuth2AuthConfig

  constructor(config: OAuth2AuthConfig) {
    this.config = config
  }

  /**
   * 获取认证头
   */
  public async getAuthHeaders(): Promise<Record<string, string>> {
    if (!this.config.enabled) {
      return {}
    }

    // 如果令牌已过期，尝试刷新
    if (this.isTokenExpired() && this.config.refreshToken) {
      await this.refreshAuth()
    }

    if (!this.config.accessToken) {
      throw new Error("缺少访问令牌")
    }

    return {
      Authorization: `Bearer ${this.config.accessToken}`,
    }
  }

  /**
   * 执行认证
   */
  public async authenticate(): Promise<AuthResult> {
    // 如果已有访问令牌且未过期，直接返回
    if (this.config.accessToken && !this.isTokenExpired()) {
      return {
        success: true,
        headers: { Authorization: `Bearer ${this.config.accessToken}` },
      }
    }

    // 如果有刷新令牌，尝试刷新
    if (this.config.refreshToken) {
      return this.refreshAuth()
    }

    // 否则，根据授权类型执行初始认证
    try {
      switch (this.config.grantType) {
        case "client_credentials":
          return await this.clientCredentialsFlow()
        case "password":
          return await this.passwordFlow()
        case "authorization_code":
          return await this.authorizationCodeFlow()
        case "refresh_token":
          if (!this.config.refreshToken) {
            throw new Error("缺少刷新令牌")
          }
          return await this.refreshAuth()
        default:
          throw new Error(`不支持的授权类型: ${this.config.grantType}`)
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
    return this.config.enabled && !!this.config.accessToken && !this.isTokenExpired()
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

    try {
      const response = await fetch(this.config.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: this.config.refreshToken,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }),
      })

      if (!response.ok) {
        throw new Error(`令牌刷新失败: ${response.statusText}`)
      }

      const data = await response.json()

      this.config.accessToken = data.access_token
      if (data.refresh_token) {
        this.config.refreshToken = data.refresh_token
      }

      if (data.expires_in) {
        this.config.expiresAt = Date.now() + data.expires_in * 1000
      }

      return {
        success: true,
        headers: { Authorization: `Bearer ${this.config.accessToken}` },
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
    this.config.accessToken = undefined
    this.config.refreshToken = undefined
    this.config.expiresAt = undefined
  }

  /**
   * 客户端凭证流程
   */
  private async clientCredentialsFlow(): Promise<AuthResult> {
    try {
      const response = await fetch(this.config.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          scope: this.config.scopes?.join(" ") || "",
        }),
      })

      if (!response.ok) {
        throw new Error(`认证失败: ${response.statusText}`)
      }

      const data = await response.json()

      this.config.accessToken = data.access_token
      if (data.refresh_token) {
        this.config.refreshToken = data.refresh_token
      }

      if (data.expires_in) {
        this.config.expiresAt = Date.now() + data.expires_in * 1000
      }

      return {
        success: true,
        headers: { Authorization: `Bearer ${this.config.accessToken}` },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "认证失败",
      }
    }
  }

  /**
   * 密码流程
   */
  private async passwordFlow(): Promise<AuthResult> {
    // 这里需要用户名和密码，通常通过UI收集
    // 这是一个简化的示例
    return {
      success: false,
      error: "密码流程需要实现",
    }
  }

  /**
   * 授权码流程
   */
  private async authorizationCodeFlow(): Promise<AuthResult> {
    // 这需要重定向到授权服务器，然后处理回调
    // 这是一个简化的示例
    return {
      success: false,
      error: "授权码流程需要实现",
    }
  }

  /**
   * 检查令牌是否已过期
   */
  private isTokenExpired(): boolean {
    if (!this.config.expiresAt) {
      return false
    }

    // 提前5分钟将令牌视为过期，以避免边界情况
    return Date.now() >= this.config.expiresAt - 5 * 60 * 1000
  }
}
