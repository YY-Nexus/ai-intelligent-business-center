"use client"

import { useState, useEffect } from "react"
import type { RepairStrategyType, RepairHistoryItem } from "@/types/repair"

export function useRepair() {
  // 默认修复策略
  const defaultStrategy: RepairStrategyType = {
    fixApiConnectivityIssues: true,
    fixConfigurationIssues: true,
    fixPerformanceIssues: true,
    fixSecurityIssues: true,
    priorityOrder: "severity",
    apiConnectivityPriority: 3,
    configurationPriority: 2,
    performancePriority: 1,
    securityPriority: 4,
    createBackupBeforeFix: true,
    rollbackOnFailureThreshold: 30,
    fixTimeout: 30,
  }

  const [repairStrategy, setRepairStrategy] = useState<RepairStrategyType>(defaultStrategy)
  const [repairHistory, setRepairHistory] = useState<RepairHistoryItem[]>([])
  const [isRepairing, setIsRepairing] = useState(false)

  // 从本地存储加载修复策略和历史记录
  useEffect(() => {
    try {
      // 加载修复策略
      const savedStrategy = localStorage.getItem("repairStrategy")
      if (savedStrategy) {
        setRepairStrategy(JSON.parse(savedStrategy))
      }

      // 加载修复历史
      const savedHistory = localStorage.getItem("repairHistory")
      if (savedHistory) {
        setRepairHistory(JSON.parse(savedHistory))
      } else {
        // 如果没有历史记录，添加一些模拟数据
        setRepairHistory([
          {
            id: "repair-1",
            timestamp: Date.now() - 86400000 * 3, // 3天前
            problems: [
              {
                id: "api-1",
                type: "apiConnectivity",
                name: "智谱GLM API连接问题",
                description: "连接超时，无法访问API服务",
                status: "fixed",
                severity: "high",
                fixDescription: "已修复API连接问题，确保与AI提供商的通信正常。",
              },
              {
                id: "config-1",
                type: "configuration",
                name: "路由规则配置问题",
                description: "存在冗余路由规则，影响路由效率",
                status: "fixed",
                severity: "medium",
                fixDescription: "已修复配置问题，确保系统配置正确。",
              },
              {
                id: "perf-1",
                type: "performance",
                name: "缓存命中率低",
                description: "缓存命中率低于60%，影响系统性能",
                status: "failed",
                severity: "low",
                error: "修复过程中遇到技术问题，需要手动干预。",
              },
            ],
            strategy: defaultStrategy,
            totalProblems: 3,
            fixedProblems: 2,
            failedProblems: 1,
            duration: 15000, // 15秒
            systemHealthBefore: 75,
            systemHealthAfter: 85,
            problemSummary: [
              { type: "apiConnectivity", count: 1, fixed: 1 },
              { type: "configuration", count: 1, fixed: 1 },
              { type: "performance", count: 1, fixed: 0 },
            ],
          },
          {
            id: "repair-2",
            timestamp: Date.now() - 86400000, // 1天前
            problems: [
              {
                id: "security-1",
                type: "security",
                name: "API密钥暴露风险",
                description: "API密钥存储不安全，存在泄露风险",
                status: "fixed",
                severity: "critical",
                fixDescription: "已修复安全漏洞，增强系统安全性。",
              },
            ],
            strategy: {
              ...defaultStrategy,
              fixApiConnectivityIssues: false,
              fixConfigurationIssues: false,
              fixPerformanceIssues: false,
            },
            totalProblems: 1,
            fixedProblems: 1,
            failedProblems: 0,
            duration: 8000, // 8秒
            systemHealthBefore: 85,
            systemHealthAfter: 95,
            problemSummary: [{ type: "security", count: 1, fixed: 1 }],
          },
        ])
      }
    } catch (error) {
      console.error("加载修复策略或历史记录失败:", error)
    }
  }, [])

  // 保存修复策略到本地存储
  useEffect(() => {
    try {
      localStorage.setItem("repairStrategy", JSON.stringify(repairStrategy))
    } catch (error) {
      console.error("保存修复策略失败:", error)
    }
  }, [repairStrategy])

  // 保存修复历史到本地存储
  useEffect(() => {
    try {
      localStorage.setItem("repairHistory", JSON.stringify(repairHistory))
    } catch (error) {
      console.error("保存修复历史失败:", error)
    }
  }, [repairHistory])

  // 添加修复历史记录
  const addRepairHistory = (historyItem: RepairHistoryItem) => {
    setRepairHistory((prev) => [historyItem, ...prev])
  }

  return {
    repairStrategy,
    setRepairStrategy,
    repairHistory,
    addRepairHistory,
    isRepairing,
    setIsRepairing,
  }
}
