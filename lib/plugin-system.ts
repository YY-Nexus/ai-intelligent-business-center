// 插件配置模式类型
export interface PluginConfigSchema {
  [key: string]: {
    type: string
    default: any
    description: string
    enum?: string[]
  }
}

// 审计插件类型
export interface AuditPlugin {
  id: string
  name: string
  description: string
  version: string
  author: string
  category: string
  enabled: boolean
  configSchema?: PluginConfigSchema
}

// 插件系统类
export class PluginSystem {
  private plugins: Map<string, AuditPlugin> = new Map()

  // 注册插件
  registerPlugin(plugin: AuditPlugin): void {
    this.plugins.set(plugin.id, plugin)
  }

  // 获取所有插件
  getAllPlugins(): AuditPlugin[] {
    return Array.from(this.plugins.values())
  }

  // 获取特定插件
  getPlugin(id: string): AuditPlugin | undefined {
    return this.plugins.get(id)
  }

  // 启用插件
  enablePlugin(id: string): boolean {
    const plugin = this.plugins.get(id)
    if (plugin) {
      plugin.enabled = true
      this.plugins.set(id, plugin)
      return true
    }
    return false
  }

  // 禁用插件
  disablePlugin(id: string): boolean {
    const plugin = this.plugins.get(id)
    if (plugin) {
      plugin.enabled = false
      this.plugins.set(id, plugin)
      return true
    }
    return false
  }

  // 获取已启用的插件
  getEnabledPlugins(): AuditPlugin[] {
    return Array.from(this.plugins.values()).filter((plugin) => plugin.enabled)
  }

  // 获取特定类别的插件
  getPluginsByCategory(category: string): AuditPlugin[] {
    return Array.from(this.plugins.values()).filter((plugin) => plugin.category === category)
  }

  // 卸载插件
  uninstallPlugin(id: string): boolean {
    return this.plugins.delete(id)
  }

  // 更新插件
  updatePlugin(id: string, updatedPlugin: Partial<AuditPlugin>): boolean {
    const plugin = this.plugins.get(id)
    if (plugin) {
      this.plugins.set(id, { ...plugin, ...updatedPlugin })
      return true
    }
    return false
  }
}

// 创建插件系统实例
export const pluginSystem = new PluginSystem()
