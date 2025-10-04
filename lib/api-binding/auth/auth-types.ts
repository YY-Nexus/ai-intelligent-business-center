/**
 * 认证类型定义
 */

// 认证类型
export type AuthType = "none" | "basic" | "bearer" | "api-key" | "oauth2" | "custom"

// 基础认证配置
export interface AuthConfiguration {
  // 认证类型
  type: AuthType
  // 是否启用认证
  enabled: boolean
}

// 基本认证配置
export interface BasicAuthConfig extends AuthConfiguration {
  type: "basic"
  // 用户名
  username: string
  // 密码
  password: string
}

// Bearer令牌认证配置
export interface BearerAuthConfig extends AuthConfiguration {
  type: "bearer"
  // 访问令牌
  token: string
  // 刷新令牌
  refreshToken?: string
  // 令牌过期时间
  expiresAt?: number
  // 是否自动刷新令牌
  autoRefresh?: boolean
}

// API密钥认证配置
export interface ApiKeyAuthConfig extends AuthConfiguration {
  type: "api-key"
  // API密钥
  apiKey: string
  // 是否在查询参数中传递API密钥
  inQuery?: boolean
  // 头部名称
  headerName?: string
  // 查询参数名称
  queryParamName?: string
}

// OAuth2认证配置
export interface OAuth2AuthConfig extends AuthConfiguration {
  type: "oauth2"
  // 客户端ID
  clientId: string
  // 客户端密钥
  clientSecret: string
  // 授权类型
  grantType: "client_credentials" | "password" | "authorization_code" | "refresh_token"
  // 令牌URL
  tokenUrl: string
  // 授权URL
  authorizationUrl?: string
  // 重定向URL
  redirectUri?: string
  // 访问令牌
  accessToken?: string
  // 刷新令牌
  refreshToken?: string
  // 令牌过期时间
  expiresAt?: number
  // 作用域
  scopes?: string[]
}

// 自定义认证配置
export interface CustomAuthConfig extends AuthConfiguration {
  type: "custom"
  // 获取认证头的函数
  getAuthHeaders: () => Promise<Record<string, string>> | Record<string, string>
  // 其他自定义配置
  [key: string]: any
}

// 认证结果
export interface AuthResult {
  // 是否成功
  success: boolean
  // 认证头
  headers?: Record<string, string>
  // 错误信息
  error?: string
}

// 认证处理器接口
export interface AuthHandler {
  // 获取认证头
  getAuthHeaders(): Promise<Record<string, string>>
  // 执行认证
  authenticate(): Promise<AuthResult>
  // 检查是否已认证
  isAuthenticated(): boolean
}
