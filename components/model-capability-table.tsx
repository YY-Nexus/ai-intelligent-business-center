"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ModelCapabilityTable() {
  const capabilities = [
    { name: "文本生成", description: "生成连贯、上下文相关的文本内容" },
    { name: "图像生成", description: "根据文本描述生成图像" },
    { name: "代码生成", description: "生成和完成代码片段" },
    { name: "多轮对话", description: "维持上下文的多轮对话能力" },
    { name: "知识问答", description: "回答基于事实的知识性问题" },
    { name: "内容摘要", description: "总结长文本内容" },
    { name: "情感分析", description: "分析文本的情感倾向" },
    { name: "多语言支持", description: "支持多种语言的处理能力" },
    { name: "文本嵌入", description: "生成文本的向量表示" },
  ]

  const models = [
    {
      name: "文心一言",
      provider: "百度",
      capabilities: {
        文本生成: true,
        图像生成: true,
        代码生成: true,
        多轮对话: true,
        知识问答: true,
        内容摘要: true,
        情感分析: true,
        多语言支持: true,
        文本嵌入: true,
      },
    },
    {
      name: "星火认知",
      provider: "讯飞",
      capabilities: {
        文本生成: true,
        图像生成: false,
        代码生成: true,
        多轮对话: true,
        知识问答: true,
        内容摘要: true,
        情感分析: true,
        多语言支持: true,
        文本嵌入: true,
      },
    },
    {
      name: "ChatGLM",
      provider: "智谱AI",
      capabilities: {
        文本生成: true,
        图像生成: false,
        代码生成: true,
        多轮对话: true,
        知识问答: true,
        内容摘要: true,
        情感分析: true,
        多语言支持: true,
        文本嵌入: true,
      },
    },
    {
      name: "通义千问",
      provider: "阿里云",
      capabilities: {
        文本生成: true,
        图像生成: true,
        代码生成: true,
        多轮对话: true,
        知识问答: true,
        内容摘要: true,
        情感分析: true,
        多语言支持: true,
        文本嵌入: true,
      },
    },
    {
      name: "混元",
      provider: "腾讯云",
      capabilities: {
        文本生成: true,
        图像生成: false,
        代码生成: true,
        多轮对话: true,
        知识问答: true,
        内容摘要: true,
        情感分析: true,
        多语言支持: true,
        文本嵌入: false,
      },
    },
    {
      name: "ABAB",
      provider: "MiniMax",
      capabilities: {
        文本生成: true,
        图像生成: false,
        代码生成: true,
        多轮对话: true,
        知识问答: true,
        内容摘要: true,
        情感分析: true,
        多语言支持: true,
        文本嵌入: false,
      },
    },
    {
      name: "Moonshot",
      provider: "Moonshot AI",
      capabilities: {
        文本生成: true,
        图像生成: false,
        代码生成: true,
        多轮对话: true,
        知识问答: true,
        内容摘要: true,
        情感分析: true,
        多语言支持: true,
        文本嵌入: true,
      },
    },
    {
      name: "Baichuan",
      provider: "百川智能",
      capabilities: {
        文本生成: true,
        图像生成: false,
        代码生成: true,
        多轮对话: true,
        知识问答: true,
        内容摘要: true,
        情感分析: true,
        多语言支持: true,
        文本嵌入: false,
      },
    },
  ]

  return (
    <TooltipProvider>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">能力/模型</TableHead>
                {models.map((model) => (
                  <TableHead key={model.name} className="text-center">
                    {model.name}
                    <div className="text-xs text-muted-foreground">{model.provider}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {capabilities.map((capability) => (
                <TableRow key={capability.name}>
                  <TableCell className="font-medium">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 cursor-help">
                        {capability.name}
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{capability.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  {models.map((model) => (
                    <TableCell key={`${model.name}-${capability.name}`} className="text-center">
                      {model.capabilities[capability.name] ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  )
}
