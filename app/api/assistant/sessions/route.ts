import { type NextRequest, NextResponse } from "next/server"
import { ApiAssistantService } from "@/lib/api-assistant/assistant-service"

export async function GET() {
  try {
    const assistantService = ApiAssistantService.getInstance()
    const sessions = await assistantService.getSessions()

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("获取会话列表错误:", error)
    return NextResponse.json({ error: "获取会话列表时出错" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title } = body

    const assistantService = ApiAssistantService.getInstance()
    const session = await assistantService.createSession(title)

    return NextResponse.json(session)
  } catch (error) {
    console.error("创建会话错误:", error)
    return NextResponse.json({ error: "创建会话时出错" }, { status: 500 })
  }
}
