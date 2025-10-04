import { NextResponse } from "next/server"
import { ZhipuAI } from "zhipuai"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "提示词不能为空" }, { status: 400 })
    }

    // 创建一个可读流
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const client = new ZhipuAI({
            apiKey: process.env.ZHIPU_API_KEY,
          })

          const stream = await client.chat.completions.create({
            model: "glm-4-0520",
            messages: [{ role: "user", content: prompt }],
            stream: true,
          })

          // 处理流式响应
          for await (const chunk of stream) {
            if (chunk.choices[0]?.delta?.content) {
              controller.enqueue(new TextEncoder().encode(chunk.choices[0].delta.content))
            }
          }
          controller.close()
        } catch (error) {
          console.error("智谱AI流式调用错误:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error("智谱AI API调用错误:", error)
    return NextResponse.json({ error: "处理您的请求时出错" }, { status: 500 })
  }
}
