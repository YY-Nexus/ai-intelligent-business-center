/**
 * 简单的依赖注入容器
 */
export class DIContainer {
  private services: Map<string, any> = new Map()
  private factories: Map<string, () => any> = new Map()
  private singletons: Map<string, boolean> = new Map()
  private instances: Map<string, any> = new Map()

  /**
   * 注册服务
   * @param token 服务标识符
   * @param factory 创建服务实例的工厂函数
   * @param singleton 是否为单例
   */
  register<T>(token: string, factory: () => T, singleton = true): void {
    this.factories.set(token, factory)
    this.singletons.set(token, singleton)

    // 如果不是单例，则清除已有实例
    if (!singleton) {
      this.instances.delete(token)
    }
  }

  /**
   * 注册现有实例
   * @param token 服务标识符
   * @param instance 服务实例
   */
  registerInstance<T>(token: string, instance: T): void {
    this.instances.set(token, instance)
    this.singletons.set(token, true)
  }

  /**
   * 获取服务实例
   * @param token 服务标识符
   * @returns 服务实例
   */
  resolve<T>(token: string): T {
    // 检查是否已有实例（对于单例）
    if (this.instances.has(token)) {
      return this.instances.get(token) as T
    }

    // 检查是否有工厂函数
    const factory = this.factories.get(token)
    if (!factory) {
      throw new Error(`未找到服务: ${token}`)
    }

    // 创建实例
    const instance = factory()

    // 如果是单例，则缓存实例
    if (this.singletons.get(token)) {
      this.instances.set(token, instance)
    }

    return instance as T
  }

  /**
   * 检查服务是否已注册
   * @param token 服务标识符
   * @returns 是否已注册
   */
  has(token: string): boolean {
    return this.factories.has(token) || this.instances.has(token)
  }

  /**
   * 移除服务
   * @param token 服务标识符
   */
  remove(token: string): void {
    this.factories.delete(token)
    this.singletons.delete(token)
    this.instances.delete(token)
  }

  /**
   * 清除所有服务
   */
  clear(): void {
    this.factories.clear()
    this.singletons.clear()
    this.instances.clear()
  }
}

// 创建全局容器实例
export const container = new DIContainer()
