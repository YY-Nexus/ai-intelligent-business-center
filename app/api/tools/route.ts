import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// 模拟天气 API
async function getWeather(location: string) {
  // 在实际应用中，这里应该调用真实的天气 API
  console.log(`获取 ${location} 的天气信息`)

  // 返回模拟数据
  return {
    location,
    temperature: Math.floor(Math.random() * 30) + 5, // 5-35°C
    condition: ["晴朗", "多云", "小雨", "大雨", "雷雨", "雾"][Math.floor(Math.random() * 6)],
    humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
  }
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    // 定义工具
    const tools = [
      {
        name: "get_weather",
        description: "获取指定地点的天气信息",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "地点名称，如城市名",
            },
          },
          required: ["location"],
        },
      },
    ]

    // 使用 AI SDK 生成文本并处理工具调用
    const result = await generateText({
      model: openai("gpt-4o"),
      prompt: message,
      tools,
      tool_choice: "auto",
    })

    let weatherData = null

    // 检查是否有工具调用
    if (result.toolCalls && result.toolCalls.length > 0) {
      for (const toolCall of result.toolCalls) {
        if (toolCall.name === "get_weather") {
          const { location } = toolCall.arguments as { location: string }
          weatherData = await getWeather(location)
        }
      }
    }

    return new Response(
      JSON.stringify({
        response: result.text,
        weatherData,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error: any) {
    console.error("工具调用 API 错误:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
