"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Clock, Calendar, Tag, FileText, Code, Database, Globe } from "lucide-react"

// 搜索结果类型
interface SearchResult {
  id: string
  title: string
  description: string
  type: "api" | "document" | "config" | "code" | "log"
  tags: string[]
  date: string
  url: string
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [dateRange, setDateRange] = useState("any")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // 可用的标签
  const availableTags = [
    "REST",
    "GraphQL",
    "WebSocket",
    "OAuth",
    "JWT",
    "数据库",
    "缓存",
    "安全",
    "性能",
    "监控",
    "文档",
    "测试",
    "配置",
    "部署",
    "集成",
  ]

  // 处理标签选择
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  // 执行搜索
  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setHasSearched(true)

    // 模拟搜索延迟
    setTimeout(() => {
      // 模拟搜索结果
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: "REST API配置指南",
          description: "详细介绍如何配置和使用REST API，包括认证、请求格式和响应处理。",
          type: "document",
          tags: ["REST", "配置", "文档"],
          date: "2023-05-15",
          url: "/api-documentation/rest-guide",
        },
        {
          id: "2",
          title: "OAuth2认证配置",
          description: "OAuth2认证流程和配置说明，包括授权码模式和客户端凭证模式。",
          type: "config",
          tags: ["OAuth", "安全", "配置"],
          date: "2023-06-22",
          url: "/api-config/oauth-settings",
        },
        {
          id: "3",
          title: "数据库连接池设置",
          description: "数据库连接池的配置参数和优化建议，提高数据库访问性能。",
          type: "config",
          tags: ["数据库", "性能", "配置"],
          date: "2023-07-10",
          url: "/settings/database",
        },
        {
          id: "4",
          title: "API性能监控报告",
          description: "API调用性能分析报告，包括响应时间、吞吐量和错误率统计。",
          type: "log",
          tags: ["性能", "监控", "REST"],
          date: "2023-08-05",
          url: "/api-config/performance-report",
        },
        {
          id: "5",
          title: "GraphQL架构定义",
          description: "GraphQL API的类型定义和查询结构，包括查询、变更和订阅。",
          type: "code",
          tags: ["GraphQL", "文档", "配置"],
          date: "2023-09-18",
          url: "/api-documentation/graphql-schema",
        },
        {
          id: "6",
          title: "WebSocket连接示例",
          description: "WebSocket API的连接和消息处理示例代码，包括认证和重连机制。",
          type: "code",
          tags: ["WebSocket", "代码", "示例"],
          date: "2023-10-02",
          url: "/api-documentation/websocket-examples",
        },
        {
          id: "7",
          title: "JWT令牌验证中间件",
          description: "用于验证JWT令牌的中间件代码，包括令牌解析和权限检查。",
          type: "code",
          tags: ["JWT", "安全", "代码"],
          date: "2023-11-15",
          url: "/api-config/jwt-middleware",
        },
        {
          id: "8",
          title: "API网关配置",
          description: "API网关的路由规则和负载均衡配置，实现API的统一管理和控制。",
          type: "config",
          tags: ["网关", "配置", "部署"],
          date: "2023-12-20",
          url: "/api-config/gateway-settings",
        },
      ]

      // 根据搜索条件过滤结果
      const filteredResults = mockResults.filter((result) => {
        // 搜索词匹配
        const matchesQuery =
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description.toLowerCase().includes(searchQuery.toLowerCase())

        // 类型匹配
        const matchesType = searchType === "all" || result.type === searchType

        // 标签匹配
        const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => result.tags.includes(tag))

        // 日期匹配
        let matchesDate = true
        const resultDate = new Date(result.date)
        const now = new Date()

        if (dateRange === "day") {
          const oneDayAgo = new Date(now)
          oneDayAgo.setDate(now.getDate() - 1)
          matchesDate = resultDate >= oneDayAgo
        } else if (dateRange === "week") {
          const oneWeekAgo = new Date(now)
          oneWeekAgo.setDate(now.getDate() - 7)
          matchesDate = resultDate >= oneWeekAgo
        } else if (dateRange === "month") {
          const oneMonthAgo = new Date(now)
          oneMonthAgo.setMonth(now.getMonth() - 1)
          matchesDate = resultDate >= oneMonthAgo
        }

        return matchesQuery && matchesType && matchesTags && matchesDate
      })

      setSearchResults(filteredResults)
      setIsSearching(false)
    }, 1000)
  }

  // 获取结果类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "api":
        return <Globe className="h-5 w-5 text-blue-500" />
      case "document":
        return <FileText className="h-5 w-5 text-purple-500" />
      case "config":
        return <Database className="h-5 w-5 text-green-500" />
      case "code":
        return <Code className="h-5 w-5 text-orange-500" />
      case "log":
        return <Clock className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">高级搜索</h1>
        <p className="text-muted-foreground">强大的搜索功能，帮助您快速找到API配置、文档、代码示例和日志记录。</p>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>搜索查询</CardTitle>
          <CardDescription>输入关键词并设置过滤条件</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="搜索API、文档、配置、代码或日志..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "搜索中..." : "搜索"}
                <Search className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                筛选
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <Label htmlFor="searchType" className="mb-1 block">
                    内容类型
                  </Label>
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger id="searchType">
                      <SelectValue placeholder="选择内容类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有类型</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="document">文档</SelectItem>
                      <SelectItem value="config">配置</SelectItem>
                      <SelectItem value="code">代码</SelectItem>
                      <SelectItem value="log">日志</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dateRange" className="mb-1 block">
                    时间范围
                  </Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger id="dateRange">
                      <SelectValue placeholder="选择时间范围" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">任何时间</SelectItem>
                      <SelectItem value="day">过去24小时</SelectItem>
                      <SelectItem value="week">过去一周</SelectItem>
                      <SelectItem value="month">过去一个月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1 block">标签</Label>
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 border rounded-md">
                    {availableTags.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={() => handleTagToggle(tag)}
                        />
                        <Label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">搜索结果</h2>
            <div className="text-sm text-muted-foreground">找到 {searchResults.length} 个结果</div>
          </div>

          {searchResults.length > 0 ? (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="document">文档</TabsTrigger>
                <TabsTrigger value="config">配置</TabsTrigger>
                <TabsTrigger value="code">代码</TabsTrigger>
                <TabsTrigger value="log">日志</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <ResultCard key={result.id} result={result} />
                  ))}
                </div>
              </TabsContent>

              {["document", "config", "code", "log"].map((type) => (
                <TabsContent key={type} value={type}>
                  <div className="space-y-4">
                    {searchResults
                      .filter((result) => result.type === type)
                      .map((result) => (
                        <ResultCard key={result.id} result={result} />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">未找到结果</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  没有找到与您的搜索条件匹配的结果。请尝试使用不同的关键词或调整筛选条件。
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

// 搜索结果卡片组件
function ResultCard({ result }: { result: SearchResult }) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "api":
        return <Globe className="h-5 w-5 text-blue-500" />
      case "document":
        return <FileText className="h-5 w-5 text-purple-500" />
      case "config":
        return <Database className="h-5 w-5 text-green-500" />
      case "code":
        return <Code className="h-5 w-5 text-orange-500" />
      case "log":
        return <Clock className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "api":
        return "API"
      case "document":
        return "文档"
      case "config":
        return "配置"
      case "code":
        return "代码"
      case "log":
        return "日志"
      default:
        return type
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="mt-1">{getTypeIcon(result.type)}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{result.title}</h3>
              <Badge variant="outline" className="text-xs">
                {getTypeLabel(result.type)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {result.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(result.date).toLocaleDateString("zh-CN")}
              </Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={result.url}>查看</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
