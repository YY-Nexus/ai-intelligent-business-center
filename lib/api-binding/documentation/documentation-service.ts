// API文档服务类型定义
export interface ApiDocumentation {
  id: string
  configId: string
  title: string
  description: string
  version: string
  endpoints: ApiEndpoint[]
  updatedAt: string
}

export interface ApiEndpoint {
  id: string
  path: string
  method: string
  description: string
  tags: string[]
  parameters: ApiParameter[]
  requestBody?: ApiRequestBody
  responses: ApiResponse[]
}

export interface ApiParameter {
  name: string
  in: "query" | "path" | "header" | "cookie"
  description: string
  required: boolean
  schema: {
    type: string
    format?: string
  }
}

export interface ApiRequestBody {
  description: string
  required: boolean
  content: {
    [contentType: string]: {
      schema: any
      example?: any
    }
  }
}

export interface ApiResponse {
  statusCode: string
  description: string
  content?: {
    [contentType: string]: {
      schema: any
      example?: any
    }
  }
}

// 本地存储键
const STORAGE_KEY_PREFIX = "api-documentation-"

// API文档服务
export class ApiDocumentationService {
  // 获取API文档
  static getDocumentationByApiId(configId: string): ApiDocumentation | null {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${configId}`
      const storedDoc = localStorage.getItem(storageKey)
      return storedDoc ? JSON.parse(storedDoc) : null
    } catch (error) {
      console.error("获取API文档失败:", error)
      return null
    }
  }

  // 保存API文档
  static saveDocumentation(documentation: ApiDocumentation): boolean {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${documentation.configId}`
      localStorage.setItem(storageKey, JSON.stringify(documentation))
      return true
    } catch (error) {
      console.error("保存API文档失败:", error)
      return false
    }
  }

  // 删除API文档
  static deleteDocumentation(configId: string): boolean {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${configId}`
      localStorage.removeItem(storageKey)
      return true
    } catch (error) {
      console.error("删除API文档失败:", error)
      return false
    }
  }

  // 创建新端点
  static createEndpoint(): ApiEndpoint {
    return {
      id: `endpoint-${Date.now()}`,
      path: "",
      method: "GET",
      description: "",
      tags: [],
      parameters: [],
      responses: [
        {
          statusCode: "200",
          description: "成功响应",
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
      ],
    }
  }

  // 创建新参数
  static createParameter(): ApiParameter {
    return {
      name: "",
      in: "query",
      description: "",
      required: false,
      schema: {
        type: "string",
      },
    }
  }

  // 创建新响应
  static createResponse(): ApiResponse {
    return {
      statusCode: "200",
      description: "成功响应",
      content: {
        "application/json": {
          schema: { type: "object" },
        },
      },
    }
  }

  // 导出为Markdown
  static exportToMarkdown(documentation: ApiDocumentation): string {
    let markdown = `# ${documentation.title}\n\n`
    markdown += `${documentation.description}\n\n`
    markdown += `**版本:** ${documentation.version}\n\n`
    markdown += `---\n\n`

    // 按标签分组端点
    const endpointsByTag: Record<string, ApiEndpoint[]> = {}
    documentation.endpoints.forEach((endpoint) => {
      if (endpoint.tags.length === 0) {
        const tag = "默认"
        endpointsByTag[tag] = endpointsByTag[tag] || []
        endpointsByTag[tag].push(endpoint)
      } else {
        endpoint.tags.forEach((tag) => {
          endpointsByTag[tag] = endpointsByTag[tag] || []
          endpointsByTag[tag].push(endpoint)
        })
      }
    })

    // 生成每个标签的文档
    Object.entries(endpointsByTag).forEach(([tag, endpoints]) => {
      markdown += `## ${tag}\n\n`

      endpoints.forEach((endpoint) => {
        markdown += `### ${endpoint.method} ${endpoint.path}\n\n`
        markdown += `${endpoint.description}\n\n`

        // 参数
        if (endpoint.parameters.length > 0) {
          markdown += `#### 参数\n\n`
          markdown += `| 名称 | 位置 | 描述 | 必填 | 类型 |\n`
          markdown += `| ---- | ---- | ---- | ---- | ---- |\n`
          endpoint.parameters.forEach((param) => {
            markdown += `| ${param.name} | ${param.in} | ${param.description} | ${
              param.required ? "是" : "否"
            } | ${param.schema.type} |\n`
          })
          markdown += `\n`
        }

        // 请求体
        if (endpoint.requestBody) {
          markdown += `#### 请求体\n\n`
          markdown += `${endpoint.requestBody.description}\n\n`
          markdown += `**必填:** ${endpoint.requestBody.required ? "是" : "否"}\n\n`

          Object.entries(endpoint.requestBody.content).forEach(([contentType, content]) => {
            markdown += `**Content-Type: ${contentType}**\n\n`
            if (content.schema) {
              markdown += "```json\n"
              markdown += JSON.stringify(content.schema, null, 2)
              markdown += "\n```\n\n"
            }
            if (content.example) {
              markdown += "示例:\n\n"
              markdown += "```json\n"
              markdown += JSON.stringify(content.example, null, 2)
              markdown += "\n```\n\n"
            }
          })
        }

        // 响应
        markdown += `#### 响应\n\n`
        endpoint.responses.forEach((response) => {
          markdown += `##### ${response.statusCode} - ${response.description}\n\n`

          if (response.content) {
            Object.entries(response.content).forEach(([contentType, content]) => {
              markdown += `**Content-Type: ${contentType}**\n\n`
              if (content.schema) {
                markdown += "```json\n"
                markdown += JSON.stringify(content.schema, null, 2)
                markdown += "\n```\n\n"
              }
              if (content.example) {
                markdown += "示例:\n\n"
                markdown += "```json\n"
                markdown += JSON.stringify(content.example, null, 2)
                markdown += "\n```\n\n"
              }
            })
          }
        })

        markdown += `---\n\n`
      })
    })

    return markdown
  }

  // 导出为OpenAPI
  static exportToOpenAPI(documentation: ApiDocumentation): any {
    const openapi: any = {
      openapi: "3.0.0",
      info: {
        title: documentation.title,
        description: documentation.description,
        version: documentation.version,
      },
      paths: {},
      components: {
        schemas: {},
        securitySchemes: {},
      },
    }

    // 添加路径
    documentation.endpoints.forEach((endpoint) => {
      if (!openapi.paths[endpoint.path]) {
        openapi.paths[endpoint.path] = {}
      }

      const method = endpoint.method.toLowerCase()
      openapi.paths[endpoint.path][method] = {
        summary: endpoint.description,
        description: endpoint.description,
        tags: endpoint.tags.length > 0 ? endpoint.tags : ["默认"],
        parameters: endpoint.parameters.map((param) => ({
          name: param.name,
          in: param.in,
          description: param.description,
          required: param.required,
          schema: param.schema,
        })),
        responses: {},
      }

      // 添加请求体
      if (endpoint.requestBody) {
        openapi.paths[endpoint.path][method].requestBody = {
          description: endpoint.requestBody.description,
          required: endpoint.requestBody.required,
          content: endpoint.requestBody.content,
        }
      }

      // 添加响应
      endpoint.responses.forEach((response) => {
        openapi.paths[endpoint.path][method].responses[response.statusCode] = {
          description: response.description,
          content: response.content,
        }
      })
    })

    return openapi
  }
}
