import { NextResponse } from "next/server"
import type { RepairHistory } from "@/app/components/system-audit/repair-history"

// 模拟数据存储 - 实际应用中应替换为数据库
const historyStore: Record<string, RepairHistory[]> = {}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const timeRange = searchParams.get("timeRange") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

    if (!projectId) {
      return NextResponse.json({ error: "项目ID是必需的" }, { status: 400 })
    }

    // 获取项目的修复历史
    const projectHistory = historyStore[projectId] || []

    // 根据时间范围过滤
    let filteredHistory = [...projectHistory]
    const now = new Date()

    if (timeRange !== "all") {
      const startDate = new Date()

      switch (timeRange) {
        case "week":
          startDate.setDate(now.getDate() - 7)
          break
        case "month":
          startDate.setMonth(now.getMonth() - 1)
          break
        case "quarter":
          startDate.setMonth(now.getMonth() - 3)
          break
      }

      filteredHistory = filteredHistory.filter((h) => new Date(h.timestamp) >= startDate)
    }

    // 分页
    const paginatedHistory = filteredHistory.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      histories: paginatedHistory,
      total: filteredHistory.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("历史记录API错误:", error)
    return NextResponse.json(
      { error: "获取历史记录时发生错误", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { history, projectId } = body

    if (!history) {
      return NextResponse.json({ error: "需要提供有效的历史记录" }, { status: 400 })
    }

    if (!projectId) {
      return NextResponse.json({ error: "项目ID是必需的" }, { status: 400 })
    }

    // 初始化项目历史记录数组（如果不存在）
    if (!historyStore[projectId]) {
      historyStore[projectId] = []
    }

    // 添加新的历史记录
    historyStore[projectId].unshift(history)

    return NextResponse.json({
      success: true,
      historyId: history.id,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("历史记录API错误:", error)
    return NextResponse.json(
      { error: "保存历史记录时发生错误", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}
