import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import type { Change, ImpactAnalysis, PaginationParams, FilterParams } from "../models/impact-analysis-types"

// 数据文件路径
const DATA_DIR = path.join(process.cwd(), "data")
const CHANGES_FILE = path.join(DATA_DIR, "changes.json")
const ANALYSIS_FILE = path.join(DATA_DIR, "analysis.json")

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// 初始化数据文件
if (!fs.existsSync(CHANGES_FILE)) {
  fs.writeFileSync(CHANGES_FILE, JSON.stringify([]))
}

if (!fs.existsSync(ANALYSIS_FILE)) {
  fs.writeFileSync(ANALYSIS_FILE, JSON.stringify([]))
}

// 读取变更数据
export function readChanges(): Change[] {
  try {
    const data = fs.readFileSync(CHANGES_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error("读取变更数据失败:", error)
    return []
  }
}

// 写入变更数据
export function writeChanges(changes: Change[]): boolean {
  try {
    fs.writeFileSync(CHANGES_FILE, JSON.stringify(changes, null, 2))
    return true
  } catch (error) {
    console.error("写入变更数据失败:", error)
    return false
  }
}

// 读取分析数据
export function readAnalysis(): ImpactAnalysis[] {
  try {
    const data = fs.readFileSync(ANALYSIS_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error("读取分析数据失败:", error)
    return []
  }
}

// 写入分析数据
export function writeAnalysis(analysis: ImpactAnalysis[]): boolean {
  try {
    fs.writeFileSync(ANALYSIS_FILE, JSON.stringify(analysis, null, 2))
    return true
  } catch (error) {
    console.error("写入分析数据失败:", error)
    return false
  }
}

// 变更服务
export const changeService = {
  // 获取所有变更
  getChanges(params?: PaginationParams & FilterParams): {
    changes: Change[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  } {
    const allChanges = readChanges()
    let filteredChanges = [...allChanges]

    // 应用过滤条件
    if (params) {
      if (params.type) {
        filteredChanges = filteredChanges.filter((c) => c.type === params.type)
      }

      if (params.impactLevel) {
        filteredChanges = filteredChanges.filter((c) => c.impactLevel === params.impactLevel)
      }

      if (params.author) {
        filteredChanges = filteredChanges.filter((c) => c.author.toLowerCase().includes(params.author!.toLowerCase()))
      }

      if (params.dateFrom) {
        const fromDate = new Date(params.dateFrom).getTime()
        filteredChanges = filteredChanges.filter((c) => new Date(c.date).getTime() >= fromDate)
      }

      if (params.dateTo) {
        const toDate = new Date(params.dateTo).getTime()
        filteredChanges = filteredChanges.filter((c) => new Date(c.date).getTime() <= toDate)
      }

      if (params.search) {
        const searchTerm = params.search.toLowerCase()
        filteredChanges = filteredChanges.filter(
          (c) =>
            c.path.toLowerCase().includes(searchTerm) ||
            c.description.toLowerCase().includes(searchTerm) ||
            c.author.toLowerCase().includes(searchTerm),
        )
      }

      // 排序
      if (params.sortBy) {
        const sortOrder = params.sortOrder === "desc" ? -1 : 1
        filteredChanges.sort((a: any, b: any) => {
          if (a[params.sortBy!] < b[params.sortBy!]) return -1 * sortOrder
          if (a[params.sortBy!] > b[params.sortBy!]) return 1 * sortOrder
          return 0
        })
      } else {
        // 默认按日期降序排序
        filteredChanges.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }
    }

    // 计算分页
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const total = filteredChanges.length
    const totalPages = Math.ceil(total / pageSize)

    // 应用分页
    const startIndex = (page - 1) * pageSize
    const paginatedChanges = filteredChanges.slice(startIndex, startIndex + pageSize)

    return {
      changes: paginatedChanges,
      total,
      page,
      pageSize,
      totalPages,
    }
  },

  // 获取单个变更
  getChange(id: string): Change | null {
    const changes = readChanges()
    return changes.find((c) => c.id === id) || null
  },

  // 创建变更
  createChange(change: Omit<Change, "id" | "createdAt" | "updatedAt">): Change {
    const changes = readChanges()
    const now = new Date().toISOString()

    const newChange: Change = {
      ...change,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    }

    changes.push(newChange)
    writeChanges(changes)

    return newChange
  },

  // 更新变更
  updateChange(id: string, change: Partial<Change>): Change | null {
    const changes = readChanges()
    const index = changes.findIndex((c) => c.id === id)

    if (index === -1) return null

    const updatedChange: Change = {
      ...changes[index],
      ...change,
      updatedAt: new Date().toISOString(),
    }

    changes[index] = updatedChange
    writeChanges(changes)

    return updatedChange
  },

  // 删除变更
  deleteChange(id: string): boolean {
    const changes = readChanges()
    const initialLength = changes.length
    const filteredChanges = changes.filter((c) => c.id !== id)

    if (filteredChanges.length === initialLength) return false

    writeChanges(filteredChanges)

    // 同时删除相关的分析结果
    const analysis = readAnalysis()
    const filteredAnalysis = analysis.filter((a) => a.changeId !== id)
    writeAnalysis(filteredAnalysis)

    return true
  },
}

// 分析服务
export const analysisService = {
  // 获取变更的分析结果
  getAnalysisForChange(changeId: string): ImpactAnalysis | null {
    const allAnalysis = readAnalysis()
    return allAnalysis.find((a) => a.changeId === changeId) || null
  },

  // 创建或更新分析结果
  saveAnalysis(analysis: Omit<ImpactAnalysis, "id" | "createdAt" | "updatedAt">): ImpactAnalysis {
    const allAnalysis = readAnalysis()
    const now = new Date().toISOString()
    const existingIndex = allAnalysis.findIndex((a) => a.changeId === analysis.changeId)

    if (existingIndex !== -1) {
      // 更新现有分析
      const updatedAnalysis: ImpactAnalysis = {
        ...allAnalysis[existingIndex],
        ...analysis,
        updatedAt: now,
      }

      allAnalysis[existingIndex] = updatedAnalysis
      writeAnalysis(allAnalysis)

      return updatedAnalysis
    } else {
      // 创建新分析
      const newAnalysis: ImpactAnalysis = {
        ...analysis,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      }

      allAnalysis.push(newAnalysis)
      writeAnalysis(allAnalysis)

      return newAnalysis
    }
  },

  // 删除分析结果
  deleteAnalysis(id: string): boolean {
    const allAnalysis = readAnalysis()
    const initialLength = allAnalysis.length
    const filteredAnalysis = allAnalysis.filter((a) => a.id !== id)

    if (filteredAnalysis.length === initialLength) return false

    writeAnalysis(filteredAnalysis)
    return true
  },

  // 生成分析结果
  generateAnalysis(changeId: string): ImpactAnalysis | null {
    const change = changeService.getChange(changeId)
    if (!change) return null

    // 这里可以实现真实的分析逻辑
    // 目前使用模拟数据作为示例
    const analysisData: Record<string, Omit<ImpactAnalysis, "id" | "changeId" | "createdAt" | "updatedAt">> = {
      // 用户资料API变更
      "modify:/api/users/profile": {
        affectedApis: ["/api/users/profile", "/api/users/settings", "/api/notifications/preferences"],
        affectedServices: ["用户认证服务", "个人资料服务", "通知服务", "用户设置服务"],
        affectedClients: ["Web应用", "移动应用", "第三方集成"],
        riskLevel: "high",
        recommendations: [
          "提前通知所有客户端开发团队",
          "提供详细的迁移指南",
          "实施版本控制以支持旧版和新版API",
          "设置监控以跟踪迁移进度",
        ],
      },
      // 产品推荐API变更
      "add:/api/products/recommendations": {
        affectedApis: ["/api/products/recommendations", "/api/products/list"],
        affectedServices: ["产品目录服务", "用户行为分析服务", "推荐引擎"],
        affectedClients: ["Web应用", "移动应用"],
        riskLevel: "medium",
        recommendations: ["更新API文档", "提供示例代码", "监控API性能", "收集用户反馈"],
      },
      // 旧版订单API移除
      "remove:/api/orders/legacy": {
        affectedApis: ["/api/orders/legacy", "/api/orders/status", "/api/payments/process"],
        affectedServices: ["订单处理服务", "支付服务", "库存服务", "物流服务"],
        affectedClients: ["Web应用", "移动应用", "第三方集成", "管理后台"],
        riskLevel: "high",
        recommendations: [
          "制定详细的迁移计划",
          "提供迁移支持和咨询",
          "设置过渡期，同时支持新旧API",
          "实施监控和警报系统",
          "准备回滚计划",
        ],
      },
      // 认证令牌API变更
      "modify:/api/auth/token": {
        affectedApis: ["/api/auth/token", "/api/auth/refresh", "/api/users/me"],
        affectedServices: ["认证服务", "用户服务", "权限服务"],
        affectedClients: ["所有客户端"],
        riskLevel: "high",
        recommendations: ["提前通知所有客户端", "提供详细的迁移指南", "设置过渡期", "实施监控系统", "准备应急响应计划"],
      },
      // 事件分析API添加
      "add:/api/analytics/events": {
        affectedApis: ["/api/analytics/events"],
        affectedServices: ["分析服务", "事件处理服务"],
        affectedClients: ["分析仪表板", "管理后台"],
        riskLevel: "low",
        recommendations: ["更新API文档", "提供集成示例", "监控API使用情况"],
      },
    }

    // 根据变更类型和路径查找匹配的分析模板
    const key = `${change.type}:${change.path}`
    const template = analysisData[key]

    if (!template) {
      // 如果没有匹配的模板，生成一个基本的分析结果
      return this.saveAnalysis({
        changeId,
        affectedApis: [change.path],
        affectedServices: change.dependencies,
        affectedClients: ["未知客户端"],
        riskLevel: change.impactLevel,
        recommendations: ["进行详细的影响分析", "制定迁移计划", "更新API文档"],
      })
    }

    // 使用模板生成分析结果
    return this.saveAnalysis({
      changeId,
      ...template,
    })
  },
}

// 初始化示例数据
export function initializeExampleData() {
  const changes = readChanges()

  // 只有在没有数据时才初始化
  if (changes.length === 0) {
    const now = new Date().toISOString()
    const exampleChanges: Change[] = [
      {
        id: "change-1",
        type: "modify",
        path: "/api/users/profile",
        description: "修改用户资料API的响应格式，添加新的字段并调整现有字段的结构",
        impactLevel: "high",
        dependencies: ["用户认证服务", "个人资料服务", "通知服务"],
        author: "张三",
        date: "2023-12-15",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "change-2",
        type: "add",
        path: "/api/products/recommendations",
        description: "添加新的产品推荐API，基于用户历史行为提供个性化推荐",
        impactLevel: "medium",
        dependencies: ["产品目录服务", "用户行为分析服务", "推荐引擎"],
        author: "李四",
        date: "2023-12-10",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "change-3",
        type: "remove",
        path: "/api/orders/legacy",
        description: "移除旧版订单API，所有客户端应迁移到新版API",
        impactLevel: "high",
        dependencies: ["订单处理服务", "支付服务", "库存服务"],
        author: "王五",
        date: "2023-12-05",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "change-4",
        type: "modify",
        path: "/api/auth/token",
        description: "修改认证令牌API，更新令牌格式并增加安全性",
        impactLevel: "high",
        dependencies: ["认证服务", "用户服务", "权限服务"],
        author: "赵六",
        date: "2023-11-28",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "change-5",
        type: "add",
        path: "/api/analytics/events",
        description: "添加新的事件分析API，用于跟踪和分析用户行为",
        impactLevel: "low",
        dependencies: ["分析服务", "事件处理服务"],
        author: "钱七",
        date: "2023-11-20",
        createdAt: now,
        updatedAt: now,
      },
    ]

    writeChanges(exampleChanges)

    // 为每个变更生成分析结果
    exampleChanges.forEach((change) => {
      analysisService.generateAnalysis(change.id)
    })
  }
}
