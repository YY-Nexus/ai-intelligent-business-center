/**
 * CogView-3 API类型定义
 */

// 图像质量选项
export type CogViewQuality = "standard" | "hd"

// 请求选项
export interface CogViewRequestOptions {
  model?: string
  prompt: string
  quality?: CogViewQuality
  size?: string
  user_id?: string
}

// 生成的图像数据
export interface CogViewImageData {
  url: string
}

// 内容过滤
export interface CogViewContentFilter {
  role: "assistant" | "user" | "history"
  level: 0 | 1 | 2 | 3
}

// 响应对象
export interface CogViewResponse {
  created: number
  data: CogViewImageData[]
  content_filter?: CogViewContentFilter[]
}
