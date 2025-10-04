"use client"

import React from "react"

import { useState, useEffect } from "react"
import { TechCard } from "@/components/ui/tech-card"
import { TechButton } from "@/components/ui/tech-button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  GitBranch,
  GitMerge,
  GitPullRequest,
  Plus,
  History,
  Tag,
  Check,
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  FileText,
  Copy,
  Trash2,
} from "lucide-react"
import { useApiConfig } from "./api-config-manager"

// 版本类型
type ApiVersion = {
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

export function ApiVersionManager() {
  const { configs } = useApiConfig()
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
  const { toast } = useToast()

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
    // 在实际应用中，这里应该调用API获取版本历史

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
          // 模拟API配置数据
          baseUrl: "https://api.example.com/v1",
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
          },
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

  // 删除版本
  const deleteVersion = (version: ApiVersion) => {
    const updatedVersions = versions.filter((v) => v.id !== version.id)

    setVersions(updatedVersions)

    if (selectedVersion && selectedVersion.id === version.id) {
      setSelectedVersion(updatedVersions.length > 0 ? updatedVersions[updatedVersions.length - 1] : null)
    }

    if (compareVersion && compareVersion.id === version.id) {
      setCompareVersion(null)
    }

    toast({
      title: "版本已删除",
      description: `版本 ${version.version} 已成功删除`,
    })
  }

  // 复制版本
  const duplicateVersion = (version: ApiVersion) => {
    const newVersion: ApiVersion = {
      ...version,
      id: `v${Date.now()}`,
      version: `${version.version}-copy`,
      description: `${version.description} (副本)`,
      createdAt: new Date().toISOString(),
      createdBy: "当前用户", // 在实际应用中，这里应该是当前登录用户
      status: "draft",
    }

    setVersions([...versions, newVersion])

    toast({
      title: "版本已复制",
      description: `已创建版本 ${version.version} 的副本`,
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
  }

  // 结束比较
  const endCompare = () => {
    setIsComparing(false)
    setCompareVersion(null)
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
        <p className="text-muted-foreground">管理API配置的不同版本，跟踪变更历史</p>
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
          <TechButton
            variant="primary"
            depth="3d"
            glow="soft"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setIsCreatingVersion(true)}
            disabled={!selectedConfigId}
          >
            创建新版本
          </TechButton>

          <TechButton
            variant="outline"
            depth="flat"
            icon={<GitMerge className="h-4 w-4" />}
            onClick={startCompare}
            disabled={!selectedVersion || isComparing}
          >
            比较版本
          </TechButton>

          {isComparing && (
            <TechButton variant="outline" depth="flat" icon={<Check className="h-4 w-4" />} onClick={endCompare}>
              结束比较
            </TechButton>
          )}

          <TechButton
            variant="outline"
            depth="flat"
            icon={<History className="h-4 w-4" />}
            disabled={!selectedConfigId}
          >
            查看变更历史
          </TechButton>
        </div>
      </div>

      {isCreatingVersion && (
        <TechCard variant="panel" title="创建新版本" description="为API配置创建新版本" glow="subtle">
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
              <p className="text-xs text-muted-foreground">详细列出此版本的所有变更，每行一��变更项</p>
            </div>

            <div className="flex justify-end gap-2">
              <TechButton variant="outline" depth="flat" onClick={() => setIsCreatingVersion(false)}>
                取消
              </TechButton>

              <TechButton variant="primary" depth="3d" onClick={createNewVersion}>
                创建版本
              </TechButton>
            </div>
          </div>
        </TechCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TechCard variant="panel" title="版本历史" description="API配置的所有版本" glow="subtle">
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
                        ? "border-techblue-500 bg-techblue-50/50 dark:bg-techblue-900/20"
                        : "border-techblue-200 dark:border-techblue-800 hover:bg-techblue-50/30 dark:hover:bg-techblue-900/10"
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
                        <Tag className="h-4 w-4 text-techblue-500 mr-2" />
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
          </TechCard>
        </div>

        <div className="md:col-span-2">
          {isComparing && compareVersion ? (
            <TechCard
              variant="panel"
              title="版本比较"
              description={`比较 ${selectedVersion?.version} 与 ${compareVersion.version}`}
              glow="subtle"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="font-medium">{selectedVersion?.version}</div>
                    <div className="text-sm text-muted-foreground">
                      {getStatusBadge(selectedVersion?.status || "draft")}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <ArrowRight className="h-6 w-6 text-techblue-500" />
                  </div>

                  <div className="text-center">
                    <div className="font-medium">{compareVersion.version}</div>
                    <div className="text-sm text-muted-foreground">{getStatusBadge(compareVersion.status)}</div>
                  </div>
                </div>

                <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                  <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium">变更摘要</div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">基本信息变更</h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="font-medium">属性</div>
                          <div className="font-medium">{selectedVersion?.version}</div>
                          <div className="font-medium">{compareVersion.version}</div>

                          <div>描述</div>
                          <div className="text-muted-foreground">{selectedVersion?.description}</div>
                          <div className="text-muted-foreground">{compareVersion.description}</div>

                          <div>创建时间</div>
                          <div className="text-muted-foreground">{formatDate(selectedVersion?.createdAt || "")}</div>
                          <div className="text-muted-foreground">{formatDate(compareVersion.createdAt)}</div>

                          <div>创建者</div>
                          <div className="text-muted-foreground">{selectedVersion?.createdBy}</div>
                          <div className="text-muted-foreground">{compareVersion.createdBy}</div>

                          <div>状态</div>
                          <div>{getStatusBadge(selectedVersion?.status || "draft")}</div>
                          <div>{getStatusBadge(compareVersion.status)}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">配置变更</h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="font-medium">属性</div>
                          <div className="font-medium">{selectedVersion?.version}</div>
                          <div className="font-medium">{compareVersion.version}</div>

                          <div>基础URL</div>
                          <div className="text-muted-foreground">{selectedVersion?.config.baseUrl}</div>
                          <div className="text-muted-foreground">{compareVersion.config.baseUrl}</div>

                          <div>超时设置</div>
                          <div className="text-muted-foreground">{selectedVersion?.config.timeout}ms</div>
                          <div className="text-muted-foreground">{compareVersion.config.timeout}ms</div>

                          <div>请求头</div>
                          <div className="text-muted-foreground">
                            {selectedVersion?.config.headers && Object.keys(selectedVersion.config.headers).length} 个
                          </div>
                          <div className="text-muted-foreground">
                            {compareVersion.config.headers && Object.keys(compareVersion.config.headers).length} 个
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                    <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium">
                      {selectedVersion?.version} 变更记录
                    </div>
                    <div className="p-4">
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {selectedVersion?.changes.map((change, index) => (
                          <li key={index} className="text-muted-foreground">
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                    <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium">
                      {compareVersion.version} 变更记录
                    </div>
                    <div className="p-4">
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {compareVersion.changes.map((change, index) => (
                          <li key={index} className="text-muted-foreground">
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TechCard>
          ) : selectedVersion ? (
            <TechCard
              variant="panel"
              title={`版本详情: ${selectedVersion.version}`}
              description={selectedVersion.description}
              glow="subtle"
            >
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

                <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                  <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    变更记录
                  </div>
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

                <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                  <div className="bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium flex items-center">
                    <GitBranch className="h-4 w-4 mr-2" />
                    配置详情
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">基础URL</h4>
                          <div className="p-2 bg-techblue-50/50 dark:bg-techblue-900/20 rounded border border-techblue-200 dark:border-techblue-800 text-sm">
                            {selectedVersion.config.baseUrl}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">超时设置</h4>
                          <div className="p-2 bg-techblue-50/50 dark:bg-techblue-900/20 rounded border border-techblue-200 dark:border-techblue-800 text-sm">
                            {selectedVersion.config.timeout}ms
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">请求头</h4>
                        <div className="bg-techblue-50/50 dark:bg-techblue-900/20 rounded border border-techblue-200 dark:border-techblue-800">
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
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  {selectedVersion.status === "draft" && (
                    <TechButton
                      variant="primary"
                      depth="3d"
                      icon={<GitPullRequest className="h-4 w-4" />}
                      onClick={() => publishVersion(selectedVersion)}
                    >
                      发布版本
                    </TechButton>
                  )}

                  {selectedVersion.status === "published" && (
                    <TechButton
                      variant="outline"
                      depth="flat"
                      icon={<ArrowLeft className="h-4 w-4" />}
                      onClick={() => deprecateVersion(selectedVersion)}
                    >
                      废弃版本
                    </TechButton>
                  )}

                  <TechButton
                    variant="outline"
                    depth="flat"
                    icon={<Copy className="h-4 w-4" />}
                    onClick={() => duplicateVersion(selectedVersion)}
                  >
                    复制版本
                  </TechButton>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <TechButton variant="outline" depth="flat" icon={<Trash2 className="h-4 w-4" />}>
                        删除版本
                      </TechButton>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>
                          您确定要删除版本 {selectedVersion.version} 吗？此操作无法撤销。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteVersion(selectedVersion)}>删除</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </TechCard>
          ) : (
            <TechCard variant="panel" title="版本详情" description="选择版本以查看详情" glow="subtle">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <GitBranch className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">暂无选中版本</h3>
                <p className="text-muted-foreground max-w-md">请从左侧版本列表中选择一个版本，或者创建新版本。</p>
              </div>
            </TechCard>
          )}
        </div>
      </div>
    </div>
  )
}
