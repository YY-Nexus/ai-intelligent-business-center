/**
 * 飞桨星河API类型定义
 */

// 模型类型
export type PaddleFlowModel =
  | "deepseek-r1"
  | "llama-3-8b"
  | "qwen-max"
  | "qwen-plus"
  | "ernie-bot-4"
  | "ernie-bot-8k"
  | string

// 消息角色
export type PaddleFlowRole = "system" | "user" | "assistant"

// 消息类型
export interface PaddleFlowMessage {
  role: PaddleFlowRole
  content: string
}

// 聊天请求参数
export interface PaddleFlowChatRequest {
  model: PaddleFlowModel
  messages: PaddleFlowMessage[]
  temperature?: number
  top_p?: number
  max_tokens?: number
  stream?: boolean
  presence_penalty?: number
  frequency_penalty?: number
  stop?: string[]
}

// 聊天响应选项
export interface PaddleFlowChoice {
  index: number
  message: PaddleFlowMessage
  finish_reason: "stop" | "length" | "content_filter" | null
}

// 使用情况统计
export interface PaddleFlowUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

// 聊天响应
export interface PaddleFlowChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: PaddleFlowChoice[]
  usage: PaddleFlowUsage
}

// 流式响应中的增量内容
export interface PaddleFlowDelta {
  role?: PaddleFlowRole
  content?: string
}

// 流式响应选项
export interface PaddleFlowStreamChoice {
  index: number
  delta: PaddleFlowDelta
  finish_reason: "stop" | "length" | "content_filter" | null
}

// 流式响应
export interface PaddleFlowStreamResponse {
  id: string
  object: string
  created: number
  model: string
  choices: PaddleFlowStreamChoice[]
}
