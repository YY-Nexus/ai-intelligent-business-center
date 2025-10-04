import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createHash } from "crypto"
import { sql } from "@neondatabase/serverless"

// 简单的密码哈希函数
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // 验证输入
    if (!email || !password) {
      return NextResponse.json({ error: "邮箱和密码不能为空" }, { status: 400 })
    }

    // 查询数据库验证用户
    const hashedPassword = hashPassword(password)
    const result = await sql`
      SELECT id, name, email, role, image, settings
      FROM users
      WHERE email = ${email} AND password_hash = ${hashedPassword}
    `

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "邮箱或密码不正确" }, { status: 401 })
    }

    const user = result.rows[0]

    // 创建会话
    const sessionId = createHash("sha256").update(Date.now().toString()).digest("hex")

    // 存储会话到数据库
    await sql`
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (${sessionId}, ${user.id}, ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)})
    `

    // 设置会话cookie
    cookies().set({
      name: "session_id",
      value: sessionId,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7天
      sameSite: "lax",
    })

    // 返回用户信息（不包含敏感数据）
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
    console.error("Login error:", error)
    return NextResponse.json({ error: "登录过程中发生错误" }, { status: 500 })
  }
}
