/**
 * GLM-4V API类型定义
 */

// 内容类型
export type GLM4VContentType = "text" | "image_url" | "video_url"

// 图片URL对象
export interface GLM4VImageUrl {
  url: string
}

// 视频URL对象
export interface GLM4VVideoUrl {
  url: string
}

// 内容项
export type GLM4VContent =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: GLM4VImageUrl }
  | { type: "video_url"; video_url: GLM4VVideoUrl }

// 消息角色
export type GLM4VRole = "user" | "assistant"

// 用户消息
export interface GLM4VMessage {
  role: GLM4VRole
  content: GLM4VRole extends "user" ? GLM4VContent[] : string
}

// 请求选项
export interface GLM4VRequestOptions {
  model?: "glm-4v-flash" | "glm-4v" | "glm-4v-flash(免费)"
  messages: GLM4VMessage[]
  request_id?: string
  do_sample?: boolean
  stream?: boolean
  temperature?: number
  top_p?: number
  max_tokens?: number
  user_id?: string
}

// 响应选择项
export interface GLM4VChoice {
  finish_reason: "stop" | "length" | "sensitive" | "network_error"
  index: number
  message?: {
    role: "assistant"
    content: string
  }
  delta?: {
    role: "assistant"
    content: string
  }
}

// 使用统计
export interface GLM4VUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

// 内容过滤
export interface GLM4VContentFilter {
  role: "assistant" | "user" | "history"
  level: 0 | 1 | 2 | 3
}

// 响应对象
export interface GLM4VResponse {
  id: string
  created: number
  model: string
  request_id: string
  choices: GLM4VChoice[]
  usage: GLM4VUsage
  content_filter?: GLM4VContentFilter[]
}
