import { DIApiClient } from "../core/di-api-client"
import { ApiServiceProvider } from "../core/service-provider"
import { container } from "@/lib/di/container"
import type { ApiConfiguration } from "../config/config-types"
import type { AuthConfiguration } from "../auth/auth-types"
import { jest } from "@jest/globals"

// 在测试前设置服务
beforeAll(() => {
  // 注册服务
  const provider = new ApiServiceProvider()
  provider.register(container)
})

// 在测试后清理
afterAll(() => {
  container.clear()
})

// 模拟服务器响应
const mockFetch = (responseData: any, status = 200, headers = {}) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    headers: new Headers({
      "Content-Type": "application/json",
      ...headers,
    }),
    json: jest.fn().mockResolvedValue(responseData),
    text: jest.fn().mockResolvedValue(JSON.stringify(responseData)),
  })
}

describe("API客户端集成测试", () => {
  let client: DIApiClient

  beforeEach(() => {
    // 创建API配置
    const config: ApiConfiguration = {
      baseUrl: "https://api.example.com",
      timeout: 5000,
    }

    // 创建认证配置
    const authConfig: AuthConfiguration = {
      type: "bearer",
      enabled: true,
      token: "test-token",
    }

    // 创建客户端
    client = new DIApiClient({
      config,
      auth: authConfig,
    })

    // 重置fetch模拟
    jest.resetAllMocks()
  })

  test("应正确发送GET请求", async () => {
    const mockData = { id: 1, name: "测试用户" }
    mockFetch(mockData)

    const response = await client.get("/users/1")

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com/users/1",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      }),
    )

    expect(response.status).toBe(200)
    expect(response.data).toEqual(mockData)
  })

  test("应正确发送带查询参数的GET请求", async () => {
    const mockData = { items: [{ id: 1 }, { id: 2 }] }
    mockFetch(mockData)

    const response = await client.get("/users", {
      queryParams: { page: 1, limit: 10 },
    })

    expect(global.fetch).toHaveBeenCalledWith("https://api.example.com/users?page=1&limit=10", expect.anything())

    expect(response.data).toEqual(mockData)
  })

  test("应正确发送POST请求", async () => {
    const requestData = { name: "新用户", email: "new@example.com" }
    const mockData = { id: 3, ...requestData }
    mockFetch(mockData)

    const response = await client.post("/users", requestData)

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com/users",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        }),
        body: JSON.stringify(requestData),
      }),
    )

    expect(response.data).toEqual(mockData)
  })

  test("应正确处理错误响应", async () => {
    const errorData = { error: "用户未找到", code: "NOT_FOUND" }
    mockFetch(errorData, 404)

    await expect(client.get("/users/999")).rejects.toThrow()
  })

  test("应正确应用数据映射", async () => {
    const apiData = {
      user_id: 1,
      user_name: "测试用户",
      user_email: "test@example.com",
    }
    mockFetch(apiData)

    const response = await client.get("/users/1", {
      mapping: {
        user_id: "id",
        user_name: "name",
        user_email: "email",
      },
    })

    expect(response.data).toEqual({
      id: 1,
      name: "测试用户",
      email: "test@example.com",
    })
  })

  test("应正确处理超时", async () => {
    // 模拟请求超时
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("请求超时"))
        }, 100)
      })
    })

    // 设置较短的超时时间
    const timeoutClient = new DIApiClient({
      config: {
        baseUrl: "https://api.example.com",
        timeout: 50,
      },
      auth: {
        type: "bearer",
        enabled: true,
        token: "test-token",
      },
    })

    await expect(timeoutClient.get("/users/1")).rejects.toThrow()
  })
})
