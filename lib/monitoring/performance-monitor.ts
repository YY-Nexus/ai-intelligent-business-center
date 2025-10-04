/**
 * 性能监控服务
 * 用于收集和分析API性能指标
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetric[] = []
  private thresholds: PerformanceThresholds = {
    responseTime: 1000, // 默认响应时间阈值：1秒
    errorRate: 5, // 默认错误率阈值：5%
    timeoutRate: 2, // 默认超时率阈值：2%
  }
  private listeners: PerformanceListener[] = []
  private isAlerting = false
  private alertCooldown = 60000 // 警报冷却时间：1分钟

  private constructor() {
    // 私有构造函数，确保单例
  }

  /**
   * 获取PerformanceMonitor实例
   */
  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  /**
   * 设置性能阈值
   */
  public setThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds }
  }

  /**
   * 添加性能监听器
   */
  public addListener(listener: PerformanceListener): void {
    this.listeners.push(listener)
  }

  /**
   * 移除性能监听器
   */
  public removeListener(listener: PerformanceListener): void {
    const index = this.listeners.indexOf(listener)
    if (index !== -1) {
      this.listeners.splice(index, 1)
    }
  }

  /**
   * 记录API请求性能指标
   */
  public recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric)

    // 保留最近1000条记录
    if (this.metrics.length > 1000) {
      this.metrics.shift()
    }

    // 分析性能并触发监听器
    this.analyzePerformance()
  }

  /**
   * 开始记录请求
   * 返回一个用于结束记录的函数
   */
  public startRecording(endpoint: string, method: string): () => void {
    const startTime = performance.now()
    const requestId = this.generateRequestId()

    return (status?: number, error?: Error) => {
      const endTime = performance.now()
      const duration = endTime - startTime

      this.recordMetric({
        requestId,
        endpoint,
        method,
        startTime,
        endTime,
        duration,
        status: status || 0,
        error: error ? error.message : undefined,
        timestamp: new Date(),
      })
    }
  }

  /**
   * 获取性能指标
   */
  public getMetrics(options?: {
    endpoint?: string
    method?: string
    timeRange?: [Date, Date]
    limit?: number
  }): PerformanceMetric[] {
    let filteredMetrics = [...this.metrics]

    // 按端点筛选
    if (options?.endpoint) {
      filteredMetrics = filteredMetrics.filter((m) => m.endpoint === options.endpoint)
    }

    // 按方法筛选
    if (options?.method) {
      filteredMetrics = filteredMetrics.filter((m) => m.method === options.method)
    }

    // 按时间范围筛选
    if (options?.timeRange) {
      const [start, end] = options.timeRange
      filteredMetrics = filteredMetrics.filter((m) => m.timestamp >= start && m.timestamp <= end)
    }

    // 按限制数量筛选
    if (options?.limit) {
      filteredMetrics = filteredMetrics.slice(-options.limit)
    }

    return filteredMetrics
  }

  /**
   * 获取性能统计数据
   */
  public getStatistics(options?: {
    endpoint?: string
    method?: string
    timeRange?: [Date, Date]
  }): PerformanceStatistics {
    const metrics = this.getMetrics(options)

    if (metrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        errorCount: 0,
        errorRate: 0,
        timeoutCount: 0,
        timeoutRate: 0,
        statusCodes: {},
      }
    }

    // 计算响应时间统计
    const responseTimes = metrics.map((m) => m.duration).sort((a, b) => a - b)
    const totalResponseTime = responseTimes.reduce((sum, time) => sum + time, 0)

    // 计算错误和超时
    const errorCount = metrics.filter((m) => m.error || (m.status >= 400 && m.status < 600)).length
    const timeoutCount = metrics.filter((m) => m.error?.includes("timeout") || m.status === 408).length

    // 计算状态码分布
    const statusCodes: Record<number, number> = {}
    metrics.forEach((m) => {
      if (m.status) {
        statusCodes[m.status] = (statusCodes[m.status] || 0) + 1
      }
    })

    // 计算百分位数
    const p95Index = Math.floor(responseTimes.length * 0.95)
    const p99Index = Math.floor(responseTimes.length * 0.99)

    return {
      totalRequests: metrics.length,
      averageResponseTime: totalResponseTime / metrics.length,
      minResponseTime: responseTimes[0],
      maxResponseTime: responseTimes[responseTimes.length - 1],
      p95ResponseTime: responseTimes[p95Index] || responseTimes[responseTimes.length - 1],
      p99ResponseTime: responseTimes[p99Index] || responseTimes[responseTimes.length - 1],
      errorCount,
      errorRate: (errorCount / metrics.length) * 100,
      timeoutCount,
      timeoutRate: (timeoutCount / metrics.length) * 100,
      statusCodes,
    }
  }

  /**
   * 清除所有指标数据
   */
  public clearMetrics(): void {
    this.metrics = []
  }

  /**
   * 导出性能数据
   */
  public exportData(): PerformanceExportData {
    return {
      metrics: this.metrics,
      thresholds: this.thresholds,
      timestamp: new Date(),
    }
  }

  /**
   * 导入性能数据
   */
  public importData(data: PerformanceExportData): void {
    this.metrics = data.metrics
    this.thresholds = data.thresholds
  }

  /**
   * 分析性能并触发监听器
   */
  private analyzePerformance(): void {
    // 获取最近5分钟的指标
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const recentMetrics = this.getMetrics({
      timeRange: [fiveMinutesAgo, new Date()],
    })

    if (recentMetrics.length === 0) {
      return
    }

    // 计算统计数据
    const stats = this.getStatistics({
      timeRange: [fiveMinutesAgo, new Date()],
    })

    // 检查是否超过阈值
    const alerts: PerformanceAlert[] = []

    if (stats.averageResponseTime > this.thresholds.responseTime) {
      alerts.push({
        type: "responseTime",
        message: `平均响应时间(${stats.averageResponseTime.toFixed(2)}ms)超过阈值(${this.thresholds.responseTime}ms)`,
        value: stats.averageResponseTime,
        threshold: this.thresholds.responseTime,
      })
    }

    if (stats.errorRate > this.thresholds.errorRate) {
      alerts.push({
        type: "errorRate",
        message: `错误率(${stats.errorRate.toFixed(2)}%)超过阈值(${this.thresholds.errorRate}%)`,
        value: stats.errorRate,
        threshold: this.thresholds.errorRate,
      })
    }

    if (stats.timeoutRate > this.thresholds.timeoutRate) {
      alerts.push({
        type: "timeoutRate",
        message: `超时率(${stats.timeoutRate.toFixed(2)}%)超过阈值(${this.thresholds.timeoutRate}%)`,
        value: stats.timeoutRate,
        threshold: this.thresholds.timeoutRate,
      })
    }

    // 如果有警报且不在冷却期，通知监听器
    if (alerts.length > 0 && !this.isAlerting) {
      this.isAlerting = true
      setTimeout(() => {
        this.isAlerting = false
      }, this.alertCooldown)

      // 通知所有监听器
      this.listeners.forEach((listener) => {
        if (listener.onAlert) {
          listener.onAlert(alerts, stats)
        }
      })
    }

    // 通知所有监听器更新统计数据
    this.listeners.forEach((listener) => {
      if (listener.onStatsUpdate) {
        listener.onStatsUpdate(stats)
      }
    })
  }

  /**
   * 生成唯一请求ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }
}

/**
 * 性能指标接口
 */
export interface PerformanceMetric {
  requestId: string
  endpoint: string
  method: string
  startTime: number
  endTime: number
  duration: number
  status: number
  error?: string
  timestamp: Date
}

/**
 * 性能统计接口
 */
export interface PerformanceStatistics {
  totalRequests: number
  averageResponseTime: number
  minResponseTime: number
  maxResponseTime: number
  p95ResponseTime: number
  p99ResponseTime: number
  errorCount: number
  errorRate: number
  timeoutCount: number
  timeoutRate: number
  statusCodes: Record<number, number>
}

/**
 * 性能阈值接口
 */
export interface PerformanceThresholds {
  responseTime: number // 毫秒
  errorRate: number // 百分比
  timeoutRate: number // 百分比
}

/**
 * 性能警报接口
 */
export interface PerformanceAlert {
  type: "responseTime" | "errorRate" | "timeoutRate"
  message: string
  value: number
  threshold: number
}

/**
 * 性能监听器接口
 */
export interface PerformanceListener {
  onAlert?: (alerts: PerformanceAlert[], stats: PerformanceStatistics) => void
  onStatsUpdate?: (stats: PerformanceStatistics) => void
}

/**
 * 性能导出数据接口
 */
export interface PerformanceExportData {
  metrics: PerformanceMetric[]
  thresholds: PerformanceThresholds
  timestamp: Date
}
