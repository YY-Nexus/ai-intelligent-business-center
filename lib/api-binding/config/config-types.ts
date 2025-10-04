/**
 * API配置类型定义
 */

// 环境类型
export type Environment = "development" | "testing" | "production" | string

// API基本配置
export interface ApiConfig {
  // API名称
  name: string
  // 基础URL
  baseUrl: string
  // API版本
  version?: string
  // 超时时间（毫秒）
  timeout?: number
  // 默认请求头
  headers?: Record<string, string>
  // 其他自定义配置
  [key: string]: any
}

// 环境特定的API配置
export interface EnvironmentConfig extends ApiConfig {
  // 环境标识
  environment: Environment
}

// API配置存储
export interface ApiConfigStore {
  // 配置映射，键为API名称，值为该API的不同环境配置
  configs: Record<string, EnvironmentConfig[]>
  // 当前活动环境
  activeEnvironment: Environment
}

// 配置验证结果
export interface ConfigValidationResult {
  // 是否有效
  valid: boolean
  // 错误信息
  errors?: string[]
}
