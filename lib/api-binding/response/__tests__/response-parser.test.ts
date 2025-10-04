import { ApiResponseParser } from "../response-parser"

describe("响应解析器", () => {
  let parser: ApiResponseParser

  beforeEach(() => {
    parser = new ApiResponseParser()
  })

  test("应正确解析JSON响应", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      json: jest.fn().mockResolvedValue({ id: 1, name: "测试用户" }),
    } as unknown as Response

    const result = await parser.parse(mockResponse)
    expect(result.status).toBe(200)
    expect(result.statusText).toBe("OK")
    expect(result.data).toEqual({ id: 1, name: "测试用户" })
    expect(mockResponse.json).toHaveBeenCalled()
  })

  test("应正确解析文本响应", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers({
        "Content-Type": "text/plain",
      }),
      text: jest.fn().mockResolvedValue("Hello, World!"),
    } as unknown as Response

    const result = await parser.parse(mockResponse)
    expect(result.status).toBe(200)
    expect(result.statusText).toBe("OK")
    expect(result.data).toBe("Hello, World!")
    expect(mockResponse.text).toHaveBeenCalled()
  })

  test("应正确解析二进制响应", async () => {
    const mockArrayBuffer = new ArrayBuffer(8)
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers({
        "Content-Type": "application/octet-stream",
      }),
      arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer),
    } as unknown as Response

    const result = await parser.parse(mockResponse)
    expect(result.status).toBe(200)
    expect(result.statusText).toBe("OK")
    expect(result.data).toBe(mockArrayBuffer)
    expect(mockResponse.arrayBuffer).toHaveBeenCalled()
  })

  test("应正确解析表单数据响应", async () => {
    const mockFormData = new FormData()
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers({
        "Content-Type": "multipart/form-data",
      }),
      formData: jest.fn().mockResolvedValue(mockFormData),
    } as unknown as Response

    const result = await parser.parse(mockResponse)
    expect(result.status).toBe(200)
    expect(result.statusText).toBe("OK")
    expect(result.data).toBe(mockFormData)
    expect(mockResponse.formData).toHaveBeenCalled()
  })

  test("应处理空响应", async () => {
    const mockResponse = {
      ok: true,
      status: 204,
      statusText: "No Content",
      headers: new Headers({}),
    } as unknown as Response

    const result = await parser.parse(mockResponse)
    expect(result.status).toBe(204)
    expect(result.statusText).toBe("No Content")
    expect(result.data).toBeNull()
  })

  test("应处理解析错误", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      json: jest.fn().mockRejectedValue(new Error("解析错误")),
      text: jest.fn().mockResolvedValue("无效的JSON"),
    } as unknown as Response

    await expect(parser.parse(mockResponse)).rejects.toThrow("解析错误")
  })

  test("应正确提取响应头", async () => {
    const headers = new Headers({
      "Content-Type": "application/json",
      "X-Request-ID": "123456",
    })
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: "OK",
      headers,
      json: jest.fn().mockResolvedValue({}),
    } as unknown as Response

    const result = await parser.parse(mockResponse)
    expect(result.headers).toEqual({
      "content-type": "application/json",
      "x-request-id": "123456",
    })
  })

  test("应正确处理自定义解析选项", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      json: jest.fn().mockResolvedValue({ data: { id: 1, name: "测试用户" } }),
    } as unknown as Response

    const result = await parser.parse(mockResponse, {
      dataField: "data",
    })
    expect(result.data).toEqual({ id: 1, name: "测试用户" })
  })

  test("应正确处理分页元数据", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers({
        "Content-Type": "application/json",
        "X-Total-Count": "100",
        "X-Page": "1",
        "X-Per-Page": "10",
      }),
      json: jest.fn().mockResolvedValue({ items: [{ id: 1 }] }),
    } as unknown as Response

    const result = await parser.parse(mockResponse, {
      extractPagination: true,
      paginationTotalHeader: "X-Total-Count",
      paginationPageHeader: "X-Page",
      paginationPerPageHeader: "X-Per-Page",
    })

    expect(result.data).toEqual({ items: [{ id: 1 }] })
    expect(result.metadata?.pagination).toEqual({
      total: 100,
      page: 1,
      perPage: 10,
    })
  })
})
