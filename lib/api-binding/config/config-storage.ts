import type { ApiConfig } from "./config-types"

/**
 * API配置存储服务 - 管理API配置的持久化存储
 */
export class ApiConfigStorage {
  private readonly storageKey = "api_os_configs"

  /**
   * 保存API配置
   */
  async saveConfig(config: ApiConfig): Promise<string> {
    const configs = await this.getAllConfigs()

    // 生成唯一ID（如果没有）
    if (!config.id) {
      config.id = `config_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    }

    // 添加或更新配置
    configs[config.id] = {
      ...config,
      updatedAt: new Date().toISOString(),
    }

    // 保存到本地存储
    localStorage.setItem(this.storageKey, JSON.stringify(configs))

    return config.id
  }

  /**
   * 获取所有API配置
   */
  async getAllConfigs(): Promise<Record<string, ApiConfig>> {
    const configsJson = localStorage.getItem(this.storageKey)
    return configsJson ? JSON.parse(configsJson) : {}
  }

  /**
   * 获取单个API配置
   */
  async getConfig(id: string): Promise<ApiConfig | null> {
    const configs = await this.getAllConfigs()
    return configs[id] || null
  }

  /**
   * 删除API配置
   */
  async deleteConfig(id: string): Promise<boolean> {
    const configs = await this.getAllConfigs()

    if (!configs[id]) {
      return false
    }

    delete configs[id]
    localStorage.setItem(this.storageKey, JSON.stringify(configs))

    return true
  }

  /**
   * 导出所有配置
   */
  async exportConfigs(): Promise<string> {
    const configs = await this.getAllConfigs()
    return JSON.stringify(configs, null, 2)
  }

  /**
   * 导入配置
   */
  async importConfigs(configsJson: string): Promise<number> {
    try {
      const configs = JSON.parse(configsJson)
      const currentConfigs = await this.getAllConfigs()

      // 合并配置
      const mergedConfigs = { ...currentConfigs, ...configs }
      localStorage.setItem(this.storageKey, JSON.stringify(mergedConfigs))

      // 返回导入的配置数量
      return Object.keys(configs).length
    } catch (error) {
      console.error("导入配置失败:", error)
      throw new Error("导入配置失败，请检查JSON格式是否正确")
    }
  }
}

// 导出全局API配置存储实例
export const apiConfigStorage = new ApiConfigStorage()
