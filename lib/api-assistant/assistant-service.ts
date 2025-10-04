import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { nanoid } from "nanoid"
import { sql } from "@vercel/postgres"
import type {
  ApiAssistantMessage,
  ApiAssistantRequest,
  ApiAssistantResponse,
  ApiAssistantSession,
  ApiAssistantFeedback,
} from "./types"

export class ApiAssistantService {
  private static instance: ApiAssistantService

  private constructor() {}

  public static getInstance(): ApiAssistantService {
    if (!ApiAssistantService.instance) {
      ApiAssistantService.instance = new ApiAssistantService()
    }
    return ApiAssistantService.instance
  }

  /**
   * 创建新的会话
   */
  public async createSession(title = "新会话"): Promise<ApiAssistantSession> {
    const id = nanoid()
    const now = new Date()

    // 创建系统提示消息
    const systemMessage: ApiAssistantMessage = {
      id: nanoid(),
      role: "system",
      content: this.getSystemPrompt(),
      createdAt: now,
    }

    // 创建会话
    const session: ApiAssistantSession = {
      id,
      title,
      createdAt: now,
      updatedAt: now,
      messages: [systemMessage],
    }

    // 保存到数据库
    await sql`
      INSERT INTO api_assistant_sessions (id, title, created_at, updated_at)
      VALUES (${session.id}, ${session.title}, ${session.createdAt.toISOString()}, ${session.updatedAt.toISOString()})
    `

    await sql`
      INSERT INTO api_assistant_messages (id, session_id, role, content, created_at)
      VALUES (${systemMessage.id}, ${session.id}, ${systemMessage.role}, ${systemMessage.content}, ${systemMessage.createdAt.toISOString()})
    `

    return session
  }

  /**
   * 获取会话列表
   */
  public async getSessions(): Promise<ApiAssistantSession[]> {
    const { rows } = await sql`
      SELECT id, title, created_at, updated_at
      FROM api_assistant_sessions
      ORDER BY updated_at DESC
    `

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      messages: [],
    }))
  }

  /**
   * 获取会话详情
   */
  public async getSession(sessionId: string): Promise<ApiAssistantSession | null> {
    const { rows: sessionRows } = await sql`
      SELECT id, title, created_at, updated_at
      FROM api_assistant_sessions
      WHERE id = ${sessionId}
    `

    if (sessionRows.length === 0) {
      return null
    }

    const session = {
      id: sessionRows[0].id,
      title: sessionRows[0].title,
      createdAt: new Date(sessionRows[0].created_at),
      updatedAt: new Date(sessionRows[0].updated_at),
      messages: [],
    }

    const { rows: messageRows } = await sql`
      SELECT id, role, content, created_at
      FROM api_assistant_messages
      WHERE session_id = ${sessionId}
      ORDER BY created_at ASC
    `

    session.messages = messageRows.map((row) => ({
      id: row.id,
      role: row.role,
      content: row.content,
      createdAt: new Date(row.created_at),
    }))

    return session
  }

  /**
   * 发送消息并获取回复
   */
  public async sendMessage(request: ApiAssistantRequest): Promise<ApiAssistantResponse> {
    let session: ApiAssistantSession

    // 获取或创建会话
    if (request.sessionId) {
      const existingSession = await this.getSession(request.sessionId)
      if (!existingSession) {
        throw new Error(`会话不存在: ${request.sessionId}`)
      }
      session = existingSession
    } else {
      session = await this.createSession()
    }

    // 创建用户消息
    const userMessage: ApiAssistantMessage = {
      id: nanoid(),
      role: "user",
      content: request.message,
      createdAt: new Date(),
    }

    // 保存用户消息到数据库
    await sql`
      INSERT INTO api_assistant_messages (id, session_id, role, content, created_at)
      VALUES (${userMessage.id}, ${session.id}, ${userMessage.role}, ${userMessage.content}, ${userMessage.createdAt.toISOString()})
    `

    // 更新会话时间
    await sql`
      UPDATE api_assistant_sessions
      SET updated_at = ${new Date().toISOString()}, title = CASE WHEN title = '新会话' THEN ${this.generateSessionTitle(request.message)} ELSE title END
      WHERE id = ${session.id}
    `

    // 准备消息历史
    const messages = [...session.messages, userMessage]

    // 添加上下文信息
    let contextPrompt = ""
    if (request.context) {
      if (request.context.apiDefinitions) {
        contextPrompt += "\n\nAPI定义:\n" + JSON.stringify(request.context.apiDefinitions, null, 2)
      }
      if (request.context.apiDocumentation) {
        contextPrompt += "\n\nAPI文档:\n" + request.context.apiDocumentation
      }
      if (request.context.codeSnippets && request.context.codeSnippets.length > 0) {
        contextPrompt += "\n\n代码片段:\n" + request.context.codeSnippets.join("\n\n")
      }
      if (request.context.errorLogs) {
        contextPrompt += "\n\n错误日志:\n" + request.context.errorLogs
      }
      if (request.context.userPreferences) {
        contextPrompt += "\n\n用户偏好:\n" + JSON.stringify(request.context.userPreferences, null, 2)
      }
    }

    if (contextPrompt) {
      messages.push({
        id: nanoid(),
        role: "system",
        content: "以下是当前上下文信息，请在回答用户问题时参考这些信息：" + contextPrompt,
        createdAt: new Date(),
      })
    }

    // 调用Groq API获取回复
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      maxTokens: 2048,
    })

    // 创建助手消息
    const assistantMessage: ApiAssistantMessage = {
      id: nanoid(),
      role: "assistant",
      content: text,
      createdAt: new Date(),
    }

    // 保存助手消息到数据库
    await sql`
      INSERT INTO api_assistant_messages (id, session_id, role, content, created_at)
      VALUES (${assistantMessage.id}, ${session.id}, ${assistantMessage.role}, ${assistantMessage.content}, ${assistantMessage.createdAt.toISOString()})
    `

    // 解析回复中的代码和建议
    const { code, codeLanguage, suggestedActions } = this.parseAssistantResponse(text)

    return {
      id: assistantMessage.id,
      message: text,
      code,
      codeLanguage,
      suggestedActions,
    }
  }

  /**
   * 提交反馈
   */
  public async submitFeedback(feedback: ApiAssistantFeedback): Promise<void> {
    await sql`
      INSERT INTO api_assistant_feedback (message_id, rating, comment, created_at)
      VALUES (${feedback.messageId}, ${feedback.rating}, ${feedback.comment || null}, ${new Date().toISOString()})
    `
  }

  /**
   * 删除会话
   */
  public async deleteSession(sessionId: string): Promise<void> {
    await sql`
      DELETE FROM api_assistant_messages
      WHERE session_id = ${sessionId}
    `

    await sql`
      DELETE FROM api_assistant_sessions
      WHERE id = ${sessionId}
    `
  }

  /**
   * 获取系统提示词
   */
  private getSystemPrompt(): string {
    return `你是API OS系统的智能助手，专门帮助用户解决API开发、集成和管理方面的问题。

你的主要职责包括：
1. 回答用户关于API设计、开发、测试和部署的问题
2. 帮助用户理解和使用各种API，包括REST、GraphQL、WebSocket等
3. 提供API相关的代码示例和最佳实践
4. 协助用户解决API集成过程中遇到的问题
5. 提供API安全、性能优化和监控方面的建议

请注意以下几点：
- 回答应该简洁明了，直接解决用户的问题
- 提供的代码示例应该符合最佳实践，并且易于理解
- 优先考虑用户提供的上下文信息
- 如果用户的问题不清楚，请礼貌地要求澄清
- 回答中应该包含实用的建议和可操作的步骤

你的回答应该专业、准确，并且对中国用户友好。`
  }

  /**
   * 生成会话标题
   */
  private generateSessionTitle(message: string): string {
    // 简单地截取消息的前20个字符作为标题
    return message.length > 20 ? message.substring(0, 20) + "..." : message
  }

  /**
   * 解析助手回复
   */
  private parseAssistantResponse(text: string): {
    code?: string
    codeLanguage?: string
    suggestedActions?: { title: string; description: string; action: string }[]
  } {
    const result: {
      code?: string
      codeLanguage?: string
      suggestedActions?: { title: string; description: string; action: string }[]
    } = {}

    // 提取代码块
    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g
    const codeBlocks = [...text.matchAll(codeBlockRegex)]

    if (codeBlocks.length > 0) {
      const firstCodeBlock = codeBlocks[0]
      result.codeLanguage = firstCodeBlock[1] || "plaintext"
      result.code = firstCodeBlock[2].trim()
    }

    // 尝试提取建议的操作
    // 这里使用一个简单的启发式方法，寻找"建议"、"可以"、"推荐"等关键词后面的短句
    const actionKeywords = ["建议", "可以", "推荐", "尝试", "考虑"]
    const sentences = text.split(/[。！？.!?]/)

    const suggestedActions: { title: string; description: string; action: string }[] = []

    for (const sentence of sentences) {
      for (const keyword of actionKeywords) {
        if (sentence.includes(keyword) && sentence.length < 100 && sentence.length > 10) {
          const action = sentence.trim()
          suggestedActions.push({
            title: action.substring(0, Math.min(20, action.length)) + (action.length > 20 ? "..." : ""),
            description: action,
            action: "suggestion",
          })
          break
        }
      }

      if (suggestedActions.length >= 3) break
    }

    if (suggestedActions.length > 0) {
      result.suggestedActions = suggestedActions
    }

    return result
  }
}
