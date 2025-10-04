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

    // 获取要更新的用户数据
    const userData = await request.json()

    // 防止更新敏感字段
    delete userData.id
    delete userData.role
    delete userData.password_hash

    // 构建更新SQL
    const updateFields = []
    const updateValues = []

    for (const [key, value] of Object.entries(userData)) {
      if (key !== "settings") {
        // 设置通过专门的API更新
        updateFields.push(`${key} = $${updateFields.length + 1}`)
        updateValues.push(value)
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "没有提供要更新的字段" }, { status: 400 })
    }

    // 更新数据库
    const updateQuery = `
      UPDATE users
      SET ${updateFields.join(", ")}
      WHERE id = $${updateFields.length + 1}
      RETURNING id, name, email, role, image
    `

    updateValues.push(userId)

    const result = await sql.query(updateQuery, updateValues)

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "更新用户信息过程中发生错误" }, { status: 500 })
  }
}
