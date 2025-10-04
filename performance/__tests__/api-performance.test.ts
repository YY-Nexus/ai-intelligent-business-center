import { DIApiClient } from "@/lib/api-binding/core/di-api-client"
import { ApiServiceProvider } from "@/lib/api-binding/core/service-provider"
import { container } from "@/lib/di/container"
import { jest } from "@jest/globals"

// 性能测试配置
const ITERATIONS = 100
const CONCURRENT_REQUESTS = 10

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

describe("API客户端性能测试", () => {
  let client: DIApiClient

  beforeAll(() => {
    // 注册服务
    const provider = new ApiServiceProvider()
    provider.register(container)

    // 创建客户端
    client = new DIApiClient({
      config: {
        baseUrl: "https://api.example.com",
        timeout: 10000,
      },
      auth: {
        type: "bearer",
        enabled: true,
        token: "test-token",
      },
    })
  })

  afterAll(() => {
    container.clear()
  })

  test("顺序请求性能", async () => {
    const mockData = { id: 1, name: "测试用户" }
    mockFetch(mockData, 10) // 10ms延迟

    const startTime = Date.now()

    for (let i = 0; i < ITERATIONS; i++) {
      await client.get("/users/1")
    }

    const endTime = Date.now()
    const totalTime = endTime - startTime
    const avgTime = totalTime / ITERATIONS

    console.log(`顺序请求性能:`)
    console.log(`总请求数: ${ITERATIONS}`)
    console.log(`总耗时: ${totalTime}ms`)
    console.log(`平均请求时间: ${avgTime.toFixed(2)}ms`)

    expect(avgTime).toBeLessThan(50) // 确保平均请求时间在可接受范围内
  }, 30000)

  test("并发请求性能", async () => {
    const mockData = { id: 1, name: "测试用户" }
    mockFetch(mockData, 10) // 10ms延迟

    const startTime = Date.now()

    // 创建并发请求批次
    const batches = Math.ceil(ITERATIONS / CONCURRENT_REQUESTS)

    for (let batch = 0; batch < batches; batch++) {
      const requests = []
      const remaining = Math.min(CONCURRENT_REQUESTS, ITERATIONS - batch * CONCURRENT_REQUESTS)

      for (let i = 0; i < remaining; i++) {
        requests.push(client.get("/users/1"))
      }

      await Promise.all(requests)
    }

    const endTime = Date.now()
    const totalTime = endTime - startTime
    const avgTime = totalTime / ITERATIONS

    console.log(`并发请求性能:`)
    console.log(`总请求数: ${ITERATIONS}`)
    console.log(`并发数: ${CONCURRENT_REQUESTS}`)
    console.log(`总耗时: ${totalTime}ms`)
    console.log(`平均请求时间: ${avgTime.toFixed(2)}ms`)

    expect(avgTime).toBeLessThan(20) // 并发请求应该更快
  }, 30000)

  test("大数据负载性能", async () => {
    // 创建大型数据负载
    const largeData = {
      items: Array(1000)
        .fill(0)
        .map((_, i) => ({
          id: i,
          name: `Item ${i}`,
          description: `This is a description for item ${i}. It contains some text to increase the payload size.`,
          metadata: {
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            tags: ["tag1", "tag2", "tag3"],
          },
        })),
    }

    mockFetch(largeData, 20) // 20ms延迟

    const startTime = Date.now()

    for (let i = 0; i < 10; i++) {
      // 减少迭代次数，因为数据量大
      await client.get("/items")
    }

    const endTime = Date.now()
    const totalTime = endTime - startTime
    const avgTime = totalTime / 10

    console.log(`大数据负载性能:`)
    console.log(`总请求数: 10`)
    console.log(`数据项数量: 1000`)
    console.log(`总耗时: ${totalTime}ms`)
    console.log(`平均请求时间: ${avgTime.toFixed(2)}ms`)

    expect(avgTime).toBeLessThan(100) // 大数据负载请求可能需要更多时间
  }, 30000)

  test("错误处理性能", async () => {
    // 模拟错误响应
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("模拟网络错误"))
        }, 10)
      })
    })

    const startTime = Date.now()
    let errorCount = 0

    for (let i = 0; i < ITERATIONS; i++) {
      try {
        await client.get("/error-endpoint")
      } catch (error) {
        errorCount++
      }
    }

    const endTime = Date.now()
    const totalTime = endTime - startTime
    const avgTime = totalTime / ITERATIONS

    console.log(`错误处理性能:`)
    console.log(`总请求数: ${ITERATIONS}`)
    console.log(`错误数: ${errorCount}`)
    console.log(`总耗时: ${totalTime}ms`)
    console.log(`平均错误处理时间: ${avgTime.toFixed(2)}ms`)

    expect(errorCount).toBe(ITERATIONS)
    expect(avgTime).toBeLessThan(50) // 确保错误处理性能在可接受范围内
  }, 30000)
})
