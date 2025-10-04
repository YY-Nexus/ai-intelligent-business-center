// 重新导出核心类型和组件
export * from "./core/types"
export * from "./config/config-types"
export * from "./auth/auth-types"
export * from "./request/request-types"
export * from "./response/response-types"
export * from "./mapping/mapping-types"
export * from "./error/error-types"

// 导出工厂和服务
export { ApiClientFactory } from "./core/client-factory"
export { ApiServiceProvider } from "./core/service-provider"
export { SERVICE_TOKENS } from "./core/services"

// 导出容器
export { container } from "@/lib/di/container"

// 为了向后兼容，重新导出createAuthHandler
export { createAuthHandler } from "./auth/auth-handler"
