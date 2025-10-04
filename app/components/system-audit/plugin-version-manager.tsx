"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Package,
  Clock,
  History,
  Download,
  Shield,
  Zap,
  Eye,
} from "lucide-react"
import type { AuditPlugin } from "@/lib/plugin-system"

// 插件版本类型
interface PluginVersion {
  version: string
  releaseDate: string
  isInstalled: boolean
  isLatest: boolean
  changelog: string
  compatibility: "compatible" | "warning" | "incompatible"
}

// 插件详细信息类型
interface PluginDetail extends AuditPlugin {
  installedVersion: string
  latestVersion: string
  updateAvailable: boolean
  versions: PluginVersion[]
  lastUpdated: string
}

export function PluginVersionManager() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [plugins, setPlugins] = useState<PluginDetail[]>([])
  const [selectedPlugin, setSelectedPlugin] = useState<PluginDetail | null>(null)
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({})
  const [isRollingBack, setIsRollingBack] = useState<Record<string, boolean>>({})

  // 加载插件数据
  useEffect(() => {
    const fetchPlugins = async () => {
      setIsLoading(true)
      try {
        // 模拟API调用
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // 模拟数据
        const pluginsData: PluginDetail[] = [
          {
            id: "security-scanner",
            name: "安全漏洞扫描",
            description: "扫描代码中的安全漏洞并提供修复建议",
            version: "1.0.0",
            author: "安全团队",
            category: "security",
            enabled: true,
            installedVersion: "1.0.0",
            latestVersion: "1.1.0",
            updateAvailable: true,
            lastUpdated: "2023-12-15",
            versions: [
              {
                version: "1.1.0",
                releaseDate: "2023-12-20",
                isInstalled: false,
                isLatest: true,
                changelog: "- 添加了新的漏洞检测规则\n- 提高了扫描性能\n- 修复了多个错误",
                compatibility: "compatible",
              },
              {
                version: "1.0.0",
                releaseDate: "2023-12-15",
                isInstalled: true,
                isLatest: false,
                changelog: "初始版本发布",
                compatibility: "compatible",
              },
              {
                version: "0.9.5",
                releaseDate: "2023-11-30",
                isInstalled: false,
                isLatest: false,
                changelog: "Beta版本，修复了多个关键问题",
                compatibility: "compatible",
              },
            ],
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
          },
          {
            id: "performance-analyzer",
            name: "性能分析器",
            description: "分析代码性能瓶颈并提供优化建议",
            version: "1.2.1",
            author: "性能团队",
            category: "performance",
            enabled: true,
            installedVersion: "1.2.1",
            latestVersion: "1.2.1",
            updateAvailable: false,
            lastUpdated: "2023-12-10",
            versions: [
              {
                version: "1.2.1",
                releaseDate: "2023-12-10",
                isInstalled: true,
                isLatest: true,
                changelog: "- 修复了内存泄漏问题\n- 优化了报告生成",
                compatibility: "compatible",
              },
              {
                version: "1.2.0",
                releaseDate: "2023-11-25",
                isInstalled: false,
                isLatest: false,
                changelog: "添加了高级分析模式",
                compatibility: "compatible",
              },
              {
                version: "1.1.0",
                releaseDate: "2023-10-15",
                isInstalled: false,
                isLatest: false,
                changelog: "改进了报告生成功能",
                compatibility: "warning",
              },
            ],
            configSchema: {
              analysisMode: {
                type: "string",
                enum: ["basic", "advanced"],
                default: "basic",
                description: "分析模式",
              },
            },
          },
          {
            id: "accessibility-checker",
            name: "无障碍检查器",
            description: "检查UI组件的无障碍性并提供改进建议",
            version: "0.9.5",
            author: "UI团队",
            category: "accessibility",
            enabled: false,
            installedVersion: "0.9.5",
            latestVersion: "1.0.0",
            updateAvailable: true,
            lastUpdated: "2023-11-28",
            versions: [
              {
                version: "1.0.0",
                releaseDate: "2023-12-18",
                isInstalled: false,
                isLatest: true,
                changelog: "- 正式版发布\n- 添加了完整的WCAG 2.1支持\n- 改进了报告格式",
                compatibility: "compatible",
              },
              {
                version: "0.9.5",
                releaseDate: "2023-11-28",
                isInstalled: true,
                isLatest: false,
                changelog: "添加了更多WCAG 2.1检查项",
                compatibility: "compatible",
              },
              {
                version: "0.9.0",
                releaseDate: "2023-10-20",
                isInstalled: false,
                isLatest: false,
                changelog: "Beta版本发布",
                compatibility: "incompatible",
              },
            ],
            configSchema: {
              checkLevel: {
                type: "string",
                enum: ["A", "AA", "AAA"],
                default: "AA",
                description: "WCAG合规级别",
              },
            },
          },
        ]

        setPlugins(pluginsData)
      } catch (error) {
        console.error("加载插件失败:", error)
        toast({
          title: "加载失败",
          description: "无法加载插件数据，请稍后重试",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlugins()
  }, [toast])

  // 更新插件
  const updatePlugin = async (plugin: PluginDetail) => {
    setIsUpdating((prev) => ({ ...prev, [plugin.id]: true }))

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 更新插件数据
      setPlugins((prevPlugins) =>
        prevPlugins.map((p) => {
          if (p.id === plugin.id) {
            // 找到最新版本
            const latestVersion = p.versions.find((v) => v.isLatest)

            return {
              ...p,
              installedVersion: p.latestVersion,
              updateAvailable: false,
              versions: p.versions.map((v) => ({
                ...v,
                isInstalled: v.isLatest || v.isInstalled,
              })),
            }
          }
          return p
        }),
      )

      // 如果当前选中的是这个插件，也更新选中的插件
      if (selectedPlugin && selectedPlugin.id === plugin.id) {
        const updatedPlugin = plugins.find((p) => p.id === plugin.id)
        if (updatedPlugin) {
          setSelectedPlugin({
            ...updatedPlugin,
            installedVersion: updatedPlugin.latestVersion,
            updateAvailable: false,
            versions: updatedPlugin.versions.map((v) => ({
              ...v,
              isInstalled: v.isLatest || v.isInstalled,
            })),
          })
        }
      }

      toast({
        title: "更新成功",
        description: `插件 "${plugin.name}" 已更新到版本 ${plugin.latestVersion}`,
      })
    } catch (error) {
      console.error("更新插件失败:", error)
      toast({
        title: "更新失败",
        description: `无法更新插件 "${plugin.name}"，请稍后重试`,
        variant: "destructive",
      })
    } finally {
      setIsUpdating((prev) => ({ ...prev, [plugin.id]: false }))
    }
  }

  // 回滚插件版本
  const rollbackPlugin = async (plugin: PluginDetail, version: string) => {
    const versionKey = `${plugin.id}-${version}`
    setIsRollingBack((prev) => ({ ...prev, [versionKey]: true }))

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 更新插件数据
      setPlugins((prevPlugins) =>
        prevPlugins.map((p) => {
          if (p.id === plugin.id) {
            return {
              ...p,
              installedVersion: version,
              updateAvailable: version !== p.latestVersion,
              versions: p.versions.map((v) => ({
                ...v,
                isInstalled: v.version === version,
              })),
            }
          }
          return p
        }),
      )

      // 如果当前选中的是这个插件，也更新选中的插件
      if (selectedPlugin && selectedPlugin.id === plugin.id) {
        const updatedPlugin = plugins.find((p) => p.id === plugin.id)
        if (updatedPlugin) {
          setSelectedPlugin({
            ...updatedPlugin,
            installedVersion: version,
            updateAvailable: version !== updatedPlugin.latestVersion,
            versions: updatedPlugin.versions.map((v) => ({
              ...v,
              isInstalled: v.version === version,
            })),
          })
        }
      }

      toast({
        title: "回滚成功",
        description: `插件 "${plugin.name}" 已回滚到版本 ${version}`,
      })
    } catch (error) {
      console.error("回滚插件失败:", error)
      toast({
        title: "回滚失败",
        description: `无法回滚插件 "${plugin.name}"，请稍后重试`,
        variant: "destructive",
      })
    } finally {
      setIsRollingBack((prev) => ({ ...prev, [versionKey]: false }))
    }
  }

  // 查看插件详情
  const viewPluginDetails = (plugin: PluginDetail) => {
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
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  // 获取兼容性标签
  const getCompatibilityBadge = (compatibility: string) => {
    switch (compatibility) {
      case "compatible":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            兼容
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="mr-1 h-3 w-3" />
            部分兼容
          </Badge>
        )
      case "incompatible":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            不兼容
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">插件版本管理</h2>
        <Button variant="outline" size="sm" onClick={() => setIsLoading(true)} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          刷新
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">加载插件数据...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">已安装插件</CardTitle>
              <CardDescription>管理已安装插件的版本</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>插件</TableHead>
                    <TableHead>当前版本</TableHead>
                    <TableHead>最新版本</TableHead>
                    <TableHead>最后更新</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plugins.map((plugin) => (
                    <TableRow key={plugin.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-1 rounded-md">{getPluginIcon(plugin.category)}</div>
                          <div>
                            <div className="font-medium">{plugin.name}</div>
                            <div className="text-xs text-muted-foreground">{plugin.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">v{plugin.installedVersion}</Badge>
                      </TableCell>
                      <TableCell>
                        {plugin.updateAvailable ? (
                          <Badge variant="default" className="bg-blue-600">
                            v{plugin.latestVersion}
                          </Badge>
                        ) : (
                          <Badge variant="outline">v{plugin.latestVersion}</Badge>
                        )}
                      </TableCell>
                      <TableCell>{plugin.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => viewPluginDetails(plugin)}>
                            <History className="mr-1 h-4 w-4" />
                            历史
                          </Button>
                          {plugin.updateAvailable && (
                            <Button size="sm" onClick={() => updatePlugin(plugin)} disabled={isUpdating[plugin.id]}>
                              {isUpdating[plugin.id] ? (
                                <>
                                  <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                                  更新中...
                                </>
                              ) : (
                                <>
                                  <Download className="mr-1 h-4 w-4" />
                                  更新
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

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
                          <Badge variant="outline">当前: v{selectedPlugin.installedVersion}</Badge>
                          {selectedPlugin.updateAvailable && (
                            <Badge variant="default" className="bg-blue-600">
                              最新: v{selectedPlugin.latestVersion}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedPlugin(null)}>
                      <XCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="overflow-auto max-h-[60vh]">
                  <Tabs defaultValue="versions">
                    <TabsList className="mb-4">
                      <TabsTrigger value="versions">版本历史</TabsTrigger>
                      <TabsTrigger value="settings">配置选项</TabsTrigger>
                    </TabsList>

                    <TabsContent value="versions">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">版本历史</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span>当前安装</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span>最新版本</span>
                            </div>
                          </div>
                        </div>

                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-6">
                            {selectedPlugin.versions.map((version, index) => (
                              <div
                                key={index}
                                className={`border-l-2 pl-4 pb-4 ${
                                  version.isInstalled
                                    ? "border-blue-500"
                                    : version.isLatest
                                      ? "border-green-500"
                                      : "border-gray-200"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-medium flex items-center">
                                      v{version.version}
                                      {version.isInstalled && (
                                        <Badge variant="default" className="ml-2 bg-blue-500">
                                          当前
                                        </Badge>
                                      )}
                                      {version.isLatest && !version.isInstalled && (
                                        <Badge variant="default" className="ml-2 bg-green-500">
                                          最新
                                        </Badge>
                                      )}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>{version.releaseDate}</span>
                                      </div>
                                      <div>{getCompatibilityBadge(version.compatibility)}</div>
                                    </div>
                                  </div>
                                  <div>
                                    {!version.isInstalled && (
                                      <Button
                                        size="sm"
                                        variant={version.isLatest ? "default" : "outline"}
                                        onClick={() =>
                                          version.isLatest
                                            ? updatePlugin(selectedPlugin)
                                            : rollbackPlugin(selectedPlugin, version.version)
                                        }
                                        disabled={
                                          isUpdating[selectedPlugin.id] ||
                                          isRollingBack[`${selectedPlugin.id}-${version.version}`]
                                        }
                                      >
                                        {isUpdating[selectedPlugin.id] ||
                                        isRollingBack[`${selectedPlugin.id}-${version.version}`] ? (
                                          <>
                                            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                                            处理中...
                                          </>
                                        ) : version.isLatest ? (
                                          <>
                                            <Download className="mr-1 h-3 w-3" />
                                            更新
                                          </>
                                        ) : (
                                          <>
                                            <RotateCcw className="mr-1 h-3 w-3" />
                                            回滚
                                          </>
                                        )}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <div className="bg-muted/50 p-3 rounded-md text-sm whitespace-pre-line">
                                  {version.changelog}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
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
                  {selectedPlugin.updateAvailable && (
                    <Button onClick={() => updatePlugin(selectedPlugin)} disabled={isUpdating[selectedPlugin.id]}>
                      {isUpdating[selectedPlugin.id] ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          更新中...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          更新到 v{selectedPlugin.latestVersion}
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
