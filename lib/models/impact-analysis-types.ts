// 变更类型
export interface Change {
  id: string
  type: "add" | "modify" | "remove"
  path: string
  description: string
  impactLevel: "high" | "medium" | "low"
  dependencies: string[]
  author: string
  date: string
  createdAt: string
  updatedAt: string
}

// 影响分析结果
export interface ImpactAnalysis {
  id: string
  changeId: string
  affectedApis: string[]
  affectedServices: string[]
  affectedClients: string[]
  riskLevel: "high" | "medium" | "low"
  recommendations: string[]
  createdAt: string
  updatedAt: string
}

// API响应类型
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  timestamp: string
  pagination?: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

// 分页请求参数
export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

// 过滤请求参数
export interface FilterParams {
  type?: "add" | "modify" | "remove"
  impactLevel?: "high" | "medium" | "low"
  author?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}
