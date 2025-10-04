import type { AuthHandler, AuthResult, CustomAuthConfig } from "../auth-types"

/**
 * 自定义认证策略
 */
export class CustomAuthStrategy implements AuthHandler {
  private config: CustomAuthConfig
  private isAuthValid = false

  constructor(config: CustomAuthConfig) {
    this.config = config
  }

  /**
   * 获取认证头
   */
  public async getAuthHeaders(): Promise<Record<string, string>> {
    if (!this.config.enabled) {
      return {}
    }

    try {
      return await this.config.getAuthHeaders()
    } catch (error) {
      console.error("获取自定义认证头失败:", error)
      return {}
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
