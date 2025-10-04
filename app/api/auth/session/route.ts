import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    // 获取会话ID
    const sessionId = cookies().get("session_id")?.value

    if (!sessionId) {
      return NextResponse.json({ user: null })
    }

    // 查询会话
    const sessionResult = await sql`
      SELECT user_id, expires_at
      FROM sessions
      WHERE id = ${sessionId}
    `

    if (sessionResult.rowCount === 0) {
      cookies().delete("session_id")
      return NextResponse.json({ user: null })
    }

    const session = sessionResult.rows[0]

    // 检查会话是否过期
    if (new Date(session.expires_at) < new Date()) {
      // 删除过期会话
      await sql`
        DELETE FROM sessions WHERE id = ${sessionId}
      `
      cookies().delete("session_id")
      return NextResponse.json({ user: null })
    }

    // 获取用户信息
    const userResult = await sql`
      SELECT id, name, email, role, image, settings
      FROM users
      WHERE id = ${session.user_id}
    `

    if (userResult.rowCount === 0) {
      cookies().delete("session_id")
      return NextResponse.json({ user: null })
    }

    const user = userResult.rows[0]

    // 返回用户信息
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        settings: user.settings,
      },
    })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ error: "获取会话信息过程中发生错误" }, { status: 500 })
  }
}
