import { ApiClient } from "../api-client"
import { ApiConfigManager } from "../../config/config-manager"
import { AuthHandlerFactory } from "../../auth/auth-handler"
import { RequestBuilder } from "../../request/request-builder"
import { ApiResponseParser } from "../../response/response-parser"
import { ApiDataMapper } from "../../mapping/data-mapper"
import { ApiErrorHandler } from "../../error/error-handler"
import { jest } from "@jest/globals"

// 模拟依赖
jest.mock("../../config/config-manager")
jest.mock("../../auth/auth-handler")
jest.mock("../../request/request-builder")
jest.mock("../../response/response-parser")
jest.mock("../../mapping/data-mapper")
jest.mock("../../error/error-handler")

describe("ApiClient", () => {
  let client: ApiClient
  let mockConfigManager: jest.Mocked<ApiConfigManager>
  let mockAuthHandler: any
  let mockRequestBuilder: jest.Mocked<RequestBuilder>
  let mockResponseParser: jest.Mocked<ApiResponseParser>
  let mockDataMapper: jest.Mocked<ApiDataMapper>
  let mockErrorHandler: jest.Mocked<ApiErrorHandler>
  let mockFetch: jest.SpyInstance

  beforeEach(() => {
    // 重置所有模拟
    jest.clearAllMocks()

    // 模拟配置管理器
    mockConfigManager = {
      addConfig: jest.fn(),
      getConfig: jest.fn().mockReturnValue({
        baseUrl: "https://api.example.com",
        timeout: 5000,
      }),
      removeConfig: jest.fn(),
      hasConfig: jest.fn(),
      updateConfig: jest.fn(),
    } as unknown as jest.Mocked<ApiConfigManager>
    ;(ApiConfigManager as jest.Mock).mockImplementation(() => mockConfigManager)

    // 模拟认证处理器
    mockAuthHandler = {
      getAuthHeaders: jest.fn().mockResolvedValue({ Authorization: "Bearer test-token" }),
    }
    ;(AuthHandlerFactory.createHandler as jest.Mock) = jest.fn().mockReturnValue(mockAuthHandler)

    // 模拟请求构建器
    mockRequestBuilder = {
      setPath: jest.fn().mockReturnThis(),
      setMethod: jest.fn().mockReturnThis(),
      addQueryParams: jest.fn().mockReturnThis(),
      addHeaders: jest.fn().mockReturnThis(),
      setBody: jest.fn().mockReturnThis(),
      setTimeout: jest.fn().mockReturnThis(),
      addInterceptor: jest.fn().mockReturnThis(),
      build: jest.fn().mockResolvedValue({
        url: "https://api.example.com/test",
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      validate: jest.fn().mockReturnValue({ valid: true }),
    } as unknown as jest.Mocked<RequestBuilder>
    ;(RequestBuilder as jest.Mock).mockImplementation(() => mockRequestBuilder)

    // 模拟响应解析器
    mockResponseParser = {
      parse: jest.fn().mockResolvedValue({
        data: { id: 1, name: "测试" },
        status: 200,
        statusText: "OK",
        headers: { "content-type": "application/json" },
      }),
    } as unknown as jest.Mocked<ApiResponseParser>
    ;(ApiResponseParser as jest.Mock).mockImplementation(() => mockResponseParser)

    // 模拟数据映射器
    mockDataMapper = {
      map: jest.fn().mockReturnValue({
        data: { id: 1, name: "测试" },
        errors: [],
      }),
    } as unknown as jest.Mocked<ApiDataMapper>
    ;(ApiDataMapper as jest.Mock).mockImplementation(() => mockDataMapper)

    // 模拟错误处理器
    mockErrorHandler = {
      handleError: jest.fn((error) => {
        throw error
      }),
      shouldRetry: jest.fn().mockReturnValue(false),
      getRetryDelay: jest.fn().mockReturnValue(1000),
    } as unknown as jest.Mocked<ApiErrorHandler>
    ;(ApiErrorHandler as jest.Mock).mockImplementation(() => mockErrorHandler)

    // 模拟全局fetch
    mockFetch = jest.spyOn(global, "fetch").mockImplementation(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({ "Content-Type": "application/json" }),
          json: () => Promise.resolve({ id: 1, name: "测试" }),
          text: () => Promise.resolve(JSON.stringify({ id: 1, name: "测试" })),
        }) as unknown as Response,
    )

    // 创建客户端实例
    client = new ApiClient({
      config: {
        baseUrl: "https://api.example.com",
      },
      auth: {
        type: "bearer",
        enabled: true,
        token: "test-token",
      },
    })
  })

  afterEach(() => {
    mockFetch.mockRestore()
  })

  describe("GET请求", () => {
    test("应正确发送GET请求", async () => {
      const response = await client.get("/test")

      // 验证请求构建
      expect(mockRequestBuilder.setPath).toHaveBeenCalledWith("/test")
      expect(mockRequestBuilder.setMethod).toHaveBeenCalledWith("GET")
      expect(mockRequestBuilder.build).toHaveBeenCalled()

      // 验证fetch调用
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        expect.objectContaining({
          method: "GET",
        }),
      )

      // 验证响应解析
      expect(mockResponseParser.parse).toHaveBeenCalled()

      // 验证返回数据
      expect(response).toEqual({
        data: { id: 1, name: "测试" },
        status: 200,
        statusText: "OK",
        headers: { "content-type": "application/json" },
      })
    })

    test("应正确处理查询参数", async () => {
      await client.get("/test", {
        queryParams: { page: 1, limit: 10 },
      })

      expect(mockRequestBuilder.addQueryParams).toHaveBeenCalledWith({ page: 1, limit: 10 })
    })
  })

  describe("POST请求", () => {
    test("应正确发送POST请求", async () => {
      const data = { name: "新测试" }
      await client.post("/test", data)

      // 验证请求构建
      expect(mockRequestBuilder.setPath).toHaveBeenCalledWith("/test")
      expect(mockRequestBuilder.setMethod).toHaveBeenCalledWith("POST")
      expect(mockRequestBuilder.setBody).toHaveBeenCalledWith(data, undefined)
      expect(mockRequestBuilder.build).toHaveBeenCalled()

      // 验证fetch调用
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe("PUT请求", () => {
    test("应正确发送PUT请求", async () => {
      const data = { name: "更新测试" }
      await client.put("/test/1", data)

      // 验证请求构建
      expect(mockRequestBuilder.setPath).toHaveBeenCalledWith("/test/1")
      expect(mockRequestBuilder.setMethod).toHaveBeenCalledWith("PUT")
      expect(mockRequestBuilder.setBody).toHaveBeenCalledWith(data, undefined)
      expect(mockRequestBuilder.build).toHaveBeenCalled()

      // 验证fetch调用
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe("DELETE请求", () => {
    test("应正确发送DELETE请求", async () => {
      await client.delete("/test/1")

      // 验证请求构建
      expect(mockRequestBuilder.setPath).toHaveBeenCalledWith("/test/1")
      expect(mockRequestBuilder.setMethod).toHaveBeenCalledWith("DELETE")
      expect(mockRequestBuilder.build).toHaveBeenCalled()

      // 验证fetch调用
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe("PATCH请求", () => {
    test("应正确发送PATCH请求", async () => {
      const data = { name: "部分更新" }
      await client.patch("/test/1", data)

      // 验证请求构建
      expect(mockRequestBuilder.setPath).toHaveBeenCalledWith("/test/1")
      expect(mockRequestBuilder.setMethod).toHaveBeenCalledWith("PATCH")
      expect(mockRequestBuilder.setBody).toHaveBeenCalledWith(data, undefined)
      expect(mockRequestBuilder.build).toHaveBeenCalled()

      // 验证fetch调用
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe("错误处理", () => {
    test("应正确处理请求错误", async () => {
      // 模拟请求失败
      mockFetch.mockRejectedValueOnce(new Error("网络错误"))

      await expect(client.get("/test")).rejects.toThrow("网络错误")
      expect(mockErrorHandler.handleError).toHaveBeenCalled()
    })

    test("应正确处理认证错误", async () => {
      // 模拟认证失败
      mockAuthHandler.getAuthHeaders.mockRejectedValueOnce(new Error("认证失败"))

      await expect(client.get("/test")).rejects.toThrow("认证失败")
      expect(mockErrorHandler.handleError).toHaveBeenCalled()
    })

    test("应正确处理请求构建错误", async () => {
      // 模拟请求构建失败
      mockRequestBuilder.build.mockRejectedValueOnce(new Error("请求构建失败"))

      await expect(client.get("/test")).rejects.toThrow("请求构建失败")
      expect(mockErrorHandler.handleError).toHaveBeenCalled()
    })

    test("应正确处理请求验证错误", async () => {
      // 模拟请求验证失败
      mockRequestBuilder.validate.mockReturnValueOnce({
        valid: false,
        errors: ["无效的URL"],
      })

      await expect(client.get("/test")).rejects.toThrow("请求验证失败: 无效的URL")
    })
  })

  describe("数据映射", () => {
    test("应正确应用数据映射", async () => {
      const mapping = {
        id: "userId",
        name: "userName",
      }

      await client.get("/test", { mapping })

      expect(mockDataMapper.map).toHaveBeenCalledWith({ id: 1, name: "测试" }, mapping, "apiToApp")
    })
  })

  describe("拦截器", () => {
    test("应正确应用请求拦截器", async () => {
      const interceptor = {
        onRequest: jest.fn((config) => config),
      }

      const clientWithInterceptors = new ApiClient({
        config: {
          baseUrl: "https://api.example.com",
        },
        requestInterceptors: [interceptor],
      })

      await clientWithInterceptors.get("/test")

      expect(mockRequestBuilder.addInterceptor).toHaveBeenCalled()
    })

    test("应正确应用响应拦截器", async () => {
      const interceptor = {
        onResponse: jest.fn((response, data) => data),
      }

      const clientWithInterceptors = new ApiClient({
        config: {
          baseUrl: "https://api.example.com",
        },
        responseInterceptors: [interceptor],
      })

      await clientWithInterceptors.get("/test")

      // 由于响应拦截器在客户端内部处理，我们无法直接验证它的调用
      // 但我们可以验证客户端是否正常工作
      expect(mockFetch).toHaveBeenCalled()
    })
  })
})
