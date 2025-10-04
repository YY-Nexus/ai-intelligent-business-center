"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  GitBranch,
  GitCommit,
  GitMerge,
  Plus,
  History,
  Tag,
  Check,
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
} from "lucide-react"
import { VersionDiffViewer } from "./version-diff-viewer"
import { VersionHistoryTimeline } from "./version-history-timeline"
import { VersionChangeList } from "./version-change-list"

// 版本类型定义
export interface ApiVersion {
  id: string
  configId: string
  version: string
  description: string
  createdAt: string
  createdBy: string
  status: "draft" | "published" | "deprecated"
  changes: string[]
  config: any // API配置数据
}

// API配置类型
interface ApiConfig {
  id: string
  name: string
  description: string
}

export function VersionManager() {
  const [configs, setConfigs] = useState<ApiConfig[]>([])
  const [selectedConfigId, setSelectedConfigId] = useState<string>("")
  const [versions, setVersions] = useState<ApiVersion[]>([])
  const [selectedVersion, setSelectedVersion] = useState<ApiVersion | null>(null)
  const [compareVersion, setCompareVersion] = useState<ApiVersion | null>(null)
  const [isCreatingVersion, setIsCreatingVersion] = useState(false)
  const [newVersionData, setNewVersionData] = useState({
    version: "",
    description: "",
    changes: "",
  })
  const [isComparing, setIsComparing] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const { toast } = useToast()

  // 加载API配置列表
  useEffect(() => {
    // 模拟从API加载配置列表
    const mockConfigs: ApiConfig[] = [
      { id: "config1", name: "用户API", description: "用户管理相关API" },
      { id: "config2", name: "产品API", description: "产品管理相关API" },
      { id: "config3", name: "订单API", description: "订单管理相关API" },
      { id: "config4", name: "支付API", description: "支付处理相关API" },
    ]
    setConfigs(mockConfigs)
  }, [])

  // 当选择的配置变化时，加载版本历史
  useEffect(() => {
    if (selectedConfigId) {
      loadVersions(selectedConfigId)
    } else {
      setVersions([])
      setSelectedVersion(null)
      setCompareVersion(null)
    }
  }, [selectedConfigId])

  // 加载版本历史
  const loadVersions = (configId: string) => {
    // 模拟从服务器加载版本历史
    const mockVersions: ApiVersion[] = [
      {
        id: "v1",
        configId,
        version: "1.0.0",
        description: "初始版本",
        createdAt: "2023-01-15T08:30:00Z",
        createdBy: "张三",
        status: "deprecated",
        changes: ["创建基本API配置", "添加认证机制", "设置基本请求头"],
        config: {
          baseUrl: "https://api.example.com/v1",
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
          },
          endpoints: [
            { path: "/users", method: "GET" },
            { path: "/users/{id}", method: "GET" },
          ],
        },
      },
      {
        id: "v2",
        configId,
        version: "1.1.0",
        description: "添加新端点",
        createdAt: "2023-03-22T10:15:00Z",
        createdBy: "李四",
        status: "deprecated",
        changes: ["添加用户管理端点", "优化错误处理", "增加请求重试机制"],
        config: {
          baseUrl: "https://api.example.com/v1.1",
          timeout: 8000,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          endpoints: [
            { path: "/users", method: "GET" },
            { path: "/users/{id}", method: "GET" },
            { path: "/users", method: "POST" },
            { path: "/users/{id}", method: "PUT" },
          ],
        },
      },
      {
        id: "v3",
        configId,
        version: "2.0.0",
        description: "主要版本更新",
        createdAt: "2023-06-10T14:45:00Z",
        createdBy: "王五",
        status: "published",
        changes: ["重构API结构", "添加GraphQL支持", "增强安全性", "优化性能"],
        config: {
          baseUrl: "https://api.example.com/v2",
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-API-Version": "2.0.0",
          },
          endpoints: [
            { path: "/api/users", method: "GET" },
            { path: "/api/users/{id}", method: "GET" },
            { path: "/api/users", method: "POST" },
            { path: "/api/users/{id}", method: "PUT" },
            { path: "/api/users/{id}", method: "DELETE" },
            { path: "/graphql", method: "POST" },
          ],
        },
      },
      {
        id: "v4",
        configId,
        version: "2.1.0",
        description: "功能增强",
        createdAt: "2023-08-05T09:20:00Z",
        createdBy: "赵六",
        status: "draft",
        changes: ["添加批量操作支持", "增加缓存机制", "改进错误报告"],
        config: {
          baseUrl: "https://api.example.com/v2",
          timeout: 12000,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-API-Version": "2.1.0",
            "Cache-Control": "max-age=3600",
          },
          endpoints: [
            { path: "/api/users", method: "GET" },
            { path: "/api/users/{id}", method: "GET" },
            { path: "/api/users", method: "POST" },
            { path: "/api/users/{id}", method: "PUT" },
            { path: "/api/users/{id}", method: "DELETE" },
            { path: "/api/users/batch", method: "POST" },
            { path: "/graphql", method: "POST" },
          ],
        },
      },
    ]

    setVersions(mockVersions)

    // 默认选择最新版本
    if (mockVersions.length > 0) {
      setSelectedVersion(mockVersions[mockVersions.length - 1])
    }
  }

  // 创建新版本
  const createNewVersion = () => {
    if (!selectedConfigId) {
      toast({
        title: "请选择API配置",
        description: "请先选择要创建新版本的API配置",
        variant: "destructive",
      })
      return
    }

    if (!newVersionData.version) {
      toast({
        title: "版本号不能为空",
        description: "请输入有效的版本号",
        variant: "destructive",
      })
      return
    }

    // 检查版本号是否已存在
    if (versions.some((v) => v.version === newVersionData.version)) {
      toast({
        title: "版本号已存在",
        description: "请使用不同的版本号",
        variant: "destructive",
      })
      return
    }

    // 创建新版本
    const newVersion: ApiVersion = {
      id: `v${Date.now()}`,
      configId: selectedConfigId,
      version: newVersionData.version,
      description: newVersionData.description,
      createdAt: new Date().toISOString(),
      createdBy: "当前用户", // 在实际应用中，这里应该是当前登录用户
      status: "draft",
      changes: newVersionData.changes.split("\n").filter((line) => line.trim()),
      config: selectedVersion ? { ...selectedVersion.config } : {},
    }

    setVersions([...versions, newVersion])
    setSelectedVersion(newVersion)
    setIsCreatingVersion(false)

    // 重置表单
    setNewVersionData({
      version: "",
      description: "",
      changes: "",
    })

    toast({
      title: "版本创建成功",
      description: `已成功创建版本 ${newVersion.version}`,
    })
  }

  // 发布版本
  const publishVersion = (version: ApiVersion) => {
    if (version.status === "published") {
      return
    }

    const updatedVersions = versions.map((v) => (v.id === version.id ? { ...v, status: "published" as const } : v))

    setVersions(updatedVersions)

    if (selectedVersion && selectedVersion.id === version.id) {
      setSelectedVersion({ ...selectedVersion, status: "published" })
    }

    toast({
      title: "版本已发布",
      description: `版本 ${version.version} 已成功发布`,
    })
  }

  // 废弃版本
  const deprecateVersion = (version: ApiVersion) => {
    if (version.status === "deprecated") {
      return
    }

    const updatedVersions = versions.map((v) => (v.id === version.id ? { ...v, status: "deprecated" as const } : v))

    setVersions(updatedVersions)

    if (selectedVersion && selectedVersion.id === version.id) {
      setSelectedVersion({ ...selectedVersion, status: "deprecated" })
    }

    toast({
      title: "版本已废弃",
      description: `版本 ${version.version} 已标记为废弃`,
    })
  }

  // 开始比较版本
  const startCompare = () => {
    if (!selectedVersion) {
      toast({
        title: "请选择版本",
        description: "请先选择要比较的版本",
        variant: "destructive",
      })
      return
    }

    setIsComparing(true)
    setCompareVersion(null)
    setActiveTab("diff")
  }

  // 结束比较
  const endCompare = () => {
    setIsComparing(false)
    setCompareVersion(null)
    setActiveTab("details")
  }

  // 获取状态标签
  const getStatusBadge = (status: ApiVersion["status"]) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">草稿</Badge>
      case "published":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">已发布</Badge>
      case "deprecated":
        return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">已废弃</Badge>
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">API版本管理</h2>
        <p className="text-muted-foreground">管理API配置的不同版本，跟踪变更历史，比较版本差异</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="w-full md:w-64">
          <Select value={selectedConfigId} onValueChange={setSelectedConfigId}>
            <SelectTrigger>
              <SelectValue placeholder="选择API配置" />
            </SelectTrigger>
            <SelectContent>
              {configs.map((config) => (
                <SelectItem key={config.id} value={config.id}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="default"
            size="sm"
            className="gap-1"
            onClick={() => setIsCreatingVersion(true)}
            disabled={!selectedConfigId}
          >
            <Plus className="h-4 w-4" />
            创建新版本
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={startCompare}
            disabled={!selectedVersion || isComparing}
          >
            <GitMerge className="h-4 w-4" />
            比较版本
          </Button>

          {isComparing && (
            <Button variant="outline" size="sm" className="gap-1" onClick={endCompare}>
              <Check className="h-4 w-4" />
              结束比较
            </Button>
          )}

          <Button variant="outline" size="sm" className="gap-1" disabled={!selectedConfigId}>
            <History className="h-4 w-4" />
            查看历史
          </Button>
        </div>
      </div>

      {isCreatingVersion && (
        <Card>
          <CardHeader>
            <CardTitle>创建新版本</CardTitle>
            <CardDescription>为API配置创建新版本</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="version" className="text-sm font-medium">
                    版本号 *
                  </label>
                  <Input
                    id="version"
                    value={newVersionData.version}
                    onChange={(e) => setNewVersionData({ ...newVersionData, version: e.target.value })}
                    placeholder="例如: 1.0.0"
                    required
                  />
                  <p className="text-xs text-muted-foreground">建议使用语义化版本号格式 (主版本.次版本.修订版本)</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    版本描述 *
                  </label>
                  <Input
                    id="description"
                    value={newVersionData.description}
                    onChange={(e) => setNewVersionData({ ...newVersionData, description: e.target.value })}
                    placeholder="简要描述此版本的主要变更"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="changes" className="text-sm font-medium">
                  变更列表
                </label>
                <Textarea
                  id="changes"
                  value={newVersionData.changes}
                  onChange={(e) => setNewVersionData({ ...newVersionData, changes: e.target.value })}
                  placeholder="每行一个变更项，例如:
- 添加新端点
- 修复认证问题
- 优化性能"
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">详细列出此版本的所有变更，每行一个变更项</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreatingVersion(false)}>
                  取消
                </Button>

                <Button variant="default" onClick={createNewVersion}>
                  创建版本
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>版本历史</CardTitle>
              <CardDescription>API配置的所有版本</CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedConfigId ? (
                <div className="text-center py-8 text-muted-foreground">请选择API配置以查看版本历史</div>
              ) : versions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">暂无版本历史</div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        (selectedVersion && selectedVersion.id === version.id) ||
                        (compareVersion && compareVersion.id === version.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                      onClick={() => {
                        if (isComparing) {
                          if (selectedVersion && selectedVersion.id !== version.id) {
                            setCompareVersion(version)
                          }
                        } else {
                          setSelectedVersion(version)
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 text-primary mr-2" />
                          <span className="font-medium">{version.version}</span>
                        </div>
                        {getStatusBadge(version.status)}
                      </div>

                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{version.description}</p>

                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(version.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {isComparing && compareVersion ? (
            <Card>
              <CardHeader>
                <CardTitle>版本比较</CardTitle>
                <CardDescription>{`比较 ${selectedVersion?.version} 与 ${compareVersion.version}`}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="font-medium">{selectedVersion?.version}</div>
                      <div className="text-sm text-muted-foreground">
                        {getStatusBadge(selectedVersion?.status || "draft")}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <ArrowRight className="h-6 w-6 text-primary" />
                    </div>

                    <div className="text-center">
                      <div className="font-medium">{compareVersion.version}</div>
                      <div className="text-sm text-muted-foreground">{getStatusBadge(compareVersion.status)}</div>
                    </div>
                  </div>

                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="summary">变更摘要</TabsTrigger>
                      <TabsTrigger value="endpoints">端点变更</TabsTrigger>
                      <TabsTrigger value="config">配置变更</TabsTrigger>
                      <TabsTrigger value="visual">可视化比较</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary">
                      <VersionChangeList sourceVersion={selectedVersion} targetVersion={compareVersion} />
                    </TabsContent>

                    <TabsContent value="endpoints">
                      <VersionDiffViewer
                        oldValue={selectedVersion?.config.endpoints || []}
                        newValue={compareVersion.config.endpoints || []}
                        type="endpoints"
                      />
                    </TabsContent>

                    <TabsContent value="config">
                      <VersionDiffViewer
                        oldValue={selectedVersion?.config || {}}
                        newValue={compareVersion.config || {}}
                        type="config"
                      />
                    </TabsContent>

                    <TabsContent value="visual">
                      <div className="h-[400px] border rounded-md p-4">
                        <VersionHistoryTimeline
                          versions={versions}
                          highlightIds={[selectedVersion?.id || "", compareVersion.id]}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          ) : selectedVersion ? (
            <Card>
              <CardHeader>
                <CardTitle>{`版本详情: ${selectedVersion.version}`}</CardTitle>
                <CardDescription>{selectedVersion.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">基本信息</TabsTrigger>
                    <TabsTrigger value="endpoints">API端点</TabsTrigger>
                    <TabsTrigger value="config">配置详情</TabsTrigger>
                    <TabsTrigger value="history">变更历史</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details">
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-2 items-center">
                        {getStatusBadge(selectedVersion.status)}

                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(selectedVersion.createdAt)}</span>
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-4 w-4 mr-1" />
                          <span>{selectedVersion.createdBy}</span>
                        </div>
                      </div>

                      <div className="border rounded-md overflow-hidden">
                        <div className="bg-muted p-3 font-medium flex items-center">变更记录</div>
                        <div className="p-4">
                          <ul className="list-disc list-inside space-y-1">
                            {selectedVersion.changes.map((change, index) => (
                              <li key={index} className="text-muted-foreground">
                                {change}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-end">
                        {selectedVersion.status === "draft" && (
                          <Button
                            variant="default"
                            size="sm"
                            className="gap-1"
                            onClick={() => publishVersion(selectedVersion)}
                          >
                            <GitCommit className="h-4 w-4" />
                            发布版本
                          </Button>
                        )}

                        {selectedVersion.status === "published" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => deprecateVersion(selectedVersion)}
                          >
                            <ArrowLeft className="h-4 w-4" />
                            废弃版本
                          </Button>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="endpoints">
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-muted p-3 font-medium">API端点列表</div>
                      <div className="p-4">
                        <div className="space-y-2">
                          {selectedVersion.config.endpoints?.map((endpoint: any, index: number) => (
                            <div key={index} className="flex items-center p-2 border rounded-md">
                              <Badge variant="outline" className="mr-2">
                                {endpoint.method}
                              </Badge>
                              <code className="text-sm">{endpoint.path}</code>
                            </div>
                          )) || <div className="text-muted-foreground">无API端点信息</div>}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="config">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">基础URL</h4>
                          <div className="p-2 bg-muted rounded border text-sm">{selectedVersion.config.baseUrl}</div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">超时设置</h4>
                          <div className="p-2 bg-muted rounded border text-sm">{selectedVersion.config.timeout}ms</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">请求头</h4>
                        <div className="bg-muted rounded border">
                          <div className="grid grid-cols-2 gap-2 p-2 text-sm">
                            <div className="font-medium">名称</div>
                            <div className="font-medium">值</div>

                            {selectedVersion.config.headers &&
                              Object.entries(selectedVersion.config.headers).map(([key, value]) => (
                                <React.Fragment key={key}>
                                  <div className="text-muted-foreground">{key}</div>
                                  <div className="text-muted-foreground">{value as string}</div>
                                </React.Fragment>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="history">
                    <div className="h-[400px] border rounded-md p-4">
                      <VersionHistoryTimeline versions={versions} highlightIds={[selectedVersion.id]} />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>版本详情</CardTitle>
                <CardDescription>选择版本以查看详情</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <GitBranch className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">暂无选中版本</h3>
                  <p className="text-muted-foreground max-w-md">请从左侧版本列表中选择一个版本，或者创建新版本。</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
