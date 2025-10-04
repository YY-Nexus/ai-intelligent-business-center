import type { ApiConfig, EnvironmentConfig, Environment, ApiConfigStore, ConfigValidationResult } from "./config-types"

/**
 * API配置管理器
 * 负责存储和管理API连接信息
 */
export class ApiConfigManager {
  private store: ApiConfigStore

  constructor() {
    this.store = {
      configs: {},
      activeEnvironment: "development",
    }
  }

  /**
   * 添加API配置
   */
  public addConfig(apiName: string, config: ApiConfig, environment: Environment = "development"): void {
    if (!this.store.configs[apiName]) {
      this.store.configs[apiName] = []
    }

    // 检查是否已存在相同环境的配置
    const existingConfigIndex = this.store.configs[apiName].findIndex((cfg) => cfg.environment === environment)

    const envConfig: EnvironmentConfig = {
      ...config,
      environment,
    }

    if (existingConfigIndex >= 0) {
      // 更新现有配置
      this.store.configs[apiName][existingConfigIndex] = envConfig
    } else {
      // 添加新配置
      this.store.configs[apiName].push(envConfig)
    }
  }

  /**
   * 获取API配置
   */
  public getConfig(apiName: string, environment?: Environment): EnvironmentConfig | null {
    const env = environment || this.store.activeEnvironment

    if (!this.store.configs[apiName]) {
      return null
    }

    return this.store.configs[apiName].find((cfg) => cfg.environment === env) || null
  }

  /**
   * 设置活动环境
   */
  public setActiveEnvironment(environment: Environment): void {
    this.store.activeEnvironment = environment
  }

  /**
   * 获取活动环境
   */
  public getActiveEnvironment(): Environment {
    return this.store.activeEnvironment
  }

  /**
   * 删除API配置
   */
  public removeConfig(apiName: string, environment?: Environment): boolean {
    if (!this.store.configs[apiName]) {
      return false
    }

    if (environment) {
      // 删除特定环境的配置
      const initialLength = this.store.configs[apiName].length
      this.store.configs[apiName] = this.store.configs[apiName].filter((cfg) => cfg.environment !== environment)
      return initialLength !== this.store.configs[apiName].length
    } else {
      // 删除所有环境的配置
      delete this.store.configs[apiName]
      return true
    }
  }

  /**
   * 验证API配置
   */
  public validateConfig(config: ApiConfig): ConfigValidationResult {
    const errors: string[] = []

    if (!config.name) {
      errors.push("API名称是必需的")
    }

    if (!config.baseUrl) {
      errors.push("基础URL是必需的")
    } else {
      try {
        new URL(config.baseUrl)
      } catch (e) {
        errors.push("基础URL格式无效")
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    }
  }

  /**
   * 导出所有配置
   */
  public exportConfigs(): ApiConfigStore {
    return JSON.parse(JSON.stringify(this.store))
  }

  /**
   * 导入配置
   */
  public importConfigs(configs: ApiConfigStore): void {
    this.store = JSON.parse(JSON.stringify(configs))
  }

  /**
   * 测试API连接
   */
  public async testConnection(apiName: string, environment?: Environment): Promise<boolean> {
    const config = this.getConfig(apiName, environment)
    if (!config) {
      return false
    }

    try {
      const response = await fetch(config.baseUrl, {
        method: "HEAD",
        headers: config.headers || {},
        signal: AbortSignal.timeout(config.timeout || 5000),
      })

      return response.ok
    } catch (error) {
      console.error(`测试连接到 ${apiName} 失败:`, error)
      return false
    }
  }
}
