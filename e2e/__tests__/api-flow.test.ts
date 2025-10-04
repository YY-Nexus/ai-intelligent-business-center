import { DIApiClient } from "@/lib/api-binding/core/di-api-client"
import { ApiServiceProvider } from "@/lib/api-binding/core/service-provider"
import { container } from "@/lib/di/container"
import { jest } from "@jest/globals"

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

describe("API流程端到端测试", () => {
  beforeAll(() => {
    // 注册服务
    const provider = new ApiServiceProvider()
    provider.register(container)
  })

  afterAll(() => {
    container.clear()
  })

  test("完整的API交互流程", async () => {
    // 1. 创建客户端
    const client = new DIApiClient({
      config: {
        baseUrl: "https://api.example.com",
        timeout: 5000,
      },
      auth: {
        type: "bearer",
        enabled: true,
        token: "test-token",
      },
    })

    // 2. 模拟获取用户列表
    mockFetch({
      items: [
        { user_id: 1, user_name: "用户1" },
        { user_id: 2, user_name: "用户2" },
      ],
      total: 2,
    })

    const usersResponse = await client.get("/users", {
      mapping: {
        items: [
          {
            user_id: "id",
            user_name: "name",
          },
        ],
      },
    })

    expect(usersResponse.data.items).toHaveLength(2)
    expect(usersResponse.data.items[0].id).toBe(1)
    expect(usersResponse.data.items[0].name).toBe("用户1")

    // 3. 模拟创建新用户
    const newUser = {
      name: "新用户",
      email: "new@example.com",
    }

    mockFetch({
      user_id: 3,
      user_name: "新用户",
      user_email: "new@example.com",
      created_at: "2023-01-01T00:00:00Z",
    })

    const createResponse = await client.post("/users", newUser, {
      mapping: {
        user_id: "id",
        user_name: "name",
        user_email: "email",
        created_at: {
          key: "createdAt",
          transform: (value: string) => new Date(value),
        },
      },
    })

    expect(createResponse.data.id).toBe(3)
    expect(createResponse.data.name).toBe("新用户")
    expect(createResponse.data.createdAt).toBeInstanceOf(Date)

    // 4. 模拟获取用户详情
    mockFetch({
      user_id: 3,
      user_name: "新用户",
      user_email: "new@example.com",
      created_at: "2023-01-01T00:00:00Z",
      profile: {
        avatar: "https://example.com/avatar.jpg",
        bio: "这是一个新用户",
      },
    })

    const userResponse = await client.get("/users/3", {
      mapping: {
        user_id: "id",
        user_name: "name",
        user_email: "email",
        created_at: {
          key: "createdAt",
          transform: (value: string) => new Date(value),
        },
        profile: {
          avatar: "avatarUrl",
          bio: "biography",
        },
      },
    })

    expect(userResponse.data.id).toBe(3)
    expect(userResponse.data.avatarUrl).toBe("https://example.com/avatar.jpg")
    expect(userResponse.data.biography).toBe("这是一个新用户")

    // 5. 模拟更新用户
    const updateData = {
      name: "更新的用户",
      biography: "已更新的简介",
    }

    mockFetch({
      user_id: 3,
      user_name: "更新的用户",
      user_email: "new@example.com",
      profile: {
        avatar: "https://example.com/avatar.jpg",
        bio: "已更新的简介",
      },
    })

    const updateResponse = await client.put("/users/3", updateData, {
      mapping: {
        user_id: "id",
        user_name: "name",
        user_email: "email",
        profile: {
          avatar: "avatarUrl",
          bio: "biography",
        },
      },
    })

    expect(updateResponse.data.name).toBe("更新的用户")
    expect(updateResponse.data.biography).toBe("已更新的简介")

    // 6. 模拟删除用户
    mockFetch({ success: true })

    const deleteResponse = await client.delete("/users/3")
    expect(deleteResponse.data.success).toBe(true)
  })
})
