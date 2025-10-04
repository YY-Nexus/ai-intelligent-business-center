import { type NextRequest, NextResponse } from "next/server"
import { ApiAssistantService } from "@/lib/api-assistant/assistant-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, sessionId, context } = body

    if (!message) {
      return NextResponse.json({ error: "消息不能为空" }, { status: 400 })
    }

    const assistantService = ApiAssistantService.getInstance()
    const response = await assistantService.sendMessage({
      message,
      sessionId,
      context,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("API助手错误:", error)
    return NextResponse.json({ error: "处理请求时出错" }, { status: 500 })
  }
}
