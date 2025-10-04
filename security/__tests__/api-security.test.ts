import fetch from "node-fetch"
import { describe, expect, test, beforeAll } from "@jest/globals"

// 导入安全测试配置和辅助函数
const { apiBaseUrl, adminCredentials, userCredentials, testTimeout } = global.securityConfig
const { randomString, sqlInjectionStrings, xssStrings, commandInjectionStrings } = global.securityHelpers

// 存储测试过程中的令牌
let adminToken: string
let userToken: string

describe("API安全测试", () => {
  beforeAll(async () => {
    // 获取管理员令牌
    const adminResponse = await fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: adminCredentials.username,
        password: adminCredentials.password,
      }),
    })

    const adminData = await adminResponse.json()
    adminToken = adminData.token

    // 获取普通用户令牌
    const userResponse = await fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userCredentials.username,
        password: userCredentials.password,
      }),
    })

    const userData = await userResponse.json()
    userToken = userData.token
  }, testTimeout)

  describe("认证和授权测试", () => {
    test("未认证请求应被拒绝", async () => {
      const response = await fetch(`${apiBaseUrl}/users`)
      expect(response.status).toBe(401)
    })

    test("使用无效令牌应被拒绝", async () => {
      const response = await fetch(`${apiBaseUrl}/users`, {
        headers: { Authorization: "Bearer invalid_token" },
      })
      expect(response.status).toBe(401)
    })

    test("普通用户不应访问管理员API", async () => {
      const response = await fetch(`${apiBaseUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      expect(response.status).toBe(403)
    })

    test("管理员应能访问管理员API", async () => {
      const response = await fetch(`${apiBaseUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      expect(response.status).toBe(200)
    })
  })

  describe("输入验证测试", () => {
    test("应拒绝SQL注入尝试", async () => {
      for (const injection of sqlInjectionStrings) {
        const response = await fetch(`${apiBaseUrl}/users?search=${encodeURIComponent(injection)}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        })

        // 应返回错误或空结果，而不是服务器错误
        expect(response.status).not.toBe(500)

        const data = await response.json()
        // 检查响应中是否包含敏感数据
        expect(JSON.stringify(data)).not.toContain("password")
      }
    })

    test("应拒绝XSS尝试", async () => {
      for (const injection of xssStrings) {
        const response = await fetch(`${apiBaseUrl}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            name: injection,
            email: `${randomString()}@example.com`,
          }),
        })

        // 应返回错误或成功，但不应包含未转义的XSS负载
        const data = await response.json()

        if (response.status === 201 && data.user) {
          // 如果创建成功，确保名称已被净化
          expect(data.user.name).not.toBe(injection)
          // 或者名称中的脚本标签已被转义
          expect(data.user.name).not.toContain("<script>")
        }
      }
    })

    test("应拒绝命令注入尝试", async () => {
      for (const injection of commandInjectionStrings) {
        const response = await fetch(`${apiBaseUrl}/system/ping?host=${encodeURIComponent(injection)}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        })

        // 应返回错误或受限结果，而不是执行命令
        expect(response.status).not.toBe(200)

        if (response.status === 200) {
          const data = await response.json()
          // 检查响应中是否包含敏感系统数据
          expect(JSON.stringify(data)).not.toContain("root:")
          expect(JSON.stringify(data)).not.toContain("passwd")
        }
      }
    })
  })

  describe("速率限制测试", () => {
    test("应实施速率限制", async () => {
      // 发送多个快速请求
      const requests = []
      for (let i = 0; i < 50; i++) {
        requests.push(
          fetch(`${apiBaseUrl}/users`, {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
        )
      }

      const responses = await Promise.all(requests)

      // 至少有一个请求应该被速率限制
      const limitedResponses = responses.filter((r) => r.status === 429)
      expect(limitedResponses.length).toBeGreaterThan(0)
    })
  })

  describe("敏感数据暴露测试", () => {
    test("用户对象不应包含密码哈希", async () => {
      const response = await fetch(`${apiBaseUrl}/users`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })

      expect(response.status).toBe(200)

      const data = await response.json()
      // 检查用户对象中是否包含密码字段
      const usersString = JSON.stringify(data)
      expect(usersString).not.toContain("password")
      expect(usersString).not.toContain("passwordHash")
    })

    test("错误响应不应包含堆栈跟踪", async () => {
      // 故意发送错误请求
      const response = await fetch(`${apiBaseUrl}/nonexistent-endpoint`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })

      expect(response.status).toBe(404)

      const data = await response.json()
      // 检查错误响应中是否包含堆栈跟踪
      const errorString = JSON.stringify(data)
      expect(errorString).not.toContain("at ")
      expect(errorString).not.toContain("node_modules")
      expect(errorString).not.toContain("stack")
    })
  })

  describe("CORS测试", () => {
    test("应实施正确的CORS策略", async () => {
      // 发送预检请求
      const response = await fetch(`${apiBaseUrl}/users`, {
        method: "OPTIONS",
        headers: {
          Origin: "https://malicious-site.com",
          "Access-Control-Request-Method": "GET",
          "Access-Control-Request-Headers": "Authorization",
        },
      })

      // 检查CORS头
      const allowOrigin = response.headers.get("Access-Control-Allow-Origin")

      // 不应允许所有来源
      expect(allowOrigin).not.toBe("*")
      // 不应允许恶意站点
      expect(allowOrigin).not.toBe("https://malicious-site.com")
    })
  })

  describe("HTTP安全头测试", () => {
    test("应设置适当的安全头", async () => {
      const response = await fetch(`${apiBaseUrl}/users`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })

      // 检查安全头
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
      expect(response.headers.get("X-Frame-Options")).toBe("DENY")
      expect(response.headers.get("Content-Security-Policy")).toBeTruthy()
      expect(response.headers.get("Strict-Transport-Security")).toBeTruthy()
    })
  })
})
