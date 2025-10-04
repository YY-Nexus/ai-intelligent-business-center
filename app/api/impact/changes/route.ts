import { type NextRequest, NextResponse } from "next/server"
import { changeService, initializeExampleData } from "@/lib/services/data-storage-service"
import type { ApiResponse, Change, PaginationParams, FilterParams } from "@/lib/models/impact-analysis-types"

// 确保示例数据已初始化
initializeExampleData()

// 获取变更列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // 解析分页和过滤参数
    const params: PaginationParams & FilterParams = {
      page: searchParams.has("page") ? Number.parseInt(searchParams.get("page") as string) : 1,
      pageSize: searchParams.has("pageSize") ? Number.parseInt(searchParams.get("pageSize") as string) : 10,
      sortBy: (searchParams.get("sortBy") as string) || "date",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
      type: (searchParams.get("type") as "add" | "modify" | "remove") || undefined,
      impactLevel: (searchParams.get("impactLevel") as "high" | "medium" | "low") || undefined,
      author: searchParams.get("author") || undefined,
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
      search: searchParams.get("search") || undefined,
    }

    const { changes, total, page, pageSize, totalPages } = changeService.getChanges(params)

    const response: ApiResponse<Change[]> = {
      success: true,
      data: changes,
      timestamp: new Date().toISOString(),
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("获取变更列表失败:", error)

    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "获取变更列表失败",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

// 创建新变更
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证必填字段
    const requiredFields = ["type", "path", "description", "impactLevel", "dependencies", "author", "date"]
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

    const newChange = changeService.createChange(body)

    const response: ApiResponse<Change> = {
      success: true,
      data: newChange,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("创建变更失败:", error)

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "创建变更失败",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
