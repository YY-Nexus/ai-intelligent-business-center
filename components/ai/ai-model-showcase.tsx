"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Zap, Code, FileText, MessageSquare, ImageIcon, Cpu } from "lucide-react"

interface ModelFeature {
  icon: React.ReactNode
  title: string
  description: string
}

interface ModelProvider {
  name: string
  logo: string
  website: string
}

interface AiModel {
  id: string
  name: string
  description: string
  provider: ModelProvider
  features: ModelFeature[]
  capabilities: string[]
  tags: string[]
  isNew?: boolean
  isPopular?: boolean
  image?: string
}

const aiModels: AiModel[] = [
  {
    id: "glm4v",
    name: "GLM-4V",
    description: "智谱AI最新一代多模态大语言模型，支持视觉理解、文本生成和复杂推理",
    provider: {
      name: "智谱AI",
      logo: "/images/zhipu-logo.png",
      website: "https://www.zhipuai.cn/",
    },
    features: [
      {
        icon: <ImageIcon className="h-5 w-5 text-purple-500" />,
        title: "多模态理解",
        description: "可以理解图像内容并进行详细描述和分析",
      },
      {
        icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
        title: "对话能力",
        description: "支持自然、连贯的多轮对话，具有上下文理解能力",
      },
      {
        icon: <Cpu className="h-5 w-5 text-purple-500" />,
        title: "知识推理",
        description: "能够进行复杂的逻辑推理和知识应用",
      },
    ],
    capabilities: ["图像理解", "文本生成", "代码辅助", "知识问答", "数据分析"],
    tags: ["多模态", "中文优化", "高精度"],
    isNew: true,
    isPopular: true,
    image: "/placeholder.svg?key=1k24s",
  },
  {
    id: "cogview",
    name: "CogView",
    description: "智源研究院开发的文生图模型，支持中英文提示词生成高质量图像",
    provider: {
      name: "智源研究院",
      logo: "/images/baai-logo.png",
      website: "https://www.baai.ac.cn/",
    },
    features: [
      {
        icon: <ImageIcon className="h-5 w-5 text-pink-500" />,
        title: "文本到图像",
        description: "根据文本描述生成相应的图像内容",
      },
      {
        icon: <Zap className="h-5 w-5 text-pink-500" />,
        title: "风格多样化",
        description: "支持多种艺术风格和视觉效果的生成",
      },
      {
        icon: <FileText className="h-5 w-5 text-pink-500" />,
        title: "中文优化",
        description: "针对中文提示词进行了特别优化",
      },
    ],
    capabilities: ["文生图", "风格转换", "图像编辑", "创意设计"],
    tags: ["生成式AI", "中文优化", "创意设计"],
    isPopular: true,
    image: "/placeholder.svg?key=pdlzr",
  },
  {
    id: "codegeex",
    name: "CodeGeeX",
    description: "智谱AI开发的代码生成模型，支持多种编程语言的代码补全和生成",
    provider: {
      name: "智谱AI",
      logo: "/images/zhipu-logo.png",
      website: "https://www.zhipuai.cn/",
    },
    features: [
      {
        icon: <Code className="h-5 w-5 text-green-500" />,
        title: "代码生成",
        description: "根据注释或需求描述生成完整代码",
      },
      {
        icon: <Zap className="h-5 w-5 text-green-500" />,
        title: "多语言支持",
        description: "支持Python、Java、C++等多种编程语言",
      },
      {
        icon: <FileText className="h-5 w-5 text-green-500" />,
        title: "代码解释",
        description: "能够解释代码功能和实现逻辑",
      },
    ],
    capabilities: ["代码生成", "代码补全", "代码转换", "代码解释", "Bug修复"],
    tags: ["编程辅助", "开发工具", "效率提升"],
    image: "/placeholder.svg?key=t6ig9",
  },
]

export function AiModelShowcase() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredModels = activeTab === "all" ? aiModels : aiModels.filter((model) => model.tags.includes(activeTab))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">AI大模型展示</h2>
        <p className="text-muted-foreground">探索和使用最新的AI大模型能力</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">全部模型</TabsTrigger>
          <TabsTrigger value="多模态">多模态</TabsTrigger>
          <TabsTrigger value="生成式AI">生成式AI</TabsTrigger>
          <TabsTrigger value="编程辅助">编程辅助</TabsTrigger>
          <TabsTrigger value="中文优化">中文优化</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <Card key={model.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {model.name}
                        {model.isNew && (
                          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                            新上线
                          </Badge>
                        )}
                        {model.isPopular && !model.isNew && (
                          <Badge variant="outline" className="border-amber-500 text-amber-500">
                            热门
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{model.description}</CardDescription>
                    </div>
                    <Link href={model.provider.website} target="_blank" rel="noopener noreferrer">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        <Image
                          src={model.provider.logo || "/placeholder.svg?height=32&width=32&query=AI公司logo"}
                          alt={model.provider.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  {model.image && (
                    <div className="mb-4 rounded-md overflow-hidden">
                      <Image
                        src={model.image || "/placeholder.svg"}
                        alt={`${model.name} 展示图`}
                        width={400}
                        height={200}
                        className="w-full object-cover h-[160px]"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-3">
                    {model.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="mt-0.5">{feature.icon}</div>
                        <div>
                          <h4 className="text-sm font-medium">{feature.title}</h4>
                          <p className="text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1">
                    {model.capabilities.map((capability, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                      >
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/api-config/${model.id}`} className="w-full">
                    <Button className="w-full" variant="default">
                      <Sparkles className="mr-2 h-4 w-4" />
                      开始使用
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
