import type { ApiConfig } from "@/lib/api-binding/config/config-types"

export interface MonitoringConfig {
  enabled: boolean
  interval: number // 监控间隔（分钟）
  endpoints: string[] // 要监控的端点
  alertThresholds: {
    responseTime: number // 响应时间阈值（毫秒）
    errorRate: number // 错误率阈值（百分比）
    availability: number // 可用性阈值（百分比）
  }
  notificationChannels: {
    email?: string[]
    webhook?: string
    browser?: boolean
  }
}

export interface MonitoringResult {
  timestamp: string
  endpoint: string
  status: number
  responseTime: number
  success: boolean
  error?: string
}

export interface MonitoringSummary {
  availability: number // 可用性百分比
  avgResponseTime: number // 平均响应时间
  errorRate: number // 错误率
  totalRequests: number // 总请求数
  successfulRequests: number // 成功请求数
  failedRequests: number // 失败请求数
}

export class MonitoringService {
  private monitoringResults: Record<string, MonitoringResult[]> = {}
  private monitoringIntervals: Record<string, NodeJS.Timeout> = {}

  /**
   * 启动API监控
   */
  startMonitoring(configId: string, apiConfig: ApiConfig, monitoringConfig: MonitoringConfig): void {
    // 如果已经在监控，先停止
    this.stopMonitoring(configId)

    if (!monitoringConfig.enabled) {
      console.log(`监控未启用: ${apiConfig.name}`)
      return
    }

    console.log(`启动监控: ${apiConfig.name}, 间隔: ${monitoringConfig.interval}分钟`)

    // 初始化结果存储
    if (!this.monitoringResults[configId]) {
      this.monitoringResults[configId] = []
    }

    // 设置监控间隔
    const intervalMs = monitoringConfig.interval * 60 * 1000

    // 立即执行一次监控
    this.performMonitoring(configId, apiConfig, monitoringConfig)

    // 设置定时监控
    this.monitoringIntervals[configId] = setInterval(() => {
      this.performMonitoring(configId, apiConfig, monitoringConfig)
    }, intervalMs)
  }

  /**
   * 停止API监控
   */
  stopMonitoring(configId: string): void {
    if (this.monitoringIntervals[configId]) {
      clearInterval(this.monitoringIntervals[configId])
      delete this.monitoringIntervals[configId]
      console.log(`停止监控: ${configId}`)
    }
  }

  /**
   * 执行监控检查
   */
  private async performMonitoring(
    configId: string,
    apiConfig: ApiConfig,
    monitoringConfig: MonitoringConfig,
  ): Promise<void> {
    const endpoints = monitoringConfig.endpoints.length > 0 ? monitoringConfig.endpoints : [apiConfig.endpoint || ""]

    for (const endpoint of endpoints) {
      try {
        const startTime = performance.now()

        // 构建完整URL
        const url = new URL(endpoint, apiConfig.baseUrl).toString()

        // 发送请求
        const response = await fetch(url, {
          method: "GET",
          headers: apiConfig.headers,
          // 设置超时
          signal: AbortSignal.timeout(10000),
        })

        const endTime = performance.now()
        const responseTime = endTime - startTime

        // 记录结果
        const result: MonitoringResult = {
          timestamp: new Date().toISOString(),
          endpoint,
          status: response.status,
          responseTime,
          success: response.ok,
          error: response.ok ? undefined : `HTTP错误: ${response.status} ${response.statusText}`,
        }

        this.monitoringResults[configId].push(result)

        // 检查是否需要发送警报
        this.checkAlerts(configId, apiConfig, monitoringConfig, result)

        // 限制存储的结果数量
        if (this.monitoringResults[configId].length > 1000) {
          this.monitoringResults[configId] = this.monitoringResults[configId].slice(-1000)
        }
      } catch (error: any) {
        // 记录错误结果
        const result: MonitoringResult = {
          timestamp: new Date().toISOString(),
          endpoint,
          status: 0,
          responseTime: 0,
          success: false,
          error: error.message || "未知错误",
        }

        this.monitoringResults[configId].push(result)

        // 发送警报
        this.checkAlerts(configId, apiConfig, monitoringConfig, result)
      }
    }
  }

  /**
   * 检查是否需要发送警报
   */
  private checkAlerts(
    configId: string,
    apiConfig: ApiConfig,
    monitoringConfig: MonitoringConfig,
    result: MonitoringResult,
  ): void {
    // 检查响应时间
    if (
      result.success &&
      monitoringConfig.alertThresholds.responseTime > 0 &&
      result.responseTime > monitoringConfig.alertThresholds.responseTime
    ) {
      this.sendAlert(
        configId,
        apiConfig,
        `响应时间过长: ${result.responseTime.toFixed(0)}ms > ${monitoringConfig.alertThresholds.responseTime}ms`,
        "warning",
        monitoringConfig.notificationChannels,
      )
    }

    // 检查错误
    if (!result.success) {
      this.sendAlert(
        configId,
        apiConfig,
        `API请求失败: ${result.endpoint} - ${result.error}`,
        "error",
        monitoringConfig.notificationChannels,
      )
    }

    // 检查可用性和错误率需要汇总数据，在getSummary中处理
    const summary = this.getSummary(configId)

    // 检查可用性
    if (
      monitoringConfig.alertThresholds.availability > 0 &&
      summary.availability < monitoringConfig.alertThresholds.availability
    ) {
      this.sendAlert(
        configId,
        apiConfig,
        `可用性低于阈值: ${summary.availability.toFixed(1)}% < ${monitoringConfig.alertThresholds.availability}%`,
        "error",
        monitoringConfig.notificationChannels,
      )
    }

    // 检查错误率
    if (
      monitoringConfig.alertThresholds.errorRate > 0 &&
      summary.errorRate > monitoringConfig.alertThresholds.errorRate
    ) {
      this.sendAlert(
        configId,
        apiConfig,
        `错误率高于阈值: ${summary.errorRate.toFixed(1)}% > ${monitoringConfig.alertThresholds.errorRate}%`,
        "error",
        monitoringConfig.notificationChannels,
      )
    }
  }

  /**
   * 发送警报
   */
  private sendAlert(
    configId: string,
    apiConfig: ApiConfig,
    message: string,
    severity: "info" | "warning" | "error",
    channels: MonitoringConfig["notificationChannels"],
  ): void {
    console.log(`[${severity.toUpperCase()}] ${apiConfig.name}: ${message}`)

    // 浏览器通知
    if (channels.browser && typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(`${apiConfig.name} - ${severity.toUpperCase()}`, {
          body: message,
          icon: "/favicon.ico",
        })
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission()
      }
    }

    // 在实际应用中，这里应该实现电子邮件和Webhook通知
    // 这里仅作为示例
    if (channels.email && channels.email.length > 0) {
      console.log(`发送电子邮件警报到: ${channels.email.join(", ")}`)
    }

    if (channels.webhook) {
      console.log(`发送Webhook警报到: ${channels.webhook}`)
    }
  }

  /**
   * 获取监控结果
   */
  getResults(configId: string): MonitoringResult[] {
    return this.monitoringResults[configId] || []
  }

  /**
   * 获取监控摘要
   */
  getSummary(configId: string): MonitoringSummary {
    const results = this.monitoringResults[configId] || []

    if (results.length === 0) {
      return {
        availability: 100,
        avgResponseTime: 0,
        errorRate: 0,
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
      }
    }

    const totalRequests = results.length
    const successfulRequests = results.filter((r) => r.success).length
    const failedRequests = totalRequests - successfulRequests

    const availability = (successfulRequests / totalRequests) * 100
    const errorRate = (failedRequests / totalRequests) * 100

    const avgResponseTime =
      results.reduce((sum, r) => sum + (r.success ? r.responseTime : 0), 0) / (successfulRequests || 1)

    return {
      availability,
      avgResponseTime,
      errorRate,
      totalRequests,
      successfulRequests,
      failedRequests,
    }
  }

  /**
   * 获取监控状态
   */
  getStatus(configId: string): "online" | "degraded" | "offline" | "unknown" {
    const results = this.monitoringResults[configId] || []

    if (results.length === 0) {
      return "unknown"
    }

    // 获取最近的10个结果或全部结果
    const recentResults = results.slice(-10)
    const successRate = recentResults.filter((r) => r.success).length / recentResults.length

    if (successRate >= 0.9) {
      return "online"
    } else if (successRate >= 0.5) {
      return "degraded"
    } else {
      return "offline"
    }
  }

  /**
   * 清除监控结果
   */
  clearResults(configId: string): void {
    this.monitoringResults[configId] = []
  }
}

// 导出全局监控服务实例
export const monitoringService = new MonitoringService()
