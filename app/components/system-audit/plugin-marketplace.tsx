"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import {
  Search,
  Download,
  Star,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Package,
  Shield,
  Zap,
  Eye,
  FileText,
  Clock,
  ArrowUpDown,
} from "lucide-react"
import type { AuditPlugin } from "@/lib/plugin-system"

// 插件市场项目类型
interface MarketplacePlugin extends AuditPlugin {
  downloads: number
  rating: number
  lastUpdated: string
  publisher: {
    name: string
    verified: boolean
    avatar?: string
  }
  tags: string[]
  price: number | "免费"
  versions: {
    version: string
    date: string
    changelog: string
  }[]
}

// 插件分类
const PLUGIN_CATEGORIES = [
  { id: "all", name: "全部" },
  { id: "security", name: "安全" },
  { id: "performance", name: "性能" },
  { id: "accessibility", name: "无障碍" },
  { id: "code-quality", name: "代码质量" },
  { id: "documentation", name: "文档" },
  { id: "testing", name: "测试" },
]

// 排序选项
const SORT_OPTIONS = [
  { id: "popular", name: "最受欢迎" },
  { id: "recent", name: "最近更新" },
  { id: "rating", name: "最高评分" },
  { id: "downloads", name: "下载最多" },
]

export function PluginMarketplace() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortOption, setSortOption] = useState("popular")
  const [installedPlugins, setInstalledPlugins] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInstalling, setIsInstalling] = useState<Record<string, boolean>>({})
  const [marketplacePlugins, setMarketplacePlugins] = useState<MarketplacePlugin[]>([])
  const [selectedPlugin, setSelectedPlugin] = useState<MarketplacePlugin | null>(null)

  // 加载插件数据
  useEffect(() => {
    const fetchPlugins = async () => {
      setIsLoading(true)
      try {
        // 模拟API调用
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // 模拟数据
        const plugins: MarketplacePlugin[] = [
          {
            id: "security-scanner",
            name: "安全漏洞扫描",
            description: "扫描代码中的安全漏洞并提供修复建议",
            version: "1.0.0",
            author: "安全团队",
            category: "security",
            enabled: true,
            downloads: 12500,
            rating: 4.8,
            lastUpdated: "2023-12-15",
            publisher: {
              name: "安全团队",
              verified: true,
              avatar: "/placeholder.svg?key=9ijve",
            },
            tags: ["安全", "漏洞", "OWASP"],
            price: "免费",
            configSchema: {
              scanDepth: {
                type: "number",
                default: 3,
                description: "扫描深度级别",
              },
              includeDependencies: {
                type: "boolean",
                default: true,
                description: "是否扫描依赖项",
              },
            },
            versions: [
              {
                version: "1.0.0",
                date: "2023-12-15",
                changelog: "初始版本发布",
              },
              {
                version: "0.9.5",
                date: "2023-11-30",
                changelog: "Beta版本，修复了多个关键问题",
              },
              {
                version: "0.9.0",
                date: "2023-11-15",
                changelog: "Alpha版本，提供基本功能",
              },
            ],
          },
          {
            id: "performance-analyzer",
            name: "性能分析器",
            description: "分析代码性能瓶颈并提供优化建议",
            version: "1.2.1",
            author: "性能团队",
            category: "performance",
            enabled: true,
            downloads: 9800,
            rating: 4.6,
            lastUpdated: "2023-12-10",
            publisher: {
              name: "性能团队",
              verified: true,
              avatar: "/placeholder.svg?key=h0raa",
            },
            tags: ["性能", "优化", "分析"],
            price: "免费",
            configSchema: {
              analysisMode: {
                type: "string",
                enum: ["basic", "advanced"],
                default: "basic",
                description: "分析模式",
              },
            },
            versions: [
              {
                version: "1.2.1",
                date: "2023-12-10",
                changelog: "修复了内存泄漏问题",
              },
              {
                version: "1.2.0",
                date: "2023-11-25",
                changelog: "添加了高级分析模式",
              },
              {
                version: "1.1.0",
                date: "2023-10-15",
                changelog: "改进了报告生成功能",
              },
            ],
          },
          {
            id: "accessibility-checker",
            name: "无障碍检查器",
            description: "检查UI组件的无障碍性并提供改进建议",
            version: "0.9.5",
            author: "UI团队",
            category: "accessibility",
            enabled: false,
            downloads: 5600,
            rating: 4.3,
            lastUpdated: "2023-11-28",
            publisher: {
              name: "UI团队",
              verified: false,
              avatar: "/placeholder.svg?key=cbii3",
            },
            tags: ["无障碍", "UI", "WCAG"],
            price: "免费",
            configSchema: {
              checkLevel: {
                type: "string",
                enum: ["A", "AA", "AAA"],
                default: "AA",
                description: "WCAG合规级别",
              },
            },
            versions: [
              {
                version: "0.9.5",
                date: "2023-11-28",
                changelog: "添加了更多WCAG 2.1检查项",
              },
              {
                version: "0.9.0",
                date: "2023-10-20",
                changelog: "Beta版本发布",
              },
            ],
          },
          {
            id: "code-quality-analyzer",
            name: "代码质量分析器",
            description: "分析代码质量并提供改进建议",
            version: "2.0.0",
            author: "代码质量团队",
            category: "code-quality",
            enabled: false,
            downloads: 15200,
            rating: 4.9,
            lastUpdated: "2023-12-18",
            publisher: {
              name: "代码质量团队",
              verified: true,
              avatar: "/placeholder.svg?key=fj028",
            },
            tags: ["代码质量", "静态分析", "最佳实践"],
            price: 299,
            configSchema: {
              rulesets: {
                type: "string",
                enum: ["basic", "standard", "strict"],
                default: "standard",
                description: "规则集",
              },
            },
            versions: [
              {
                version: "2.0.0",
                date: "2023-12-18",
                changelog: "完全重写的分析引擎，提高了性能和准确性",
              },
              {
                version: "1.5.0",
                date: "2023-10-05",
                changelog: "添加了自定义规则支持",
              },
              {
                version: "1.0.0",
                date: "2023-08-15",
                changelog: "正式版发布",
              },
            ],
          },
          {
            id: "documentation-generator",
            name: "文档生成器",
            description: "自动生成项目文档",
            version: "1.1.0",
            author: "文档团队",
            category: "documentation",
            enabled: false,
            downloads: 7800,
            rating: 4.5,
            lastUpdated: "2023-11-20",
            publisher: {
              name: "文档团队",
              verified: true,
              avatar: "/placeholder.svg?key=6eofc",
            },
            tags: ["文档", "自动生成", "Markdown"],
            price: "免费",
            configSchema: {
              format: {
                type: "string",
                enum: ["markdown", "html", "pdf"],
                default: "markdown",
                description: "输出格式",
              },
            },
            versions: [
              {
                version: "1.1.0",
                date: "2023-11-20",
                changelog: "添加了PDF导出功能",
              },
              {
                version: "1.0.0",
                date: "2023-09-10",
                changelog: "正式版发布",
              },
            ],
          },
          {
            id: "test-coverage-analyzer",
            name: "测试覆盖率分析器",
            description: "分析测试覆盖率并提供改进建议",
            version: "0.8.0",
            author: "测试团队",
            category: "testing",
            enabled: false,
            downloads: 4200,
            rating: 4.2,
            lastUpdated: "2023-12-05",
            publisher: {
              name: "测试团队",
              verified: false,
              avatar: "/placeholder.svg?key=4uljv",
            },
            tags: ["测试", "覆盖率", "质量"],
            price: 199,
            configSchema: {
              threshold: {
                type: "number",
                default: 80,
                description: "覆盖率阈值",
              },
            },
            versions: [
              {
                version: "0.8.0",
                date: "2023-12-05",
                changelog: "添加了分支覆盖率分析",
              },
              {
                version: "0.7.0",
                date: "2023-10-25",
                changelog: "添加了报告导��功能",
              },
            ],
          },
          {
            id: "dependency-analyzer",
            name: "依赖分析器",
            description: "分析项目依赖并检查安全漏洞",
            version: "1.3.0",
            author: "安全团队",
            category: "security",
            enabled: false,
            downloads: 11000,
            rating: 4.7,
            lastUpdated: "2023-12-12",
            publisher: {
              name: "安全团队",
              verified: true,
              avatar: "/placeholder.svg?key=gqqoa",
            },
            tags: ["依赖", "安全", "漏洞"],
            price: "免费",
            configSchema: {
              checkFrequency: {
                type: "string",
                enum: ["daily", "weekly", "monthly"],
                default: "weekly",
                description: "检查频率",
              },
            },
            versions: [
              {
                version: "1.3.0",
                date: "2023-12-12",
                changelog: "添加了自动更新建议",
              },
              {
                version: "1.2.0",
                date: "2023-11-05",
                changelog: "添加了更多漏洞数据库",
              },
              {
                version: "1.0.0",
                date: "2023-09-20",
                changelog: "正式版发布",
              },
            ],
          },
        ]

        setMarketplacePlugins(plugins)

        // 模拟已安装的插件
        setInstalledPlugins(["security-scanner", "performance-analyzer"])
      } catch (error) {
        console.error("加载插件失败:", error)
        toast({
          title: "加载失败",
          description: "无法加载插件市场数据，请稍后重试",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlugins()
  }, [toast])

  // 过滤和排序插件
  const filteredPlugins = marketplacePlugins
    .filter((plugin) => {
      // 按搜索词过滤
      const matchesSearch =
        searchQuery === "" ||
        plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // 按分类过滤
      const matchesCategory = selectedCategory === "all" || plugin.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      // 按选择的排序选项排序
      switch (sortOption) {
        case "recent":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case "rating":
          return b.rating - a.rating
        case "downloads":
          return b.downloads - a.downloads
        case "popular":
        default:
          // 综合排序：下载量 * 评分
          return b.downloads * b.rating - a.downloads * a.rating
      }
    })

  // 安装/卸载插件
  const togglePluginInstallation = async (plugin: MarketplacePlugin) => {
    const isInstalled = installedPlugins.includes(plugin.id)
    const action = isInstalled ? "卸载" : "安装"

    setIsInstalling((prev) => ({ ...prev, [plugin.id]: true }))

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (isInstalled) {
        setInstalledPlugins((prev) => prev.filter((id) => id !== plugin.id))
      } else {
        setInstalledPlugins((prev) => [...prev, plugin.id])
      }

      toast({
        title: `${action}成功`,
        description: `插件 "${plugin.name}" 已${action}`,
      })
    } catch (error) {
      console.error(`${action}插件失败:`, error)
      toast({
        title: `${action}失败`,
        description: `无法${action}插件 "${plugin.name}"，请稍后重试`,
        variant: "destructive",
      })
    } finally {
      setIsInstalling((prev) => ({ ...prev, [plugin.id]: false }))
    }
  }

  // 查看插件详情
  const viewPluginDetails = (plugin: MarketplacePlugin) => {
    setSelectedPlugin(plugin)
  }

  // 获取插件图标
  const getPluginIcon = (category: string) => {
    switch (category) {
      case "security":
        return <Shield className="h-5 w-5 text-red-500" />
      case "performance":
        return <Zap className="h-5 w-5 text-yellow-500" />
      case "accessibility":
        return <Eye className="h-5 w-5 text-green-500" />
      case "code-quality":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "documentation":
        return <FileText className="h-5 w-5 text-purple-500" />
      case "testing":
        return <CheckCircle className="h-5 w-5 text-cyan-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  // 格式化下载量
  const formatDownloads = (downloads: number) => {
    if (downloads >= 10000) {
      return `${(downloads / 1000).toFixed(1)}k`
    }
    return downloads.toString()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">插件市场</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索插件..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="bg-background border rounded-md px-2 py-1 text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {PLUGIN_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <select
              className="bg-background border rounded-md px-2 py-1 text-sm"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">加载插件市场...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {filteredPlugins.length > 0 ? (
            filteredPlugins.map((plugin) => (
              <Card key={plugin.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <div className="bg-primary/10 p-2 rounded-md">{getPluginIcon(plugin.category)}</div>
                      <div>
                        <CardTitle className="text-base">{plugin.name}</CardTitle>
                        <CardDescription className="line-clamp-1">{plugin.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={installedPlugins.includes(plugin.id) ? "default" : "outline"}>
                      {installedPlugins.includes(plugin.id)
                        ? "已安装"
                        : plugin.price === "免费"
                          ? "免费"
                          : `¥${plugin.price}`}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{plugin.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDownloads(plugin.downloads)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>v{plugin.version}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {plugin.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <img
                        src={plugin.publisher.avatar || "/placeholder.svg?height=20&width=20"}
                        alt={plugin.publisher.name}
                      />
                    </Avatar>
                    <span className="text-xs text-muted-foreground flex items-center">
                      {plugin.publisher.name}
                      {plugin.publisher.verified && <CheckCircle className="h-3 w-3 text-blue-500 ml-1" />}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => viewPluginDetails(plugin)}>
                    详情
                  </Button>
                  <Button
                    size="sm"
                    variant={installedPlugins.includes(plugin.id) ? "outline" : "default"}
                    onClick={() => togglePluginInstallation(plugin)}
                    disabled={isInstalling[plugin.id]}
                  >
                    {isInstalling[plugin.id] ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        处理中...
                      </>
                    ) : installedPlugins.includes(plugin.id) ? (
                      "卸载"
                    ) : (
                      "安装"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center h-64">
              <Package className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
              <p className="text-muted-foreground">未找到匹配的插件</p>
            </div>
          )}
        </div>
      )}

      {/* 插件详情对话框 */}
      {selectedPlugin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-3 rounded-md">{getPluginIcon(selectedPlugin.category)}</div>
                  <div>
                    <CardTitle className="text-xl">{selectedPlugin.name}</CardTitle>
                    <CardDescription>{selectedPlugin.description}</CardDescription>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={installedPlugins.includes(selectedPlugin.id) ? "default" : "outline"}>
                        {installedPlugins.includes(selectedPlugin.id)
                          ? "已安装"
                          : selectedPlugin.price === "免费"
                            ? "免费"
                            : `¥${selectedPlugin.price}`}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm">{selectedPlugin.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDownloads(selectedPlugin.downloads)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedPlugin(null)}>
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-auto max-h-[60vh]">
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">详情</TabsTrigger>
                  <TabsTrigger value="versions">版本历史</TabsTrigger>
                  <TabsTrigger value="settings">配置选项</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">发布者</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <img
                          src={selectedPlugin.publisher.avatar || "/placeholder.svg?height=32&width=32"}
                          alt={selectedPlugin.publisher.name}
                        />
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{selectedPlugin.publisher.name}</span>
                          {selectedPlugin.publisher.verified && <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />}
                        </div>
                        <p className="text-xs text-muted-foreground">作者: {selectedPlugin.author}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">标签</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlugin.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">版本信息</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">当前版本</span>
                        <span className="text-sm font-medium">v{selectedPlugin.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">最后更新</span>
                        <span className="text-sm font-medium">{selectedPlugin.lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">兼容性</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">系统版本</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          兼容
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="versions">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">版本历史</h3>
                    <div className="space-y-4">
                      {selectedPlugin.versions.map((version, index) => (
                        <div key={index} className="border-l-2 border-primary/30 pl-4 pb-4">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium">v{version.version}</h4>
                            <span className="text-xs text-muted-foreground">{version.date}</span>
                          </div>
                          <p className="text-sm">{version.changelog}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">配置选项</h3>
                    {selectedPlugin.configSchema ? (
                      <div className="space-y-4">
                        {Object.entries(selectedPlugin.configSchema).map(([key, schema]) => (
                          <div key={key} className="space-y-1">
                            <h4 className="text-sm font-medium">{key}</h4>
                            <p className="text-xs text-muted-foreground">{schema.description}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs">类型:</span>
                              <Badge variant="outline" className="text-xs">
                                {schema.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs">默认值:</span>
                              <Badge variant="secondary" className="text-xs">
                                {schema.default?.toString()}
                              </Badge>
                            </div>
                            {schema.enum && (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs">可选值:</span>
                                {schema.enum.map((value, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {value}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">此插件没有配置选项</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">ID: {selectedPlugin.id}</div>
              <Button
                onClick={() => togglePluginInstallation(selectedPlugin)}
                disabled={isInstalling[selectedPlugin.id]}
              >
                {isInstalling[selectedPlugin.id] ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    处理中...
                  </>
                ) : installedPlugins.includes(selectedPlugin.id) ? (
                  "卸载"
                ) : (
                  "安装"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
