import { DIApiClient } from "@/lib/api-binding/core/di-api-client"
import { ApiServiceProvider } from "@/lib/api-binding/core/service-provider"
import { container } from "@/lib/di/container"
import { describe, beforeAll, afterAll, test, jest, expect } from "@jest/globals"

// 负载测试配置
const USERS = 100 // 模拟用户数
const REQUESTS_PER_USER = 50 // 每个用户的请求数
const MAX_CONCURRENT_USERS = 20 // 最大并发用户数

// 模拟服务器响应
const mockFetch = (responseData: any, delay = 0) => {
  global.fetch = jest.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          json: jest.fn().mockResolvedValue(responseData),
          text: jest.fn().mockResolvedValue(JSON.stringify(responseData)),
        })
      }, delay)
    })
  })
}

// 模拟用户会话
async function simulateUserSession(userId: number, requestCount: number) {
  // 创建客户端
  const client = new DIApiClient({
    config: {
      baseUrl: "https://api.example.com",
      timeout: 10000,
    },
    auth: {
      type: "bearer",
      enabled: true,
      token: `user-${userId}-token`,
    },
  })

  const results = {
    userId,
    requestCount: 0,
    successCount: 0,
    errorCount: 0,
    totalTime: 0,
  }

  const startTime = Date.now()

  for (let i = 0; i < requestCount; i++) {
    try {
      // 随机选择请求类型
      const requestType = Math.floor(Math.random() * 5)

      switch (requestType) {
        case 0:
          await client.get(`/users/${userId}`)
          break
        case 1:
          await client.get("/items", { queryParams: { page: 1, limit: 10 } })
          break
        case 2:
          await client.post("/items", { name: `Item ${i}`, userId })
          break
        case 3:
          await client.put(`/items/${i}`, { name: `Updated Item ${i}` })
          break
        case 4:
          await client.delete(`/items/${i}`)
          break
      }

      results.successCount++
    } catch (error) {
      results.errorCount++
    }

    results.requestCount++
  }

  results.totalTime = Date.now() - startTime
  return results
}

describe("API客户端负载测试", () => {
  beforeAll(() => {
    // 注册服务
    const provider = new ApiServiceProvider()
    provider.register(container)

    // 模拟响应
    mockFetch({ success: true }, 20) // 20ms延迟
  })

  afterAll(() => {
    container.clear()
  })

  test("模拟多用户负载", async () => {
    console.log(`开始负载测试:`)
    console.log(`用户数: ${USERS}`)
    console.log(`每用户请求数: ${REQUESTS_PER_USER}`)
    console.log(`最大并发用户数: ${MAX_CONCURRENT_USERS}`)

    const startTime = Date.now()
    const results = []

    // 分批处理用户，控制并发数
    for (let i = 0; i < USERS; i += MAX_CONCURRENT_USERS) {
      const userBatch = []
      const batchSize = Math.min(MAX_CONCURRENT_USERS, USERS - i)

      for (let j = 0; j < batchSize; j++) {
        userBatch.push(simulateUserSession(i + j, REQUESTS_PER_USER))
      }

      const batchResults = await Promise.all(userBatch)
      results.push(...batchResults)
    }

    const endTime = Date.now()
    const totalTime = endTime - startTime

    // 计算统计数据
    const totalRequests = results.reduce((sum, r) => sum + r.requestCount, 0)
    const successRequests = results.reduce((sum, r) => sum + r.successCount, 0)
    const errorRequests = results.reduce((sum, r) => sum + r.errorCount, 0)
    const avgUserTime = results.reduce((sum, r) => sum + r.totalTime, 0) / results.length
    const requestsPerSecond = (totalRequests / totalTime) * 1000

    console.log(`负载测试结果:`)
    console.log(`总请求数: ${totalRequests}`)
    console.log(`成功请求数: ${successRequests}`)
    console.log(`失败请求数: ${errorRequests}`)
    console.log(`总耗时: ${totalTime}ms`)
    console.log(`平均用户会话时间: ${avgUserTime.toFixed(2)}ms`)
    console.log(`每秒请求数: ${requestsPerSecond.toFixed(2)}`)

    expect(successRequests).toBe(totalRequests)
    expect(requestsPerSecond).toBeGreaterThan(10) // 确保每秒至少处理10个请求
  }, 300000) // 5分钟超时
})
