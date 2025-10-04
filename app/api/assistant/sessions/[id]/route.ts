import { type NextRequest, NextResponse } from "next/server"
import { ApiAssistantService } from "@/lib/api-assistant/assistant-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = params.id

    const assistantService = ApiAssistantService.getInstance()
    const session = await assistantService.getSession(sessionId)

    if (!session) {
      return NextResponse.json({ error: "会话不存在" }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error("获取会话详情错误:", error)
    return NextResponse.json({ error: "获取会话详情时出错" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = params.id

    const assistantService = ApiAssistantService.getInstance()
    await assistantService.deleteSession(sessionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("删除会话错误:", error)
    return NextResponse.json({ error: "删除会话时出错" }, { status: 500 })
  }
}
