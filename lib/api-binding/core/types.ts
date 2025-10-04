/**
 * API客户端类型定义
 */

import type { ApiConfig } from "../config/config-types"
import type { AuthConfiguration } from "../auth/auth-types"
import type { HttpMethod, ContentType, RequestInterceptor } from "../request/request-types"
import type { ResponseParseOptions } from "../response/response-types"
import type { MappingConfig, MappingDirection } from "../mapping/mapping-types"
import type { ErrorHandlerOptions } from "../error/error-types"
import type { ResponseMetadata } from "../response/response-types"

// API客户端选项
export interface ApiClientOptions {
  // API配置
  config: ApiConfig
  // 认证配置
  auth?: AuthConfiguration
  // 错误处理器选项
  errorHandlerOptions?: ErrorHandlerOptions
  // 请求拦截器
  requestInterceptors?: RequestInterceptor[]
  // 响应拦截器
  responseInterceptors?: ResponseInterceptor[]
  // 默认响应解析选项
  defaultParseOptions?: ResponseParseOptions
}

// 响应拦截器
export interface ResponseInterceptor {
  // 响应拦截函数
  onResponse<T>(response: Response, data: T): Promise<T> | T
  // 错误拦截函数
  onError?(error: Error, request: any): Promise<Error> | Error
}

// API请求选项
export interface ApiRequestOptions {
  // HTTP方法
  method: HttpMethod
  // 请求体
  body?: any
  // 查询参数
  queryParams?: Record<string, string | number | boolean | null | undefined>
  // 请求头
  headers?: Record<string, string>
  // 内容类型
  contentType?: ContentType
  // 超时时间（毫秒）
  timeout?: number
  // 重试次数
  retries?: number
  // 响应解析选项
  parseOptions?: ResponseParseOptions
  // 数据映射配置
  mapping?: MappingConfig
  // 映射方向
  mappingDirection?: MappingDirection
  // 状态码验证函数
  validateStatus?: (status: number) => boolean
}

// API响应
export interface ApiResponse<T> {
  // 响应数据
  data: T
  // 状态码
  status: number
  // 状态文本
  statusText: string
  // 响应头
  headers: Record<string, string>
  // 元数据
  metadata?: ResponseMetadata
}
