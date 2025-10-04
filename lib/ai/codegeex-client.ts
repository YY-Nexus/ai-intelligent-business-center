/**
 * CodeGeeX API客户端
 * 用于与智谱AI的CodeGeeX模型进行交互
 */

import { getZhipuApiKey } from "./ai-config-manager"
import { createHmac } from "crypto"
import { v4 as uuidv4 } from "uuid"

export interface CodeGeeXConfig {
  apiKey?: string
  apiUrl?: string
  version?: string
}

export interface CodeGeeXGenerateOptions {
  prompt: string
  language?: string
  max_tokens?: number
  temperature?: number
  top_p?: number
  stop_sequences?: string[]
  stream?: boolean
  user_id?: string
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

  constructor(config: CodeGeeXConfig = {}) {
    this.apiKey = config.apiKey || getZhipuApiKey() || ""
    this.apiUrl = config.apiUrl || "https://open.bigmodel.cn/api/paas/v4/code/completions"
    this.version = config.version || "codegeex-4"
  }

  /**
   * 设置API密钥
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("zhipu_api_key", apiKey)
      } catch (e) {
        console.error("保存智谱AI API密钥到localStorage失败:", e)
      }
    }
  }

  /**
   * 获取API密钥
   */
  getApiKey(): string {
    return this.apiKey
  }

  /**
   * 生成JWT令牌
   */
  private generateJWT(): string {
    if (!this.apiKey) {
      throw new Error("智谱AI API密钥未设置")
    }

    // 从API密钥中提取ID和密钥
    const [apiId, apiSecret] = this.apiKey.split(".")

    if (!apiId || !apiSecret) {
      throw new Error('无效的API密钥格式，应为"id.secret"格式')
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
   * 验证API密钥是否有效
   */
  async validateApiKey(): Promise<boolean> {
    if (!this.apiKey) return false

    try {
      const token = this.generateJWT()

      // 发送一个简单的请求来检查API密钥是否有效
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: this.version,
          prompt: "function hello() {",
          max_tokens: 1,
        }),
      })

      return response.ok
    } catch (error) {
      console.error("验证智谱AI API密钥失败:", error)
      return false
    }
  }

  /**
   * 生成代码
   */
  async generateCode(options: CodeGeeXGenerateOptions): Promise<CodeGeeXResponse> {
    if (!this.apiKey) {
      throw new Error("智谱AI API密钥未设置")
    }

    try {
      const token = this.generateJWT()

      const requestBody = {
        model: this.version,
        prompt: this.formatPromptWithLanguage(options.prompt, options.language),
        max_tokens: options.max_tokens || 2048,
        temperature: options.temperature || 0.7,
        top_p: options.top_p || 0.9,
        stop: options.stop_sequences || [],
        stream: options.stream || false,
        user_id: options.user_id,
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
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`智谱AI API错误 (${response.status}): ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
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
  async streamGenerateCode(
    options: CodeGeeXGenerateOptions,
    onData: (text: string) => void,
    onComplete: (fullText: string) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    if (!this.apiKey) {
      throw new Error("智谱AI API密钥未设置")
    }

    try {
      const token = this.generateJWT()

      const requestBody = {
        model: this.version,
        prompt: this.formatPromptWithLanguage(options.prompt, options.language),
        max_tokens: options.max_tokens || 2048,
        temperature: options.temperature || 0.7,
        top_p: options.top_p || 0.9,
        stop: options.stop_sequences || [],
        stream: true,
        user_id: options.user_id,
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
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`智谱AI API错误 (${response.status}): ${JSON.stringify(errorData)}`)
      }

      if (!response.body) {
        throw new Error("响应没有可读取的流")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder("utf-8")
      let fullText = ""
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") continue

            try {
              const parsedData = JSON.parse(data)
              if (parsedData.choices && parsedData.choices.length > 0) {
                const text = parsedData.choices[0].text || ""
                if (text) {
                  fullText += text
                  onData(text)
                }
              }
            } catch (e) {
              console.warn("解析流数据失败:", e)
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
  static getSupportedLanguages(): Array<{ value: string; label: string }> {
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
  static detectLanguage(code: string): string {
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

// 导出默认实例
export default new CodeGeeXClient()
