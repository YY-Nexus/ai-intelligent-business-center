/**
 * 智谱AI大模型类型定义
 */

/**
 * 智谱AI模型信息
 */
export interface ZhipuModel {
  id: string
  name: string
  description: string
  maxTokens: number
  capabilities: string[]
  inputPrice: number // 每千tokens的输入价格（元）
  outputPrice: number // 每千tokens的输出价格（元）
}

/**
 * 智谱AI模型列表
 */
export const zhipuModels: ZhipuModel[] = [
  {
    id: "glm-4",
    name: "GLM-4",
    description: "智谱AI的旗舰大语言模型，具有强大的语言理解和生成能力，支持工具调用",
    maxTokens: 128000,
    capabilities: ["聊天对话", "文本生成", "内容创作", "代码生成", "Function Call", "工具调用"],
    inputPrice: 0.1, // 0.1元/千tokens
    outputPrice: 0.2, // 0.2元/千tokens
  },
  {
    id: "glm-4v",
    name: "GLM-4V",
    description: "智谱AI的视觉语言模型，支持图像理解和多模态交互",
    maxTokens: 128000,
    capabilities: ["聊天对话", "图像理解", "多模态交互", "OCR", "图表分析"],
    inputPrice: 0.1, // 0.1元/千tokens
    outputPrice: 0.2, // 0.2元/千tokens
  },
  {
    id: "glm-3-turbo",
    name: "GLM-3-Turbo",
    description: "智谱AI的高性能中大型语言模型，性能优秀，价格实惠",
    maxTokens: 16000,
    capabilities: ["聊天对话", "文本生成", "内容创作", "代码生成", "Function Call"],
    inputPrice: 0.005, // 0.005元/千tokens
    outputPrice: 0.015, // 0.015元/千tokens
  },
  {
    id: "chatglm_turbo",
    name: "ChatGLM Turbo",
    description: "基于ChatGLM架构的对话模型，响应速度快",
    maxTokens: 8192,
    capabilities: ["聊天对话", "文本生成"],
    inputPrice: 0.005, // 0.005元/千tokens
    outputPrice: 0.01, // 0.01元/千tokens
  },
]

/**
 * 生成嵌入请求选项
 */
export interface ZhipuEmbeddingOptions {
  model: string
  input: string | string[]
}

/**
 * 生成嵌入响应
 */
export interface ZhipuEmbeddingResponse {
  id: string
  object: string
  created: number
  model: string
  usage: {
    prompt_tokens: number
    total_tokens: number
  }
  data: {
    embedding: number[]
    index: number
    object: string
  }[]
}

/**
 * 工具定义
 */
export interface ZhipuTool {
  type: "function"
  function: {
    name: string
    description: string
    parameters: {
      type: "object"
      properties: Record<string, any>
      required?: string[]
    }
  }
}

/**
 * 文件上传响应
 */
export interface ZhipuFileUploadResponse {
  id: string
  object: string
  bytes: number
  created_at: number
  filename: string
  purpose: string
}

/**
 * 知识库搜索请求选项
 */
export interface ZhipuRetrievalOptions {
  model: string
  messages: any[]
  knowledge_id: string
  temperature?: number
  top_p?: number
  max_tokens?: number
}

/**
 * Web搜索请求选项
 */
export interface ZhipuWebSearchOptions {
  model: string
  messages: any[]
  web_search: {
    enable: boolean
    search_query?: string
  }
  temperature?: number
  top_p?: number
  max_tokens?: number
}
