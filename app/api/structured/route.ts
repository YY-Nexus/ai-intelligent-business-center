import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"

// 定义电影推荐的结构
const movieRecommendationSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "电影标题",
    },
    year: {
      type: "number",
      description: "电影发行年份",
    },
    genre: {
      type: "string",
      description: "电影类型，如科幻、动作、喜剧等",
    },
    director: {
      type: "string",
      description: "电影导演",
    },
    description: {
      type: "string",
      description: "电影简短描述",
    },
    rating: {
      type: "number",
      description: "电影评分，1-10分",
    },
  },
  required: ["title", "year", "genre", "director", "description", "rating"],
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    // 使用 AI SDK 生成结构化对象
    const result = await generateObject({
      model: openai("gpt-4o"),
      schema: movieRecommendationSchema,
      prompt: `根据以下主题或类型推荐一部电影: ${prompt}。请提供电影的标题、年份、类型、导演、简短描述和评分（1-10分）。`,
    })

    return new Response(JSON.stringify(result.object), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("结构化输出 API 错误:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
