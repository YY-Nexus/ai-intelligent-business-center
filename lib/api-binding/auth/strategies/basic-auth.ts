import type { AuthHandler, AuthResult, BasicAuthConfig } from "../auth-types"

/**
 * 基本认证策略
 */
export class BasicAuthStrategy implements AuthHandler {
  private config: BasicAuthConfig
  private isAuthValid = false

  constructor(config: BasicAuthConfig) {
    this.config = config
  }

  /**
   * 获取认证头
   */
  public async getAuthHeaders(): Promise<Record<string, string>> {
    if (!this.config.enabled) {
      return {}
    }

    const credentials = `${this.config.username}:${this.config.password}`
    const encodedCredentials = btoa(credentials)

    return {
      Authorization: `Basic ${encodedCredentials}`,
    }
  }

  /**
   * 执行认证
   */
  public async authenticate(): Promise<AuthResult> {
    try {
      const headers = await this.getAuthHeaders()
      this.isAuthValid = true
      return {
        success: true,
        headers,
      }
    } catch (error) {
      this.isAuthValid = false
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
    return this.isAuthValid && this.config.enabled
  }
}
