import { toast } from "@/components/ui/use-toast"
import type {
  ApiResponse,
  Change,
  ImpactAnalysis,
  PaginationParams,
  FilterParams,
} from "../models/impact-analysis-types"

// 重试配置
interface RetryConfig {
  maxRetries: number
  retryDelay: number
  shouldRetry: (error: Error) => boolean
}

// 默认重试配置
const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  shouldRetry: (error: Error) => {
    // 只有网络错误或5xx错误才重试
    return error.message.includes("network") || error.message.includes("500") || error.message.includes("503")
  },
}

/**
 * 带重试功能的API请求
 */
async function fetchWithRetry<T>(
  url: string,
  options?: RequestInit,
  retryConfig: RetryConfig = defaultRetryConfig,
): Promise<T> {
  let retries = 0

  while (true) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP错误: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      const err = error as Error

      if (retries >= retryConfig.maxRetries || !retryConfig.shouldRetry(err)) {
        console.error("API请求失败:", err)
        throw err
      }

      // 增加重试延迟（指数退避）
      const delay = retryConfig.retryDelay * Math.pow(2, retries)
      console.log(`请求失败，${delay}ms后重试(${retries + 1}/${retryConfig.maxRetries})...`)
      await new Promise((resolve) => setTimeout(resolve, delay))
      retries++
    }
  }
}

/**
 * 构建查询字符串
 */
function buildQueryString(params?: Record<string, any>): string {
  if (!params) return ""

  const query = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&")

  return query ? `?${query}` : ""
}

/**
 * 获取变更列表
 */
export async function getChangesList(params?: PaginationParams & FilterParams): Promise<ApiResponse<Change[]>> {
  try {
    const queryString = buildQueryString(params)
    return await fetchWithRetry<ApiResponse<Change[]>>(`/api/impact/changes${queryString}`)
  } catch (error) {
    console.error("获取变更列表失败:", error)
    toast({
      title: "获取变更列表失败",
      description: (error as Error).message,
      variant: "destructive",
    })
    throw error
  }
}

/**
 * 获取变更详情
 */
export async function getChangeDetail(id: string): Promise<ApiResponse<Change>> {
  try {
    return await fetchWithRetry<ApiResponse<Change>>(`/api/impact/changes/${id}`)
  } catch (error) {
    console.error("获取变更详情失败:", error)
    toast({
      title: "获取变更详情失败",
      description: (error as Error).message,
      variant: "destructive",
    })
    throw error
  }
}

/**
 * 创建变更
 */
export async function createChange(
  change: Omit<Change, "id" | "createdAt" | "updatedAt">,
): Promise<ApiResponse<Change>> {
  try {
    return await fetchWithRetry<ApiResponse<Change>>("/api/impact/changes", {
      method: "POST",
      body: JSON.stringify(change),
    })
  } catch (error) {
    console.error("创建变更失败:", error)
    toast({
      title: "创建变更失败",
      description: (error as Error).message,
      variant: "destructive",
    })
    throw error
  }
}

/**
 * 更新变更
 */
export async function updateChange(id: string, change: Partial<Change>): Promise<ApiResponse<Change>> {
  try {
    return await fetchWithRetry<ApiResponse<Change>>(`/api/impact/changes/${id}`, {
      method: "PUT",
      body: JSON.stringify(change),
    })
  } catch (error) {
    console.error("更新变更失败:", error)
    toast({
      title: "更新变更失败",
      description: (error as Error).message,
      variant: "destructive",
    })
    throw error
  }
}

/**
 * 删除变更
 */
export async function deleteChange(id: string): Promise<ApiResponse<null>> {
  try {
    return await fetchWithRetry<ApiResponse<null>>(`/api/impact/changes/${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.error("删除变更失败:", error)
    toast({
      title: "删除变更失败",
      description: (error as Error).message,
      variant: "destructive",
    })
    throw error
  }
}

/**
 * 获取变更的影响分析
 */
export async function getImpactAnalysis(changeId: string | null): Promise<ApiResponse<ImpactAnalysis>> {
  if (!changeId) {
    return {
      success: false,
      data: {} as ImpactAnalysis,
      message: "未提供变更ID",
      timestamp: new Date().toISOString(),
    }
  }

  try {
    return await fetchWithRetry<ApiResponse<ImpactAnalysis>>(`/api/impact/analysis/${changeId}`)
  } catch (error) {
    console.error("获取影响分析失败:", error)
    toast({
      title: "获取影响分析失败",
      description: (error as Error).message,
      variant: "destructive",
    })
    throw error
  }
}

/**
 * 保存影响分析
 */
export async function saveImpactAnalysis(
  changeId: string,
  analysis: Omit<ImpactAnalysis, "id" | "changeId" | "createdAt" | "updatedAt">,
): Promise<ApiResponse<ImpactAnalysis>> {
  try {
    return await fetchWithRetry<ApiResponse<ImpactAnalysis>>(`/api/impact/analysis/${changeId}`, {
      method: "POST",
      body: JSON.stringify(analysis),
    })
  } catch (error) {
    console.error("保存影响分析失败:", error)
    toast({
      title: "保存影响分析失败",
      description: (error as Error).message,
      variant: "destructive",
    })
    throw error
  }
}

/**
 * 删除影响分析
 */
export async function deleteImpactAnalysis(changeId: string): Promise<ApiResponse<null>> {
  try {
    return await fetchWithRetry<ApiResponse<null>>(`/api/impact/analysis/${changeId}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.error("删除影响分析失败:", error)
    toast({
      title: "删除影响分析失败",
      description: (error as Error).message,
      variant: "destructive",
    })
    throw error
  }
}
