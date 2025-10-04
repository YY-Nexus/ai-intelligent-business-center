// 监控服务类型定义
export interface MonitoringSettings {
  checkAvailability: boolean
  checkResponseTime: boolean
  checkStatusCode: boolean
  expectedStatusCode: number
  timeout: number // 毫秒
  alertThreshold: number // 毫秒
}

export interface MonitoringResult {
  timestamp: number
  configId: string
  available: boolean
  statusCode?: number
  responseTime: number
  error?: string
}

// 本地存储键
const STORAGE_KEY_PREFIX = "api-monitoring-"

// 监控服务
export class MonitoringService {
  // 检查端点
  static async checkEndpoint(
    configId: string,
    baseUrl: string,
    settings: MonitoringSettings,
  ): Promise<MonitoringResult> {
    const startTime = performance.now()
    const result: MonitoringResult = {
      timestamp: Date.now(),
      configId,
      available: false,
      responseTime: 0,
    }

    try {
      // 创建AbortController用于超时控制
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), settings.timeout)

      // 发送请求
      const response = await fetch(baseUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      })

      // 清除超时
      clearTimeout(timeoutId)

      // 计算响应时间
      const endTime = performance.now()
      result.responseTime = Math.round(endTime - startTime)
      result.statusCode = response.status
      result.available = true
    } catch (error) {
      // 计算响应时间（即使失败）
      const endTime = performance.now()
      result.responseTime = Math.round(endTime - startTime)

      // 设置错误信息
      if (error instanceof Error) {
        result.error = error.name === "AbortError" ? "请求超时" : error.message
      } else {
        result.error = "未知错误"
      }
    }

    return result
  }

  // 获取监控结果
  static getMonitoringResults(configId: string): MonitoringResult[] {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${configId}`
      const storedResults = localStorage.getItem(storageKey)
      return storedResults ? JSON.parse(storedResults) : []
    } catch (error) {
      console.error("获取监控结果失败:", error)
      return []
    }
  }

  // 保存监控结果
  static saveMonitoringResults(configId: string, results: MonitoringResult[]): boolean {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${configId}`
      localStorage.setItem(storageKey, JSON.stringify(results))
      return true
    } catch (error) {
      console.error("保存监控结果失败:", error)
      return false
    }
  }

  // 清除监控结果
  static clearMonitoringResults(configId: string): boolean {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${configId}`
      localStorage.removeItem(storageKey)
      return true
    } catch (error) {
      console.error("清除监控结果失败:", error)
      return false
    }
  }
}
