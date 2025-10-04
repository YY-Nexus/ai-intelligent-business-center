import { BasicAuthStrategy } from "../strategies/basic-auth"
import type { BasicAuthConfig } from "../auth-types"

describe("基本认证策略", () => {
  const validConfig: BasicAuthConfig = {
    type: "basic",
    enabled: true,
    username: "testuser",
    password: "testpassword",
  }

  const disabledConfig: BasicAuthConfig = {
    ...validConfig,
    enabled: false,
  }

  test("当启用时应生成正确的认证头", async () => {
    const strategy = new BasicAuthStrategy(validConfig)
    const headers = await strategy.getAuthHeaders()

    // 验证Base64编码的凭据
    const expectedCredentials = btoa(`${validConfig.username}:${validConfig.password}`)
    expect(headers).toEqual({
      Authorization: `Basic ${expectedCredentials}`,
    })
  })

  test("当禁用时应返回空头", async () => {
    const strategy = new BasicAuthStrategy(disabledConfig)
    const headers = await strategy.getAuthHeaders()

    expect(headers).toEqual({})
  })

  test("认证成功应返回成功结果和头", async () => {
    const strategy = new BasicAuthStrategy(validConfig)
    const result = await strategy.authenticate()

    expect(result.success).toBe(true)
    expect(result.headers).toBeDefined()
    expect(strategy.isAuthenticated()).toBe(true)
  })
})
