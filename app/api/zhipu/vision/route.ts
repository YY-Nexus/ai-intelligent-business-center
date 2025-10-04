import { NextResponse } from "next/server"
import { ZhipuAI } from "zhipuai"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    const prompt = formData.get("prompt") as string

    if (!image) {
      return NextResponse.json({ error: "图片不能为空" }, { status: 400 })
    }

    if (!prompt) {
      return NextResponse.json({ error: "提示词不能为空" }, { status: 400 })
    }

    // 将图片转换为base64
    const imageBuffer = await image.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString("base64")
    const mimeType = image.type
    const dataURI = `data:${mimeType};base64,${base64Image}`

    const client = new ZhipuAI({
      apiKey: process.env.ZHIPU_API_KEY,
    })

    const completion = await client.chat.completions.create({
      model: "glm-4v", // 使用支持视觉的模型
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: dataURI } },
          ],
        },
      ],
    })

    return NextResponse.json({
      message: completion.choices[0].message.content,
    })
  } catch (error) {
    console.error("智谱AI视觉识别错误:", error)
    return NextResponse.json({ error: "处理您的请求时出错" }, { status: 500 })
  }
}
