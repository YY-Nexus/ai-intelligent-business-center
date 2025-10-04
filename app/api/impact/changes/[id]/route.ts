import { type NextRequest, NextResponse } from "next/server"
import { changeService } from "@/lib/services/data-storage-service"
import type { ApiResponse, Change } from "@/lib/models/impact-analysis-types"

// 获取单个变更
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const change = changeService.getChange(id)

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

    const response: ApiResponse<Change> = {
      success: true,
      data: change,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("获取变更详情失败:", error)

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "获取变更详情失败",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// 更新变更
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    const updatedChange = changeService.updateChange(id, body)

    if (!updatedChange) {
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

    const response: ApiResponse<Change> = {
      success: true,
      data: updatedChange,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("更新变更失败:", error)

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "更新变更失败",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// 删除变更
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const success = changeService.deleteChange(id)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "未找到指定变更",
          timestamp: new Date().toISOString(),
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "变更已删除",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("删除变更失败:", error)

    return NextResponse.json(
      {
        success: false,
        message: "删除变更失败",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
