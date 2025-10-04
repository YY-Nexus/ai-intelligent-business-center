import { NextResponse } from "next/server"
import type { Problem, ProblemType } from "@/app/components/system-audit/auto-fix-engine"

// 模拟ML预测函数 - 实际应用中应替换为真实ML模型
function predictRepairSuccess(problem: Problem): number {
  // 基于问题类型的基础成功率
  const baseRateByType: Record<ProblemType, number> = {
    framework: 85,
    fileCompliance: 90,
    interaction: 80,
    missingFeature: 70,
  }

  // 基于严重程度的调整
  const severityAdjustment = {
    critical: -15,
    high: -10,
    medium: 0,
    low: +5,
  }

  // 计算预测成功率
  let predictedRate = baseRateByType[problem.type] || 75

  // 应用严重程度调整
  if (problem.severity) {
    predictedRate += severityAdjustment[problem.severity] || 0
  }

  // 添加一些随机性以模拟ML模型的变化
  predictedRate += Math.random() * 10 - 5

  // 确保在0-100范围内
  return Math.max(0, Math.min(100, predictedRate))
}

// 模拟ML预测修复时间函数
function predictRepairTime(problem: Problem): number {
  // 基于问题类型的基础修复时间（秒）
  const baseTimeByType: Record<ProblemType, number> = {
    framework: 180,
    fileCompliance: 120,
    interaction: 150,
    missingFeature: 300,
  }

  // 基于严重程度的调整
  const severityAdjustment = {
    critical: 120,
    high: 60,
    medium: 0,
    low: -30,
  }

  // 计算预测修复时间
  let predictedTime = baseTimeByType[problem.type] || 180

  // 应用严重程度调整
  if (problem.severity) {
    predictedTime += severityAdjustment[problem.severity] || 0
  }

  // 添加一些随机性以模拟ML模型的变化
  predictedTime += Math.random() * 60 - 30

  // 确保至少30秒
  return Math.max(30, predictedTime)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { problems, predictionType = "all" } = body

    if (!problems || !Array.isArray(problems) || problems.length === 0) {
      return NextResponse.json({ error: "需要提供有效的问题列表" }, { status: 400 })
    }

    const predictions = problems.map((problem) => {
      const result: any = { problemId: problem.id }

      if (predictionType === "all" || predictionType === "success") {
        result.successRate = predictRepairSuccess(problem)
      }

      if (predictionType === "all" || predictionType === "time") {
        result.repairTime = predictRepairTime(problem)
      }

      return result
    })

    return NextResponse.json({
      success: true,
      predictions,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("ML预测API错误:", error)
    return NextResponse.json(
      { error: "执行预测时发生错误", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}
