import type {
  HttpMethod,
  ContentType,
  RequestOptions,
  RequestConfig,
  RequestValidationResult,
  RequestInterceptor,
} from "./request-types"

/**
 * 请求构建器
 * 帮助用户构建API请求
 */
export class RequestBuilder {
  private baseUrl: string
  private options: RequestOptions
  private path = ""
  private interceptors: RequestInterceptor[] = []

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
    this.options = {
      method: "GET",
      headers: {},
      queryParams: {},
    }
  }

  /**
   * 设置请求路径
   */
  public setPath(path: string): RequestBuilder {
    this.path = path.startsWith("/") ? path : `/${path}`
    return this
  }

  /**
   * 设置HTTP方法
   */
  public setMethod(method: HttpMethod): RequestBuilder {
    this.options.method = method
    return this
  }

  /**
   * 设置GET方法
   */
  public get(): RequestBuilder {
    return this.setMethod("GET")
  }

  /**
   * 设置POST方法
   */
  public post(): RequestBuilder {
    return this.setMethod("POST")
  }

  /**
   * 设置PUT方法
   */
  public put(): RequestBuilder {
    return this.setMethod("PUT")
  }

  /**
   * 设置DELETE方法
   */
  public delete(): RequestBuilder {
    return this.setMethod("DELETE")
  }

  /**
   * 设置PATCH方法
   */
  public patch(): RequestBuilder {
    return this.setMethod("PATCH")
  }

  /**
   * 添加查询参数
   */
  public addQueryParam(name: string, value: string | number | boolean | null | undefined): RequestBuilder {
    if (value !== undefined && value !== null) {
      this.options.queryParams = {
        ...this.options.queryParams,
        [name]: value,
      }
    }
    return this
  }

  /**
   * 添加多个查询参数
   */
  public addQueryParams(params: Record<string, string | number | boolean | null | undefined>): RequestBuilder {
    Object.entries(params).forEach(([name, value]) => {
      this.addQueryParam(name, value)
    })
    return this
  }

  /**
   * 添加请求头
   */
  public addHeader(name: string, value: string): RequestBuilder {
    this.options.headers = {
      ...this.options.headers,
      [name]: value,
    }
    return this
  }

  /**
   * 添加多个请求头
   */
  public addHeaders(headers: Record<string, string>): RequestBuilder {
    this.options.headers = {
      ...this.options.headers,
      ...headers,
    }
    return this
  }

  /**
   * 设置请求体
   */
  public setBody(body: any, contentType?: ContentType): RequestBuilder {
    this.options.body = body

    if (contentType) {
      this.options.contentType = contentType
      this.addHeader("Content-Type", contentType)
    } else if (body && typeof body === "object") {
      // 默认为JSON
      this.options.contentType = "application/json"
      this.addHeader("Content-Type", "application/json")
    }

    return this
  }

  /**
   * 设置JSON请求体
   */
  public setJsonBody(body: any): RequestBuilder {
    return this.setBody(body, "application/json")
  }

  /**
   * 设置表单请求体
   */
  public setFormBody(formData: Record<string, string>): RequestBuilder {
    const body = new URLSearchParams()
    Object.entries(formData).forEach(([key, value]) => {
      body.append(key, value)
    })

    return this.setBody(body, "application/x-www-form-urlencoded")
  }

  /**
   * 设置多部分表单请求体
   */
  public setMultipartBody(formData: FormData): RequestBuilder {
    return this.setBody(formData, "multipart/form-data")
  }

  /**
   * 设置超时
   */
  public setTimeout(timeout: number): RequestBuilder {
    this.options.timeout = timeout
    return this
  }

  /**
   * 设置重试次数
   */
  public setRetries(retries: number): RequestBuilder {
    this.options.retries = retries
    return this
  }

  /**
   * 设置重试延迟
   */
  public setRetryDelay(retryDelay: number): RequestBuilder {
    this.options.retryDelay = retryDelay
    return this
  }

  /**
   * 设置响应类型
   */
  public setResponseType(responseType: "json" | "text" | "blob" | "arraybuffer"): RequestBuilder {
    this.options.responseType = responseType
    return this
  }

  /**
   * 添加请求拦截器
   */
  public addInterceptor(interceptor: RequestInterceptor): RequestBuilder {
    this.interceptors.push(interceptor)
    return this
  }

  /**
   * 构建请求配置
   */
  public async build(): Promise<RequestConfig> {
    // 构建URL
    let url = this.baseUrl + this.path

    // 添加查询参数
    if (this.options.queryParams && Object.keys(this.options.queryParams).length > 0) {
      const queryString = Object.entries(this.options.queryParams)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join("&")

      url += url.includes("?") ? `&${queryString}` : `?${queryString}`
    }

    // 准备请求体
    let body = this.options.body
    if (body && typeof body === "object" && !(body instanceof FormData) && !(body instanceof URLSearchParams)) {
      body = JSON.stringify(body)
    }

    // 创建请求配置
    let config: RequestConfig = {
      ...this.options,
      url,
      body,
    }

    // 应用请求拦截器
    for (const interceptor of this.interceptors) {
      config = await interceptor.onRequest(config)
    }

    return config
  }

  /**
   * 验证请求
   */
  public validate(): RequestValidationResult {
    const errors: string[] = []

    // 验证URL
    if (!this.baseUrl) {
      errors.push("基础URL是必需的")
    }

    // 验证HTTP方法
    if (!this.options.method) {
      errors.push("HTTP方法是必需的")
    }

    // 验证请求体与HTTP方法的兼容性
    if (this.options.body && ["GET", "HEAD"].includes(this.options.method)) {
      errors.push(`${this.options.method}请求不应包含请求体`)
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    }
  }
}

/**
 * 创建请求构建器的工厂函数
 * 方便快速创建RequestBuilder实例
 */
export function createRequestBuilder(baseUrl: string): RequestBuilder {
  return new RequestBuilder(baseUrl)
}
