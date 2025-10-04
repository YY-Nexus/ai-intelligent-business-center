import type { ApiProvider, ApiRequest, ApiResponse, ModelCapability } from "@/types/api"

/**
 * 统一API抽象层
 * 提供统一的接口来处理不同AI提供商的API差异
 */
export class UnifiedApi {
  private providers: Map<string, ApiProvider> = new Map()
  private routingRules: any[] = []
  private settings: {
    enableSmartRouting: boolean
    enableFailover: boolean
    enableCostOptimization: boolean
    enableABTesting: boolean
  } = {
    enableSmartRouting: true,
    enableFailover: true,
    enableCostOptimization: true,
    enableABTesting: false,
  }

  /**
   * 注册AI提供商
   * @param provider 提供商配置
   */
  registerProvider(provider: ApiProvider): void {
    this.providers.set(provider.id, provider)
    console.log(`已注册提供商: ${provider.name}`)
  }

  /**
   * 更新提供商配置
   * @param providerId 提供商ID
   * @param updates 更新内容
   */
  updateProvider(providerId: string, updates: Partial<ApiProvider>): void {
    const provider = this.providers.get(providerId)
    if (provider) {
      this.providers.set(providerId, { ...provider, ...updates })
      console.log(`已更新提供商: ${provider.name}`)
    }
  }

  /**
   * 移除提供商
   * @param providerId 提供商ID
   */
  removeProvider(providerId: string): void {
    const provider = this.providers.get(providerId)
    if (provider) {
      this.providers.delete(providerId)
      console.log(`已移除提供商: ${provider.name}`)
    }
  }

  /**
   * 设置路由规则
   * @param rules 路由规则数组
   */
  setRoutingRules(rules: any[]): void {
    this.routingRules = rules
    console.log(`已设置${rules.length}条路由规则`)
  }

  /**
   * 更新系统设置
   * @param settings 设置对象
   */
  updateSettings(settings: Partial<typeof this.settings>): void {
    this.settings = { ...this.settings, ...settings }
    console.log("已更新系统设置")
  }

  /**
   * 选择最佳提供商
   * @param request API请求
   * @returns 选中的提供商ID
   */
  private selectProvider(request: ApiRequest): string {
    // 如果请求中指定了提供商，且该提供商可用，则使用指定的提供商
    if (request.providerId) {
      const provider = this.providers.get(request.providerId)
      if (provider && provider.status === "active" && provider.healthStatus !== "unhealthy") {
        return provider.id
      }
    }

    // 如果启用了智能路由，则应用路由规则
    if (this.settings.enableSmartRouting) {
      // 按优先级排序规则
      const sortedRules = [...this.routingRules].sort((a, b) => a.priority - b.priority)

      // 遍历规则，找到第一个匹配的规则
      for (const rule of sortedRules) {
        if (!rule.enabled) continue

        // 检查规则条件是否匹配
        const isMatch = this.matchRuleConditions(rule.conditions, request)
        if (isMatch) {
          const provider = this.providers.get(rule.action.providerId)
          if (provider && provider.status === "active" && provider.healthStatus !== "unhealthy") {
            return provider.id
          }

          // 如果主要提供商不可用，且启用了故障切换，则使用备用提供商
          if (this.settings.enableFailover && rule.action.fallbackProviderId) {
            const fallbackProvider = this.providers.get(rule.action.fallbackProviderId)
            if (
              fallbackProvider &&
              fallbackProvider.status === "active" &&
              fallbackProvider.healthStatus !== "unhealthy"
            ) {
              return fallbackProvider.id
            }
          }
        }
      }
    }

    // 如果没有匹配的规则或智能路由未启用，则选择第一个可用的提供商
    const availableProviders = Array.from(this.providers.values()).filter(
      (p) => p.status === "active" && p.healthStatus !== "unhealthy",
    )

    if (availableProviders.length === 0) {
      throw new Error("没有可用的AI提供商")
    }

    // 如果启用了成本优化，则选择成本最低的提供商
    if (this.settings.enableCostOptimization) {
      availableProviders.sort((a, b) => a.costPerToken - b.costPerToken)
    }

    return availableProviders[0].id
  }

  /**
   * 检查请求是否匹配规则条件
   * @param conditions 规则条件
   * @param request API请求
   * @returns 是否匹配
   */
  private matchRuleConditions(conditions: any[], request: ApiRequest): boolean {
    // 如果没有条件，则默认匹配
    if (!conditions || conditions.length === 0) {
      return true
    }

    // 检查所有条件是否匹配
    return conditions.every((condition) => {
      const value = this.getRequestFieldValue(request, condition.field)

      switch (condition.operator) {
        case "equals":
          return value === condition.value
        case "contains":
          return typeof value === "string" && value.includes(condition.value)
        case "startsWith":
          return typeof value === "string" && value.startsWith(condition.value)
        case "endsWith":
          return typeof value === "string" && value.endsWith(condition.value)
        case "greaterThan":
          return typeof value === "number" && value > condition.value
        case "lessThan":
          return typeof value === "number" && value < condition.value
        default:
          return false
      }
    })
  }

  /**
   * 获取请求中指定字段的值
   * @param request API请求
   * @param field 字段路径
   * @returns 字段值
   */
  private getRequestFieldValue(request: ApiRequest, field: string): any {
    const parts = field.split(".")
    let value: any = request

    for (const part of parts) {
      if (value === undefined || value === null) {
        return undefined
      }
      value = value[part]
    }

    return value
  }

  /**
   * 发送聊天消息
   * @param request 聊天请求
   * @returns 聊天响应
   */
  async sendChatMessage(request: ApiRequest): Promise<ApiResponse> {
    try {
      // 选择提供商
      const providerId = this.selectProvider(request)
      const provider = this.providers.get(providerId)

      if (!provider) {
        throw new Error(`提供商不存在: ${providerId}`)
      }

      // 记录请求开始时间
      const startTime = Date.now()

      // 根据提供商类型调用不同的API
      let response: ApiResponse

      switch (provider.apiType) {
        case "openai":
          response = await this.callOpenAI(provider, request)
          break
        case "baidu":
          response = await this.callBaidu(provider, request)
          break
        case "xfyun":
          response = await this.callXfyun(provider, request)
          break
        case "zhipu":
          response = await this.callZhipu(provider, request)
          break
        case "aliyun":
          response = await this.callAliyun(provider, request)
          break
        case "tencent":
          response = await this.callTencent(provider, request)
          break
        case "minimax":
          response = await this.callMinimax(provider, request)
          break
        case "moonshot":
          response = await this.callMoonshot(provider, request)
          break
        case "baichuan":
          response = await this.callBaichuan(provider, request)
          break
        default:
          throw new Error(`不支持的API类型: ${provider.apiType}`)
      }

      // 计算响应时间
      const responseTime = Date.now() - startTime

      // 记录使用统计
      this.recordUsage({
        providerId,
        model: response.model || request.model || provider.defaultModel,
        endpoint: "chat",
        tokensIn: response.usage?.promptTokens || 0,
        tokensOut: response.usage?.completionTokens || 0,
        responseTime,
        success: true,
      })

      return {
        ...response,
        provider: providerId,
      }
    } catch (error: any) {
      console.error("发送聊天消息失败:", error)

      // 记录错误
      this.recordError({
        providerId: request.providerId || "unknown",
        endpoint: "chat",
        errorCode: error.code || "UNKNOWN_ERROR",
        errorMessage: error.message,
      })

      // 如果启用了故障切换，且指定了提供商但失败了，则尝试使用其他提供商
      if (this.settings.enableFailover && request.providerId) {
        try {
          // 清除指定的提供商，让系统重新选择
          const newRequest = { ...request, providerId: undefined }
          return await this.sendChatMessage(newRequest)
        } catch (fallbackError) {
          // 如果备用提供商也失败，则抛出原始错误
          throw error
        }
      }

      throw error
    }
  }

  /**
   * 调用OpenAI API
   * @param provider 提供商配置
   * @param request API请求
   * @returns API响应
   */
  private async callOpenAI(provider: ApiProvider, request: ApiRequest): Promise<ApiResponse> {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    // 模拟响应
    return {
      text: `这是来自OpenAI的响应。您的消息: "${request.messages[request.messages.length - 1].content}"`,
      model: request.model || provider.defaultModel,
      usage: {
        promptTokens: 20,
        completionTokens: 30,
        totalTokens: 50,
      },
    }
  }

  /**
   * 调用百度文心一言API
   * @param provider 提供商配置
   * @param request API请求
   * @returns API响应
   */
  private async callBaidu(provider: ApiProvider, request: ApiRequest): Promise<ApiResponse> {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    // 模拟响应
    return {
      text: `这是来自百度文心一言的响应。您的消息: "${request.messages[request.messages.length - 1].content}"`,
      model: request.model || provider.defaultModel,
      usage: {
        promptTokens: 20,
        completionTokens: 30,
        totalTokens: 50,
      },
    }
  }

  /**
   * 调用讯飞星火API
   * @param provider 提供商配置
   * @param request API请求
   * @returns API响应
   */
  private async callXfyun(provider: ApiProvider, request: ApiRequest): Promise<ApiResponse> {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    // 模拟响应
    return {
      text: `这是来自讯飞星火的响应。您的消息: "${request.messages[request.messages.length - 1].content}"`,
      model: request.model || provider.defaultModel,
      usage: {
        promptTokens: 20,
        completionTokens: 30,
        totalTokens: 50,
      },
    }
  }

  /**
   * 调用智谱AI API
   * @param provider 提供商配置
   * @param request API请求
   * @returns API响应
   */
  private async callZhipu(provider: ApiProvider, request: ApiRequest): Promise<ApiResponse> {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    // 模拟响应
    return {
      text: `这是来自智谱AI的响应。您的消息: "${request.messages[request.messages.length - 1].content}"`,
      model: request.model || provider.defaultModel,
      usage: {
        promptTokens: 20,
        completionTokens: 30,
        totalTokens: 50,
      },
    }
  }

  /**
   * 调用阿里云通义千问API
   * @param provider 提供商配置
   * @param request API请求
   * @returns API响应
   */
  private async callAliyun(provider: ApiProvider, request: ApiRequest): Promise<ApiResponse> {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    // 模拟响应
    return {
      text: `这是来自阿里云通义千问的响应。您的消息: "${request.messages[request.messages.length - 1].content}"`,
      model: request.model || provider.defaultModel,
      usage: {
        promptTokens: 20,
        completionTokens: 30,
        totalTokens: 50,
      },
    }
  }

  /**
   * 调用腾讯云混元API
   * @param provider 提供商配置
   * @param request API请求
   * @returns API响应
   */
  private async callTencent(provider: ApiProvider, request: ApiRequest): Promise<ApiResponse> {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    // 模拟响应
    return {
      text: `这是来自腾讯云混元的响应。您的消息: "${request.messages[request.messages.length - 1].content}"`,
      model: request.model || provider.defaultModel,
      usage: {
        promptTokens: 20,
        completionTokens: 30,
        totalTokens: 50,
      },
    }
  }

  /**
   * 调用MiniMax API
   * @param provider 提供商配置
   * @param request API请求
   * @returns API响应
   */
  private async callMinimax(provider: ApiProvider, request: ApiRequest): Promise<ApiResponse> {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    // 模拟响应
    return {
      text: `这是来自MiniMax的响应。您的消息: "${request.messages[request.messages.length - 1].content}"`,
      model: request.model || provider.defaultModel,
      usage: {
        promptTokens: 20,
        completionTokens: 30,
        totalTokens: 50,
      },
    }
  }

  /**
   * 调用Moonshot AI API
   * @param provider 提供商配置
   * @param request API请求
   * @returns API响应
   */
  private async callMoonshot(provider: ApiProvider, request: ApiRequest): Promise<ApiResponse> {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    // 模拟响应
    return {
      text: `这是来自Moonshot AI的响应。您的消息: "${request.messages[request.messages.length - 1].content}"`,
      model: request.model || provider.defaultModel,
      usage: {
        promptTokens: 20,
        completionTokens: 30,
        totalTokens: 50,
      },
    }
  }

  /**
   * 调用百川智能API
   * @param provider 提供商配置
   * @param request API请求
   * @returns API响应
   */
  private async callBaichuan(provider: ApiProvider, request: ApiRequest): Promise<ApiResponse> {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

    // 模拟响应
    return {
      text: `这是来自百川智能的响应。您的消息: "${request.messages[request.messages.length - 1].content}"`,
      model: request.model || provider.defaultModel,
      usage: {
        promptTokens: 20,
        completionTokens: 30,
        totalTokens: 50,
      },
    }
  }

  /**
   * 记录API使用统计
   * @param usage 使用统计数据
   */
  private recordUsage(usage: {
    providerId: string
    model: string
    endpoint: string
    tokensIn: number
    tokensOut: number
    responseTime: number
    success: boolean
  }): void {
    // 在实际应用中，这里应该将使用统计数据保存到数据库
    console.log("记录使用统计:", usage)
  }

  /**
   * 记录API错误
   * @param error 错误数据
   */
  private recordError(error: {
    providerId: string
    endpoint: string
    errorCode: string
    errorMessage: string
  }): void {
    // 在实际应用中，这里应该将错误数据保存到数据库
    console.log("记录错误:", error)
  }

  /**
   * 获取提供商列表
   * @returns 提供商列表
   */
  getProviders(): ApiProvider[] {
    return Array.from(this.providers.values())
  }

  /**
   * 获取提供商详情
   * @param providerId 提供商ID
   * @returns 提供商详情
   */
  getProvider(providerId: string): ApiProvider | undefined {
    return this.providers.get(providerId)
  }

  /**
   * 获取路由规则
   * @returns 路由规则列表
   */
  getRoutingRules(): any[] {
    return this.routingRules
  }

  /**
   * 获取系统设置
   * @returns 系统设置
   */
  getSettings(): typeof this.settings {
    return this.settings
  }

  /**
   * 检查提供商健康状态
   * @param providerId 提供商ID
   * @returns 健康检查结果
   */
  async checkProviderHealth(providerId: string): Promise<{
    status: "healthy" | "degraded" | "unhealthy"
    latency: number
    message: string
  }> {
    const provider = this.providers.get(providerId)
    if (!provider) {
      return {
        status: "unhealthy",
        latency: 0,
        message: "提供商不存在",
      }
    }

    try {
      // 模拟健康检查
      const startTime = Date.now()
      await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300))
      const latency = Date.now() - startTime

      // 随机模拟不同的健康状态
      const random = Math.random()
      if (random < 0.8) {
        return {
          status: "healthy",
          latency,
          message: "提供商运行正常",
        }
      } else if (random < 0.9) {
        return {
          status: "degraded",
          latency,
          message: "提供商性能下降",
        }
      } else {
        return {
          status: "unhealthy",
          latency,
          message: "提供商不可用",
        }
      }
    } catch (error: any) {
      return {
        status: "unhealthy",
        latency: 0,
        message: error.message || "健康检查失败",
      }
    }
  }

  /**
   * 检查所有提供商的健康状态
   * @returns 健康检查结果
   */
  async checkAllProvidersHealth(): Promise<
    Map<
      string,
      {
        status: "healthy" | "degraded" | "unhealthy"
        latency: number
        message: string
      }
    >
  > {
    const results = new Map()

    for (const providerId of this.providers.keys()) {
      results.set(providerId, await this.checkProviderHealth(providerId))
    }

    return results
  }

  /**
   * 获取模型能力映射表
   * @returns 模型能力映射表
   */
  getModelCapabilities(): Map<string, ModelCapability[]> {
    const capabilities = new Map<string, ModelCapability[]>()

    for (const provider of this.providers.values()) {
      for (const model of provider.models) {
        capabilities.set(model.id, model.capabilities)
      }
    }

    return capabilities
  }

  /**
   * 获取使用统计
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @param groupBy 分组方式
   * @returns 使用统计数据
   */
  async getUsageStatistics(
    startDate: Date,
    endDate: Date,
    groupBy: "hour" | "day" | "week" | "month" = "day",
  ): Promise<any> {
    // 模拟统计数据
    return {
      totalCalls: 12543,
      totalCost: 1245.78,
      avgResponseTime: 237,
      errorRate: 0.023,
      usageByProvider: [
        { name: "百度文心一言", value: 4500 },
        { name: "讯飞星火", value: 3200 },
        { name: "智谱AI", value: 2100 },
        { name: "阿里云通义千问", value: 1500 },
        { name: "腾讯云混元", value: 800 },
        { name: "MiniMax", value: 300 },
        { name: "Moonshot AI", value: 100 },
        { name: "百川智能", value: 43 },
      ],
      costByProvider: [
        { name: "百度文心一言", value: 450.5 },
        { name: "讯飞星火", value: 320.3 },
        { name: "智谱AI", value: 210.8 },
        { name: "阿里云通义千问", value: 150.2 },
        { name: "腾讯云混元", value: 80.5 },
        { name: "MiniMax", value: 30.4 },
        { name: "Moonshot AI", value: 10.1 },
        { name: "百川智能", value: 4.3 },
      ],
      performanceMetrics: [
        { name: "百度文心一言", value: 220 },
        { name: "讯飞星火", value: 180 },
        { name: "智谱AI", value: 250 },
        { name: "阿里云通义千问", value: 210 },
        { name: "腾讯云混元", value: 230 },
        { name: "MiniMax", value: 270 },
        { name: "Moonshot AI", value: 200 },
        { name: "百川智能", value: 240 },
      ],
      usageByEndpoint: [
        { endpoint: "chat", calls: 10000, cost: 1000.5, avgResponseTime: 230 },
        { endpoint: "completions", calls: 2000, cost: 200.3, avgResponseTime: 210 },
        { endpoint: "embeddings", calls: 500, cost: 40.5, avgResponseTime: 150 },
        { endpoint: "images", calls: 43, cost: 4.48, avgResponseTime: 1200 },
      ],
      errorRates: [
        { name: "百度文心一言", value: 0.02 },
        { name: "讯飞星火", value: 0.015 },
        { name: "智谱AI", value: 0.03 },
        { name: "阿里云通义千问", value: 0.025 },
        { name: "腾讯云混元", value: 0.02 },
        { name: "MiniMax", value: 0.04 },
        { name: "Moonshot AI", value: 0.01 },
        { name: "百川智能", value: 0.03 },
      ],
    }
  }
}

// 导出单例实例
export const unifiedApi = new UnifiedApi()
