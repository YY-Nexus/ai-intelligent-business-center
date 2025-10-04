/**
 * 智谱AI API性能优化工具
 */
import { LRUCache } from "lru-cache"

// 缓存配置接口
export interface CacheConfig {
  maxSize: number
  ttl: number // 缓存生存时间（毫秒）
}

// 默认缓存配置
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  maxSize: 100,
  ttl: 5 * 60 * 1000, // 5分钟
}

// 缓存键生成器
export type CacheKeyGenerator<T> = (params: T) => string

/**
 * 创建LRU缓存实例
 * @param config 缓存配置
 * @returns LRU缓存实例
 */
export function createCache(config: CacheConfig = DEFAULT_CACHE_CONFIG) {
  return new LRUCache<string, any>({
    max: config.maxSize,
    ttl: config.ttl,
  })
}

// 全局缓存实例
const globalCache = createCache()

/**
 * 使用缓存执行异步函数
 * @param fn 要执行的异步函数
 * @param params 函数参数
 * @param keyGenerator 缓存键生成器
 * @param cache 缓存实例
 * @returns 函数执行结果的Promise
 */
export async function withCache<T, R>(
  fn: (params: T) => Promise<R>,
  params: T,
  keyGenerator: CacheKeyGenerator<T>,
  cache: LRUCache<string, any> = globalCache,
): Promise<R> {
  const cacheKey = keyGenerator(params)

  // 检查缓存
  const cachedResult = cache.get(cacheKey)
  if (cachedResult !== undefined) {
    console.log(`[智谱AI] 缓存命中: ${cacheKey}`)
    return cachedResult
  }

  // 执行函数
  const result = await fn(params)

  // 存入缓存
  cache.set(cacheKey, result)

  return result
}

/**
 * 批处理请求
 * @param requests 请求数组
 * @param batchFn 批处理函数
 * @param maxBatchSize 最大批处理大小
 * @returns 处理结果数组
 */
export async function batchRequests<T, R>(
  requests: T[],
  batchFn: (batch: T[]) => Promise<R[]>,
  maxBatchSize = 10,
): Promise<R[]> {
  const results: R[] = []

  // 分批处理
  for (let i = 0; i < requests.length; i += maxBatchSize) {
    const batch = requests.slice(i, i + maxBatchSize)
    const batchResults = await batchFn(batch)
    results.push(...batchResults)
  }

  return results
}

/**
 * 请求节流
 * @param fn 要执行的异步函数
 * @param maxRequestsPerMinute 每分钟最大请求数
 * @returns 节流后的函数
 */
export function throttleRequests<T, R>(
  fn: (params: T) => Promise<R>,
  maxRequestsPerMinute = 60,
): (params: T) => Promise<R> {
  const requestTimestamps: number[] = []
  const minInterval = 60000 / maxRequestsPerMinute

  return async (params: T): Promise<R> => {
    const now = Date.now()

    // 清理过期的时间戳
    while (requestTimestamps.length > 0 && now - requestTimestamps[0] > 60000) {
      requestTimestamps.shift()
    }

    // 检查是否超过速率限制
    if (requestTimestamps.length >= maxRequestsPerMinute) {
      const oldestTimestamp = requestTimestamps[0]
      const waitTime = 60000 - (now - oldestTimestamp)

      if (waitTime > 0) {
        console.log(`[智谱AI] 请求节流: 等待 ${waitTime}ms`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }
    }

    // 添加当前时间戳
    requestTimestamps.push(Date.now())

    // 执行函数
    return await fn(params)
  }
}

/**
 * 请求优化器
 * 结合缓存、重试和节流功能
 */
export class RequestOptimizer<T, R> {
  private fn: (params: T) => Promise<R>
  private keyGenerator: CacheKeyGenerator<T>
  private cache: LRUCache<string, any>
  private maxRequestsPerMinute: number

  constructor(
    fn: (params: T) => Promise<R>,
    keyGenerator: CacheKeyGenerator<T>,
    cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG,
    maxRequestsPerMinute = 60,
  ) {
    this.fn = fn
    this.keyGenerator = keyGenerator
    this.cache = createCache(cacheConfig)
    this.maxRequestsPerMinute = maxRequestsPerMinute
  }

  /**
   * 执行优化后的请求
   * @param params 请求参数
   * @returns 请求结果
   */
  async execute(params: T): Promise<R> {
    // 应用缓存
    const cacheKey = this.keyGenerator(params)
    const cachedResult = this.cache.get(cacheKey)

    if (cachedResult !== undefined) {
      return cachedResult
    }

    // 应用节流
    const throttledFn = throttleRequests(this.fn, this.maxRequestsPerMinute)

    // 应用重试（从retry-handler.ts导入）
    // const result = await withRetry(() => throttledFn(params))
    const result = await throttledFn(params)

    // 存入缓存
    this.cache.set(cacheKey, result)

    return result
  }

  /**
   * 清除缓存
   * @param params 如果提供，则只清除特定参数的缓存
   */
  clearCache(params?: T): void {
    if (params) {
      const cacheKey = this.keyGenerator(params)
      this.cache.delete(cacheKey)
    } else {
      this.cache.clear()
    }
  }
}
