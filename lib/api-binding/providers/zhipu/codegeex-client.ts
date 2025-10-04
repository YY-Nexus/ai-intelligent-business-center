/**
 * CodeGeeX API 客户端
 * 提供与智谱AI的CodeGeeX模型交互的功能
 */

import { v4 as uuidv4 } from "uuid"
import { createHmac } from "crypto"

export interface CodeGeeXConfig {
  apiKey: string
  apiUrl?: string
  version?: string
}

export interface CodeGeeXGenerateOptions {
  prompt: string
  language?: string
  maxTokens?: number
  temperature?: number
  topP?: number
  stopSequences?: string[]
  stream?: boolean
}

export interface CodeGeeXResponse {
  success: boolean
  data: {
    id: string
    object: string
    created: number
    model: string
    choices: Array<{
      index: number
      finish_reason: string
      text: string
    }>
    usage: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
  }
  error?: string
}

export class CodeGeeXClient {
  private apiKey: string
  private apiUrl: string
  private version: string

  constructor(config: CodeGeeXConfig) {
    this.apiKey = config.apiKey
    this.apiUrl = config.apiUrl || "https://open.bigmodel.cn/api/paas/v4/code/completions"
    this.version = config.version || "codegeex-4"
  }

  /**
   * 生成JWT令牌
   */
  private generateToken(): string {
    // 从API密钥中提取ID和密钥
    const [apiId, apiSecret] = this.apiKey.split(".")

    if (!apiId || !apiSecret) {
      throw new Error("无效的API密钥格式，应为'id.secret'格式")
    }

    const payload = {
      api_key: apiId,
      exp: Math.floor(Date.now() / 1000) + 3600,
      timestamp: Math.floor(Date.now() / 1000),
    }

    // 创建JWT头部
    const header = { alg: "HS256", typ: "JWT" }

    // Base64编码头部和载荷
    const headerBase64 = Buffer.from(JSON.stringify(header)).toString("base64").replace(/=/g, "")
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64").replace(/=/g, "")

    // 创建签名
    const signature = createHmac("sha256", apiSecret)
      .update(`${headerBase64}.${payloadBase64}`)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")

    // 返回完整的JWT
    return `${headerBase64}.${payloadBase64}.${signature}`
  }

  /**
   * 生成代码
   */
  public async generateCode(options: CodeGeeXGenerateOptions): Promise<CodeGeeXResponse> {
    try {
      const token = this.generateToken()

      const requestBody = {
        model: this.version,
        prompt: this.formatPromptWithLanguage(options.prompt, options.language),
        max_tokens: options.maxTokens || 2048,
        temperature: options.temperature || 0.7,
        top_p: options.topP || 0.9,
        stop: options.stopSequences || [],
        stream: options.stream || false,
      }

      console.log("CodeGeeX请求参数:", JSON.stringify(requestBody))

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("CodeGeeX API错误:", data)
        throw new Error(data.error?.message || `请求失败: ${response.status}`)
      }

      return {
        success: true,
        data: {
          id: data.id || uuidv4(),
          object: data.object || "code_completion",
          created: data.created || Date.now(),
          model: data.model || this.version,
          choices: data.choices || [],
          usage: data.usage || {
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
          },
        },
      }
    } catch (error: any) {
      console.error("CodeGeeX生成代码失败:", error)
      return {
        success: false,
        data: {
          id: uuidv4(),
          object: "code_completion",
          created: Date.now(),
          model: this.version,
          choices: [],
          usage: {
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
          },
        },
        error: error.message || "生成代码失败",
      }
    }
  }

  /**
   * 流式生成代码
   */
  public async streamGenerateCode(
    options: CodeGeeXGenerateOptions,
    onData: (text: string) => void,
    onComplete: (fullText: string) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    try {
      const token = this.generateToken()

      const requestBody = {
        model: this.version,
        prompt: this.formatPromptWithLanguage(options.prompt, options.language),
        max_tokens: options.maxTokens || 2048,
        temperature: options.temperature || 0.7,
        top_p: options.topP || 0.9,
        stop: options.stopSequences || [],
        stream: true,
      }

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || `请求失败: ${response.status}`)
      }

      if (!response.body) {
        throw new Error("响应体为空")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n").filter((line) => line.trim() !== "")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") continue

            try {
              const parsedData = JSON.parse(data)
              if (parsedData.choices && parsedData.choices.length > 0) {
                const text = parsedData.choices[0].text || ""
                fullText += text
                onData(text)
              }
            } catch (e) {
              console.error("解析流数据失败:", e)
            }
          }
        }
      }

      onComplete(fullText)
    } catch (error: any) {
      console.error("CodeGeeX流式生成失败:", error)
      onError(error.message || "流式生成失败")
    }
  }

  /**
   * 根据语言格式化提示词
   */
  private formatPromptWithLanguage(prompt: string, language?: string): string {
    if (!language) return prompt

    // 为不同语言添加特定的提示词格式
    switch (language.toLowerCase()) {
      case "typescript":
      case "javascript":
        return `${prompt}\n\n// 使用${language}实现:\n`
      case "python":
        return `${prompt}\n\n# 使用Python实现:\n`
      case "java":
        return `${prompt}\n\n// 使用Java实现:\n`
      case "cpp":
      case "c++":
        return `${prompt}\n\n// 使用C++实现:\n`
      case "go":
        return `${prompt}\n\n// 使用Go实现:\n`
      case "rust":
        return `${prompt}\n\n// 使用Rust实现:\n`
      default:
        return prompt
    }
  }

  /**
   * 获取支持的编程语言
   */
  public static getSupportedLanguages(): Array<{ value: string; label: string }> {
    return [
      { value: "typescript", label: "TypeScript" },
      { value: "javascript", label: "JavaScript" },
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
      { value: "cpp", label: "C++" },
      { value: "go", label: "Go" },
      { value: "rust", label: "Rust" },
      { value: "sql", label: "SQL" },
      { value: "html", label: "HTML" },
      { value: "css", label: "CSS" },
      { value: "php", label: "PHP" },
      { value: "csharp", label: "C#" },
      { value: "swift", label: "Swift" },
      { value: "kotlin", label: "Kotlin" },
    ]
  }

  /**
   * 检测代码语言
   */
  public static detectLanguage(code: string): string {
    // 简单的语言检测逻辑
    if (code.includes("import React") || code.includes("useState") || code.includes("export default")) {
      return "typescript"
    } else if (code.includes("function") && code.includes("return") && code.includes("{")) {
      return "javascript"
    } else if (code.includes("def ") && code.includes(":")) {
      return "python"
    } else if (code.includes("public class") || code.includes("private void")) {
      return "java"
    } else if (code.includes("#include")) {
      return "cpp"
    } else if (code.includes("package main") || code.includes("func ")) {
      return "go"
    } else {
      return "unknown"
    }
  }
}
