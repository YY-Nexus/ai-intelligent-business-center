import { type NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"
import { sql } from "@neondatabase/serverless"

// 简单的密码哈希函数
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // 验证输入
    if (!name || !email || !password) {
      return NextResponse.json({ error: "姓名、邮箱和密码不能为空" }, { status: 400 })
    }

    // 检查邮箱是否已存在
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.rowCount > 0) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 409 })
    }

    // 默认用户设置
    const defaultSettings = {
      theme: "system",
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      language: "zh-CN",
      timezone: "Asia/Shanghai",
    }

    // 创建新用户
    const hashedPassword = hashPassword(password)
    await sql`
      INSERT INTO users (name, email, password_hash, role, settings)
      VALUES (${name}, ${email}, ${hashedPassword}, ${"user"}, ${JSON.stringify(defaultSettings)})
    `

    return NextResponse.json({ message: "注册成功，请登录" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "注册过程中发生错误" }, { status: 500 })
  }
}
