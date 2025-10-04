import { type NextRequest, NextResponse } from "next/server"
import { analysisService, changeService } from "@/lib/services/data-storage-service"
import type { ApiResponse, ImpactAnalysis } from "@/lib/models/impact-analysis-types"

// 获取变更的分析结果
export async function GET(request: NextRequest, { params }: { params: { changeId: string } }) {
  try {
    const changeId = params.changeId

    // 检查变更是否存在
    const change = changeService.getChange(changeId)
    if (!change) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "未找到指定变更",
          timestamp: new Date().toISOString(),
        },
        { status: 404 },
      )
    }

    // 获取分析结果
    let analysis = analysisService.getAnalysisForChange(changeId)

    // 如果没有分析结果，生成一个
    if (!analysis) {
      analysis = analysisService.generateAnalysis(changeId)

      if (!analysis) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            message: "无法生成分析结果",
            timestamp: new Date().toISOString(),
          },
          { status: 500 },
        )
      }
    }

    const response: ApiResponse<ImpactAnalysis> = {
      success: true,
      data: analysis,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("获取分析结果失败:", error)

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "获取分析结果失败",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// 创建或更新分析结果
export async function POST(request: NextRequest, { params }: { params: { changeId: string } }) {
  try {
    const changeId = params.changeId
    const body = await request.json()

    // 检查变更是否存在
    const change = changeService.getChange(changeId)
    if (!change) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "未找到指定变更",
          timestamp: new Date().toISOString(),
        },
        { status: 404 },
      )
    }

    // 验证必填字段
    const requiredFields = ["affectedApis", "affectedServices", "affectedClients", "riskLevel", "recommendations"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            message: `缺少必填字段: ${field}`,
            timestamp: new Date().toISOString(),
          },
          { status: 400 },
        )
      }
    }

    const analysis = analysisService.saveAnalysis({
      changeId,
      ...body,
    })

    const response: ApiResponse<ImpactAnalysis> = {
      success: true,
      data: analysis,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("保存分析结果失败:", error)

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "保存分析结果失败",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// 删除分析结果
export async function DELETE(request: NextRequest, { params }: { params: { changeId: string } }) {
  try {
    const changeId = params.changeId

    // 获取分析结果
    const analysis = analysisService.getAnalysisForChange(changeId)

    if (!analysis) {
      return NextResponse.json(
        {
          success: false,
          message: "未找到指定分析结果",
          timestamp: new Date().toISOString(),
        },
        { status: 404 },
      )
    }

    // 删除分析结果
    const success = analysisService.deleteAnalysis(analysis.id)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "删除分析结果失败",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "分析结果已删除",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("删除分析结果失败:", error)

    return NextResponse.json(
      {
        success: false,
        message: "删除分析结果失败",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
