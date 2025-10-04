/**
 * 响应类型定义
 */

// 分页信息
export interface PaginationInfo {
  // 当前页码
  currentPage: number
  // 总页数
  totalPages: number
  // 总项目数
  totalItems: number
  // 每页项目数
  itemsPerPage: number
  // 是否有下一页
  hasNextPage: boolean
  // 是否有上一页
  hasPreviousPage: boolean
}

// 响应元数据
export interface ResponseMetadata {
  // 分页信息
  pagination?: PaginationInfo
  // 时间戳
  timestamp?: string
  // 请求ID
  requestId?: string
  // 其他元数据
  [key: string]: any
}

// 标准化响应
export interface NormalizedResponse<T> {
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
  // 原始响应
  raw: Response
}

// 响应解析选项
export interface ResponseParseOptions {
  // 预期响应类型
  expectedType?: "json" | "text" | "blob" | "arraybuffer"
  // 是否在错误时抛出异常
  throwOnError?: boolean
  // 数据提取路径
  extractDataPath?: string
  // 元数据提取路径
  extractMetadataPath?: string
  // 分页信息提取路径
  extractPaginationPath?: string
}

// 响应解析器接口
export interface ResponseParser {
  // 解析响应
  parse<T>(response: Response, options?: ResponseParseOptions): Promise<NormalizedResponse<T>>
  // 提取分页信息
  extractPagination(data: any, path?: string): PaginationInfo | undefined
  // 提取元数据
  extractMetadata(data: any, path?: string): ResponseMetadata | undefined
}
