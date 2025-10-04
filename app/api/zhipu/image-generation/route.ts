import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "提示词不能为空" }, { status: 400 })
    }

    // 这里应该调用智谱AI的CogView API
    // 由于CogView API可能需要特殊的认证和处理，这里使用模拟数据

    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 返回一个随机的占位图像
    // 在实际应用中，这里应该返回CogView API生成的图像URL
    const imageUrl = `https://source.unsplash.com/random/512x512/?${encodeURIComponent(prompt)}`

    return NextResponse.json({
      imageUrl,
    })
  } catch (error) {
    console.error("图像生成错误:", error)
    return NextResponse.json({ error: "处理您的请求时出错" }, { status: 500 })
  }
}
