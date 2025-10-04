import type { AuthHandler, AuthResult, ApiKeyAuthConfig } from "../auth-types"

/**
 * API密钥认证策略
 */
export class ApiKeyAuthStrategy implements AuthHandler {
  private config: ApiKeyAuthConfig

  constructor(config: ApiKeyAuthConfig) {
    this.config = {
      ...config,
      headerName: config.headerName || "X-API-Key",
      queryParamName: config.queryParamName || "api_key",
    }
  }

  /**
   * 获取认证头
   */
  public async getAuthHeaders(): Promise<Record<string, string>> {
    if (!this.config.enabled) {
      return {}
    }

    // 如果配置为在查询参数中使用API密钥，则不添加到头部
    if (this.config.inQuery) {
      return {}
    }

    return {
      [this.config.headerName!]: this.config.apiKey,
    }
  }

  /**
   * 获取查询参数
   */
  public getQueryParams(): Record<string, string> {
    if (!this.config.enabled || !this.config.inQuery) {
      return {}
    }

    return {
      [this.config.queryParamName!]: this.config.apiKey,
    }
  }

  /**
   * 执行认证
   */
  public async authenticate(): Promise<AuthResult> {
    if (!this.config.apiKey) {
      return {
        success: false,
        error: "缺少API密钥",
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
    return this.config.enabled && !!this.config.apiKey
  }
}
