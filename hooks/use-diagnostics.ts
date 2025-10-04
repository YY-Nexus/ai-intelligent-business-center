"use client"

import { useState, useCallback } from "react"
import type { Problem } from "@/types/repair"

export function useDiagnostics() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [isProblemDetectionRunning, setIsProblemDetectionRunning] = useState(false)
  const [detectionProgress, setDetectionProgress] = useState(0)
  const [diagnosticsResults, setDiagnosticsResults] = useState<any>(null)
  const [lastDiagnosticsRun, setLastDiagnosticsRun] = useState<number | null>(null)

  // 运行系统诊断
  const runSystemDiagnostics = useCallback(async () => {
    setIsProblemDetectionRunning(true)
    setDetectionProgress(0)
    setProblems([])

    try {
      // 模拟诊断过程
      for (let i = 1; i <= 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        setDetectionProgress(i * 10)
      }

      // 模拟诊断结果
      const results = {
        apiConnectivity: {
          score: 75,
          details: [
            { name: "百度文心一言API", status: "ok" },
            { name: "讯飞星火API", status: "warning", message: "响应时间较长" },
            { name: "智谱GLM API", status: "error", message: "连接失败" },
            { name: "阿里通义千问API", status: "ok" },
          ],
        },
        configurationIssues: {
          score: 85,
          details: [
            { name: "API密钥配置", status: "ok" },
            { name: "路由规则配置", status: "warning", message: "存在冗余规则" },
            { name: "模型参数配置", status: "ok" },
            { name: "环境变量配置", status: "ok" },
          ],
        },
        performanceMetrics: {
          score: 70,
          details: [
            { name: "平均响应时间", status: "warning", message: "响应时间超过1秒" },
            { name: "并发请求处理", status: "ok" },
            { name: "缓存命中率", status: "warning", message: "缓存命中率低于60%" },
            { name: "资源利用率", status: "ok" },
          ],
        },
        securityIssues: {
          score: 90,
          details: [
            { name: "API密钥安全", status: "ok" },
            { name: "请求验证", status: "ok" },
            { name: "数据加密", status: "ok" },
            { name: "访问控制", status: "ok" },
          ],
        },
      }

      setDiagnosticsResults(results)

      // 生成问题列表
      const detectedProblems: Problem[] = []

      // API连接问题
      if (results.apiConnectivity.score < 100) {
        results.apiConnectivity.details.forEach((detail, index) => {
          if (detail.status === "warning" || detail.status === "error") {
            detectedProblems.push({
              id: `api-${index}`,
              type: "apiConnectivity",
              name: `${detail.name}连接问题`,
              description: detail.message || `${detail.name}连接异常`,
              status: "pending",
              severity: detail.status === "error" ? "high" : "medium",
              fixSuccessRate: detail.status === "error" ? 75 : 90,
            })
          }
        })
      }

      // 配置问题
      if (results.configurationIssues.score < 100) {
        results.configurationIssues.details.forEach((detail, index) => {
          if (detail.status === "warning" || detail.status === "error") {
            detectedProblems.push({
              id: `config-${index}`,
              type: "configuration",
              name: `${detail.name}配置问题`,
              description: detail.message || `${detail.name}配置异常`,
              status: "pending",
              severity: detail.status === "error" ? "high" : "medium",
              fixSuccessRate: detail.status === "error" ? 80 : 95,
            })
          }
        })
      }

      // 性能问题
      if (results.performanceMetrics.score < 100) {
        results.performanceMetrics.details.forEach((detail, index) => {
          if (detail.status === "warning" || detail.status === "error") {
            detectedProblems.push({
              id: `perf-${index}`,
              type: "performance",
              name: `${detail.name}性能问题`,
              description: detail.message || `${detail.name}性能异常`,
              status: "pending",
              severity: detail.status === "error" ? "high" : "low",
              fixSuccessRate: detail.status === "error" ? 70 : 85,
            })
          }
        })
      }

      // 安全问题
      if (results.securityIssues.score < 100) {
        results.securityIssues.details.forEach((detail, index) => {
          if (detail.status === "warning" || detail.status === "error") {
            detectedProblems.push({
              id: `security-${index}`,
              type: "security",
              name: `${detail.name}安全问题`,
              description: detail.message || `${detail.name}安全异常`,
              status: "pending",
              severity: detail.status === "error" ? "critical" : "high",
              fixSuccessRate: detail.status === "error" ? 65 : 80,
            })
          }
        })
      }

      // 添加一些模拟问题，确保有足够的问题可以修复
      if (detectedProblems.length < 3) {
        detectedProblems.push(
          {
            id: "api-fallback",
            type: "apiConnectivity",
            name: "API故障转移配置缺失",
            description: "系统缺少API故障自动转移配置，可能导致单点故障",
            status: "pending",
            severity: "high",
            fixSuccessRate: 85,
          },
          {
            id: "config-validation",
            type: "configuration",
            name: "配置验证机制不完善",
            description: "系统缺少配置验证机制，可能导致错误配置被应用",
            status: "pending",
            severity: "medium",
            fixSuccessRate: 90,
          },
          {
            id: "perf-caching",
            type: "performance",
            name: "缓存策略优化",
            description: "当前缓存策略效率低下，需要优化以提高性能",
            status: "pending",
            severity: "low",
            fixSuccessRate: 95,
          },
        )
      }

      setProblems(detectedProblems)
      setLastDiagnosticsRun(Date.now())
    } catch (error) {
      console.error("诊断过程出错:", error)
    } finally {
      setIsProblemDetectionRunning(false)
      setDetectionProgress(100)
    }
  }, [])

  return {
    problems,
    isProblemDetectionRunning,
    detectionProgress,
    runSystemDiagnostics,
    diagnosticsResults,
    lastDiagnosticsRun,
  }
}
