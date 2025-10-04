import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@neondatabase/serverless"

export async function PUT(request: NextRequest) {
  try {
    // 获取会话ID
    const sessionId = cookies().get("session_id")?.value

    if (!sessionId) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    // 查询会话
    const sessionResult = await sql`
      SELECT user_id, expires_at
      FROM sessions
      WHERE id = ${sessionId}
    `

    if (sessionResult.rowCount === 0 || new Date(sessionResult.rows[0].expires_at) < new Date()) {
      cookies().delete("session_id")
      return NextResponse.json({ error: "会话已过期" }, { status: 401 })
    }

    const userId = sessionResult.rows[0].user_id

    // 获取当前用户设置
    const userResult = await sql`
      SELECT settings FROM users WHERE id = ${userId}
    `

    if (userResult.rowCount === 0) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    const currentSettings = userResult.rows[0].settings || {}

    // 获取要更新的设置
    const newSettings = await request.json()

    // 合并设置
    const updatedSettings = {
      ...currentSettings,
      ...newSettings,
      notifications: {
        ...currentSettings.notifications,
        ...newSettings.notifications,
      },
    }

    // 更新数据库
    await sql`
      UPDATE users
      SET settings = ${JSON.stringify(updatedSettings)}
      WHERE id = ${userId}
    `

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error("Update settings error:", error)
    return NextResponse.json({ error: "更新设置过程中发生错误" }, { status: 500 })
  }
}
