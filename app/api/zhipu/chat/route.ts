import { NextResponse } from "next/server"
import { ZhipuAI } from "zhipuai"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "提示词不能为空" }, { status: 400 })
    }

    const client = new ZhipuAI({
      apiKey: process.env.ZHIPU_API_KEY,
    })

    const completion = await client.chat.completions.create({
      model: "glm-4-0520",
      messages: [{ role: "user", content: prompt }],
    })

    return NextResponse.json({
      message: completion.choices[0].message.content,
    })
  } catch (error) {
    console.error("智谱AI API调用错误:", error)
    return NextResponse.json({ error: "处理您的请求时出错" }, { status: 500 })
  }
}
