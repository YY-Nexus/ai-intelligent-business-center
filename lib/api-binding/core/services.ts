import type { ApiConfigManager } from "../config/config-manager"
import type { AuthHandler } from "../auth/auth-types"
import type { ApiResponseParser } from "../response/response-parser"
import type { ApiDataMapper } from "../mapping/data-mapper"
import type { ApiErrorHandler } from "../error/error-handler"

// 服务标识符
export const SERVICE_TOKENS = {
  CONFIG_MANAGER: "api:configManager",
  AUTH_HANDLER: "api:authHandler",
  RESPONSE_PARSER: "api:responseParser",
  DATA_MAPPER: "api:dataMapper",
  ERROR_HANDLER: "api:errorHandler",
}

// 服务接口
export interface ApiServices {
  configManager: ApiConfigManager
  authHandler: AuthHandler
  responseParser: ApiResponseParser
  dataMapper: ApiDataMapper
  errorHandler: ApiErrorHandler
}
