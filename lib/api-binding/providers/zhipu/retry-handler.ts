/**
 * 智谱AI API重试处理工具
 */
import { ZhipuErrorType, parseZhipuError } from "./error-handler"

// 重试配置接口
export interface RetryConfig {
  maxRetries: number
  initialDelayMs: number
  maxDelayMs: number
  backoffFactor: number
  retryableErrorTypes: ZhipuErrorType[]
}

// 默认重试配置
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffFactor: 2,
  retryableErrorTypes: [
    ZhipuErrorType.RATE_LIMIT,
    ZhipuErrorType.SERVER_ERROR,
    ZhipuErrorType.TIMEOUT,
    ZhipuErrorType.NETWORK,
  ],
}

/**
 * 计算重试延迟时间（指数退避策略）
 * @param retryCount 当前重试次数
 * @param config 重试配置
 * @returns 延迟时间（毫秒）
 */
export function calculateRetryDelay(retryCount: number, config: RetryConfig = DEFAULT_RETRY_CONFIG): number {
  // 基础延迟 * 退避因子^重试次数 + 随机抖动
  const delay = config.initialDelayMs * Math.pow(config.backoffFactor, retryCount)

  // 添加随机抖动（0-100ms）以避免多个客户端同时重试
  const jitter = Math.random() * 100

  // 确保不超过最大延迟
  return Math.min(delay + jitter, config.maxDelayMs)
}

/**
 * 判断错误是否可重试
 * @param error 捕获的错误
 * @param config 重试配置
 * @returns 是否可重试
 */
export function isRetryableError(error: any, config: RetryConfig = DEFAULT_RETRY_CONFIG): boolean {
  const errorDetails = parseZhipuError(error)

  // 如果错误类型在可重试列表中，则可重试
  return errorDetails.retryable && config.retryableErrorTypes.includes(errorDetails.type)
}

/**
 * 使用重试逻辑执行异步函数
 * @param fn 要执行的异步函数
 * @param config 重试配置
 * @returns 函数执行结果的Promise
 */
export async function withRetry<T>(fn: () => Promise<T>, config: RetryConfig = DEFAULT_RETRY_CONFIG): Promise<T> {
  let retryCount = 0

  while (true) {
    try {
      return await fn()
    } catch (error) {
      // 判断是否已达到最大重试次数或错误不可重试
      if (retryCount >= config.maxRetries || !isRetryableError(error, config)) {
        throw error
      }

      // 计算延迟时间
      const delayMs = calculateRetryDelay(retryCount, config)

      // 记录重试信息
      console.warn(`智谱AI API请求失败，将在${delayMs}ms后重试 (${retryCount + 1}/${config.maxRetries})`, error)

      // 等待后重试
      await new Promise((resolve) => setTimeout(resolve, delayMs))

      // 增加重试计数
      retryCount++
    }
  }
}
