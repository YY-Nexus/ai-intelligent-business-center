"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Code,
  Globe,
  Database,
  Server,
  Layers,
  Cpu,
  Cloud,
  BookOpen,
  Briefcase,
  Zap,
  MessageSquare,
} from "lucide-react"

export interface DocCategory {
  id: string
  name: string
  description: string
  subcategories: DocSubcategory[]
  icon: React.ReactNode
  count: number
}

export interface DocSubcategory {
  id: string
  name: string
  description: string
  count: number
  popular?: boolean
}

export function ApiDocCategories() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // 按编程语言分类
  const programmingLanguages: DocCategory = {
    id: "programming-languages",
    name: "编程语言",
    description: "按不同编程语言分类的API文档和调用示例",
    icon: <Code className="h-5 w-5" />,
    count: 14,
    subcategories: [
      {
        id: "javascript",
        name: "JavaScript",
        description: "JavaScript/TypeScript API调用示例",
        count: 156,
        popular: true,
      },
      { id: "python", name: "Python", description: "Python API调用示例", count: 142, popular: true },
      { id: "java", name: "Java", description: "Java API调用示例", count: 98, popular: true },
      { id: "csharp", name: "C#", description: "C# API调用示例", count: 87 },
      { id: "go", name: "Go", description: "Go API调用示例", count: 76 },
      { id: "php", name: "PHP", description: "PHP API调用示例", count: 65 },
      { id: "ruby", name: "Ruby", description: "Ruby API调用示例", count: 54 },
      { id: "swift", name: "Swift", description: "Swift API调用示例", count: 48 },
      { id: "kotlin", name: "Kotlin", description: "Kotlin API调用示例", count: 42 },
      { id: "rust", name: "Rust", description: "Rust API调用示例", count: 36 },
      { id: "cpp", name: "C++", description: "C++ API调用示例", count: 32 },
      { id: "dart", name: "Dart", description: "Dart/Flutter API调用示例", count: 28 },
      { id: "r", name: "R", description: "R语言 API调用示例", count: 24 },
      { id: "other-languages", name: "其他语言", description: "其他编程语言API调用示例", count: 45 },
    ],
  }

  // 按行业领域分类
  const industries: DocCategory = {
    id: "industries",
    name: "行业领域",
    description: "按不同行业领域分类的API规范和最佳实践",
    icon: <Briefcase className="h-5 w-5" />,
    count: 12,
    subcategories: [
      { id: "finance", name: "金融服务", description: "银行、支付、证券等金融领域API", count: 87, popular: true },
      { id: "ecommerce", name: "电子商务", description: "电商平台、支付、物流等API", count: 76, popular: true },
      { id: "healthcare", name: "医疗健康", description: "医疗记录、健康数据、医疗服务API", count: 65 },
      { id: "education", name: "教育科研", description: "教育平台、学习管理、科研数据API", count: 54 },
      { id: "government", name: "政务服务", description: "政府数据、公共服务API", count: 43 },
      { id: "transportation", name: "交通出行", description: "地图、导航、出行服务API", count: 38 },
      { id: "media", name: "媒体娱乐", description: "内容分发、流媒体、社交媒体API", count: 32 },
      { id: "manufacturing", name: "制造业", description: "工业物联网、供应链、生产管理API", count: 28 },
      { id: "energy", name: "能源环保", description: "能源管理、环境监测API", count: 24 },
      { id: "realestate", name: "房地产", description: "房产数据、物业管理API", count: 22 },
      { id: "agriculture", name: "农业科技", description: "农业数据、智慧农业API", count: 18 },
      { id: "other-industries", name: "其他行业", description: "其他行业领域API", count: 35 },
    ],
  }

  // 按API类型分类
  const apiTypes: DocCategory = {
    id: "api-types",
    name: "API类型",
    description: "按不同API架构和协议类型分类的文档",
    icon: <Layers className="h-5 w-5" />,
    count: 8,
    subcategories: [
      { id: "rest", name: "REST API", description: "RESTful API设计和实现", count: 124, popular: true },
      { id: "graphql", name: "GraphQL", description: "GraphQL API设计和实现", count: 87, popular: true },
      { id: "grpc", name: "gRPC", description: "gRPC API设计和实现", count: 65 },
      { id: "websocket", name: "WebSocket", description: "WebSocket API设计和实现", count: 54 },
      { id: "webhook", name: "Webhook", description: "Webhook设计和实现", count: 43 },
      { id: "soap", name: "SOAP", description: "SOAP API设计和实现", count: 32 },
      { id: "json-rpc", name: "JSON-RPC", description: "JSON-RPC API设计和实现", count: 28 },
      { id: "other-types", name: "其他类型", description: "其他API类型和协议", count: 22 },
    ],
  }

  // 按平台/服务提供商分类
  const platforms: DocCategory = {
    id: "platforms",
    name: "平台与服务商",
    description: "主流平台和服务提供商的API文档",
    icon: <Cloud className="h-5 w-5" />,
    count: 10,
    subcategories: [
      {
        id: "cloud-providers",
        name: "云服务提供商",
        description: "AWS, Azure, 阿里云, 腾讯云等",
        count: 98,
        popular: true,
      },
      {
        id: "social-media",
        name: "社交媒体平台",
        description: "微信, 微博, Twitter, Facebook等",
        count: 87,
        popular: true,
      },
      { id: "payment", name: "支付服务", description: "支付宝, 微信支付, PayPal, Stripe等", count: 76 },
      { id: "ecommerce-platforms", name: "电商平台", description: "淘宝, 京东, Amazon, Shopify等", count: 65 },
      { id: "map-services", name: "地图服务", description: "高德, 百度地图, Google Maps等", count: 54 },
      { id: "communication", name: "通信服务", description: "短信, 语音, 邮件, 推送等", count: 43 },
      { id: "content-delivery", name: "内容分发", description: "CDN, 视频, 图片等服务", count: 38 },
      { id: "developer-tools", name: "开发者工具", description: "GitHub, GitLab, Bitbucket等", count: 32 },
      { id: "analytics", name: "分析服务", description: "百度统计, Google Analytics等", count: 28 },
      { id: "other-platforms", name: "其他平台", description: "其他平台和服务提供商", count: 45 },
    ],
  }

  // 按用途/功能分类
  const functionalities: DocCategory = {
    id: "functionalities",
    name: "功能用途",
    description: "按API功能和用途分类的文档",
    icon: <Zap className="h-5 w-5" />,
    count: 12,
    subcategories: [
      { id: "authentication", name: "认证与授权", description: "OAuth, JWT, API密钥等", count: 87, popular: true },
      { id: "data-processing", name: "数据处理", description: "数据转换, 验证, 存储等", count: 76, popular: true },
      { id: "file-management", name: "文件管理", description: "上传, 下载, 存储, 转换等", count: 65 },
      { id: "messaging", name: "消息通信", description: "即时通讯, 推送通知等", count: 54 },
      { id: "search", name: "搜索功能", description: "全文搜索, 索引, 过滤等", count: 48 },
      { id: "analytics-reporting", name: "分析与报告", description: "数据分析, 报表生成等", count: 43 },
      { id: "geolocation", name: "地理位置", description: "定位, 地图, 路线规划等", count: 38 },
      { id: "multimedia", name: "多媒体处理", description: "图像, 音频, 视频处理等", count: 32 },
      { id: "scheduling", name: "调度与任务", description: "定时任务, 工作流等", count: 28 },
      { id: "monitoring", name: "监控与日志", description: "性能监控, 日志管理等", count: 24 },
      { id: "internationalization", name: "国际化与本地化", description: "翻译, 货币, 时区等", count: 22 },
      { id: "other-functions", name: "其他功能", description: "其他API功能和用途", count: 35 },
    ],
  }

  // AI模型和SDK专区
  const aiModels: DocCategory = {
    id: "ai-models",
    name: "AI模型与SDK",
    description: "AI大模型API和SDK调用文档",
    icon: <Cpu className="h-5 w-5" />,
    count: 8,
    subcategories: [
      { id: "openai", name: "OpenAI API", description: "GPT-4, GPT-3.5等模型API", count: 87, popular: true },
      { id: "chinese-llm", name: "国内大模型", description: "文心一言, 通义千问, 星火等", count: 76, popular: true },
      { id: "huggingface", name: "Hugging Face", description: "Transformers, Diffusers等库", count: 65 },
      { id: "vision-models", name: "视觉模型", description: "图像识别, 生成, 分割等", count: 54 },
      { id: "audio-models", name: "语音模型", description: "语音识别, 合成, 转写等", count: 43 },
      { id: "multimodal", name: "多模态模型", description: "文本-图像, 文本-视频等", count: 38 },
      { id: "ai-sdks", name: "AI开发套件", description: "LangChain, LlamaIndex等", count: 32 },
      { id: "other-ai", name: "其他AI服务", description: "其���AI模型和服务", count: 28 },
    ],
  }

  // 数据库与存储
  const databases: DocCategory = {
    id: "databases",
    name: "数据库与存储",
    description: "各类数据库和存储服务的API文档",
    icon: <Database className="h-5 w-5" />,
    count: 10,
    subcategories: [
      {
        id: "sql-databases",
        name: "SQL数据库",
        description: "MySQL, PostgreSQL, SQL Server等",
        count: 76,
        popular: true,
      },
      {
        id: "nosql-databases",
        name: "NoSQL数据库",
        description: "MongoDB, Redis, Cassandra等",
        count: 65,
        popular: true,
      },
      { id: "graph-databases", name: "图数据库", description: "Neo4j, ArangoDB等", count: 43 },
      { id: "time-series", name: "时序数据库", description: "InfluxDB, TimescaleDB等", count: 38 },
      { id: "object-storage", name: "对象存储", description: "S3, OSS, COS等", count: 54 },
      { id: "file-storage", name: "文件存储", description: "NAS, EFS, SMB等", count: 32 },
      { id: "block-storage", name: "块存储", description: "EBS, 云硬盘等", count: 28 },
      { id: "cache", name: "缓存服务", description: "Redis, Memcached等", count: 48 },
      { id: "search-engines", name: "搜索引擎", description: "Elasticsearch, Solr等", count: 36 },
      { id: "other-storage", name: "其他存储", description: "其他数据库和存储服务", count: 24 },
    ],
  }

  // 自媒体平台
  const mediaChannels: DocCategory = {
    id: "media-channels",
    name: "自媒体平台",
    description: "各大自媒体平台的API对接文档",
    icon: <MessageSquare className="h-5 w-5" />,
    count: 8,
    subcategories: [
      { id: "wechat", name: "微信生态", description: "公众号, 小程序, 视频号等", count: 87, popular: true },
      { id: "weibo", name: "微博API", description: "微博开放平台API", count: 54 },
      { id: "douyin", name: "抖音/TikTok", description: "抖音开放平台, TikTok API", count: 76, popular: true },
      { id: "bilibili", name: "哔哩哔哩", description: "B站开放API", count: 65 },
      { id: "xiaohongshu", name: "小红书", description: "小红书开放平台", count: 43 },
      { id: "zhihu", name: "知乎", description: "知乎开放API", count: 38 },
      { id: "western-social", name: "海外社交平台", description: "YouTube, Instagram, Twitter等", count: 58 },
      { id: "other-media", name: "其他媒体平台", description: "其他自媒体和内容平台", count: 32 },
    ],
  }

  // 商业开发平台
  const businessPlatforms: DocCategory = {
    id: "business-platforms",
    name: "商业开发平台",
    description: "企业级商业开发平台的API文档",
    icon: <Server className="h-5 w-5" />,
    count: 9,
    subcategories: [
      { id: "saas-platforms", name: "SaaS平台", description: "Salesforce, SAP, 钉钉等", count: 65, popular: true },
      { id: "crm-systems", name: "CRM系统", description: "客户关系管理系统API", count: 54 },
      { id: "erp-systems", name: "ERP系统", description: "企业资源计划系统API", count: 48 },
      { id: "hr-systems", name: "HR系统", description: "人力资源管理系统API", count: 43 },
      { id: "marketing-platforms", name: "营销平台", description: "营销自动化, 广告平台等", count: 38 },
      { id: "financial-systems", name: "财务系统", description: "财务管理, 会计系统等", count: 32 },
      { id: "supply-chain", name: "供应链平台", description: "供应链管理, 物流系统等", count: 28 },
      { id: "collaboration", name: "协作平台", description: "团队协作, 项目管理等", count: 76, popular: true },
      { id: "other-business", name: "其他商业平台", description: "其他企业级商业平台", count: 24 },
    ],
  }

  // 工具开发平台
  const developerTools: DocCategory = {
    id: "developer-tools",
    name: "开发工具平台",
    description: "开发者工具和服务的API文档",
    icon: <BookOpen className="h-5 w-5" />,
    count: 10,
    subcategories: [
      { id: "code-repositories", name: "代码仓库", description: "GitHub, GitLab, Gitee等", count: 76, popular: true },
      { id: "ci-cd", name: "CI/CD工具", description: "Jenkins, GitHub Actions等", count: 65 },
      { id: "testing-tools", name: "测试工具", description: "自动化测试, 性能测试等", count: 54 },
      { id: "monitoring-tools", name: "监控工具", description: "APM, 日志分析等", count: 48 },
      { id: "ide-extensions", name: "IDE扩展", description: "VS Code, IntelliJ等扩展API", count: 43 },
      { id: "documentation", name: "文档工具", description: "Swagger, Postman等", count: 38 },
      { id: "package-managers", name: "包管理器", description: "npm, PyPI, Maven等", count: 32 },
      { id: "devops-tools", name: "DevOps工具", description: "Kubernetes, Docker等", count: 87, popular: true },
      { id: "low-code", name: "低代码平台", description: "低代码/无代码开发平台", count: 28 },
      { id: "other-tools", name: "其他开发工具", description: "其他开发者工具和服务", count: 24 },
    ],
  }

  // 国际化与本地化
  const internationalization: DocCategory = {
    id: "internationalization",
    name: "国际化与本地化",
    description: "国际化和本地化相关的API文档",
    icon: <Globe className="h-5 w-5" />,
    count: 8,
    subcategories: [
      { id: "translation", name: "翻译服务", description: "机器翻译, 本地化API", count: 65, popular: true },
      { id: "localization", name: "本地化工具", description: "i18n, l10n工具和服务", count: 54 },
      { id: "currency", name: "货币与支付", description: "货币转换, 国际支付等", count: 48 },
      { id: "time-date", name: "时间与日期", description: "时区处理, 日历系统等", count: 43 },
      { id: "address", name: "地址格式化", description: "国际地址格式化和验证", count: 38 },
      { id: "compliance", name: "合规与法规", description: "国际法规遵从API", count: 32 },
      { id: "cultural", name: "文化适配", description: "文化差异处理API", count: 28 },
      { id: "other-i18n", name: "其他国际化", description: "其他国际化和本地化服务", count: 24 },
    ],
  }

  // 所有分类
  const allCategories: DocCategory[] = [
    programmingLanguages,
    industries,
    apiTypes,
    platforms,
    functionalities,
    aiModels,
    databases,
    mediaChannels,
    businessPlatforms,
    developerTools,
    internationalization,
  ]

  // 筛选分类
  const filteredCategories = searchQuery
    ? allCategories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.subcategories.some(
            (sub) =>
              sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              sub.description.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      )
    : allCategories

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">API文档中心</h2>
          <p className="text-muted-foreground">浏览完整的API文档分类，包含各种编程语言、行业规范和平台的API调用示例</p>
        </div>
        <div className="w-full md:w-auto relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索API文档..."
            className="w-full md:w-[300px] pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="grid">网格视图</TabsTrigger>
          <TabsTrigger value="list">列表视图</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-primary/10 rounded-md">{category.icon}</div>
                      <CardTitle>{category.name}</CardTitle>
                    </div>
                    <Badge variant="outline">{category.count}</Badge>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <ScrollArea className="h-[180px]">
                    <div className="space-y-2">
                      {category.subcategories.map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                          onClick={() => setActiveCategory(`${category.id}-${subcategory.id}`)}
                        >
                          <div>
                            <div className="font-medium">
                              {subcategory.name}
                              {subcategory.popular && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  热门
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{subcategory.description}</div>
                          </div>
                          <Badge variant="outline">{subcategory.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" onClick={() => setActiveCategory(category.id)}>
                    查看全部 {category.name} 文档
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list">
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-md">{category.icon}</div>
                    <CardTitle>{category.name}</CardTitle>
                    <Badge variant="outline">{category.count}</Badge>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => setActiveCategory(`${category.id}-${subcategory.id}`)}
                      >
                        <div>
                          <div className="font-medium">
                            {subcategory.name}
                            {subcategory.popular && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                热门
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{subcategory.description}</div>
                        </div>
                        <Badge variant="outline">{subcategory.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
