import { StreamingTextResponse } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { googleGenerativeAI } from "@ai-sdk/google"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

// 定义支持的模型映射
const modelMap = {
  openai: openai("gpt-4o"),
  anthropic: anthropic("claude-3-opus-20240229"),
  google: googleGenerativeAI("gemini-1.5-pro"),
  groq: groq("llama3-70b-8192"),
}

export async function POST(req: Request) {
  try {
    // 解析请求体
    const { messages, provider = "openai" } = await req.json()

    // 获取选择的模型
    const model = modelMap[provider as keyof typeof modelMap] || modelMap.openai

    // 使用 AI SDK 生成文本
    const result = await generateText({
      model,
      messages,
      temperature: 0.7,
      stream: true,
    })

    // 返回流式响应
    return new StreamingTextResponse(result.textStream)
  } catch (error: any) {
    console.error("聊天 API 错误:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
