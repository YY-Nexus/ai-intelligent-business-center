import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@neondatabase/serverless"

export async function POST(request: NextRequest) {
  try {
    // 获取会话ID
    const sessionId = cookies().get("session_id")?.value

    if (sessionId) {
      // 从数据库中删除会话
      await sql`
        DELETE FROM sessions WHERE id = ${sessionId}
      `

      // 清除cookie
      cookies().delete("session_id")
    }

    return NextResponse.json({ message: "已成功退出登录" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "退出登录过程中发生错误" }, { status: 500 })
  }
}
