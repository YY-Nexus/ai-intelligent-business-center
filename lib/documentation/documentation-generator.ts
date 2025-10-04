import type { ApiConfig } from "@/lib/api-binding/config/config-types"

export interface ApiEndpoint {
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
  in: "path" | "query" | "header" | "cookie"
  description: string
  required: boolean
  schema: any
}

export interface ApiRequestBody {
  description: string
  required: boolean
  content: Record<string, { schema?: any; example?: any }>
}

export interface ApiResponse {
  statusCode: string
  description: string
  content?: Record<string, { schema?: any; example?: any }>
}

export interface ApiDocumentation {
  title: string
  description: string
  version: string
  endpoints: ApiEndpoint[]
}

export class DocumentationGenerator {
  /**
   * 从API配置生成文档
   */
  static generateFromConfig(config: ApiConfig): ApiDocumentation {
    // 基本文档信息
    const documentation: ApiDocumentation = {
      title: config.name || "API文档",
      description: config.description || "自动生成的API文档",
      version: config.version || "1.0.0",
      endpoints: [],
    }

    // 如果配置中有端点定义，添加到文档中
    if (config.endpoint) {
      const endpoint: ApiEndpoint = {
        path: config.endpoint,
        method: config.method || "GET",
        description: config.description || `${config.method || "GET"} ${config.endpoint}`,
        tags: config.tags || [],
        parameters: [],
        responses: [
          {
            statusCode: "200",
            description: "成功响应",
            content: {
              "application/json": {
                schema: config.responseSchema || { type: "object" },
                example: config.responseExample || {},
              },
            },
          },
          {
            statusCode: "400",
            description: "请求错误",
          },
          {
            statusCode: "401",
            description: "未授权",
          },
          {
            statusCode: "500",
            description: "服务器错误",
          },
        ],
      }

      // 添加请求体
      if (config.requestBody) {
        endpoint.requestBody = {
          description: "请求体",
          required: true,
          content: {
            "application/json": {
              schema: config.requestSchema || { type: "object" },
              example: config.requestExample || JSON.parse(config.requestBody),
            },
          },
        }
      }

      // 添加参数
      if (config.params) {
        Object.entries(config.params).forEach(([name, value]) => {
          endpoint.parameters.push({
            name,
            in: "query",
            description: `查询参数: ${name}`,
            required: false,
            schema: {
              type: typeof value,
              example: value,
            },
          })
        })
      }

      // 添加路径参数
      const pathParams = (config.endpoint.match(/\{([^}]+)\}/g) || []).map((param) => param.slice(1, -1))
      pathParams.forEach((name) => {
        endpoint.parameters.push({
          name,
          in: "path",
          description: `路径参数: ${name}`,
          required: true,
          schema: {
            type: "string",
          },
        })
      })

      // 添加头部参数
      if (config.headers) {
        Object.entries(config.headers).forEach(([name, value]) => {
          endpoint.parameters.push({
            name,
            in: "header",
            description: `请求头: ${name}`,
            required: false,
            schema: {
              type: "string",
              example: value,
            },
          })
        })
      }

      documentation.endpoints.push(endpoint)
    }

    return documentation
  }

  /**
   * 生成Markdown文档
   */
  static generateMarkdown(documentation: ApiDocumentation): string {
    let markdown = `# ${documentation.title}\n\n`
    markdown += `${documentation.description}\n\n`
    markdown += `版本: ${documentation.version}\n\n`

    // 生成目录
    markdown += `## 目录\n\n`
    documentation.endpoints.forEach((endpoint, index) => {
      markdown += `${index + 1}. [${endpoint.method} ${endpoint.path}](#${endpoint.method.toLowerCase()}-${endpoint.path.replace(/\//g, "").replace(/\{|\}/g, "")}) - ${endpoint.description}\n`
    })
    markdown += `\n`

    // 生成端点文档
    documentation.endpoints.forEach((endpoint) => {
      markdown += `## ${endpoint.method} ${endpoint.path}\n\n`
      markdown += `${endpoint.description}\n\n`

      // 标签
      if (endpoint.tags.length > 0) {
        markdown += `**标签:** ${endpoint.tags.join(", ")}\n\n`
      }

      // 参数
      if (endpoint.parameters.length > 0) {
        markdown += `### 参数\n\n`
        markdown += `| 名称 | 位置 | 描述 | 必填 | 类型 |\n`
        markdown += `| ---- | ---- | ---- | ---- | ---- |\n`

        endpoint.parameters.forEach((param) => {
          markdown += `| ${param.name} | ${param.in} | ${param.description} | ${param.required ? "是" : "否"} | ${param.schema.type || "object"} |\n`
        })

        markdown += `\n`
      }

      // 请求体
      if (endpoint.requestBody) {
        markdown += `### 请求体\n\n`
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
      markdown += `### 响应\n\n`
      endpoint.responses.forEach((response) => {
        markdown += `#### ${response.statusCode} - ${response.description}\n\n`

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

    return markdown
  }

  /**
   * 导出为OpenAPI
   */
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
