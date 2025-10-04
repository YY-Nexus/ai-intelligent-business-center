import { RequestBuilder } from "../request-builder"

describe("请求构建器", () => {
  let builder: RequestBuilder

  beforeEach(() => {
    builder = new RequestBuilder("https://api.example.com")
  })

  test("应正确设置基本URL", () => {
    expect(builder["baseUrl"]).toBe("https://api.example.com")
  })

  test("应正确设置路径", () => {
    builder.setPath("/users")
    expect(builder["path"]).toBe("/users")
  })

  test("应正确处理路径前缀斜杠", () => {
    builder.setPath("users")
    expect(builder["path"]).toBe("/users")
  })

  test("应正确设置HTTP方法", () => {
    builder.setMethod("POST")
    expect(builder["method"]).toBe("POST")
  })

  test("应正确添加查询参数", () => {
    builder.addQueryParams({ page: 1, limit: 10 })
    expect(builder["queryParams"]).toEqual({ page: 1, limit: 10 })
  })

  test("应正确合并查询参数", () => {
    builder.addQueryParams({ page: 1 })
    builder.addQueryParams({ limit: 10 })
    expect(builder["queryParams"]).toEqual({ page: 1, limit: 10 })
  })

  test("应正确添加请求头", () => {
    builder.addHeaders({ "Content-Type": "application/json" })
    expect(builder["headers"]).toEqual({ "Content-Type": "application/json" })
  })

  test("应正确合并请求头", () => {
    builder.addHeaders({ "Content-Type": "application/json" })
    builder.addHeaders({ Authorization: "Bearer token" })
    expect(builder["headers"]).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer token",
    })
  })

  test("应正确设置JSON请求体", () => {
    const data = { name: "测试用户" }
    builder.setBody(data)
    expect(builder["body"]).toBe(JSON.stringify(data))
    expect(builder["headers"]["Content-Type"]).toBe("application/json")
  })

  test("应正确设置表单数据请求体", () => {
    const formData = new FormData()
    formData.append("name", "测试用户")
    builder.setBody(formData)
    expect(builder["body"]).toBe(formData)
    // 注意：FormData会自动设置Content-Type，所以我们不需要手动设置
  })

  test("应正确设置超时", () => {
    builder.setTimeout(5000)
    expect(builder["timeout"]).toBe(5000)
  })

  test("应正确构建GET请求", async () => {
    builder
      .setPath("/users")
      .setMethod("GET")
      .addQueryParams({ page: 1, limit: 10 })
      .addHeaders({ Authorization: "Bearer token" })

    const request = await builder.build()
    expect(request.url).toBe("https://api.example.com/users?page=1&limit=10")
    expect(request.method).toBe("GET")
    expect(request.headers).toEqual({ Authorization: "Bearer token" })
    expect(request.body).toBeUndefined()
  })

  test("应正确构建POST请求", async () => {
    const data = { name: "测试用户" }
    builder.setPath("/users").setMethod("POST").setBody(data).addHeaders({ Authorization: "Bearer token" })

    const request = await builder.build()
    expect(request.url).toBe("https://api.example.com/users")
    expect(request.method).toBe("POST")
    expect(request.headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer token",
    })
    expect(request.body).toBe(JSON.stringify(data))
  })

  test("应正确验证请求", () => {
    builder.setPath("/users").setMethod("GET")
    const validation = builder.validate()
    expect(validation.valid).toBe(true)
    expect(validation.errors).toBeUndefined()
  })

  test("应检测到缺失的HTTP方法", () => {
    builder.setPath("/users")
    const validation = builder.validate()
    expect(validation.valid).toBe(false)
    expect(validation.errors).toContain("HTTP方法未设置")
  })

  test("应检测到无效的HTTP方法", () => {
    builder.setPath("/users").setMethod("INVALID" as any)
    const validation = builder.validate()
    expect(validation.valid).toBe(false)
    expect(validation.errors).toContain("无效的HTTP方法: INVALID")
  })

  test("应正确应用请求拦截器", async () => {
    const interceptor = {
      onRequest: jest.fn((config) => {
        config.headers = { ...config.headers, "X-Custom": "Value" }
        return config
      }),
    }

    builder.setPath("/users").setMethod("GET").addHeaders({ Authorization: "Bearer token" }).addInterceptor(interceptor)

    const request = await builder.build()
    expect(interceptor.onRequest).toHaveBeenCalled()
    expect(request.headers).toEqual({
      Authorization: "Bearer token",
      "X-Custom": "Value",
    })
  })
})
