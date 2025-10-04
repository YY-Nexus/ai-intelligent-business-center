import { type NextRequest, NextResponse } from "next/server"
import { ApiAssistantService } from "@/lib/api-assistant/assistant-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messageId, rating, comment } = body

    if (!messageId || !rating) {
      return NextResponse.json({ error: "消息ID和评分是必需的" }, { status: 400 })
    }

    const assistantService = ApiAssistantService.getInstance()
    await assistantService.submitFeedback({
      messageId,
      rating,
      comment,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("提交反馈错误:", error)
    return NextResponse.json({ error: "提交反馈时出错" }, { status: 500 })
  }
}
