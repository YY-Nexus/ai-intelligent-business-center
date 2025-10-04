"use client"

import { useState } from "react"
import { TechCard } from "@/components/ui/tech-card"
import { TechButton } from "@/components/ui/tech-button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  Search,
  Layers,
  Copy,
  ExternalLink,
  Star,
  ThumbsUp,
  Database,
  ShoppingCart,
  Users,
  CreditCard,
  BarChart,
  Zap,
} from "lucide-react"
import { useApiConfig } from "./api-config-manager"
import { ImageIcon } from "lucide-react"

// 模板类型
type ApiTemplate = {
  id: string
  name: string
  description: string
  category: "database" | "ai" | "ecommerce" | "media" | "social" | "payment" | "analytics" | "other"
  popularity: number
  config: any // API配置数据
  tags: string[]
  author: string
  featured: boolean
  logoUrl?: string
}

// 模拟模板数据
function getMockTemplates(): ApiTemplate[] {
  return [
    {
      id: "template-1",
      name: "MySQL数据库API",
      description: "用于连接和操作MySQL数据库的API配置模板，包含常用的CRUD操作端点。",
      category: "database",
      popularity: 1245,
      config: {
        baseUrl: "https://api.example.com/mysql",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        auth: {
          type: "basic",
          enabled: true,
        },
      },
      tags: ["MySQL", "数据库", "CRUD", "关系型数据库"],
      author: "系统管理员",
      featured: true,
    },
    {
      id: "template-2",
      name: "MongoDB数据库API",
      description: "用于连接和操作MongoDB数据库的API配置模板，支持文档存储和查询。",
      category: "database",
      popularity: 987,
      config: {
        baseUrl: "https://api.example.com/mongodb",
        timeout: 12000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        auth: {
          type: "bearer",
          enabled: true,
        },
      },
      tags: ["MongoDB", "NoSQL", "文档数据库"],
      author: "系统管理员",
      featured: false,
    },
    {
      id: "template-3",
      name: "OpenAI GPT API",
      description: "用于集成OpenAI GPT模型的API配置模板，支持文本生成、聊天和内容审核。",
      category: "ai",
      popularity: 2356,
      config: {
        baseUrl: "https://api.openai.com/v1",
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        auth: {
          type: "bearer",
          enabled: true,
        },
      },
      tags: ["OpenAI", "GPT", "人工智能", "自然语言处理"],
      author: "系统管理员",
      featured: true,
    },
    {
      id: "template-4",
      name: "百度文心一言API",
      description: "用于集成百度文心一言大模型的API配置模板，支持中文文本生成和对话。",
      category: "ai",
      popularity: 1432,
      config: {
        baseUrl: "https://api.baidu.com/wenxin",
        timeout: 25000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        auth: {
          type: "api-key",
          enabled: true,
        },
      },
      tags: ["百度", "文心一言", "中文AI", "大语言模型"],
      author: "系统管理员",
      featured: true,
    },
    {
      id: "template-5",
      name: "支付宝支付API",
      description: "用于集成支付宝支付功能的API配置模板，支持创建订单、查询订单和退款。",
      category: "payment",
      popularity: 1876,
      config: {
        baseUrl: "https://openapi.alipay.com/gateway.do",
        timeout: 15000,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        auth: {
          type: "api-key",
          enabled: true,
        },
      },
      tags: ["支付宝", "支付", "电子支付", "退款"],
      author: "系统管理员",
      featured: true,
    },
    {
      id: "template-6",
      name: "微信支付API",
      description: "用于集成微信支付功能的API配置模板，支持JSAPI支付、APP支付和H5支付。",
      category: "payment",
      popularity: 2103,
      config: {
        baseUrl: "https://api.mch.weixin.qq.com/v3",
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        auth: {
          type: "custom",
          enabled: true,
        },
      },
      tags: ["微信支付", "支付", "电子支付", "小程序支付"],
      author: "系统管理员",
      featured: true,
    },
    {
      id: "template-7",
      name: "淘宝电商API",
      description: "用于集成淘宝电商功能的API配置模板，支持商品管理、订单管理和物流跟踪。",
      category: "ecommerce",
      popularity: 1567,
      config: {
        baseUrl: "https://eco.taobao.com/router/rest",
        timeout: 20000,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        auth: {
          type: "api-key",
          enabled: true,
        },
      },
      tags: ["淘宝", "电商", "商品管理", "订单管理"],
      author: "系统管理员",
      featured: false,
    },
    {
      id: "template-8",
      name: "京东电商API",
      description: "用于集成京东电商功能的API配置模板，支持商品上架、库存管理和订单处理。",
      category: "ecommerce",
      popularity: 1342,
      config: {
        baseUrl: "https://api.jd.com/routerjson",
        timeout: 18000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        auth: {
          type: "api-key",
          enabled: true,
        },
      },
      tags: ["京东", "电商", "商品管理", "库存管理"],
      author: "系统管理员",
      featured: false,
    },
    {
      id: "template-9",
      name: "腾讯云COS存储API",
      description: "用于集成腾讯云对象存储服务的API配置模板���支持文件上传、下载和管理。",
      category: "media",
      popularity: 1123,
      config: {
        baseUrl: "https://cos.ap-beijing.myqcloud.com",
        timeout: 60000,
        headers: {
          "Content-Type": "application/xml",
          Accept: "application/xml",
        },
        auth: {
          type: "custom",
          enabled: true,
        },
      },
      tags: ["腾讯云", "对象存储", "文件管理", "云存储"],
      author: "系统管理员",
      featured: false,
    },
    {
      id: "template-10",
      name: "阿里云OSS存储API",
      description: "用于集成阿里云对象存储服务的API配置模板，支持文件存储和CDN分发。",
      category: "media",
      popularity: 1456,
      config: {
        baseUrl: "https://oss-cn-hangzhou.aliyuncs.com",
        timeout: 60000,
        headers: {
          "Content-Type": "application/xml",
          Accept: "application/xml",
        },
        auth: {
          type: "custom",
          enabled: true,
        },
      },
      tags: ["阿里云", "对象存储", "CDN", "云存储"],
      author: "系统管理员",
      featured: true,
    },
    {
      id: "template-11",
      name: "微博社交API",
      description: "用于集成微博社交功能的API配置模板，支持发布内容、获取动态和用户互动。",
      category: "social",
      popularity: 876,
      config: {
        baseUrl: "https://api.weibo.com/2",
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        auth: {
          type: "oauth2",
          enabled: true,
        },
      },
      tags: ["微博", "社交媒体", "内容发布", "用户互动"],
      author: "系统管理员",
      featured: false,
      logoUrl: "/api-logos/weibo.png",
    },
    {
      id: "template-12",
      name: "微信公众号API",
      description: "用于集成微信公众号功能的API配置模板，支持消息推送、用户管理和内容发布。",
      category: "social",
      popularity: 1987,
      config: {
        baseUrl: "https://api.weixin.qq.com/cgi-bin",
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        auth: {
          type: "oauth2",
          enabled: true,
        },
      },
      tags: ["微信", "公众号", "消息推送", "内容管理"],
      author: "系统管理员",
      featured: true,
    },
    {
      id: "template-13",
      name: "百度统计API",
      description: "用于集成百度统计功能的API配置模板，支持网站访问数据分析和用户行为跟踪。",
      category: "analytics",
      popularity: 765,
      config: {
        baseUrl: "https://api.baidu.com/json/tongji/v1",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        auth: {
          type: "api-key",
          enabled: true,
        },
      },
      tags: ["百度统计", "数据分析", "用户行为", "网站统计"],
      author: "系统管理员",
      featured: false,
    },
    {
      id: "template-14",
      name: "友盟数据分析API",
      description: "用于集成友盟数据分析功能的API配置模板，支持移动应用数据分析和用户画像。",
      category: "analytics",
      popularity: 654,
      config: {
        baseUrl: "https://api.umeng.com/analytics",
        timeout: 12000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        auth: {
          type: "api-key",
          enabled: true,
        },
      },
      tags: ["友盟", "数据分析", "移动应用", "用户画像"],
      author: "系统管理员",
      featured: false,
    },
    {
      id: "template-15",
      name: "讯飞语音识别API",
      description: "用于集成讯飞语音识别功能的API配置模板，支持语音转文字和语义理解。",
      category: "ai",
      popularity: 1234,
      config: {
        baseUrl: "https://api.xfyun.cn/v1",
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        auth: {
          type: "api-key",
          enabled: true,
        },
      },
      tags: ["讯飞", "语音识别", "语义理解", "人工智能"],
      author: "系统管理员",
      featured: false,
    },
  ]
}

export function ApiTemplateGallery() {
  const { addConfig } = useApiConfig()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [templates, setTemplates] = useState<ApiTemplate[]>(getMockTemplates())
  const { toast } = useToast()

  // 筛选模板
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = activeCategory === "all" || template.category === activeCategory

    return matchesSearch && matchesCategory
  })

  // 使用模板
  const useTemplate = (template: ApiTemplate) => {
    try {
      // 创建新的API配置
      const newConfigId = addConfig({
        name: template.name,
        config: {
          ...template.config,
          baseUrl: template.config.baseUrl,
          timeout: template.config.timeout,
          headers: template.config.headers,
        },
        auth: template.config.auth || {
          type: "none",
          enabled: false,
        },
      })

      toast({
        title: "模板应用成功",
        description: `已成功创建基于 "${template.name}" 模板的API配置`,
      })

      // 增加模板使用次数
      setTemplates(templates.map((t) => (t.id === template.id ? { ...t, popularity: t.popularity + 1 } : t)))

      // 跳转到编辑页面
      window.location.href = `/api-config?tab=form&id=${newConfigId}`
    } catch (error) {
      toast({
        title: "模板应用失败",
        description: "无法创建API配置，请重试",
        variant: "destructive",
      })
    }
  }

  // 获取分类图标
  const getCategoryIcon = (category: ApiTemplate["category"]) => {
    switch (category) {
      case "database":
        return <Database className="h-5 w-5" />
      case "ai":
        return <Zap className="h-5 w-5" />
      case "ecommerce":
        return <ShoppingCart className="h-5 w-5" />
      case "media":
        return <ImageIcon className="h-5 w-5" />
      case "social":
        return <Users className="h-5 w-5" />
      case "payment":
        return <CreditCard className="h-5 w-5" />
      case "analytics":
        return <BarChart className="h-5 w-5" />
      default:
        return <Layers className="h-5 w-5" />
    }
  }

  // 获取分类名称
  const getCategoryName = (category: ApiTemplate["category"]) => {
    switch (category) {
      case "database":
        return "数据库"
      case "ai":
        return "人工智能"
      case "ecommerce":
        return "电子商务"
      case "media":
        return "媒体服务"
      case "social":
        return "社交网络"
      case "payment":
        return "支付服务"
      case "analytics":
        return "分析服务"
      default:
        return "其他服务"
    }
  }

  // 获取分类颜色
  const getCategoryColor = (category: ApiTemplate["category"]) => {
    switch (category) {
      case "database":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "ai":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "ecommerce":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "media":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      case "social":
        return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
      case "payment":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "analytics":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">API模板库</h2>
        <p className="text-muted-foreground">浏览和使用预配置的API模板，快速创建常用API配置</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索模板..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            显示 {filteredTemplates.length} 个模板，共 {templates.length} 个
          </span>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-4 bg-techblue-100/50 dark:bg-techblue-800/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white">
            全部
          </TabsTrigger>
          <TabsTrigger value="database" className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white">
            数据库
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white">
            人工智能
          </TabsTrigger>
          <TabsTrigger value="ecommerce" className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white">
            电子商务
          </TabsTrigger>
          <TabsTrigger value="media" className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white">
            媒体服务
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white">
            社交网络
          </TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white">
            支付服务
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white">
            分析服务
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory}>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">未找到匹配的模板</h3>
              <p className="text-muted-foreground">尝试使用不同的搜索词或浏览其他分类</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <TechCard key={template.id} variant="glass" border="tech" glow="subtle" contentClassName="p-0">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-md ${getCategoryColor(template.category)}`}>
                        {getCategoryIcon(template.category)}
                      </div>

                      {template.featured && (
                        <Badge className="bg-techblue-100 text-techblue-700 dark:bg-techblue-800 dark:text-techblue-200">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          精选
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-lg font-medium mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{template.description}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      <Badge variant="outline" className="text-xs">
                        {getCategoryName(template.category)}
                      </Badge>

                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}

                      {template.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{template.popularity} 次使用</span>
                    </div>
                  </div>

                  <div className="border-t border-techblue-200 dark:border-techblue-800 p-4 bg-techblue-50/30 dark:bg-techblue-900/20">
                    <div className="flex justify-between">
                      <TechButton variant="outline" depth="flat" size="sm" icon={<ExternalLink className="h-4 w-4" />}>
                        查看详情
                      </TechButton>

                      <TechButton
                        variant="primary"
                        depth="3d"
                        size="sm"
                        icon={<Copy className="h-4 w-4" />}
                        onClick={() => useTemplate(template)}
                      >
                        使用模板
                      </TechButton>
                    </div>
                  </div>
                </TechCard>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
