"use client"

import { useParams } from "next/navigation"
import { ApiDocTemplate } from "@/components/api-documentation/api-doc-template"

export default function ApiDocSubcategoryPage() {
  const params = useParams()
  const { category, subcategory } = params

  // 这里应该根据category和subcategory从API或本地数据获取文档内容
  // 这里使用模拟数据
  const docData = {
    title: "OpenAI GPT-4 API调用示例",
    description: "使用JavaScript/TypeScript调用OpenAI GPT-4 API的完整指南",
    language: "JavaScript",
    category: "AI模型与SDK",
    lastUpdated: "2023年5月15日",
    author: "YanYu云³团队",
    tags: ["OpenAI", "GPT-4", "AI", "大模型"],
    markdown: "# OpenAI GPT-4 API调用指南\n\n这里是详细的API文档内容...",
    requestExample: `import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "你是一个有用的助手。" },
      { role: "user", content: "解释什么是API？" }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  console.log(completion.choices[0].message);
}

main();`,
    responseExample: `{
  "id": "chatcmpl-123abc456def",
  "object": "chat.completion",
  "created": 1677858242,
  "model": "gpt-4",
  "usage": {
    "prompt_tokens": 13,
    "completion_tokens": 120,
    "total_tokens": 133
  },
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "API（应用程序编程接口）是一组定义和协议，用于构建和集成应用程序软件。它定义了组件之间如何交互，允许不同的软件系统相互通信。API可以看作是软件组件之间的契约，规定了如何交换信息。\\n\\n例如，当你使用手机应用查看天气时，该应用通过天气服务提供商的API获取数据。API使开发人员能够利用现有功能而不必从头开始构建，从而加速开发过程并提高效率。"
      },
      "finish_reason": "stop",
      "index": 0
    }
  ]
}`,
    sdkExample: `import { OpenAI } from "ai";

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 使用AI SDK调用GPT-4
export async function generateText(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "你是一个专业的API文档助手。" },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 1000,
  });
  
  return response.choices[0].message.content || "无法生成回复";
}`,
    apiSpecification: {
      openapi: "3.0.0",
      info: {
        title: "OpenAI API",
        description: "OpenAI GPT-4 API规范",
        version: "1.0.0",
      },
      servers: [
        {
          url: "https://api.openai.com/v1",
          description: "OpenAI API服务器",
        },
      ],
      paths: {
        "/chat/completions": {
          post: {
            summary: "创建聊天完成",
            description: "使用GPT模型创建聊天完成",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      model: {
                        type: "string",
                        description: "要使用的模型ID",
                        example: "gpt-4",
                      },
                      messages: {
                        type: "array",
                        description: "消息数组",
                        items: {
                          type: "object",
                          properties: {
                            role: {
                              type: "string",
                              description: "消息角色",
                              enum: ["system", "user", "assistant"],
                            },
                            content: {
                              type: "string",
                              description: "消息内容",
                            },
                          },
                        },
                      },
                      temperature: {
                        type: "number",
                        description: "采样温度",
                        minimum: 0,
                        maximum: 2,
                        default: 1,
                      },
                      max_tokens: {
                        type: "integer",
                        description: "生成的最大令牌数",
                        minimum: 1,
                      },
                    },
                    required: ["model", "messages"],
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "成功响应",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          description: "响应ID",
                        },
                        object: {
                          type: "string",
                          description: "对象类型",
                        },
                        created: {
                          type: "integer",
                          description: "创建时间戳",
                        },
                        model: {
                          type: "string",
                          description: "使用的模型",
                        },
                        choices: {
                          type: "array",
                          description: "生成的选项",
                          items: {
                            type: "object",
                            properties: {
                              message: {
                                type: "object",
                                properties: {
                                  role: {
                                    type: "string",
                                    description: "消息角色",
                                  },
                                  content: {
                                    type: "string",
                                    description: "消息内容",
                                  },
                                },
                              },
                              finish_reason: {
                                type: "string",
                                description: "完成原因",
                              },
                              index: {
                                type: "integer",
                                description: "选项索引",
                              },
                            },
                          },
                        },
                        usage: {
                          type: "object",
                          properties: {
                            prompt_tokens: {
                              type: "integer",
                              description: "提示使用的令牌数",
                            },
                            completion_tokens: {
                              type: "integer",
                              description: "完成使用的令牌数",
                            },
                            total_tokens: {
                              type: "integer",
                              description: "总令牌数",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              "400": {
                description: "请求错误",
              },
              "401": {
                description: "认证错误",
              },
              "429": {
                description: "请求过多",
              },
              "500": {
                description: "服务器错误",
              },
            },
            security: [
              {
                bearerAuth: [],
              },
            ],
          },
        },
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  }

  return (
    <div className="container mx-auto py-6">
      <ApiDocTemplate {...docData} />
    </div>
  )
}
