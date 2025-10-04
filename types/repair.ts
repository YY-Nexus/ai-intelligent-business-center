// 问题类型
export type ProblemType = "apiConnectivity" | "configuration" | "performance" | "security"

// 问题严重程度
export type ProblemSeverity = "critical" | "high" | "medium" | "low"

// 问题状态
export type ProblemStatus = "pending" | "fixing" | "fixed" | "failed"

// 问题定义
export interface Problem {
  id: string
  type: ProblemType
  name: string
  description: string
  status: ProblemStatus
  severity?: ProblemSeverity
  fixDescription?: string
  error?: string
  fixSuccessRate?: number // 修复成功率预估 (0-100)
}

// 系统状态快照
export interface SystemSnapshot {
  id: string
  timestamp: Date
  description: string
  data: any // 实际应用中，这里应该包含系统状态数据
}

// 修复策略
export interface RepairStrategyType {
  fixApiConnectivityIssues: boolean
  fixConfigurationIssues: boolean
  fixPerformanceIssues: boolean
  fixSecurityIssues: boolean
  priorityOrder: "severity" | "fixSuccess" | "custom"
  apiConnectivityPriority: number
  configurationPriority: number
  performancePriority: number
  securityPriority: number
  createBackupBeforeFix: boolean
  rollbackOnFailureThreshold: number
  fixTimeout: number
}

// 问题摘要
export interface ProblemSummary {
  type: string
  count: number
  fixed: number
}

// 修复历史记录
export interface RepairHistoryItem {
  id: string
  timestamp: number
  problems: Problem[]
  strategy: RepairStrategyType
  totalProblems: number
  fixedProblems: number
  failedProblems: number
  duration: number // 毫秒
  systemHealthBefore: number // 0-100
  systemHealthAfter: number // 0-100
  problemSummary: ProblemSummary[]
}
