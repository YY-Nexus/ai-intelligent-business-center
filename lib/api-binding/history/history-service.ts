// API请求历史记录类型
export interface ApiRequestHistory {
  id: string
  configId: string
  timestamp: string
  method: string
  url: string
  path: string
  headers: Record<string, string>
  queryParams: Record<string, string>
  requestBody?: any
  responseStatus: number
  responseHeaders: Record<string, string>
  responseBody?: any
  duration: number
  error?: string
}

// 存储键
const API_HISTORY_KEY = "api-request-history"
const MAX_HISTORY_ITEMS = 100

/**
 * API请求历史服务
 * 提供API请求历史记录管理功能
 */
export class ApiHistoryService {
  // 获取所有历史记录
  public static getAllHistory(): ApiRequestHistory[] {
    try {
      const history = localStorage.getItem(API_HISTORY_KEY)
      return history ? JSON.parse(history) : []
    } catch (error) {
      console.error("获取API历史记录失败:", error)
      return []
    }
  }

  // 获取特定API的历史记录
  public static getHistoryByApiId(configId: string): ApiRequestHistory[] {
    const history = this.getAllHistory()
    return history.filter((item) => item.configId === configId)
  }

  // 添加历史记录
  public static addHistoryItem(item: ApiRequestHistory): boolean {
    try {
      const history = this.getAllHistory()

      // 添加新记录到开头
      history.unshift({
        ...item,
        id: `history-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toISOString(),
      })

      // 限制历史记录数量
      const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS)

      localStorage.setItem(API_HISTORY_KEY, JSON.stringify(trimmedHistory))
      return true
    } catch (error) {
      console.error("保存API历史记录失败:", error)
      return false
    }
  }

  // 清除历史记录
  public static clearHistory(configId?: string): boolean {
    try {
      if (configId) {
        // 清除特定API的历史记录
        const history = this.getAllHistory()
        const newHistory = history.filter((item) => item.configId !== configId)
        localStorage.setItem(API_HISTORY_KEY, JSON.stringify(newHistory))
      } else {
        // 清除所有历史记录
        localStorage.setItem(API_HISTORY_KEY, JSON.stringify([]))
      }
      return true
    } catch (error) {
      console.error("清除API历史记录失败:", error)
      return false
    }
  }

  // 删除单个历史记录
  public static deleteHistoryItem(id: string): boolean {
    try {
      const history = this.getAllHistory()
      const newHistory = history.filter((item) => item.id !== id)
      localStorage.setItem(API_HISTORY_KEY, JSON.stringify(newHistory))
      return true
    } catch (error) {
      console.error("删除API历史记录失败:", error)
      return false
    }
  }
}
