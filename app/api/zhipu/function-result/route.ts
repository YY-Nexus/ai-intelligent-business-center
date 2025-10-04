import { NextResponse } from "next/server"
import { ZhipuAI } from "zhipuai"

export async function POST(request: Request) {
  try {
    const { prompt, function_name, function_response } = await request.json()

    if (!prompt || !function_name || !function_response) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const client = new ZhipuAI({
      apiKey: process.env.ZHIPU_API_KEY,
    })

    // 创建对话历史
    const messages = [
      { role: "user", content: prompt },
      {
        role: "assistant",
        content: null,
        function_call: {
          name: function_name,
          arguments: JSON.stringify(function_response),
        },
      },
      {
        role: "function",
        name: function_name,
        content: JSON.stringify(function_response),
      },
    ]

    const completion = await client.chat.completions.create({
      model: "glm-4-0520",
      messages: messages,
    })

    // 提取响应
    const message = completion.choices[0].message

    // 构建结果
    const result = {
      content: message.content,
      function_call: message.function_call,
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error("智谱AI函数结果处理错误:", error)
    return NextResponse.json({ error: "处理函数结果时出错" }, { status: 500 })
  }
}
