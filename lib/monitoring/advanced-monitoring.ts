import type { ApiConfig } from "@/lib/api-binding/config/config-types"
import { monitoringService, type MonitoringResult } from "@/lib/monitoring/monitoring-service"

export interface AdvancedMetrics {
  responseTimeP95: number // 95%响应时间
  responseTimeP99: number // 99%响应时间
  errorDistribution: Record<string, number> // 错误类型分布
  successRateByEndpoint: Record<string, number> // 各端点成功率
  responseTimeByEndpoint: Record<string, number> // 各端点平均响应时间
  requestsPerMinute: number // 每分钟请求数
  requestsPerHour: number // 每小时请求数
  peakConcurrentRequests: number // 峰值并发请求数
}

export interface AlertRule {
  id: string
  name: string
  description: string
  condition: AlertCondition
  actions: AlertAction[]
  enabled: boolean
  cooldownPeriod: number // 冷却期（分钟）
  lastTriggered?: string // 上次触发时间
}

export interface AlertCondition {
  type: "threshold" | "anomaly" | "trend" | "compound"
  metric: string
  operator: "gt" | "lt" | "eq" | "neq" | "gte" | "lte"
  value: number
  duration?: number // 持续时间（分钟）
  sensitivity?: number // 异常检测灵敏度
  compoundRules?: AlertCondition[] // 复合规则
  compoundOperator?: "and" | "or" // 复合规则操作符
}

export interface AlertAction {
  type: "email" | "webhook" | "notification" | "sms" | "custom"
  target: string
  template?: string
  customHandler?: (alert: AlertEvent) => Promise<void>
}

export interface AlertEvent {
  ruleId: string
  ruleName: string
  configId: string
  configName: string
  metric: string
  value: number
  threshold: number
  timestamp: string
  message: string
  severity: "info" | "warning" | "error" | "critical"
}

export class AdvancedMonitoringService {
  private alertRules: Record<string, AlertRule[]> = {}
  private alertHistory: Record<string, AlertEvent[]> = {}
  private metrics: Record<string, AdvancedMetrics> = {}

  /**
   * 计算高级指标
   */
  public calculateAdvancedMetrics(configId: string): AdvancedMetrics {
    const results = monitoringService.getResults(configId)

    if (!results || results.length === 0) {
      return this.getEmptyMetrics()
    }

    // 计算响应时间百分位数
    const successfulResults = results.filter((r) => r.success)
    const responseTimes = successfulResults.map((r) => r.responseTime).sort((a, b) => a - b)

    const p95Index = Math.floor(responseTimes.length * 0.95)
    const p99Index = Math.floor(responseTimes.length * 0.99)

    const responseTimeP95 =
      responseTimes.length > 0 ? responseTimes[p95Index] || responseTimes[responseTimes.length - 1] : 0
    const responseTimeP99 =
      responseTimes.length > 0 ? responseTimes[p99Index] || responseTimes[responseTimes.length - 1] : 0

    // 计算错误分布
    const errorDistribution: Record<string, number> = {}
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        const errorType = this.categorizeError(r)
        errorDistribution[errorType] = (errorDistribution[errorType] || 0) + 1
      })

    // 计算各端点指标
    const endpointMetrics: Record<string, { success: number; total: number; responseTime: number }> = {}

    results.forEach((r) => {
      const endpoint = r.endpoint || "default"

      if (!endpointMetrics[endpoint]) {
        endpointMetrics[endpoint] = { success: 0, total: 0, responseTime: 0 }
      }

      endpointMetrics[endpoint].total++

      if (r.success) {
        endpointMetrics[endpoint].success++
        endpointMetrics[endpoint].responseTime += r.responseTime
      }
    })

    // 计算各端点成功率和平均响应时间
    const successRateByEndpoint: Record<string, number> = {}
    const responseTimeByEndpoint: Record<string, number> = {}

    Object.entries(endpointMetrics).forEach(([endpoint, metrics]) => {
      successRateByEndpoint[endpoint] = metrics.total > 0 ? (metrics.success / metrics.total) * 100 : 100
      responseTimeByEndpoint[endpoint] = metrics.success > 0 ? metrics.responseTime / metrics.success : 0
    })

    // 计算请求频率
    const timestamps = results.map((r) => new Date(r.timestamp).getTime())
    const oldestTimestamp = Math.min(...timestamps)
    const newestTimestamp = Math.max(...timestamps)
    const timeRangeMinutes = (newestTimestamp - oldestTimestamp) / (1000 * 60) || 1

    const requestsPerMinute = results.length / timeRangeMinutes
    const requestsPerHour = requestsPerMinute * 60

    // 计算峰值并发请求数（简化模拟）
    const peakConcurrentRequests = Math.max(
      1,
      Math.ceil(results.length / timeRangeMinutes / 10), // 简化计算，实际应该分析请求时间分布
    )

    // 保存并返回指标
    const metrics: AdvancedMetrics = {
      responseTimeP95,
      responseTimeP99,
      errorDistribution,
      successRateByEndpoint,
      responseTimeByEndpoint,
      requestsPerMinute,
      requestsPerHour,
      peakConcurrentRequests,
    }

    this.metrics[configId] = metrics
    return metrics
  }

  /**
   * 获取空指标对象
   */
  private getEmptyMetrics(): AdvancedMetrics {
    return {
      responseTimeP95: 0,
      responseTimeP99: 0,
      errorDistribution: {},
      successRateByEndpoint: {},
      responseTimeByEndpoint: {},
      requestsPerMinute: 0,
      requestsPerHour: 0,
      peakConcurrentRequests: 0,
    }
  }

  /**
   * 分类错误
   */
  private categorizeError(result: MonitoringResult): string {
    if (!result.error) return "未知错误"

    if (result.error.includes("timeout") || result.error.includes("超时")) {
      return "请求超时"
    } else if (result.error.includes("network") || result.error.includes("网络")) {
      return "网络错误"
    } else if (result.status >= 400 && result.status < 500) {
      return "客户端错误"
    } else if (result.status >= 500) {
      return "服务器错误"
    } else {
      return "其他错误"
    }
  }

  /**
   * 添加警报规则
   */
  public addAlertRule(configId: string, rule: AlertRule): void {
    if (!this.alertRules[configId]) {
      this.alertRules[configId] = []
    }

    this.alertRules[configId].push(rule)
  }

  /**
   * 删除警报规则
   */
  public removeAlertRule(configId: string, ruleId: string): void {
    if (this.alertRules[configId]) {
      this.alertRules[configId] = this.alertRules[configId].filter((r) => r.id !== ruleId)
    }
  }

  /**
   * 获取警报规则
   */
  public getAlertRules(configId: string): AlertRule[] {
    return this.alertRules[configId] || []
  }

  /**
   * 获取警报历史
   */
  public getAlertHistory(configId: string): AlertEvent[] {
    return this.alertHistory[configId] || []
  }

  /**
   * 评估警报规则
   */
  public evaluateAlertRules(configId: string, apiConfig: ApiConfig): void {
    const rules = this.alertRules[configId] || []
    const metrics = this.calculateAdvancedMetrics(configId)
    const now = new Date()

    rules.forEach((rule) => {
      if (!rule.enabled) return

      // 检查冷却期
      if (rule.lastTriggered) {
        const lastTriggered = new Date(rule.lastTriggered)
        const cooldownMinutes = (now.getTime() - lastTriggered.getTime()) / (1000 * 60)

        if (cooldownMinutes < rule.cooldownPeriod) {
          return
        }
      }

      // 评估条件
      const triggered = this.evaluateCondition(rule.condition, metrics)

      if (triggered) {
        // 创建警报事件
        const alertEvent: AlertEvent = {
          ruleId: rule.id,
          ruleName: rule.name,
          configId,
          configName: apiConfig.name,
          metric: rule.condition.metric,
          value: this.getMetricValue(rule.condition.metric, metrics),
          threshold: rule.condition.value,
          timestamp: now.toISOString(),
          message: rule.description || `警报规则 "${rule.name}" 已触发`,
          severity: this.determineSeverity(rule),
        }

        // 记录警报历史
        if (!this.alertHistory[configId]) {
          this.alertHistory[configId] = []
        }

        this.alertHistory[configId].push(alertEvent)

        // 限制历史记录数量
        if (this.alertHistory[configId].length > 100) {
          this.alertHistory[configId] = this.alertHistory[configId].slice(-100)
        }

        // 执行警报动作
        this.executeAlertActions(alertEvent, rule.actions)

        // 更新上次触发时间
        rule.lastTriggered = now.toISOString()
      }
    })
  }

  /**
   * 评估警报条件
   */
  private evaluateCondition(condition: AlertCondition, metrics: AdvancedMetrics): boolean {
    if (condition.type === "compound" && condition.compoundRules) {
      const results = condition.compoundRules.map((rule) => this.evaluateCondition(rule, metrics))

      return condition.compoundOperator === "and" ? results.every(Boolean) : results.some(Boolean)
    }

    const value = this.getMetricValue(condition.metric, metrics)

    switch (condition.operator) {
      case "gt":
        return value > condition.value
      case "lt":
        return value < condition.value
      case "eq":
        return value === condition.value
      case "neq":
        return value !== condition.value
      case "gte":
        return value >= condition.value
      case "lte":
        return value <= condition.value
      default:
        return false
    }
  }

  /**
   * 获取指标值
   */
  private getMetricValue(metricPath: string, metrics: AdvancedMetrics): number {
    const parts = metricPath.split(".")
    let value: any = metrics

    for (const part of parts) {
      if (value && typeof value === "object" && part in value) {
        value = value[part]
      } else {
        return 0
      }
    }

    return typeof value === "number" ? value : 0
  }

  /**
   * 确定警报严重性
   */
  private determineSeverity(rule: AlertRule): "info" | "warning" | "error" | "critical" {
    // 这里可以根据规则或条件确定严重性
    // 简化实现，实际应用中可以更复杂
    const metric = rule.condition.metric

    if (metric.includes("error") || metric.includes("fail")) {
      return "critical"
    } else if (metric.includes("response") && rule.condition.operator === "gt") {
      return "error"
    } else {
      return "warning"
    }
  }

  /**
   * 执行警报动作
   */
  private async executeAlertActions(alert: AlertEvent, actions: AlertAction[]): Promise<void> {
    for (const action of actions) {
      try {
        switch (action.type) {
          case "email":
            console.log(`发送电子邮件警报到: ${action.target}`, alert)
            // 实际应用中应该实现真实的电子邮件发送
            break

          case "webhook":
            await fetch(action.target, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(alert),
            })
            break

          case "notification":
            if (typeof window !== "undefined" && "Notification" in window) {
              if (Notification.permission === "granted") {
                new Notification(`${alert.severity.toUpperCase()}: ${alert.ruleName}`, {
                  body: alert.message,
                  icon: "/favicon.ico",
                })
              }
            }
            break

          case "custom":
            if (action.customHandler) {
              await action.customHandler(alert)
            }
            break
        }
      } catch (error) {
        console.error(`执行警报动作失败: ${action.type}`, error)
      }
    }
  }

  /**
   * 创建默认警报规则
   */
  public createDefaultAlertRules(configId: string): AlertRule[] {
    const rules: AlertRule[] = [
      {
        id: `${configId}-response-time`,
        name: "响应时间过高",
        description: "API响应时间超过阈值",
        condition: {
          type: "threshold",
          metric: "responseTimeP95",
          operator: "gt",
          value: 1000,
        },
        actions: [{ type: "notification", target: "browser" }],
        enabled: true,
        cooldownPeriod: 15,
      },
      {
        id: `${configId}-error-rate`,
        name: "错误率过高",
        description: "API错误率超过阈值",
        condition: {
          type: "threshold",
          metric: "errorRate",
          operator: "gt",
          value: 5,
        },
        actions: [{ type: "notification", target: "browser" }],
        enabled: true,
        cooldownPeriod: 15,
      },
      {
        id: `${configId}-availability`,
        name: "可用性过低",
        description: "API可用性低于阈值",
        condition: {
          type: "threshold",
          metric: "availability",
          operator: "lt",
          value: 95,
        },
        actions: [{ type: "notification", target: "browser" }],
        enabled: true,
        cooldownPeriod: 15,
      },
    ]

    // 添加规则
    rules.forEach((rule) => this.addAlertRule(configId, rule))

    return rules
  }
}

// 导出全局高级监控服务实例
export const advancedMonitoringService = new AdvancedMonitoringService()
