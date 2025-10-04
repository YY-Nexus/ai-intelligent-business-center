import { NextResponse } from "next/server"
import { ZhipuAI } from "zhipuai"

export async function POST(request: Request) {
  try {
    const { prompt, functions } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "提示词不能为空" }, { status: 400 })
    }

    const client = new ZhipuAI({
      apiKey: process.env.ZHIPU_API_KEY,
    })

    const completion = await client.chat.completions.create({
      model: "glm-4-0520", // 使用支持函数调用的模型
      messages: [{ role: "user", content: prompt }],
      functions: functions,
      function_call: "auto", // 让模型决定是否调用函数
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
    console.error("智谱AI函数调用错误:", error)
    return NextResponse.json({ error: "处理您的请求时出错" }, { status: 500 })
  }
}
