import { ApiClient } from "../../core/api-client"
import type { RequestConfig } from "../../request/request-types"
import type { NormalizedResponse } from "../../response/response-types"
import type { GLM4VRequestOptions, GLM4VResponse, GLM4VMessage } from "./glm4v-types"

/**
 * GLM-4V API客户端
 * 用于与智谱AI的GLM-4V系列模型进行交互
 */
export class GLM4VClient extends ApiClient {
  constructor(apiKey: string, baseUrl = "https://open.bigmodel.cn/api/paas/v4") {
    super({
      baseUrl,
      defaultHeaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    })
  }

  /**
   * 发送聊天请求到GLM-4V模型
   * @param options 请求选项
   * @returns 模型响应
   */
  public async chat(options: GLM4VRequestOptions): Promise<NormalizedResponse<GLM4VResponse>> {
    const { model = "glm-4v-flash", messages, stream = false, temperature, top_p, max_tokens, user_id } = options

    const requestConfig: RequestConfig = {
      method: "POST",
      url: `${this.config.baseUrl}/chat/completions`,
      headers: { ...this.config.defaultHeaders },
      body: {
        model,
        messages,
        stream,
        ...(temperature !== undefined && { temperature }),
        ...(top_p !== undefined && { top_p }),
        ...(max_tokens !== undefined && { max_tokens }),
        ...(user_id !== undefined && { user_id }),
      },
    }

    return this.request<GLM4VResponse>(requestConfig)
  }

  /**
   * 处理图像理解请求
   * @param imageUrl 图像URL或Base64编码
   * @param prompt 提示文本
   * @param options 其他选项
   * @returns 模型响应
   */
  public async imageUnderstanding(
    imageUrl: string,
    prompt: string,
    options: Omit<GLM4VRequestOptions, "messages"> = {},
  ): Promise<NormalizedResponse<GLM4VResponse>> {
    const isBase64 = imageUrl.startsWith("data:") || !imageUrl.startsWith("http")

    const messages: GLM4VMessage[] = [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ]

    return this.chat({
      ...options,
      messages,
    })
  }

  /**
   * 处理视频理解请求
   * @param videoUrl 视频URL或Base64编码
   * @param prompt 提示文本
   * @param options 其他选项
   * @returns 模型响应
   */
  public async videoUnderstanding(
    videoUrl: string,
    prompt: string,
    options: Omit<GLM4VRequestOptions, "messages"> = {},
  ): Promise<NormalizedResponse<GLM4VResponse>> {
    const messages: GLM4VMessage[] = [
      {
        role: "user",
        content: [
          {
            type: "video_url",
            video_url: {
              url: videoUrl,
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ]

    return this.chat({
      ...options,
      messages,
    })
  }

  /**
   * 多轮对话
   * @param messages 消息历史
   * @param options 其他选项
   * @returns 模型响应
   */
  public async multiTurnChat(
    messages: GLM4VMessage[],
    options: Omit<GLM4VRequestOptions, "messages"> = {},
  ): Promise<NormalizedResponse<GLM4VResponse>> {
    return this.chat({
      ...options,
      messages,
    })
  }

  /**
   * 流式输出处理
   * @param options 请求选项
   * @param onChunk 处理每个数据块的回调函数
   */
  public async streamChat(
    options: GLM4VRequestOptions & { stream: true },
    onChunk: (chunk: any) => void,
  ): Promise<void> {
    const { model = "glm-4v-flash", messages, temperature, top_p, max_tokens, user_id } = options

    const requestConfig: RequestConfig = {
      method: "POST",
      url: `${this.config.baseUrl}/chat/completions`,
      headers: {
        ...this.config.defaultHeaders,
        Accept: "text/event-stream",
      },
      body: {
        model,
        messages,
        stream: true,
        ...(temperature !== undefined && { temperature }),
        ...(top_p !== undefined && { top_p }),
        ...(max_tokens !== undefined && { max_tokens }),
        ...(user_id !== undefined && { user_id }),
      },
    }

    const response = await fetch(requestConfig.url, {
      method: requestConfig.method,
      headers: requestConfig.headers as Record<string, string>,
      body: JSON.stringify(requestConfig.body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (!response.body) {
      throw new Error("Response body is null")
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") {
              return
            }
            try {
              const chunk = JSON.parse(data)
              onChunk(chunk)
            } catch (e) {
              console.error("Error parsing chunk:", e)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }
}
