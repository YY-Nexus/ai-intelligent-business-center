import { AuthHandlerFactory, createAuthHandler } from "../auth-handler"
import { BasicAuthStrategy } from "../strategies/basic-auth"
import { BearerAuthStrategy } from "../strategies/bearer-auth"
import { ApiKeyAuthStrategy } from "../strategies/api-key-auth"
import { OAuth2AuthStrategy } from "../strategies/oauth2-auth"
import { CustomAuthStrategy } from "../strategies/custom-auth"
import type { AuthConfiguration } from "../auth-types"

describe("认证处理器工厂", () => {
  test("当认证禁用时应返回NoAuthStrategy", () => {
    const config: AuthConfiguration = {
      type: "basic",
      enabled: false,
      username: "test",
      password: "test",
    }

    const handler = AuthHandlerFactory.createHandler(config)
    expect(handler.isAuthenticated()).toBe(true)
  })

  test("应根据配置类型创建正确的认证处理器", () => {
    const configs: { [key: string]: [AuthConfiguration, any] } = {
      basic: [{ type: "basic", enabled: true, username: "test", password: "test" }, BasicAuthStrategy],
      bearer: [{ type: "bearer", enabled: true, token: "test-token" }, BearerAuthStrategy],
      "api-key": [{ type: "api-key", enabled: true, apiKey: "test-key" }, ApiKeyAuthStrategy],
      oauth2: [
        {
          type: "oauth2",
          enabled: true,
          clientId: "client-id",
          clientSecret: "client-secret",
          tokenUrl: "https://example.com/token",
        },
        OAuth2AuthStrategy,
      ],
      custom: [
        {
          type: "custom",
          enabled: true,
          getAuthHeaders: async () => ({ "Custom-Auth": "test" }),
        },
        CustomAuthStrategy,
      ],
    }

    for (const [type, [config, expectedClass]] of Object.entries(configs)) {
      const handler = AuthHandlerFactory.createHandler(config)
      expect(handler).toBeInstanceOf(expectedClass)
    }
  })

  test("createAuthHandler函数应调用AuthHandlerFactory.createHandler", () => {
    const spy = jest.spyOn(AuthHandlerFactory, "createHandler")
    const config: AuthConfiguration = {
      type: "basic",
      enabled: true,
      username: "test",
      password: "test",
    }

    createAuthHandler(config)
    expect(spy).toHaveBeenCalledWith(config)
    spy.mockRestore()
  })
})
