/**
 * API提供商配置
 */
export interface ApiProvider {
  id: string
  name: string
  description: string
  apiType: "openai" | "baidu" | "xfyun" | "zhipu" | "aliyun" | "tencent" | "minimax" | "moonshot" | "baichuan"
  apiKey: string
  apiSecret?: string
  apiEndpoint?: string
  defaultModel: string
  models: ApiModel[]
  status: "active" | "inactive"
  healthStatus: "healthy" | "degraded" | "unhealthy"
  lastChecked: string
  costPerToken: number
  capabilities?: string[]
}

/**
 * API模型配置
 */
export interface ApiModel {
  id: string
  name: string
  capabilities: ModelCapability[]
  maxTokens: number
  costPerInputToken: number
  costPerOutputToken: number
}

/**
 * 模型能力
 */
export type ModelCapability =
  | "chat"
  | "completions"
  | "embeddings"
  | "images"
  | "streaming"
  | "function_calling"
  | "vision"
  | "audio"

/**
 * API请求
 */
export interface ApiRequest {
  messages: { role: string; content: string }[]
  providerId?: string
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
  functions?: any[]
  [key: string]: any
}

/**
 * API响应
 */
export interface ApiResponse {
  text: string
  model?: string
  provider?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  [key: string]: any
}

/**
 * 路由规则
 */
export interface RoutingRule {
  id: string
  name: string
  description: string
  enabled: boolean
  priority: number
  conditions: RoutingCondition[]
  action: RoutingAction
}

/**
 * 路由条件
 */
export interface RoutingCondition {
  field: string
  operator: "equals" | "contains" | "startsWith" | "endsWith" | "greaterThan" | "lessThan"
  value: string | number | boolean
}

/**
 * 路由动作
 */
export interface RoutingAction {
  providerId: string
  model?: string
  fallbackProviderId?: string
}

/**
 * 使用统计
 */
export interface UsageStatistics {
  providerId: string
  model: string
  endpoint: string
  tokensIn: number
  tokensOut: number
  cost: number
  responseTime: number
  timestamp: string
  success: boolean
}

/**
 * 错误记录
 */
export interface ErrorRecord {
  providerId: string
  endpoint: string
  errorCode: string
  errorMessage: string
  timestamp: string
}
