import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  if (!token || !email) {
    return NextResponse.json({ success: false, message: "缺少必要参数" }, { status: 400 })
  }

  try {
    // 这里应该是实际的令牌验证逻辑
    // 例如，从数据库中查询令牌是否存在且未过期
    // 并且与提供的邮箱匹配

    // 模拟验证过程
    const isValid = true // 假设令牌有效

    if (isValid) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: "令牌无效或已过期" }, { status: 400 })
    }
  } catch (error) {
    console.error("验证令牌失败:", error)
    return NextResponse.json({ success: false, message: "服务器错误" }, { status: 500 })
  }
}
